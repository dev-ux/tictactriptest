"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.justifyRouter = void 0;
const express_1 = require("express");
const authController_1 = require("./authController");
const justify_1 = require("../services/justify");
const rateLimit_1 = require("../middlewares/rateLimit");
exports.justifyRouter = (0, express_1.Router)();
// Middleware to verify JWT token
const authenticateToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    if (!token) {
        return res.status(401).json({ error: 'No token provided' });
    }
    const decoded = (0, authController_1.verifyToken)(token);
    if (!decoded || !(0, authController_1.isValidToken)(token)) {
        return res.status(403).json({ error: 'Invalid or expired token' });
    }
    // Add user email to the request object for rate limiting
    req.user = decoded;
    next();
};
// POST /api/justify
exports.justifyRouter.post('/', authenticateToken, rateLimit_1.rateLimiter, (req, res) => {
    try {
        const text = req.body;
        if (typeof text !== 'string' || !text.trim()) {
            return res.status(400).json({ error: 'Text is required' });
        }
        const justifiedText = (0, justify_1.justifyText)(text, 80);
        res.set('Content-Type', 'text/plain');
        res.send(justifiedText);
    }
    catch (error) {
        console.error('Error justifying text:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});
