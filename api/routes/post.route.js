import express from 'express';
import { veriifyToken } from '../utils/verifyUser.js';
import { createPost } from '../controllers/post.controller.js';

const router = express.Router();

router.post('/create', veriifyToken, createPost);

export default router;