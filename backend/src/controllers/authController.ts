import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../models/User';

const JWT_SECRET = 'your_jwt_secret_key';

export const register : any = async (req: Request, res: Response) => {
  const { username, password } : any = req.body;
  const hashedPassword : string = await bcrypt.hash(password, 10);
  try {
    const user  : any = new User({ username, password: hashedPassword });
    await user.save();
    res.status(201).send('User registered');
  } catch (error : any) {
    res.status(500).send('Error registering user');
  }
};

export const login : any = async (req: Request, res: Response) => {
  const { username, password } : any = req.body;
  try {
    const user : any = await User.findOne({ username });
    if (!user) {
      res.status(400).send('Invalid credentials');
      return;
    }
    const isPasswordValid : boolean = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      res.status(400).send('Invalid credentials');
      return;
    }
    const token : string = jwt.sign({ userId: user._id, username: user.username }, JWT_SECRET, { expiresIn: '1h' });
    res.json({ token });
  } catch (error : any) {
    res.status(500).send('Error logging in');
  }
};