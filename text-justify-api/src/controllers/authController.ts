import { Router, Request, Response } from 'express';
import jwt from 'jsonwebtoken';

export const authRouter = Router();

// In-memory storage for tokens (in a real app, use a database)
const tokenStore = new Map<string, string>();

// Generate a token for a given email
export function generateToken(email: string): string {
  const secret = process.env.JWT_SECRET || 'your_jwt_secret_key_here';
  return jwt.sign({ email }, secret, { expiresIn: '24h' });
}

// POST /api/token
// Body: { "email": "user@example.com" }
authRouter.post('/', (req: Request, res: Response) => {
  try {
    const { email } = req.body;
    
    if (!email) {
      return res.status(400).json({ error: 'Email is required' });
    }

    // Simple email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ error: 'Invalid email format' });
    }

    // Generate and store token
    const token = generateToken(email);
    tokenStore.set(email, token);

    res.status(200).json({ token });
  } catch (error) {
    console.error('Error generating token:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Helper function to verify token (for use in other modules)
export function verifyToken(token: string): { email: string } | null {
  try {
    const secret = process.env.JWT_SECRET || 'your_jwt_secret_key_here';
    return jwt.verify(token, secret) as { email: string };
  } catch (error) {
    return null;
  }
}

// Helper function to check if token exists in store
export function isValidToken(token: string): boolean {
  return Array.from(tokenStore.values()).includes(token);
}