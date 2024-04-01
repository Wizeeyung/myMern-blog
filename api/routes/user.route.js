import express from 'express';
import { test, updateUser } from '../controllers/user.controller.js';
import { veriifyToken } from '../utils/verifyUser.js';


const router = express.Router();

router.get('/test', test)
router.put('/update/:userId',veriifyToken, updateUser);

export default router;