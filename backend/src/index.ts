import express from 'express';
import mongoose from 'mongoose';
import bodyParser from 'body-parser';
import csrf from 'csurf';
import cookieParser from 'cookie-parser';
import cors from 'cors'; // Import CORS for cross-origin requests
import authRoutes from './routes/authRoutes';
import animalRoutes from './routes/animalRoutes';
import { errorHandler } from './middleware/errorHandler';

const app = express();

app.use(cors({
  origin: 'http://192.168.1.96:3000',
  credentials: true,
}));

app.use(cookieParser());

const csrfProtection = csrf({ cookie: true });

app.use(bodyParser.json());

app.use('/auth', csrfProtection, authRoutes);
app.use('/animals', csrfProtection, animalRoutes);

app.use((req, res, next) => {
  try {
    const csrfToken = req.csrfToken();
    console.log('CSRF Token:', csrfToken);
    next();
  } catch (error) {
    console.error('Error generating CSRF token:', error);
    next(error);
  }
});

app.use((err : any, req : any, res : any, next : any) => {
  errorHandler(err, req, res, next);
});

mongoose.connect('mongodb://localhost:27017/petfeeder')
  .then(() => {
    app.listen(3000, () => console.log('Server running on port 3000'));
  })
  .catch(err => console.error('Database connection error:', err));