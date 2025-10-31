import { Router, Request, Response, NextFunction } from 'express';
import { verifyToken, isValidToken } from './authController';
import { justifyText } from '../services/justify';
import { rateLimiter } from '../middlewares/rateLimit';

export const justifyRouter = Router();

// Middleware to verify JWT token
export const authenticateToken = (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: 'No token provided' });
  }

  const decoded = verifyToken(token);
  if (!decoded || !isValidToken(token)) {
    return res.status(403).json({ error: 'Invalid or expired token' });  }

  // Add user email to the request object for rate limiting
  req.user = decoded;
  next();
};

// Handle text justification
export const justifyTextHandler = (req: Request, res: Response) => {
    try {
      const text = req.body;
      
      if (typeof text !== 'string' || !text.trim()) {
        return res.status(400).json({ error: 'Text is required' });
      }

      const justifiedText = justifyText(text, 80);
      res.set('Content-Type', 'text/plain');
      res.send(justifiedText);
    } catch (error) {
      console.error('Error justifying text:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
};

// Apply middleware to the route
justifyRouter.post('/', authenticateToken, rateLimiter, justifyTextHandler);