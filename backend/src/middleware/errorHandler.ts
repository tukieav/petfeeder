import { Request, Response, NextFunction } from 'express';

export const errorHandler = (err: any, req: Request, res: Response, next: NextFunction) => {
  if (process.env.NODE_ENV === 'development') {
    console.error('Error stack:', err.stack);
    console.error('Error message:', err.message);
  }

  // Sprawdź, czy błąd jest związany z CSRF
  if (err.code === 'EBADCSRFTOKEN') {
    return res.status(403).json({ message: 'Invalid CSRF token' });
  }

  res.status(500).json({ message: 'Internal Server Error', error: err.message });
};