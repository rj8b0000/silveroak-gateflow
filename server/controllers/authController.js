import User from '../models/User.js';
import { generateToken } from '../utils/jwtHelper.js';
import { sendResponse, sendError } from '../utils/responseHandler.js';

/**
 * @desc    Auth user & get token
 * @route   POST /api/auth/login
 * @access  Public
 */
export const loginUser = async (req, res) => {
  const { email, password } = req.body;

  // Domain validation
  if (!email.endsWith('@university.edu')) {
    return sendError(res, 400, 'Please use a valid university email domain (@university.edu)');
  }

  const user = await User.findOne({ email }).select('+password');

  if (user && (await user.matchPassword(password))) {
    const token = generateToken(user._id);
    
    // Don't include password in response
    const userResponse = {
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      branch: user.branch,
    };

    return sendResponse(res, 200, 'Login successful', {
      user: userResponse,
      token,
    });
  } else {
    return sendError(res, 401, 'Invalid email or password');
  }
};

/**
 * @desc    Register user (For initial setup/dev)
 * @route   POST /api/auth/register
 * @access  Public
 */
export const registerUser = async (req, res) => {
  const { name, email, password, branch, role } = req.body;

  if (!email.endsWith('@university.edu')) {
    return sendError(res, 400, 'Please use a valid university email domain (@university.edu)');
  }

  const userExists = await User.findOne({ email });

  if (userExists) {
    return sendError(res, 400, 'User already exists');
  }

  const user = await User.create({
    name,
    email,
    password,
    branch,
    role: role || 'student',
  });

  if (user) {
    const token = generateToken(user._id);
    return sendResponse(res, 201, 'User registered successfully', {
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      branch: user.branch,
      token,
    });
  } else {
    return sendError(res, 400, 'Invalid user data');
  }
};
