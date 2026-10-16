import mongoose from 'mongoose';

const leadSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Name is required'],
      trim: true,
      minlength: [2, 'Name must be at least 2 characters'],
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      lowercase: true,
      trim: true,
      match: [/\S+@\S+\.\S+/, 'Please provide a valid email address'],
    },
    service: {
      type: String,
      required: [true, 'Service is required'],
      trim: true,
    },
    message: {
      type: String,
      required: [true, 'Message / Comments are required'],
      trim: true,
    },
    phone: {
      type: String,
      trim: true,
      default: '',
    },
    company: {
      type: String,
      trim: true,
      default: 'Website Inquiry',
    },
    budget: {
      type: String,
      trim: true,
      default: 'Standard Scope',
    },
    status: {
      type: String,
      enum: ['new', 'in_progress', 'converted'],
      default: 'new',
    },
    source: {
      type: String,
      default: 'Get In Touch Form',
    },
    replies: [
      {
        subject: { type: String, required: true },
        message: { type: String, required: true },
        sentAt: { type: Date, default: Date.now },
        sentBy: { type: String, default: 'Admin' },
      },
    ],
  },
  {
    timestamps: true,
  }
);

export const Lead = mongoose.model('Lead', leadSchema);
