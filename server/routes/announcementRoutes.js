import express from 'express';
import { getAnnouncements, createAnnouncement } from '../controllers/announcementController.js';
import { protect, admin } from '../middleware/authMiddleware.js';

const router = express.Router();

router.use(protect); // All announcement routes are protected

router.route('/')
  .get(getAnnouncements)
  .post(admin, createAnnouncement); // Admin only to create announcements

export default router;
