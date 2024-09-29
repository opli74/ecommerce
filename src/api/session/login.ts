import * as SQL from '../database/user';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

export const loginUser = async ( email: string, password: string ) =>
{
    try
    {
        let user = await SQL.getUserByEmail( email );
        if( !user )
            return{ success: false, data: 'Invalid email' };

        if( !user.password || user.password.length == 0 )
            return{ success: false, data: 'Invalid password' };
        
        const compare = await bcrypt.compare( password, user.password );
        if( !compare )
            return{ success: false, data: 'Invalid password not found' };
        ;
        if( !Bun.env.JWT_SECRET )
            return { success: false, data: 'JWT secret unavailable' };

        const token = jwt.sign({ uid: user.id }, Bun.env.JWT_SECRET || '', { expiresIn: '7d' });

        return { 
            success: true, 
            data: 'Login successful',
            user: { id: user.id, name: user.name, email: user.email }, 
            token 
        };
    }
    catch ( error: any )
    {
        console.error( 'Error logging in user: ', error.message );
        throw new Error( 'Failed to login' );
    }
}
