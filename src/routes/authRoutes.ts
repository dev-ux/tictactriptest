import express from 'express';
import { generateToken } from '../controllers/authController';

const router = express.Router();

router.post('/token', generateToken);

export { router as authRouter };
