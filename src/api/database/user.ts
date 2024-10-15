import * as SQL from '../database/db';
import type { ResultSetHeader, RowDataPacket } from 'mysql2';

interface USER_DB extends RowDataPacket
{
    id?: number,
    name: string,
    email: string,
    password?: string,
    isAdmin: boolean,
    createdAt?: Date,
    updatedAt?: Date, 
};

export const GetUsers = async ( 
    sensitive: boolean = false 
) => 
{
    let query;
    if( !sensitive )
        query = 'SELECT * FROM users';
    else
        query = 'SELECT id, name, email, isAdmin, createdAt, updatedAt FROM users';

    const rows = await SQL.execute< USER_DB[] >( query );
    return rows.length > 0 ? rows : null;
 };

 export const GetUserById = async ( 
    id: string, 
    sensitive: boolean = false 
) =>
{
    let query;
    if( !sensitive )
        query = 'SELECT * FROM users WHERE id=?';
    else
        query = 'SELECT id, name, email, isAdmin, createdAt, updatedAt FROM users WHERE id=?';

    const rows = await SQL.execute< USER_DB[] >( query, [id]);
    return rows.length > 0 ? rows[ 0 ] : null;
}

 export const GetUserByEmail = async ( 
    email: string, 
    sensitive: boolean = false 
) =>
{
    let query;
    if( !sensitive )
        query = 'SELECT * FROM users WHERE email=?';
    else
        query = 'SELECT id, name, email, isAdmin, createdAt, updatedAt FROM users WHERE email=?';

    const rows = await SQL.execute< USER_DB[] >( query, [email]);
    return rows.length > 0 ? rows[ 0 ] : null;
 }

 export const GetUserByName = async ( 
    name: string, 
    sensitive: boolean = false 
) =>
{
    let query;
    if( !sensitive )
        query = 'SELECT * FROM users WHERE name=?';
    else
        query = 'SELECT id, name, email, isAdmin, createdAt, updatedAt FROM users WHERE name=?';

    const rows = await SQL.execute< USER_DB[] >( query, [name]);
    return rows.length > 0 ? rows[ 0 ] : null;
}

export const AddUser = async ( 
    name: string, 
    email: string, 
    password:string 
) => 
{
    const [result] = await SQL.execute< ResultSetHeader[] >( 
        'INSERT INTO users (name, email, password, isAdmin) VALUES (?, ?, ?, false)', 
        [name, email, password] 
    );
    return result.affectedRows > 0;
}

