import { Elysia } from 'elysia';
import * as SQL from './database/db';
import * as Query from './database/user';
import { loginUser } from './session/login';
import { registerUser } from './session/register';
import { cors } from '@elysiajs/cors';
import { jwt } from '@elysiajs/jwt';
import { cookie } from '@elysiajs/cookie';
import  setCookie  from 'cookie';

SQL.init();

const app = new Elysia() 
  .use( cors( ) )
  .use( jwt( { 
    name: 'jwt',
    secret: process.env.JWT_SECRET || 'secret',
    expiresIn: '7d',
  }))
  .use( cookie( ) )

  .get( '/api/db/users', async ( ) => 
  {
    try 
    {
      return await Query.getUsers( );
    } 
    catch (error: any) 
    {
        console.error(`[QUERY ALL USERS] -> ${error.message}`);
        return { error: 'Failed to fetch users' };
    }
  })

  .post( '/api/login', async ({ body }: { body: { email: string, password: string } }, setHeader ) => 
  {
    const { email, password } = body;
    try
    { 
      const result =  await loginUser( email, password );

      if( result.error || !result.token )
        return { error: result.error };


      // Set the JWT as an HttpOnly cookie
      setCookie('token', result.token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production', // Only send over HTTPS in production
        sameSite: 'Strict', // CSRF protection
        maxAge: 24 * 60 * 60, // 1 day expiration
      });

    }
    catch( error: any )
    {
      console.error(`Error during login: ${error.message}`);
      return { error: 'Failed to login, please try again later' };
    }
  })

  .post( 'api/register', async ({ body }: { body: { name: string, email: string, password: string } }) =>
  {
    const{ name, email, password } = body;
    try
    {
      return await registerUser( name, email, password );
    }
    catch( error: any )
    {
      console.error(`Error during register: ${error.message}`);
      return { error: 'Failed to register, please try again later' };
    }
  })
;

app.listen(Number(process.env.ELYSIA_PROT), () => {
  console.log('Elysia server running on http://localhost:5521');
});
