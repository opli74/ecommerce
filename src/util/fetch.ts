export async function fetchAPI( 
  path: string, 
  method: "POST" | "GET" | "PUT" | "DELETE",
  headers: Record<string, string> = {},
  body?: any
)
{
    if (body && !headers['Content-Type'])
        headers['Content-Type'] = 'application/json';

    return await fetch( `http://localhost:5521${path}`, {
        method: method,
        headers: headers,
        credentials: 'include',
        body: method !== "GET" ? JSON.stringify( body ) : undefined
    } )
};