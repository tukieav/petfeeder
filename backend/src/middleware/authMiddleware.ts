import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

const JWT_SECRET : any = 'your_jwt_secret_key'; 

declare module 'express-serve-static-core' {
    interface Request {
      user?: { userId: string; username: string; };
    }
  }

export const isAuthenticated : any = (req: Request, res: Response, next: NextFunction) => {
  const token = req.headers.authorization?.split(' ')[1]; 

  if (!token) {
    return res.status(401).json({ message: 'No token provided, authorization denied' });
  }

  try {
    const decoded : any = jwt.verify(token, JWT_SECRET) as { userId: string; username: string };
    req.user = decoded; 
    next();
  } catch (error : any) {
    return res.status(401).json({ message: 'Invalid token, authorization denied' });
  }
};