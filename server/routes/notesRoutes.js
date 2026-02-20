import express from 'express';
import { getNotes, uploadNotes, rateNotes } from '../controllers/notesController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.use(protect); // All notes routes are protected

router.route('/')
  .get(getNotes)
  .post(uploadNotes); // Users can also upload notes

router.put('/rate', rateNotes);

export default router;
