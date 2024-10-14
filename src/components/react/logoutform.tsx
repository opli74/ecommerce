
import { redirect } from 'elysia';
import {Button} from './ui/button.tsx'
import React, { useState } from 'react';
import { fetchAPI } from '../../util/fetch.ts';

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

    const response = await fetchAPI( 
      '/user/logout', 
      'POST'
    );

    const result = await response.json();

    if (result.success) 
    {
      window.location.reload( );
      window.location.href = '/';
    }
  } 
  catch (error: any) 
  {
    alert(`An error occurred while logging out ${error.message}`);
  } 
  finally 
  {
    setLoading(false);
  }
};

export const Logoutform: React.FC = (

) => 
{
  const [loading, setLoading] = useState(false);

  return (
    <form onSubmit={(e) => handleSubmit(e, setLoading)}>      
      <Button loading={loading} size='small'>Logout</Button>
    </form>
  );
};
