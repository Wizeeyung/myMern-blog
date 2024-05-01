import express from 'express';
import { veriifyToken } from '../utils/verifyUser.js';
import { createComment, getPostComments, likeComment } from '../controllers/comment.controller.js';

const router = express.Router();

router.post('/create', veriifyToken,  createComment);
router.get('/getPostComments/:postId', getPostComments);
//we have to build an api route for like and make sure the person has to be verified for the comments to be liked
router.put('/likeComment/:commentId', veriifyToken, likeComment)
export default router ;