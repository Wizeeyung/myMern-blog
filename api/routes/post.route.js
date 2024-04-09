import express from 'express';
import { veriifyToken } from '../utils/verifyUser.js';
import { createPost , getPosts} from '../controllers/post.controller.js';

const router = express.Router();

router.post('/create', veriifyToken, createPost);
router.get('/getpost', getPosts);

export default router;