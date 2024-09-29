import * as SQL from '../database/db';
import type { ResultSetHeader, RowDataPacket } from 'mysql2';

export interface USER extends RowDataPacket
{
    id?: number,
    name: string,
    email: string,
    password?: string,
    isAdmin: boolean,
    createdAt?: Date,
    updatedAt?: Date, 
};

export const getUsers = async ( sensitive: boolean = false ) => 
{
    if( !sensitive )
        return await SQL.execute< USER[] >( 'SELECT * FROM users', [ ] );  
    else
        return await SQL.execute< USER[] >( 'SELECT id, name, email, isAdmin, createdAt, updatedAt FROM users', [ ] );
 };

 export const getUserById = async ( id: string, sensitive: boolean = false ) =>
 {
    if( !sensitive )
        return await SQL.execute< USER >( 'SELECT * FROM users WHERE id=?', [id] );
    else
        return await SQL.execute< USER >( 'SELECT id, name, email, isAdmin, createdAt, updatedAt FROM users WHERE id=?', [id] );
 }

 export const getUserByEmail = async ( email: string, sensitive: boolean = false ) : Promise<USER | undefined> =>
 {
    let query;
    if( !sensitive )
        query = 'SELECT * FROM users WHERE email=?';
    else
        query = 'SELECT id, name, email, isAdmin, createdAt, updatedAt FROM users WHERE email=?';

    const rows = await SQL.execute< USER >( query, [email]);
    return rows.length > 0 ? rows[ 0 ] : undefined;
 }

export const addUser = async ( name: string, email: string, password:string ) => 
{
    const [result] = await SQL.execute< ResultSetHeader[] >( 
        'INSERT INTO users (name, email, password, isAdmin) VALUES (?, ?, ?, false)', 
        [name, email, password] 
    );
    return result.affectedRows > 0;
}

