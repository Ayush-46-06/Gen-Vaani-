import mongoose from 'mongoose';

const ServiceCategorySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    slug: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
    },
    tagline: {
      type: String,
      default: '',
      trim: true,
    },
    icon: {
      type: String,
      default: 'grid', // 'design', 'code', 'growth', 'grid'
      trim: true,
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

export const ServiceCategory = mongoose.model('ServiceCategory', ServiceCategorySchema);

