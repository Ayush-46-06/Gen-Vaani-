import mongoose from 'mongoose';

const availabilitySchema = new mongoose.Schema(
  {
    timezone: {
      type: String,
      default: 'Australia/Sydney',
      trim: true,
    },
    timeSlots: {
      type: [String],
      default: [
        '09:30 AM',
        '11:00 AM',
        '12:30 PM',
        '02:00 PM',
        '03:30 PM',
        '04:15 PM',
      ],
    },
    workingDays: {
      type: [String],
      default: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'],
    },
    googleMeetUrl: {
      type: String,
      default: 'https://meet.google.com/mjk-yknw-mvz',
      trim: true,
    },
    googleMeetUrls: {
      type: [String],
      default: [
        'https://meet.google.com/mjk-yknw-mvz',
        'https://meet.google.com/geb-oycw-gcq',
      ],
    },
    teamsUrl: {
      type: String,
      default: 'https://teams.live.com/meet/93318275504734?p=xK5khRzzuLiFVq30LM',
      trim: true,
    },
    teamsUrls: {
      type: [String],
      default: [
        'https://teams.live.com/meet/93318275504734?p=xK5khRzzuLiFVq30LM',
        'https://teams.live.com/meet/93608937335627?p=yjLmlQpPbBwL3JPtvn',
      ],
    },
    slotDurationMinutes: {
      type: Number,
      default: 30,
    },
  },
  {
    timestamps: true,
  }
);

export const Availability = mongoose.model('Availability', availabilitySchema);

