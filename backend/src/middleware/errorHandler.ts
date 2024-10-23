import { Request, Response, NextFunction } from 'express';

export const errorHandler = (err: any, req: Request, res: Response, next: NextFunction) => {
  if (process.env.NODE_ENV === 'development') {
    console.error('Error stack:', err.stack);
    console.error('Error message:', err.message);
  }
  res.status(500).json({ message: 'Internal Server Error', error: err.message });
};