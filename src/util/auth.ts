import { fetchAPI } from './fetch';
import { type ApiResponse, response } from '../api/util/response';
import type { USER } from './types';

export async function isLoggedIn( 
  request?: Request
)
: Promise< ApiResponse< USER > >
{
  try 
  {
    const cookieHeader = request?.headers.get( 'cookie' ) || '';
    const apiResponse = await fetchAPI( 
      "/user/isloggedin", 
      "GET", 
      {
        Cookie: cookieHeader
      }
    );

    const result = ( await apiResponse.json() ) as ApiResponse< USER >;

    return result;
  } 
  catch (error: any) 
  {
    console.error( `[isLoggedIn] -> ${error}` );
    return response< USER >( 
      false,
      "Failed",
      null,
      error
    );
  }
}