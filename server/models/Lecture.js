import mongoose from 'mongoose';

const lectureSchema = new mongoose.Schema(
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
    videoUrl: {
      type: String,
      required: [true, 'Please add a video URL'],
    },
    description: {
      type: String,
      required: [true, 'Please add a description'],
    },
    duration: {
      type: String, // e.g. "45:30" or "1 hour"
      required: true,
    },
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
lectureSchema.index({ branch: 1 });

const Lecture = mongoose.model('Lecture', lectureSchema);

export default Lecture;
