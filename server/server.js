import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import connectDB from './config/db.js';
import { notFound, errorHandler } from './middleware/errorMiddleware.js';

// Load routes
import authRoutes from './routes/authRoutes.js';
import userRoutes from './routes/userRoutes.js';
import testRoutes from './routes/testRoutes.js';
import lectureRoutes from './routes/lectureRoutes.js';
import notesRoutes from './routes/notesRoutes.js';
import announcementRoutes from './routes/announcementRoutes.js';

// Load env vars
dotenv.config();

// Connect to database
connectDB();

const app = express();

// Body parser
app.use(express.json());

// Enable CORS
app.use(cors());

// Mount routers
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/tests', testRoutes);
app.use('/api/lectures', lectureRoutes);
app.use('/api/notes', notesRoutes);
app.use('/api/announcements', announcementRoutes);

// Health check
app.get('/', (req, res) => {
  res.send('API is running...');
});

// Middleware for error handling
app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`);
});
