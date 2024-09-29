import {type USER} from '../api/database/user';

export async function isLoggedIn( 
  request: Request
)
: Promise<{ success: boolean, data: any | object, user?: USER }>
{
    try 
    {
      const response = await fetch("http://localhost:5521/api/auth/isloggedin", {
        method: "GET",
        credentials: "include",
        headers: {
          Cookie: request.headers.get('cookie') || '',
        },
      });
  
      if (response.status !== 200) 
      {
        console.error("Failed to fetch user status");
        return { success: false, data: response.status };
      }
  
      const result = await response.json();
    
      return { success: result.success, data: result.data, user: result.user };
    } 
    catch (error: any) 
    {
      console.error("Error checking login status:", error);
      return { success: false, data: error.message };
    }
}