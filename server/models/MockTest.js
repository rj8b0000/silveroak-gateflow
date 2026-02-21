import mongoose from 'mongoose';

const questionSchema = new mongoose.Schema({
  questionText: {
    type: String,
    required: [true, 'Please add a question text'],
  },
  options: [
    {
      text: { type: String, required: true },
      isCorrect: { type: Boolean, default: false },
    },
  ],
  subject: {
    type: String,
    required: [true, 'Please add a subject'],
  },
  marks: {
    type: Number,
    default: 1,
  },
});

const mockTestSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Please add a title'],
    },
    branch: {
      type: String,
      required: [true, 'Please specify a branch'],
      enum: ['CE', 'IT', 'ME', 'EE', 'EC', 'CIVIL'],
    },
    duration: {
      type: Number,
      required: [true, 'Please specify the duration in minutes'],
    },
    questions: [questionSchema],
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

// Index for performance
mockTestSchema.index({ branch: 1 });

const MockTest = mongoose.model('MockTest', mockTestSchema);

export default MockTest;
