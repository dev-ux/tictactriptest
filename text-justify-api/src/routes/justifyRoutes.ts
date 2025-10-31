import express from 'express';
import { justifyTextHandler, authenticateToken } from '../controllers/justifyController';
import { rateLimiter } from '../middlewares/rateLimit';

const router = express.Router();

router.post('/', authenticateToken, rateLimiter, justifyTextHandler);

export { router as justifyRouter };
