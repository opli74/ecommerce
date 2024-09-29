import * as SQL from '../database/user';
import bcrypt from 'bcryptjs';

export const registerUser = async ( 
    name: string, 
    email: string, 
    password: string 
) =>
{
    try
    {
        const userEmailCheck = await SQL.getUserByEmail( email );
        //const userNameCheck = await SQL.getUserByName( name );

        if( userEmailCheck )
            return{ 
                success: false, 
                data: 'Email exists' 
            }; 

        // if( userNameCheck )
        //     return{ 
        //         success: false, 
        //         data: 'Name exists' 
        //     }; 

        const salt = await bcrypt.genSalt( 10 );
        const hash = await bcrypt.hash( password, salt );

        const success = await SQL.addUser( name, email, hash );
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
            data: error.message
        };
    }
}
