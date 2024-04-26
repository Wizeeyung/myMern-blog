import express from 'express';
import { veriifyToken } from '../utils/verifyUser.js';
import { createComment } from '../controllers/comment.controller.js';

const router = express.Router();

router.post('/create', veriifyToken,  createComment);

export default router ;