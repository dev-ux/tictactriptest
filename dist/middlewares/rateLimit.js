"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.rateLimiter = void 0;
// Daily word limit (80,000 words per day)
const DAILY_WORD_LIMIT = parseInt(process.env.DAILY_WORD_LIMIT || '80000', 10);
// In-memory store for word counts (in a production environment, use Redis or a database)
const wordCounts = new Map();
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
const rateLimiter = (req, res, next) => {
    var _a;
    try {
        const userEmail = (_a = req.user) === null || _a === void 0 ? void 0 : _a.email;
        if (!userEmail) {
            return res.status(401).json({ error: 'User not authenticated' });
        }
        // Get the current word count for this user
        const currentCount = wordCounts.get(userEmail) || { count: 0, lastReset: Date.now() };
        // Count words in the current request
        const text = req.body;
        const wordCount = text ? text.split(/\s+/).filter(word => word.length > 0).length : 0;
        // Check if adding these words would exceed the limit
        if (currentCount.count + wordCount > DAILY_WORD_LIMIT) {
            const error = new Error('Word limit exceeded');
            error.statusCode = 402; // Payment Required
            throw error;
        }
        // Update the word count
        wordCounts.set(userEmail, {
            count: currentCount.count + wordCount,
            lastReset: currentCount.lastReset
        });
        next();
    }
    catch (error) {
        next(error);
    }
};
exports.rateLimiter = rateLimiter;
