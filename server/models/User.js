import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Please add a name'],
    },
    email: {
      type: String,
      required: [true, 'Please add an email'],
      unique: true,
      match: [
        /^[a-zA-Z0-9._%+-]+@([a-zA-Z0-9-]+\.)*university\.edu$/,
        'Please use a valid university email domain (@university.edu)',
      ],
    },
    password: {
      type: String,
      required: [true, 'Please add a password'],
      minlength: 6,
      select: false,
    },
    branch: {
      type: String,
      required: [true, 'Please specify your branch'],
      enum: ['CE', 'IT', 'ME', 'EE', 'EC', 'CIVIL'],
    },
    role: {
      type: String,
      enum: ['student', 'admin'],
      default: 'student',
    },
    bookmarks: [
      {
        type: mongoose.Schema.Types.ObjectId,
        refPath: 'bookmarks.onModel',
      },
      {
        onModel: {
          type: String,
          enum: ['Lecture', 'Note'],
        },
      },
    ],
    lectureProgress: [
      {
        lectureId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'Lecture',
        },
        progress: {
          type: Number,
          default: 0,
        },
        completed: {
          type: Boolean,
          default: false,
        },
      },
    ],
  },
  {
    timestamps: true,
  }
);

// Encrypt password using bcrypt
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) {
    next();
  }

  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

// Match user entered password to hashed password in database
userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

// Index for performance
userSchema.index({ email: 1, branch: 1 });

const User = mongoose.model('User', userSchema);

export default User;
