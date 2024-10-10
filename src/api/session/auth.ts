import bcrypt from 'bcryptjs';
import { 
    AddUser, 
    GetUserById, 
    GetUserByEmail, 
    GetUserByName 
}
from '../database/user';
import type { 
    USER
} from '../../util/types';

export const LoginUser = async ( 
    email: string, 
    password: string 
) =>
{
    try
    {
        let user = await GetUserByEmail( email );
        if( !user )
            return{ 
                success: false, 
                data: 'Invalid email' 
            };

        if( !user.password || user.password.length == 0 )
            return{ 
                success: false, 
                data: 'Invalid password' 
            };
        
        const compare = await bcrypt.compare( password, user.password );
        if( !compare )
            return{ 
                success: false, 
                data: 'Invalid password not found' 
            };
        ;
        if( !Bun.env.JWT_SECRET )
            return { 
                success: false, 
                data: 'JWT secret unavailable' 
            };

        return { 
            success: true, 
            data: 'Login successful',
            user: user as USER
        };
    }
    catch ( error: any )
    {
        return {
            success: false,
            data: error.message
        };
    }
}

export const RegisterUser = async ( 
    name: string, 
    email: string, 
    password: string 
) =>
{
    try
    {
        const userEmailCheck = await GetUserByEmail( email );
        const userNameCheck = await GetUserByName( name );

        if( userNameCheck && userEmailCheck )
            return { 
                success: false,
                data: 'Given name and email already exists'
            };

        if( userNameCheck )
            return { 
                success: false, 
                data: 'Given name already exists' 
            }; 

        if( userEmailCheck )
            return{ 
                success: false, 
                data: 'Given email already exists' 
            }; 

        const salt = await bcrypt.genSalt( 10 );
        const hash = await bcrypt.hash( password, salt );

        const success = await AddUser( name, email, hash );
        if ( success ) 
            return { 
                success: true, 
                data: 'User registered successfully' 
            };
        else 
            return { 
                success: false, 
                data: 'Failed to register user' 
            };
    }
    catch ( error: any )
    {
        return {
            success: false,
            data: error
        };
    }
}
