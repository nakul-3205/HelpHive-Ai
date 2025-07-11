import express from 'express';
import { signup,login,logout, updateUser,getUser } from '../controllers/user.js';
// import { sign } from 'jsonwebtoken';
import { authenticate } from '../middlewares/auth.js';
// import { get } from 'mongoose';
const router = express.Router();

router.post('/updateuser',authenticate,updateUser)
router.get('/user',authenticate,getUser)

router.post('/signup', signup);
router.post('/login', login);   
router.post('/logout', logout);

export default router;