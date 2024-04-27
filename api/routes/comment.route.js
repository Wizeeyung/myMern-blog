import express from 'express';
import { veriifyToken } from '../utils/verifyUser.js';
import { createComment, getPostComments } from '../controllers/comment.controller.js';

const router = express.Router();

router.post('/create', veriifyToken,  createComment);
router.get('/getPostComments/:postId', getPostComments);

export default router ;