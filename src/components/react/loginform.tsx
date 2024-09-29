
import { redirect } from 'elysia';
import {Button} from './button.tsx'
import React, { useState } from 'react';

export const handleSubmit = async (
  e: React.FormEvent<HTMLFormElement>, 
  setLoading: (loading: boolean) => void
) => 
{
  e.preventDefault();
  
  setLoading(true);

  try 
  {  
    const formData = new FormData(e.currentTarget);

    const response = await fetch('http://localhost:5521/api/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include', 
      body: JSON.stringify ({
        email: formData.get('email'),
        password: formData.get('password')
      })
    });

    const result = await response.json();

    console.log( result )
    if (result.success) 
      window.location.href = '/';

  } 
  catch (error: any) 
  {
    alert(`An error occurred while logging in ${error.message}`);
  } 
  finally 
  {
    setLoading(false);
  }
};

export const LoginForm: React.FC = () => {
  const [loading, setLoading] = useState(false);

  return (
    <form onSubmit={(e) => handleSubmit(e, setLoading)} className='w-full'>
        <label className="block mb-3">
          Email
          <input type="email" name="email" required className='border-2 border-slate-400 p-2 rounded-lg w-full' />
        </label>
        <label className="block mb-3">
          Password
          <input type="password" name="password" required minLength={3} className='border-2 border-slate-400 p-2 rounded-lg w-full'/>
        </label>
        
        <p className='my-5 text-right'>
          Do have an account?{' '}
          <a href='/register' className='text-blue-500 underline'>
            Register
          </a>
        </p>
      
      <Button>Login</Button>
    </form>
  );
};
