import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { authRouter } from './controllers/authController';
import { justifyRouter } from './controllers/justifyController';
import { errorHandler } from './middlewares/errorHandler';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.text({ 
  type: 'text/plain',
  limit: '10mb' // Augmente la limite à 10 Mo
}));
app.use(express.json({ limit: '10mb' }));

// Routes
app.use('/api/token', authRouter);
app.use('/api/justify', justifyRouter);

// Health check
app.get('/health', (req: Request, res: Response) => {
  res.status(200).json({ status: 'ok' });
});

// Debug endpoints (only in development)
if (process.env.NODE_ENV !== 'production') {
  // Reset counter
  app.post('/api/debug/reset-limit', (req: Request, res: Response) => {
    const { email } = req.body;
    if (!email) {
      return res.status(400).json({ error: 'Email is required' });
    }
    
    const { wordCounts } = require('./middlewares/rateLimit');
    
    if (wordCounts.has(email)) {
      const oldCount = wordCounts.get(email)?.count || 0;
      wordCounts.delete(email);
      return res.json({ 
        message: `Counter reset for ${email}`,
        previousCount: oldCount
      });
    }
    
    return res.status(404).json({ error: 'User not found' });
  });

  // Check counter status
  app.get('/api/debug/limit-status', (req: Request, res: Response) => {
    const { email } = req.query;
    if (!email || typeof email !== 'string') {
      return res.status(400).json({ error: 'Email is required as a query parameter' });
    }
    
    const { wordCounts, DAILY_WORD_LIMIT } = require('./middlewares/rateLimit');
    const count = wordCounts.get(email)?.count || 0;
    
    return res.json({
      email,
      currentCount: count,
      remaining: Math.max(0, DAILY_WORD_LIMIT - count),
      limit: DAILY_WORD_LIMIT,
      resetTime: new Date(wordCounts.get(email)?.lastReset || Date.now() + 24 * 60 * 60 * 1000).toISOString()
    });
  });
}

// 404 handler
app.use((req: Request, res: Response) => {
  res.status(404).json({ error: 'Not Found' });
});

// Error handler
app.use(errorHandler);

// Export the app for testing
if (process.env.NODE_ENV !== 'production') {
  app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
  });
}

export { app };