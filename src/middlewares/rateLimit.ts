import { Request, Response, NextFunction } from 'express';
import { RateLimiterMemory } from 'rate-limiter-flexible';

// Daily word limit (80,000 words per day)
export const DAILY_WORD_LIMIT = parseInt(process.env.DAILY_WORD_LIMIT || '80000', 10);

// In-memory store for word counts (in a production environment, use Redis or a database)
export const wordCounts = new Map<string, { count: number; lastReset: number }>();

// Reset word counts at the start of each day
function resetDailyCounts() {
  const now = Date.now();
  const today = new Date(now);
  today.setHours(0, 0, 0, 0);
  
  for (const [key, value] of wordCounts.entries()) {
    if (value.lastReset < today.getTime()) {
      wordCounts.delete(key);
    }
  }
  
  // Schedule next reset at midnight
  const nextDay = new Date(today);
  nextDay.setDate(today.getDate() + 1);
  setTimeout(resetDailyCounts, nextDay.getTime() - Date.now());
}

// Start the daily reset timer
resetDailyCounts();

// Rate limiter middleware
export const rateLimiter = (req: Request, res: Response, next: NextFunction) => {
  try {
    const userEmail = req.user?.email;
    
    if (!userEmail) {
      console.log('Rate limit check failed: No user email');
      return res.status(401).json({ error: 'User not authenticated' });
    }
    
    // Get the current word count for this user or initialize it
    const now = Date.now();
    const today = new Date(now);
    today.setHours(0, 0, 0, 0);
    
    let currentCount = wordCounts.get(userEmail);
    
    // Initialize or reset counter if it's a new day
    if (!currentCount || currentCount.lastReset < today.getTime()) {
      currentCount = { count: 0, lastReset: now };
      wordCounts.set(userEmail, currentCount);
      console.log(`Counter reset for ${userEmail}`);
    }
    
    // Count words in the current request
    const text = req.body as string;
    const wordCount = text ? text.split(/\s+/).filter(word => word.length > 0).length : 0;
    
    console.log(`User ${userEmail} - Current: ${currentCount.count}, Adding: ${wordCount}, Limit: ${DAILY_WORD_LIMIT}`);
    
    // Check if adding these words would exceed the limit
    if (currentCount.count + wordCount > DAILY_WORD_LIMIT) {
      const error = new Error('Word limit exceeded');
      (error as any).statusCode = 402; // Payment Required
      throw error;
    }
    
    // Update the word count
    wordCounts.set(userEmail, {
      count: currentCount.count + wordCount,
      lastReset: currentCount.lastReset
    });
    
    next();
  } catch (error) {
    next(error);
  }
};