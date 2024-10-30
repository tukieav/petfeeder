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

// Enable CORS with credentials to allow cookies to be sent
app.use(cors({
  origin: 'http://localhost:3000', // Adjust this to your frontend's URL
  credentials: true,
}));

// Middleware to parse cookies
app.use(cookieParser());

// CSRF protection middleware
const csrfProtection = csrf({ cookie: true });

// Body parser middleware to handle JSON requests
app.use(bodyParser.json());

// Apply CSRF protection only to routes that modify data (POST, PUT, DELETE)
app.use('/auth', csrfProtection, authRoutes);
app.use('/animals', csrfProtection, animalRoutes);

// Logowanie tokenu CSRF dla testów
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

// Error handling middleware (must be last)
app.use((err : any, req : any, res : any, next : any) => {
  errorHandler(err, req, res, next);
});

// Connect to MongoDB and start the server
mongoose.connect('mongodb://localhost:27017/petfeeder')
  .then(() => {
    app.listen(3000, () => console.log('Server running on port 3000'));
  })
  .catch(err => console.error('Database connection error:', err));