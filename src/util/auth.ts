import {type USER} from '../api/database/user';

export async function isLoggedIn(request: Request): Promise<{ loggedIn: boolean, user?: USER }>
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
        return { loggedIn: false  };
      }
  
      const user = await response.json();
  
      if (!user) 
        return { loggedIn: false }; 
    
      return { loggedIn: true, user };
    } 
    catch (error: any) 
    {
      console.error("Error checking login status:", error);
      return { loggedIn: false };
    }
}