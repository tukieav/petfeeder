import express from 'express';
import { validateRegister, validateLogin } from '../validators/authValidator';
import { register, login, logout } from '../controllers/authController';

const router : any = express.Router();

router.post('/register', validateRegister, register);
router.post('/login', validateLogin, login);
router.post('/logout', logout);

export default router;