import MockTest from '../models/MockTest.js';
import TestResult from '../models/TestResult.js';
import { sendResponse, sendError } from '../utils/responseHandler.js';

/**
 * @desc    Get all tests by branch
 * @route   GET /api/tests
 * @access  Private
 */
export const getTests = async (req, res) => {
  const { branch } = req.query;
  const filter = branch ? { branch } : {};

  const tests = await MockTest.find(filter).select('-questions.options.isCorrect');
  return sendResponse(res, 200, 'Tests retrieved', tests);
};

/**
 * @desc    Create a new test
 * @route   POST /api/tests
 * @access  Private/Admin
 */
export const createTest = async (req, res) => {
  const { title, branch, duration, questions } = req.body;

  if (!title || !branch || !duration || !questions || questions.length === 0) {
    return sendError(res, 400, 'All fields are required');
  }

  const test = await MockTest.create({
    title,
    branch,
    duration,
    questions,
    createdBy: req.user._id,
  });

  if (test) {
    return sendResponse(res, 201, 'Test created successfully', test);
  } else {
    return sendError(res, 400, 'Invalid test data');
  }
};

/**
 * @desc    Submit test answers and calculate result
 * @route   POST /api/tests/submit
 * @access  Private
 */
export const submitTest = async (req, res) => {
  const { testId, answers, timeTaken } = req.body;

  const test = await MockTest.findById(testId);

  if (!test) {
    return sendError(res, 404, 'Test not found');
  }

  let totalScore = 0;
  let totalMarks = 0;
  const analysis = [];

  // Logic to calculate score
  test.questions.forEach((question) => {
    const userAnswer = answers.find((ans) => ans.questionId === question._id.toString());
    const correctOption = question.options.find((opt) => opt.isCorrect);
    
    totalMarks += question.marks;

    if (userAnswer && userAnswer.optionId === correctOption._id.toString()) {
      totalScore += question.marks;
      
      const subj = analysis.find((s) => s.subject === question.subject);
      if (subj) {
        subj.correct += 1;
        subj.score += question.marks;
      } else {
        analysis.push({ subject: question.subject, correct: 1, incorrect: 0, score: question.marks });
      }
    } else {
      const subj = analysis.find((s) => s.subject === question.subject);
      if (subj) {
        subj.incorrect += 1;
      } else {
        analysis.push({ subject: question.subject, correct: 0, incorrect: 1, score: 0 });
      }
    }
  });

  const result = await TestResult.create({
    userId: req.user._id,
    testId,
    score: totalScore,
    totalMarks,
    timeTaken,
    subjectWiseAnalysis: analysis,
  });

  if (result) {
    return sendResponse(res, 201, 'Test submitted successfully', result);
  } else {
    return sendError(res, 400, 'Submission failed');
  }
};

/**
 * @desc    Get test results for user
 * @route   GET /api/tests/results
 * @access  Private
 */
export const getResults = async (req, res) => {
  const results = await TestResult.find({ userId: req.user._id }).populate('testId', 'title');
  return sendResponse(res, 200, 'Results retrieved', results);
};
