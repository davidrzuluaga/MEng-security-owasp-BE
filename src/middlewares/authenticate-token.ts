import { RequestHandler, Request } from 'express';
import SecurityManager from '../modules/security';
import { UserType } from '../types/user';

interface AuthenticatedRequest extends Request {
  user?: UserType;
}

const authenticateToken: RequestHandler = (req: AuthenticatedRequest, res, next) => {
  const authorizationHeader = req.headers['authorization'];
  const token = authorizationHeader?.split(' ')[1]; // Extract Bearer token

  if (!token) {
    return res.status(401).json({ message: 'Access denied. No token provided.' });
  }

  try {
    // Verify the token using SecurityManager
    const user = SecurityManager.verifyToken(token);

    // Attach the decoded user information to the request object
    req.user = user;

    // Proceed to the next middleware or route handler
    next();
  } catch (error) {
    return res.status(403).json({ message: 'Invalid or expired token.' });
  }
};

export default authenticateToken;
