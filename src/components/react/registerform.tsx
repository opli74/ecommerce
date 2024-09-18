
import {Button} from './button.tsx'
import React, { useState } from 'react';

export const handleSubmit = async (e: React.FormEvent<HTMLFormElement>, setLoading: (loading: boolean) => void) => {
    e.preventDefault();
    
    setLoading(true);
  
    try {
      
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
      console.log( response );
      const result = await response.json();
      if (result.error) 
      {
        alert(result.error);
      } 
      else 
      {
        alert('Register successful');
        // Do something with the token, like storing it
        localStorage.setItem('token', result.token);
      }
    } catch (error: any) 
    {
      alert(`An error occurred while logging in ${error.message}`);
    } finally 
    {
      setLoading(false);
    }
  };

export const RegisterForm: React.FC = () => {
  const [loading, setLoading] = useState(false);

  return (
    <form onSubmit={(e) => handleSubmit(e, setLoading)}>
      <label htmlFor="name">Name:</label>
      <input type="text" id="name" name="name" required className='border-2 border-slate-400 p-2 rounded-lg w-full'/>
      
      <label htmlFor="email">Email:</label>
      <input type="email" id="email" name="email" required className='border-2 border-slate-400 p-2 rounded-lg w-full'/>

      <label htmlFor="password">Password:</label>
      <input type="password" id="password" name="password" required  className='border-2 border-slate-400 p-2 rounded-lg w-full'/>

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
