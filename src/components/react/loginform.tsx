
import { redirect } from 'elysia';
import {Button} from './button.tsx'
import React, { useState } from 'react';
import { Message } from './message.tsx';
import { fetchAPI } from '../../util/fetch.ts';

export const handleSubmit = async (
  e: React.FormEvent<HTMLFormElement>, 
  setLoading: (loading: boolean) => void,
  setError: (error: string) => void
) => 
{
  e.preventDefault();
  
  setLoading(true);

  let result;

  try 
  {  
    const formData = new FormData(e.currentTarget);

    const response = await fetchAPI( 
      '/user/login', 
      'POST', 
      { 
        'Content-Type': 'application/json' 
      }, 
      { 
        email: formData.get( 'email' ),
        password: formData.get( 'password' )
      }
    );

    result = await response.json();

    if (result.success) 
      window.location.href = '/';
    else
      setError( 'Invalid login details' );

  } 
  catch (error: any) 
  {
    setError( `Login error: ${error.message}`);
  } 
  finally 
  {
    setLoading( false );
  }
};

export const LoginForm: React.FC = (

) => 
{
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  return (
    <form onSubmit={(e) => handleSubmit(e, setLoading, setError)} className='auth-form w-full relative'>
        <div className="w-full !h-[44px] my-1">
          { error && <Message variant='danger'>{error}</Message> }
        </div>
        
        <label>
          Email
          <input type="email" name="email" required/>
        </label>
        <label>
          Password
          <input type="password" name="password" required minLength={3}/>
        </label>
        
        <p className='my-5 text-right'>
          Do have an account?{' '}
          <a href='/register' className='text-blue-500 underline'>
            Register
          </a>
        </p>
      
      <Button loading={loading} >Login</Button>
    </form>
  );
};
