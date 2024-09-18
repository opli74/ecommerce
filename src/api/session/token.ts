import jwt from 'jsonwebtoken';
import { IncomingMessage } from 'http'; // Use Node.js built-in types for request
import { parse } from 'cookie';

const JWT_SECRET = process.env.JWT_SECRET;

export const generateToken = (id: any, duration: string = '7d' ) => 
{
  if( JWT_SECRET )
    return jwt.sign({ id }, JWT_SECRET, { expiresIn: duration });
  else
    return null;
};

export const verifyToken = (token: string) => 
{
  let decoded = null;

  if( JWT_SECRET )
    decoded = jwt.verify(token, JWT_SECRET);
  
  console.log({ decoded });

  return decoded;

};


const authenticateJWT = async ({ request, next }: { request: IncomingMessage; next: Function }) => {
  try {
    // Get the cookies from the request headers
    const cookies = request.headers.cookie;

    if( !cookies)
      return { error: 'No cookies', status: 403 };
    // Extract the token from the 'token' cookie

    const token = parse( cookies ).token;

    if (!token ) {
      return { error: 'Access denied. No token provided.', status: 403 };
    }

    if( !JWT_SECRET )
      return { error: 'No token string' };
    // Verify the JWT token
    const decoded = jwt.verify(token, JWT_SECRET);

    // Attach the decoded payload (user info) to the request object
    request.user = decoded as { id: number; name: string; email: string };

    // Proceed to the next middleware or route handler
    return next();
  } catch (error) {
    console.error('JWT verification failed:', error.message);
    return { error: 'Invalid or expired token.', status: 401 };
  }
};