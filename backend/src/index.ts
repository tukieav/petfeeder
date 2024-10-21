import express from 'express';
import mongoose from 'mongoose';
import bodyParser from 'body-parser';
import authRoutes from './routes/authRoutes';
import animalRoutes from './routes/animalRoutes';
import { errorHandler } from './middleware/errorHandler';

const app = express();
app.use(bodyParser.json());
app.use('/auth', authRoutes);
app.use('/animals', animalRoutes);
app.use(errorHandler);

mongoose.connect('mongodb://localhost:27017/petfeeder')
  .then(() => {
    app.listen(3000, () => console.log('Server running on port 3000'));
  })
  .catch(err => console.error('Database connection error:', err));