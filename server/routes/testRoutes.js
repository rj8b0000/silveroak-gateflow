import express from 'express';
import { getTests, createTest, submitTest, getResults } from '../controllers/testController.js';
import { protect, admin } from '../middleware/authMiddleware.js';

const router = express.Router();

router.use(protect); // All test routes are protected

router.route('/')
  .get(getTests)
  .post(admin, createTest); // Admin only to create tests

router.post('/submit', submitTest);
router.get('/results', getResults);

export default router;
