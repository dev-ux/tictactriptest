"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const dotenv_1 = __importDefault(require("dotenv"));
const authController_1 = require("./controllers/authController");
const justifyController_1 = require("./controllers/justifyController");
const errorHandler_1 = require("./middlewares/errorHandler");
dotenv_1.default.config();
const app = (0, express_1.default)();
const PORT = process.env.PORT || 3000;
// Middleware
app.use((0, cors_1.default)());
app.use(express_1.default.text({ type: 'text/plain' }));
app.use(express_1.default.json());
// Routes
app.use('/api/token', authController_1.authRouter);
app.use('/api/justify', justifyController_1.justifyRouter);
// Health check
app.get('/health', (req, res) => {
    res.status(200).json({ status: 'ok' });
});
// 404 handler
app.use((req, res) => {
    res.status(404).json({ error: 'Not Found' });
});
// Error handler
app.use(errorHandler_1.errorHandler);
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
