
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

export const RegisterForm: React.FC = (

) => 
{
  const [loading, setLoading] = useState(false);

  return (
    <form onSubmit={(e) => handleSubmit(e, setLoading)} className='w-full'>
      <label className="block mb-3">
        Username
        <input type="text" name="name" required className='border-2 border-slate-400 p-2 rounded-lg w-full' />
      </label>
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
        <a href='/login' className='text-blue-500 underline'>
          Login
        </a>
      </p>

      <Button>Register</Button>
    </form>
  );
};
