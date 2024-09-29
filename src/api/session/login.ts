import * as SQL from '../database/user';
import bcrypt from 'bcryptjs';

export const loginUser = async ( 
    email: string, 
    password: string 
) =>
{
    try
    {
        let user = await SQL.getUserByEmail( email );
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
            user: { 
                id: user.id,
                name: user.name, 
                email: user.email 
            },
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
