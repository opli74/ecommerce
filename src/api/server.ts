import { Elysia } from 'elysia';
import type { Context } from 'elysia';
import * as SQL from './database/db';
import * as Query from './database/user';
import { loginUser } from './session/login';
import { registerUser } from './session/register';
import { cors } from '@elysiajs/cors';
import { jwt } from '@elysiajs/jwt';
import { cookie } from '@elysiajs/cookie';

SQL.init();

const app = new Elysia() 
  .use( cors({ 
    origin: true, 
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    exposeHeaders: ['Set-Cookie']
  }))
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
      return await Query.getUsers( true );
    } 
    catch (error: any) 
    {
        console.error(`[QUERY ALL USERS] -> ${error.message}`);
        return { error: 'Failed to fetch users' };
    }
  })

  .post( '/api/login',
    async ({
      jwt,
      body,
      cookie: { accessToken }
    }
    ): Promise<{ success: boolean; data: any }> =>
  {
    const { email, password } = body as { email: string, password: string };
    const result =  await loginUser( email, password );

    if( !result.success )
    {
      return { 
        success: false,
        data: result.data,
      }
    }
    
    const accessJWT = await jwt.sign( {uid: String(result.user?.id)} );

    accessToken.set( { 
      value: accessJWT,
      sameSite: 'strict',
      httpOnly: true, 
      maxAge: 7 * 24 * 60 * 60, // 7 days
      path: '/', 
    })

    return { 
      success: true, 
      data: result.user 
    };
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

  .get('/api/auth/isloggedin', async ({ jwt, cookie: { accessToken } }) => 
    {
    const token = accessToken.value;

    if (!token) 
        return false;

    try 
    {
      const result = await jwt.verify(token);

      if (!result || typeof result !== 'object') 
        return false;
    
      const { uid } = result;
      const user: Query.USER  = await Query.getUserById( String(uid) );
      
      if( !user )
        return false;

      return user[0];
    } 
    catch (error: any) 
    {
      return { error: error.message };
    }
  })
  .post( '/api/logout', async ({ jwt, cookie, cookie: { accessToken } }) => 
  {
    try 
    {
      accessToken.remove( );
      delete cookie.accessToken;
      return { success: true, data: '' };
    }
    catch ( error: any )
    {
      console.log( `Failed to logout ${error.message}` );
      return { success: false, data: error };
    }
  })  
;

app.listen(Number(process.env.ELYSIA_PROT), () => {
  console.log('Elysia server running on http://localhost:5521');
});
