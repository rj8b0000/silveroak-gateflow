import Notes from '../models/Notes.js';
import User from '../models/User.js';
import { sendResponse, sendError } from '../utils/responseHandler.js';

/**
 * @desc    Get all notes by branch
 * @route   GET /api/notes
 * @access  Private
 */
export const getNotes = async (req, res) => {
  const { branch } = req.query;
  const filter = branch ? { branch } : {};

  const notes = await Notes.find(filter).populate('uploadedBy', 'name');
  return sendResponse(res, 200, 'Notes retrieved', notes);
};

/**
 * @desc    Upload new notes
 * @route   POST /api/notes
 * @access  Private
 */
export const uploadNotes = async (req, res) => {
  const { title, branch, fileUrl } = req.body;

  if (!title || !branch || !fileUrl) {
    return sendError(res, 400, 'All fields are required');
  }

  const note = await Notes.create({
    title,
    branch,
    fileUrl,
    uploadedBy: req.user._id,
  });

  if (note) {
    return sendResponse(res, 201, 'Notes uploaded successfully', note);
  } else {
    return sendError(res, 400, 'Invalid data');
  }
};

/**
 * @desc    Rate notes
 * @route   PUT /api/notes/rate
 * @access  Private
 */
export const rateNotes = async (req, res) => {
  const { noteId, rating } = req.body;

  if (rating < 0 || rating > 5) {
    return sendError(res, 400, 'Rating must be between 0 and 5');
  }

  const note = await Notes.findById(noteId);

  if (note) {
    const totalRating = (note.rating * note.ratingsCount) + rating;
    note.ratingsCount += 1;
    note.rating = totalRating / note.ratingsCount;

    await note.save();
    return sendResponse(res, 200, 'Notes rated', note);
  } else {
    return sendError(res, 404, 'Notes not found');
  }
};

/**
 * @desc    Bookmark an item (lecture or note)
 * @route   POST /api/users/bookmark
 * @access  Private
 */
export const bookmarkItem = async (req, res) => {
  const { itemId, onModel } = req.body;

  if (!['Lecture', 'Note'].includes(onModel)) {
    return sendError(res, 400, 'Invalid model type');
  }

  const user = await User.findById(req.user._id);

  if (!user) {
    return sendError(res, 404, 'User not found');
  }

  const isBookmarked = user.bookmarks.find(
    (b) => b.toString() === itemId
  );

  if (isBookmarked) {
    user.bookmarks = user.bookmarks.filter((b) => b.toString() !== itemId);
  } else {
    user.bookmarks.push({ _id: itemId, onModel });
  }

  await user.save();

  return sendResponse(res, 200, isBookmarked ? 'Bookmark removed' : 'Bookmark added', user.bookmarks);
};
