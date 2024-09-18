import mysql from 'mysql2/promise';
import { config } from 'dotenv';
import type { RowDataPacket } from 'mysql2/promise';

config();

export let pool: mysql.Pool;

export const init = async () => 
{
    try 
    {
        pool = mysql.createPool({
            host: Bun.env.DB_HOST,
            user: Bun.env.DB_USER,
            password: Bun.env.DB_PASSWORD,
            database: Bun.env.DB_NAME,
            port: 3306,  // Default MariaDB port
            waitForConnections: true,
            connectionLimit: 10,  // Max number of connections in the pool
            queueLimit: 0         // No limit on queued requests
          });
      
        console.log(`mariaDB connected successfully`);
        return pool;
    } 
    catch (error: any) 
    {
        console.log(`Error: ${error.message}`);
        process.exit(1);
    }
};

/**
 * executes SQL queries in MySQL db
 *
 * @param {string} query - provide a valid SQL query
 * @param {string[] | Object} params - provide the parameterized values used
 * in the query
 */
export const execute = async <T> (query: string, params: (string | number)[] |  Object ): Promise<T[]> => {
    try 
    {
        if (!pool) 
        {
            throw new Error('Pool was not created. Ensure pool is created when running the app.');
        }
        
        const [rows] = await pool.execute<RowDataPacket[]>( query, params );
        return rows as T[];
    } 
    catch (error) 
    {
        console.error(`[SQL EXECUTE ERROR] -> ${error}`);
        throw new Error('Failed to execute MySQL query');
    }
}

  