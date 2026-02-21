import express from 'express';
import { getUserProfile, updateUserProfile, getLeaderboard } from '../controllers/userController.js';
import { bookmarkItem } from '../controllers/notesController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.use(protect); // All user routes are protected

router.get('/me', getUserProfile);
router.put('/update-profile', updateUserProfile);
router.get('/leaderboard', getLeaderboard);
router.post('/bookmark', bookmarkItem);

export default router;
