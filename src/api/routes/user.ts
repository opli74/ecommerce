import { Elysia, t } from "elysia";
import { cors } from '@elysiajs/cors';
import { jwt } from '@elysiajs/jwt';
import { cookie } from '@elysiajs/cookie';
import { type ApiResponse, response } from "../util/response"; 
import { LoginUser, RegisterUser } from "../session/auth";
import { 
    GetUsers, 
    GetUserByEmail, 
    GetUserById, 
    GetUserByName 
} from "../database/user";
import type { 
    USER
} from '../../util/types';

const app = new Elysia( )
.use( 
    cors({ 
        origin: 'http://localhost:4321', 
        credentials: true,
        methods: ['GET', 'POST', 'PUT', 'DELETE'],
        exposeHeaders: true
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
    let _error = error.toString().replace( "Error: ", "");

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
.get( '/user/getall', async ( 
    context
)
: Promise< ApiResponse< USER[] > >=> 
{
    try 
    {
        const users = await GetUsers( true ) as USER[];
        return response( 
            true,
            "Got users",
            users,
            null
        );
    } 
    catch ( error ) 
    {
        console.error( `[Query Failed] -> ${error}` );
        throw Error;
    }
})
.post( '/user/login', async ( {
    jwt,
    body,
    cookie: { accessToken }
} )
: Promise< ApiResponse< boolean > > =>
{
    const { email, password } = body;
    const result =  await LoginUser( email, password );

    if( !result.success || !result.user )
    {
        await new Promise((resolve) => setTimeout( resolve, 1000 ));
        return response(
            false,
            result.data
        );
    }

    const accessJWT = await jwt.sign({ uid: String(result.user?.id) });

    accessToken.set( { 
        value: accessJWT,
        sameSite: 'strict',
        httpOnly: true, 
        maxAge: 7 * 24 * 60 * 60, // 7 days
        path: '/', 
    });

    return response( 
        true,
        result.data
    )
},
{
    body: t.Object({
        email: t.String(),
        password: t.String( )
    })
})
.post( '/user/register', async ( {
    body 
} )
: Promise< ApiResponse< boolean > > =>
{
    const { name, email, password } = body;
    try
    {
        let response_ = await RegisterUser( name, email, password );
        return response( 
            response_.success,
            response_.data,
        )
    }
    catch( error: any )
    {
        throw Error;
    }
},
{
    body: t.Object({
        name: t.String( ),
        email: t.String( ),
        password: t.String( )
    })
})
.get('/user/isloggedin', async ( {
    jwt, 
    cookie: { accessToken } 
} )
: Promise< ApiResponse< USER > > => 
{
    const token = accessToken.value;

    if (!token) 
        return response( 
            false,
            "User not logged in"
        );

    try 
    {
        const result = await jwt.verify( token );

        if (!result || typeof result !== 'object') 
            return response( 
                false,
                "Token is invalid"
            );

        const { uid } = result;
        const user = await GetUserById( String(uid), true ) as USER;

        if( !user )
            return response(
                false,
                "User is invalid"
            );

        return response( 
            true,
            'User is logged in',
            user
        );
    } 
    catch (error: any) 
    {
        console.error( `[Query Failed] -> ${error}` );
        throw Error;
    }
})
.post( '/user/logout', async ( {
    cookie,
    cookie: { accessToken }
} )
: Promise< ApiResponse< boolean > > => 
{
    try 
    {
        delete cookie.accessToken;
        accessToken.remove();
        return response(
            true,
            "Successfully logged out",
        )
    }
    catch ( error )
    {
        throw Error;
    }
}) 

export default app;