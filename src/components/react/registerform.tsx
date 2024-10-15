
import {Button} from './ui/button.tsx'
import React, { useState } from 'react';
import { Message } from './ui/message.tsx';
import { fetchAPI } from '../../util/fetch.ts';

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

    const response = await fetchAPI( 
      '/user/register',
      'POST',
      {},
      {
        name: formData.get('name'),
        email: formData.get('email'),
        password: formData.get('password')
      }
    );


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
    <form 
    onSubmit={(e) => handleSubmit(e, setLoading, setError)}   
    className="auth-form w-full relative"
    noValidate
    >
      {/* Error Message */}
      <div className="w-full h-11 mt-2 mb-5">
        {error && <Message variant="danger">{error}</Message>}
      </div>


      {/* Email Field */}
      <div className="relative z-0 w-full mb-6 group">
        <input
          type="text"
          name="name"
          id="iptLgnPlnID"
          required
          placeholder=" "
          aria-describedby="name-error"
        />
        <label
          htmlFor="iptLgnPlnID"
        >
          Name
        </label>
      </div>
      
      {/* Email Field */}
      <div className="relative z-0 w-full mb-6 group">
        <input
          type="email"
          name="email"
          id="iptRgtPlnID"
          required
          placeholder=" "
          aria-describedby="email-error"
        />
        <label
          htmlFor="iptRgtPlnID"
        >
          Email
        </label>
      </div>
      {/* Password Field */}
      <div className="relative z-0 w-full mb-6 group">
        <input
          type="password"
          name="password"
          id="iptPasswordID"
          required
          minLength={3}
          placeholder=" "
          aria-describedby="password-error"
        />
        <label
          htmlFor="iptPasswordID"
        >
          Password
        </label>
      </div>
      
      <p className="mt-6 mb-16 text-right">
        Do have an account?{' '}
        <a href='/login' className='text-blue-500 underline'>
          Login
        </a>
      </p>

      <Button loading={loading} type="submit">
        Register
      </Button>
    </form>
  );
};
