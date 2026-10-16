import { Service } from '../models/Service.js';
import { defaultServices } from '../data/defaultServices.js';

// Helper to slugify string
function slugify(text) {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-') // Replace spaces with -
    .replace(/[^\w-]+/g, '') // Remove all non-word chars
    .replace(/--+/g, '-'); // Replace multiple - with single -
}

/**
 * @desc Get all services
 * @route GET /api/services
 * @access Public (filtered by isActive unless ?all=true or admin request)
 */
export const getAllServices = async (req, res) => {
  try {
    const showAll = req.query.all === 'true';
    const query = showAll ? {} : { isActive: true };
    const services = await Service.find(query).sort({ order: 1, createdAt: 1 });

    // If database is completely empty, automatically seed default services!
    if (services.length === 0) {
      console.log('No services found in database. Auto-seeding default services...');
      const seeded = await Service.insertMany(defaultServices);
      return res.status(200).json({
        success: true,
        count: seeded.length,
        services: seeded,
      });
    }

    return res.status(200).json({
      success: true,
      count: services.length,
      services,
    });
  } catch (error) {
    console.error('Error fetching services:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to retrieve services.',
      error: error.message,
    });
  }
};

/**
 * @desc Get single service by slug
 * @route GET /api/services/:slug
 * @access Public
 */
export const getServiceBySlug = async (req, res) => {
  try {
    const { slug } = req.params;
    let service = await Service.findOne({ slug: slug.toLowerCase() });

    if (!service) {
      // Check if DB is empty and needs seeding
      const count = await Service.countDocuments();
      if (count === 0) {
        await Service.insertMany(defaultServices);
        service = await Service.findOne({ slug: slug.toLowerCase() });
      }
    }

    if (!service) {
      return res.status(404).json({
        success: false,
        message: `Service with slug "${slug}" not found.`,
      });
    }

    return res.status(200).json({
      success: true,
      service,
    });
  } catch (error) {
    console.error('Error fetching service by slug:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to retrieve service.',
      error: error.message,
    });
  }
};

/**
 * @desc Create a new service
 * @route POST /api/services
 * @access Private (Admin)
 */
export const createService = async (req, res) => {
  try {
    const body = req.body;

    if (!body.title || !body.description) {
      return res.status(400).json({
        success: false,
        message: 'Service title and description are required.',
      });
    }

    let slug = body.slug ? slugify(body.slug) : slugify(body.title);

    // Ensure slug uniqueness
    const existing = await Service.findOne({ slug });
    if (existing) {
      slug = `${slug}-${Date.now().toString().slice(-4)}`;
    }

    // Default structure fill-in if missing
    const newServiceData = {
      ...body,
      slug,
      title: body.title.trim(),
      titleLine1: body.titleLine1 || body.title.split(' ')[0] || '',
      titleLine2: body.titleLine2 || body.title.split(' ').slice(1).join(' ') || '',
      description: body.description.trim(),
      subtitle: body.subtitle || `High-impact ${body.title} solutions engineered for maximum performance and growth.`,
      icon: body.icon || '⚡',
      ctaText: body.ctaText || 'BOOK NOW',
      badgeTitle: body.badgeTitle || 'Performance Score',
      badgeValue: body.badgeValue || '99/100 Core Vitals',
      heroImage: body.heroImage || 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?q=80&w=1400&auto=format&fit=crop',
      workflow: body.workflow || {
        tag: 'WORKFLOW',
        titlePrefix: 'From Concept to',
        titleHighlight: 'Deployment',
        subtitle: 'A transparent, agile methodology designed to mitigate risk and deliver value at every stage.',
        steps: [
          { step: 1, title: 'Discovery', desc: 'We analyze requirements, user personas, and define technical KPIs.', icon: 'search' },
          { step: 2, title: 'Design & Architecture', desc: 'Wireframing and system blueprints.', icon: 'design' },
          { step: 3, title: 'Execution & Development', desc: 'Modular development using modern clean code architecture.', icon: 'code' },
          { step: 4, title: 'Testing & QA', desc: 'Rigorous unit testing, cross-browser audits, and performance stress-tests.', icon: 'testing' },
          { step: 5, title: 'Deployment & Scale', desc: 'Live launch on secure global cloud servers with 24/7 monitoring.', icon: 'rocket' },
        ],
      },
      pricing: body.pricing || {
        headline: `${body.title} Pricing & Packages`,
        subheadline: 'Select the package that fits your ambition — from high-converting MVPs to bespoke enterprise platforms.',
        packages: [
          {
            id: 'basic',
            name: 'Basic Package',
            badge: null,
            price: '$999',
            period: 'one-time',
            desc: `Essential ${body.title} to establish credibility and capture qualified leads.`,
            btnText: 'Start Basic',
            btnStyle: 'outline',
          },
          {
            id: 'advanced',
            name: 'Advanced Package',
            badge: 'Essential',
            price: '$2,499',
            period: 'one-time',
            desc: `High-performance ${body.title} with custom integrations and advanced architecture.`,
            btnText: 'Choose Advanced',
            btnStyle: 'gradient',
          },
          {
            id: 'custom',
            name: 'Custom Package',
            badge: 'Most Popular',
            price: 'Custom',
            period: 'tailored scope',
            desc: 'Full-scale enterprise digital platform with custom database architectures and API integrations.',
            btnText: 'Go Custom',
            btnStyle: 'solid',
          },
        ],
        featureCategories: [],
      },
      features: body.features && body.features.length > 0 ? body.features : [
        { icon: '⚡', title: 'High Performance', desc: 'Engineered for sub-second responses and blazing speed.' },
        { icon: '🔒', title: 'Enterprise Security', desc: 'Defense-in-depth architecture with automated backups and encryption.' },
        { icon: '🎯', title: 'Conversion-Focused', desc: 'Designed strategically to maximize lead generation and ROI.' },
        { icon: '📱', title: 'Fluid Responsiveness', desc: 'Seamlessly optimized across all devices, viewports, and platforms.' },
      ],
      techStack: body.techStack && body.techStack.length > 0 ? body.techStack : ['React', 'Node.js', 'Next.js', 'PostgreSQL', 'Tailwind CSS'],
      faqs: body.faqs && body.faqs.length > 0 ? body.faqs : [
        { q: `What is included in the ${body.title} process?`, a: 'We handle everything from initial discovery and scoping to full deployment, testing, and post-launch maintenance.' },
        { q: 'What is the typical turnaround timeline?', a: 'Standard deliverables take 2-4 weeks, while complex enterprise platforms take 4-8 weeks.' },
        { q: 'Who owns the final work and code?', a: 'You retain 100% intellectual property ownership of all source code, assets, and design files.' },
      ],
      order: body.order || 99,
      isActive: body.isActive !== undefined ? body.isActive : true,
    };

    const service = await Service.create(newServiceData);

    return res.status(201).json({
      success: true,
      message: 'Service created successfully.',
      service,
    });
  } catch (error) {
    console.error('Error creating service:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to create service.',
      error: error.message,
    });
  }
};

/**
 * @desc Update an existing service
 * @route PUT /api/services/:id
 * @access Private (Admin)
 */
export const updateService = async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    if (updates.slug) {
      updates.slug = slugify(updates.slug);
    }

    const service = await Service.findByIdAndUpdate(id, updates, {
      new: true,
      runValidators: true,
    });

    if (!service) {
      return res.status(404).json({
        success: false,
        message: 'Service not found.',
      });
    }

    return res.status(200).json({
      success: true,
      message: 'Service updated successfully.',
      service,
    });
  } catch (error) {
    console.error('Error updating service:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to update service.',
      error: error.message,
    });
  }
};

/**
 * @desc Delete a service
 * @route DELETE /api/services/:id
 * @access Private (Admin)
 */
export const deleteService = async (req, res) => {
  try {
    const { id } = req.params;
    const service = await Service.findByIdAndDelete(id);

    if (!service) {
      return res.status(404).json({
        success: false,
        message: 'Service not found.',
      });
    }

    return res.status(200).json({
      success: true,
      message: `Service "${service.title}" removed successfully.`,
    });
  } catch (error) {
    console.error('Error deleting service:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to delete service.',
      error: error.message,
    });
  }
};

/**
 * @desc Seed / Reset services catalog
 * @route POST /api/services/seed
 * @access Private (Admin)
 */
export const seedServices = async (req, res) => {
  try {
    const force = req.query.force === 'true' || req.body?.force === true;
    const count = await Service.countDocuments();

    if (count > 0 && !force) {
      const existing = await Service.find().sort({ order: 1 });
      return res.status(200).json({
        success: true,
        message: `Database already contains ${count} services. Pass ?force=true to overwrite.`,
        services: existing,
      });
    }

    if (force) {
      await Service.deleteMany({});
    }

    const seeded = await Service.insertMany(defaultServices);

    return res.status(201).json({
      success: true,
      message: `Successfully seeded ${seeded.length} agency services into MongoDB.`,
      services: seeded,
    });
  } catch (error) {
    console.error('Error seeding services:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to seed services.',
      error: error.message,
    });
  }
};
