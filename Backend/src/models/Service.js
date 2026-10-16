import mongoose from 'mongoose';

const PinSchema = new mongoose.Schema(
  {
    x: { type: Number, default: 50 },
    y: { type: Number, default: 50 },
    label: { type: String, default: '' },
  },
  { _id: false }
);

const WorkflowStepSchema = new mongoose.Schema(
  {
    step: { type: Number, required: true },
    title: { type: String, required: true },
    desc: { type: String, required: true },
    icon: { type: String, default: 'search' },
  },
  { _id: false }
);

const PricingPackageSchema = new mongoose.Schema(
  {
    id: { type: String, required: true }, // e.g. 'basic', 'advanced', 'custom'
    name: { type: String, required: true },
    badge: { type: String, default: null },
    price: { type: String, required: true },
    period: { type: String, default: 'one-time' },
    desc: { type: String, default: '' },
    btnText: { type: String, default: 'Get Started' },
    btnStyle: { type: String, default: 'outline' }, // 'outline', 'gradient', 'solid'
  },
  { _id: false }
);

const FeatureMatrixItemSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    basic: { type: mongoose.Schema.Types.Mixed, default: false },
    advanced: { type: mongoose.Schema.Types.Mixed, default: true },
    custom: { type: mongoose.Schema.Types.Mixed, default: true },
  },
  { _id: false }
);

const FeatureCategorySchema = new mongoose.Schema(
  {
    category: { type: String, required: true },
    features: [FeatureMatrixItemSchema],
  },
  { _id: false }
);

const FeatureCardSchema = new mongoose.Schema(
  {
    icon: { type: String, default: '⚡' },
    title: { type: String, required: true },
    desc: { type: String, required: true },
  },
  { _id: false }
);

const FaqItemSchema = new mongoose.Schema(
  {
    q: { type: String, required: true },
    a: { type: String, required: true },
  },
  { _id: false }
);

const ServiceSchema = new mongoose.Schema(
  {
    slug: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
    },
    title: {
      type: String,
      required: true,
      trim: true,
    },
    titleLine1: {
      type: String,
      default: '',
    },
    titleLine2: {
      type: String,
      default: '',
    },
    subtitle: {
      type: String,
      default: '',
    },
    description: {
      type: String,
      required: true,
      trim: true,
    },
    icon: {
      type: String,
      default: '⚡',
    },
    ctaText: {
      type: String,
      default: 'BOOK NOW',
    },
    badgeTitle: {
      type: String,
      default: 'Performance Score',
    },
    badgeValue: {
      type: String,
      default: '99/100 Core Vitals',
    },
    badgeAvatar: {
      type: String,
      default: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&q=80',
    },
    statCount: {
      type: String,
      default: '250k',
    },
    statLabel: {
      type: String,
      default: 'Users have explored',
    },
    avatars: {
      type: [String],
      default: [
        'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&q=80',
        'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&q=80',
        'https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?w=100&q=80',
      ],
    },
    heroImage: {
      type: String,
      default: 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?q=80&w=1400&auto=format&fit=crop',
    },
    pins: [PinSchema],
    workflow: {
      tag: { type: String, default: 'WORKFLOW' },
      titlePrefix: { type: String, default: 'From Concept to' },
      titleHighlight: { type: String, default: 'Deployment' },
      subtitle: { type: String, default: 'A transparent, agile methodology designed to mitigate risk and deliver value at every stage.' },
      steps: [WorkflowStepSchema],
    },
    pricing: {
      headline: { type: String, default: 'Service Pricing & Packages' },
      subheadline: { type: String, default: 'Select the package that fits your ambition — from MVP releases to bespoke enterprise platforms.' },
      packages: [PricingPackageSchema],
      featureCategories: [FeatureCategorySchema],
    },
    features: [FeatureCardSchema],
    techStack: {
      type: [String],
      default: [],
    },
    faqs: [FaqItemSchema],
    activeProjects: {
      type: Number,
      default: 5,
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

export const Service = mongoose.model('Service', ServiceSchema);
