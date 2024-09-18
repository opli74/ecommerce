import * as SQL from '../database/user';
import { generateToken, verifyToken  } from './token';
import bcrypt from 'bcryptjs';

export const loginUser = async ( email: string, password: string ) =>
{
    try
    {
        let user = await SQL.getUserByEmail( email );

        if( !user )
            return{ error: 'Invalid email' };

        if( !user.password || user.password.length == 0 )
            return{ error: 'Invalid password' };
        
        if( !bcrypt.compare( password, user.password ))
            return{ error: 'Invalid password not found' };

        const token = generateToken( user.id );

        return { message: 'Login successful', user: { id: user.id, name: user.name, email: user.email }, token };
    }
    catch ( error: any )
    {
        console.error('Error logging in user:', error.message);
        throw new Error('Failed to login');
    }
}
