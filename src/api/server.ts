import { Elysia, t } from "elysia";
import * as SQL from './database/db'
import { cors } from '@elysiajs/cors';
import { jwt } from '@elysiajs/jwt';
import { cookie } from '@elysiajs/cookie';
import { type ApiResponse, response } from "./util/response"; 
import user from './routes/user';
import product from './routes/product'

SQL.init();

const app = new Elysia() 
.use( 
  cors({ 
      origin: 'http://localhost:4321', 
      credentials: true,
      methods: ['GET', 'POST', 'PUT', 'DELETE'],
      exposeHeaders: ['Set-Cookie']
  })
)

.use( 
  jwt( { 
      name: 'jwt',
      secret: process.env.JWT_SECRET || 'secret',
      expiresIn: '7d',
  })
)

  .use( 
    cookie( ) 
  )

  .onError( ({  
    code, 
    error, 
    set
  } ) => 
  {
    console.error( error );
    let _error = error.toString().replace( "Error: ", "" );

    let status = 500;
    let message = "Unexpcted error";

    switch (code) 
    {
        case 'NOT_FOUND':
        {
            message = "Not found";
            status = 404;
            break;
        }
        case 'INTERNAL_SERVER_ERROR':
        {
            message = "Internal server error";
            status = 500;
            break;
        }
    }

    set.status = status;
    return response( 
        false,
        message, 
        null,
        _error
    );
  })
  ///////////////////////
  //      USER API     //
  ///////////////////////
  .use( user )
  ///////////////////////
  //    PRODUCT API    //
  ///////////////////////
  .use( product )

app.listen( Number(Bun.env.ELYSIA_PORT) || 5521, (

) => 
{
  console.log('Elysia server running on http://localhost:5521');
});
