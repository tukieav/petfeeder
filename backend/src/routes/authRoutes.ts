import express, { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { body, validationResult } from 'express-validator';
import User from '../models/User';
const router : any = express.Router();
const JWT_SECRET : any = 'your_jwt_secret_key'; 
// Rejestracja
router.post('/register', 
    body('username').isEmail().withMessage('Username must be a valid email'),
    body('password')
      .isLength({ min: 8 }).withMessage('Password must be at least 8 characters long')
      .matches(/[a-z]/).withMessage('Password must contain at least one lowercase letter')
      .matches(/[A-Z]/).withMessage('Password must contain at least one uppercase letter')
      .matches(/\d/).withMessage('Password must contain at least one number')
      .matches(/[\W_]/).withMessage('Password must contain at least one special character'),
    async (req: Request, res: Response) => {
      const errors : any = validationResult(req);
      if (!errors.isEmpty()) {
        res.status(400).json({ errors: errors.array() });
        return;
      }
    const { username, password } : any = req.body;
    const hashedPassword : any = await bcrypt.hash(password, 10);
    try {
      const user : any = new User({ username, password: hashedPassword });
      await user.save();
      res.status(201).send('User registered');
    } catch (error) {
      res.status(500).send('Error registering user');
    }
  }
);
// Logowanie
router.post('/login', async (req: Request, res: Response) => {
  const { username, password } = req.body;
  try {
    const user : any = await User.findOne({ username });
    if (!user) {
      res.status(400).send('Invalid credentials');
      return;
    }
    const isPasswordValid : any = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      res.status(400).send('Invalid credentials');
      return;
    }
    const token : any = jwt.sign({ userId: user._id, username: user.username }, JWT_SECRET, { expiresIn: '1h' });
    res.json({ token });
  } catch (error) {
    res.status(500).send('Error logging in');
  }
});
export default router;