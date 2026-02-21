import User from '../models/User.js';
import TestResult from '../models/TestResult.js';
import { sendResponse, sendError } from '../utils/responseHandler.js';

/**
 * @desc    Get user profile
 * @route   GET /api/users/me
 * @access  Private
 */
export const getUserProfile = async (req, res) => {
  const user = await User.findById(req.user._id);

  if (user) {
    return sendResponse(res, 200, 'User profile retrieved', user);
  } else {
    return sendError(res, 404, 'User not found');
  }
};

/**
 * @desc    Update user profile
 * @route   PUT /api/users/update-profile
 * @access  Private
 */
export const updateUserProfile = async (req, res) => {
  const user = await User.findById(req.user._id);

  if (user) {
    user.name = req.body.name || user.name;
    user.branch = req.body.branch || user.branch;
    
    if (req.body.password) {
      user.password = req.body.password;
    }

    const updatedUser = await user.save();

    return sendResponse(res, 200, 'Profile updated', {
      _id: updatedUser._id,
      name: updatedUser.name,
      email: updatedUser.email,
      branch: updatedUser.branch,
      role: updatedUser.role,
    });
  } else {
    return sendError(res, 404, 'User not found');
  }
};

/**
 * @desc    Get leaderboard
 * @route   GET /api/users/leaderboard
 * @access  Private
 */
export const getLeaderboard = async (req, res) => {
  try {
    const leaderboard = await TestResult.aggregate([
      {
        $group: {
          _id: '$userId',
          averageScore: { $avg: '$score' },
          totalTests: { $sum: 1 },
        },
      },
      {
        $lookup: {
          from: 'users',
          localField: '_id',
          foreignField: '_id',
          as: 'user',
        },
      },
      { $unwind: '$user' },
      {
        $project: {
          _id: 1,
          averageScore: 1,
          totalTests: 1,
          'user.name': 1,
          'user.branch': 1,
        },
      },
      { $sort: { averageScore: -1 } },
      { $limit: 10 },
    ]);

    return sendResponse(res, 200, 'Leaderboard retrieved', leaderboard);
  } catch (error) {
    return sendError(res, 500, error.message);
  }
};
