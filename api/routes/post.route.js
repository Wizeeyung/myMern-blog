import express from 'express';
import { veriifyToken } from '../utils/verifyUser.js';
import { createPost , getPosts, deletePost, updatePost} from '../controllers/post.controller.js';


const router = express.Router();

router.post('/create', veriifyToken, createPost);
router.get('/getpost', getPosts);
//we need to be sure its the logged in user that wants to delete the published post so we have to verify
router.delete('/deletepost/:postId/:userId', veriifyToken, deletePost)
router.put('/updatepost/:postId/:userId', veriifyToken , updatePost)

export default router;