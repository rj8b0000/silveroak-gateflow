import express from 'express';
import { getLectures, createLecture, updateProgress } from '../controllers/lectureController.js';
import { protect, admin } from '../middleware/authMiddleware.js';

const router = express.Router();

router.use(protect); // All lecture routes are protected

router.route('/')
  .get(getLectures)
  .post(admin, createLecture); // Admin only to create lectures

router.post('/progress', updateProgress);

export default router;
