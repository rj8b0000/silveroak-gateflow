import Lecture from '../models/Lecture.js';
import User from '../models/User.js';
import { sendResponse, sendError } from '../utils/responseHandler.js';

/**
 * @desc    Get all lectures by branch
 * @route   GET /api/lectures
 * @access  Private
 */
export const getLectures = async (req, res) => {
  const { branch } = req.query;
  const filter = branch ? { branch } : {};

  const lectures = await Lecture.find(filter);
  return sendResponse(res, 200, 'Lectures retrieved', lectures);
};

/**
 * @desc    Create a new lecture
 * @route   POST /api/lectures
 * @access  Private/Admin
 */
export const createLecture = async (req, res) => {
  const { title, branch, videoUrl, description, duration } = req.body;

  if (!title || !branch || !videoUrl || !description || !duration) {
    return sendError(res, 400, 'All fields are required');
  }

  const lecture = await Lecture.create({
    title,
    branch,
    videoUrl,
    description,
    duration,
    createdBy: req.user._id,
  });

  if (lecture) {
    return sendResponse(res, 201, 'Lecture created successfully', lecture);
  } else {
    return sendError(res, 400, 'Invalid lecture data');
  }
};

/**
 * @desc    Update lecture watch progress
 * @route   POST /api/lectures/progress
 * @access  Private
 */
export const updateProgress = async (req, res) => {
  const { lectureId, progress, completed } = req.body;

  const user = await User.findById(req.user._id);

  if (!user) {
    return sendError(res, 404, 'User not found');
  }

  const progressIndex = user.lectureProgress.findIndex(
    (p) => p.lectureId.toString() === lectureId
  );

  if (progressIndex > -1) {
    user.lectureProgress[progressIndex].progress = progress;
    user.lectureProgress[progressIndex].completed = completed;
  } else {
    user.lectureProgress.push({ lectureId, progress, completed });
  }

  await user.save();

  return sendResponse(res, 200, 'Progress updated', user.lectureProgress);
};
