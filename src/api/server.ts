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

  .get( '/api/db/users', async ( 

  ) => 
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

  .post( '/api/login', async ( {
      jwt,
      body,
      cookie: { accessToken }
  } ): Promise<{ success: boolean; data: any }> =>
  {
    const { email, password } = body as { email: string, password: string };
    const result =  await loginUser( email, password );

    if( !result.success || !result.user )
      return { 
        success: false,
        data: result.data,
      };

    const accessJWT = await jwt.sign({ uid: String(result.user?.id) });

    accessToken.set( { 
      value: accessJWT,
      sameSite: 'strict',
      httpOnly: true, 
      maxAge: 7 * 24 * 60 * 60, // 7 days
      path: '/', 
    });

    return { 
      success: true, 
      data: result.data
    };
  })

  .post( 'api/register', async ( {
    body 
  } ) =>
  {
    const{ name, email, password } = body as { name: string, email: string, password: string };
    try
    {
      return await registerUser( name, email, password );
    }
    catch( error: any )
    {
      return {
        success: false, 
        data: error.message 
      };
    }
  })

  .get('/api/auth/isloggedin', async ( {
    jwt, 
    cookie: { accessToken } 
  } ) => 
  {
    const token = accessToken.value;

    if (!token) 
      return { 
        success: false, 
        data: 'Invalid token' 
      };

    try 
    {
      const result = await jwt.verify(token);

      if (!result || typeof result !== 'object') 
        return { 
          success: false, 
          data: 'Could not verify token'
        };
    
      const { uid } = result;
      const user: Query.USER  = await Query.getUserById( String(uid), true );

      if( !user )
        return { 
          success: false, 
          data: 'Invalid user from token' 
        };

      return { 
        success: true, 
        data: 'Valid user',
        user: { 
          id: user.id, 
          name: user.name, 
          email: user.email, 
          isAdmin: user.isAdmin, 
          createdAt: user.createdAt, 
          updatedAt: user.updatedAt 
        }
      };
    } 
    catch (error: any) 
    {
      return {
        success: false, 
        data: error.message
      };
    }
  })

  .post( '/api/logout', async ( {
      jwt, 
      cookie, 
      cookie: { accessToken } 
  } ) => 
  {
    try 
    {
      accessToken.remove( );
      delete cookie.accessToken;
      return { 
        success: true, 
        data: 'Successfully deleted token' 
      };
    }
    catch ( error: any )
    {
      return { 
        success: false, 
        data: error 
      };
    }
  })  
;

app.listen(Number(process.env.ELYSIA_PROT), () => {
  console.log('Elysia server running on http://localhost:5521');
});
