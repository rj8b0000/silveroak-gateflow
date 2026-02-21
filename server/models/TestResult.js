import mongoose from 'mongoose';

const testResultSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    testId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'MockTest',
      required: true,
    },
    score: {
      type: Number,
      required: true,
    },
    totalMarks: {
      type: Number,
      required: true,
    },
    timeTaken: {
      type: Number, // in minutes
      required: true,
    },
    subjectWiseAnalysis: [
      {
        subject: String,
        correct: Number,
        incorrect: Number,
        score: Number,
      },
    ],
  },
  {
    timestamps: true,
  }
);

// Index for performance
testResultSchema.index({ userId: 1, testId: 1 });

const TestResult = mongoose.model('TestResult', testResultSchema);

export default TestResult;
