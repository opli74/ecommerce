// src/components/LoginForm.tsx
import React, { useState } from 'react';
import { Button } from './ui/button';
import { Message } from './ui/message';
import { fetchAPI } from '../../util/fetch';

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
    setError( `Login error: ${error.message}` );
  } 
  finally 
  {
    setLoading( false );
  }
};

export const LoginForm: React.FC = (

) => {
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
          type="email"
          name="email"
          id="iptLgnPlnID"
          required
          placeholder=" "
          aria-describedby="email-error"
        />
        <label
          htmlFor="iptLgnPlnID"
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

      {/* Register Link */}
      <p className="mt-6 mb-16 text-right">
        Don't have an account?{' '}
        <a href="/register" className="text-blue-500 underline">
          Register
        </a>
      </p>

      {/* Submit Button */}
      <Button loading={loading} type="submit">
        Login
      </Button>
    </form>
  );
};

