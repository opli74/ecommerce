
import {Button} from './ui/button.tsx'
import React, { useState } from 'react';
import { Message } from './ui/message.tsx';

export const handleSubmit = async (
  e: React.FormEvent<HTMLFormElement>, 
  setLoading: (loading: boolean) => void,
  setError: (error: string) => void
) => 
{
  e.preventDefault();
  
  setLoading(true);

  try 
  {  
    const formData = new FormData(e.currentTarget);

    const response = await fetch('http://localhost:5521/api/register', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify ({
        name: formData.get('name'),
        email: formData.get('email'),
        password: formData.get('password')
      })
    });

    const result = await response.json();

    if (result.success) 
      window.location.href = '/login';
    else
      setError( result.data );

  } 
  catch (error: any) 
  {
    setError( `Error registering: ${error}` );
  } 
  finally 
  {
    setLoading(false);
  }
};

export const RegisterForm: React.FC = (

) => 
{
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  return (
    <form onSubmit={(e) => handleSubmit(e, setLoading, setError)} className='auth-form w-full relative'>
      <div className="w-full h-[44px] my-1">
        { error && <Message variant='danger'>{error}</Message> }
      </div>
      <label>
        Username
        <input type="text" name="name" required />
      </label>
      <label>
        Email
        <input type="email" name="email" required />
      </label>
      <label>
        Password
        <input type="password" name="password" required minLength={3} />
      </label>
      
      <p className='my-5 text-right mb-1.5rem'>
        Do have an account?{' '}
        <a href='/login' className='text-blue-500 underline'>
          Login
        </a>
      </p>

      <Button  loading={loading} >Register</Button>
    </form>
  );
};
