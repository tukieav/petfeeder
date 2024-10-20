import express from 'express';
import { validateRegister, validateLogin } from '../validators/authValidator';
import { register, login } from '../controllers/authController';

const router : any = express.Router();

router.post('/register', validateRegister, register);
router.post('/login', validateLogin, login);

export default router;