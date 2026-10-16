import mongoose from 'mongoose';

const portfolioSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Website title is required'],
      trim: true,
    },
    category: {
      type: String,
      default: 'Web Application',
      trim: true,
    },
    slug: {
      type: String,
      trim: true,
      lowercase: true,
    },
    liveUrl: {
      type: String,
      default: '',
      trim: true,
    },
    image: {
      type: String,
      default: '',
      trim: true,
    },
    tallImage: {
      type: String,
      default: '',
      trim: true,
    },
    imageKitFileId: {
      type: String,
      default: '',
    },
    description: {
      type: String,
      default: '',
    },
    order: {
      type: Number,
      default: 0,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

// Auto-generate slug before saving if not present
portfolioSchema.pre('save', function (next) {
  if (this.title && !this.slug) {
    this.slug = this.title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)+/g, '');
  }
  next();
});

export const Portfolio = mongoose.model('Portfolio', portfolioSchema);
