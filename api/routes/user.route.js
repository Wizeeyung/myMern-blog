import express from 'express';
import { test, updateUser } from '../controllers/user.controller.js';
import { veriifyToken } from '../utils/verifyUser.js';
import { deleteUser } from '../controllers/user.controller.js';


const router = express.Router();

router.get('/test', test)
//we need to verify that only the person logged in can update the profile and also delete it
router.put('/update/:userId',veriifyToken, updateUser);
router.delete('/delete/:userId', veriifyToken, deleteUser);


export default router;