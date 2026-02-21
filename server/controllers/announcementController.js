import Announcement from '../models/Announcement.js';
import { sendResponse, sendError } from '../utils/responseHandler.js';

/**
 * @desc    Get all announcements
 * @route   GET /api/announcements
 * @access  Private
 */
export const getAnnouncements = async (req, res) => {
  const announcements = await Announcement.find({}).sort({ createdAt: -1 });
  return sendResponse(res, 200, 'Announcements retrieved', announcements);
};

/**
 * @desc    Create a new announcement
 * @route   POST /api/announcements
 * @access  Private/Admin
 */
export const createAnnouncement = async (req, res) => {
  const { title, description, type } = req.body;

  if (!title || !description || !type) {
    return sendError(res, 400, 'All fields are required');
  }

  const announcement = await Announcement.create({
    title,
    description,
    type,
  });

  if (announcement) {
    return sendResponse(res, 201, 'Announcement created successfully', announcement);
  } else {
    return sendError(res, 400, 'Invalid data');
  }
};
