import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../models/User';
import dotenv from 'dotenv';

dotenv.config();

const JWT_SECRET: any = process.env.JWT_SECRET;

export const register: any = async (req: Request, res: Response) => {
  const { username, password }: any = req.body;
  const hashedPassword: string = await bcrypt.hash(password, 10);
  try {
    const user: any = new User({ username, password: hashedPassword });
    await user.save();
    res.status(201).send('User registered');
  } catch (error: any) {
    res.status(500).send('Error registering user');
  }
};

export const login = async (req: Request, res: Response) => {
  const { username, password } = req.body;
  try {
    const user = await User.findOne({ username });
    if (!user) {
      res.status(400).send('Invalid credentials');
      return;
    }
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      res.status(400).send('Invalid credentials');
      return;
    }

    const token = jwt.sign({ userId: user._id, username: user.username }, JWT_SECRET, { expiresIn: '1h' });

    console.log('JWT Token generated:', token);

    res.json({ token });
  } catch (error) {
    console.error('Error during login:', error);
    res.status(500).send('Error logging in');
  }
};
 
export const logout = async (req: Request, res: Response) => {
  try {
    console.log('Logout request received');
    res.status(200).json({ message: 'Logout successful' });
  } catch (error: any) {
    console.error('Logout failed:', error);
    res.status(500).json({ message: 'Logout failed', error: error.message });
  }
};