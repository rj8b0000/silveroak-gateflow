import mongoose from 'mongoose';

const notesSchema = new mongoose.Schema(
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
    uploadedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    fileUrl: {
      type: String,
      required: [true, 'Please add a file URL'],
    },
    rating: {
      type: Number,
      default: 0,
      min: 0,
      max: 5,
    },
    ratingsCount: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

// Index for performance
notesSchema.index({ branch: 1 });

const Notes = mongoose.model('Notes', notesSchema);

export default Notes;
