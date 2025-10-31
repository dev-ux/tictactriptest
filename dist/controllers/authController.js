"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authRouter = void 0;
exports.verifyToken = verifyToken;
exports.isValidToken = isValidToken;
const express_1 = require("express");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
exports.authRouter = (0, express_1.Router)();
// In-memory storage for tokens (in a real app, use a database)
const tokenStore = new Map();
// Generate a token for a given email
function generateToken(email) {
    const secret = process.env.JWT_SECRET || 'your_jwt_secret_key_here';
    return jsonwebtoken_1.default.sign({ email }, secret, { expiresIn: '24h' });
}
// POST /api/token
// Body: { "email": "user@example.com" }
exports.authRouter.post('/', (req, res) => {
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
    }
    catch (error) {
        console.error('Error generating token:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});
// Helper function to verify token (for use in other modules)
function verifyToken(token) {
    try {
        const secret = process.env.JWT_SECRET || 'your_jwt_secret_key_here';
        return jsonwebtoken_1.default.verify(token, secret);
    }
    catch (error) {
        return null;
    }
}
// Helper function to check if token exists in store
function isValidToken(token) {
    return Array.from(tokenStore.values()).includes(token);
}
