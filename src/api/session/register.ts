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
        const userCheck = await SQL.getUserByEmail( email );

        if(  userCheck )
            return{ 
                success: false, 
                data: 'User exists' 
            }; 

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
