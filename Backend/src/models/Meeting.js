import mongoose from 'mongoose';

const meetingSchema = new mongoose.Schema(
  {
    clientName: {
      type: String,
      required: [true, 'Client name is required'],
      trim: true,
    },
    email: {
      type: String,
      required: [true, 'Client email is required'],
      lowercase: true,
      trim: true,
      match: [/\S+@\S+\.\S+/, 'Please provide a valid email address'],
    },
    phone: {
      type: String,
      trim: true,
      default: '',
    },
    company: {
      type: String,
      trim: true,
      default: 'Direct Client',
    },
    service: {
      type: String,
      required: [true, 'Service is required'],
      trim: true,
    },
    date: {
      type: String,
      required: [true, 'Display date is required'],
      trim: true,
    },
    dateKey: {
      type: String,
      required: [true, 'Date key (YYYY-MM-DD) is required'],
      trim: true,
      index: true,
    },
    time: {
      type: String,
      required: [true, 'Time slot is required'],
      trim: true,
    },
    timezone: {
      type: String,
      default: 'Australia/Sydney',
    },
    aestTime: {
      type: String,
      trim: true,
      default: '',
    },
    aestDateKey: {
      type: String,
      trim: true,
      default: '',
      index: true,
    },
    location: {
      type: String,
      enum: ['Google Meet', 'Microsoft Teams', 'Phone call'],
      default: 'Google Meet',
    },
    notes: {
      type: String,
      trim: true,
      default: 'Initial 30-minute discovery consultation and tech scoping.',
    },
    meetUrl: {
      type: String,
      default: 'https://meet.google.com/mjk-yknw-mvz',
    },
    teamsUrl: {
      type: String,
      default: 'https://teams.microsoft.com/l/meetup-join/genvaani',
    },
    status: {
      type: String,
      enum: ['confirmed', 'completed', 'cancelled'],
      default: 'confirmed',
    },
  },
  {
    timestamps: true,
  }
);

// Compound index to ensure uniqueness for confirmed slots on a specific dateKey and time
meetingSchema.index({ dateKey: 1, time: 1, status: 1 });

export const Meeting = mongoose.model('Meeting', meetingSchema);
