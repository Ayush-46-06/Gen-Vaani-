import { ServiceCategory } from '../models/ServiceCategory.js';
import { Service } from '../models/Service.js';

// Helper to slugify string
function slugify(text) {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-')
    .replace(/[^\w-]+/g, '')
    .replace(/--+/g, '-');
}

export const defaultCategories = [
  {
    name: 'Design & Creative',
    slug: 'design-creative',
    tagline: 'UI/UX, branding and creative design.',
    icon: 'design',
    order: 0,
    isActive: true,
  },
  {
    name: 'Development & Digital Products',
    slug: 'development-digital',
    tagline: 'Websites, applications and software.',
    icon: 'code',
    order: 1,
    isActive: true,
  },
  {
    name: 'Marketing & Growth',
    slug: 'marketing-growth',
    tagline: 'Google Ads, Meta Ads, SEO and digital marketing.',
    icon: 'growth',
    order: 2,
    isActive: true,
  },
];

/**
 * @desc Get all service categories
 * @route GET /api/categories
 * @access Public
 */
export const getAllCategories = async (req, res) => {
  try {
    const showAll = req.query.all === 'true';
    const query = showAll ? {} : { isActive: true };
    let categories = await ServiceCategory.find(query).sort({ order: 1, createdAt: 1 });

    // Auto-seed default categories if database is empty
    if (categories.length === 0) {
      console.log('No service categories found in database. Auto-seeding default categories...');
      categories = await ServiceCategory.insertMany(defaultCategories);
    }

    return res.status(200).json({
      success: true,
      count: categories.length,
      categories,
    });
  } catch (error) {
    console.error('Error fetching categories:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to retrieve categories.',
      error: error.message,
    });
  }
};

/**
 * @desc Create a new category
 * @route POST /api/categories
 * @access Private (Admin)
 */
export const createCategory = async (req, res) => {
  try {
    const { name, tagline, icon, order, isActive } = req.body;

    if (!name || !name.trim()) {
      return res.status(400).json({
        success: false,
        message: 'Category name is required.',
      });
    }

    const trimmedName = name.trim();
    let slug = req.body.slug ? slugify(req.body.slug) : slugify(trimmedName);

    // Ensure uniqueness
    const existing = await ServiceCategory.findOne({
      $or: [{ name: trimmedName }, { slug }],
    });

    if (existing) {
      return res.status(400).json({
        success: false,
        message: `Category "${trimmedName}" or slug "${slug}" already exists.`,
      });
    }

    const category = await ServiceCategory.create({
      name: trimmedName,
      slug,
      tagline: (tagline || '').trim(),
      icon: icon || 'grid',
      order: order !== undefined ? Number(order) : 99,
      isActive: isActive !== undefined ? isActive : true,
    });

    return res.status(201).json({
      success: true,
      message: 'Category created successfully.',
      category,
    });
  } catch (error) {
    console.error('Error creating category:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to create category.',
      error: error.message,
    });
  }
};

/**
 * @desc Update a category
 * @route PUT /api/categories/:id
 * @access Private (Admin)
 */
export const updateCategory = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, tagline, icon, order, isActive } = req.body;

    const oldCategory = await ServiceCategory.findById(id);
    if (!oldCategory) {
      return res.status(404).json({
        success: false,
        message: 'Category not found.',
      });
    }

    const oldName = oldCategory.name;
    const updates = {};

    if (name !== undefined) {
      updates.name = name.trim();
      updates.slug = slugify(name);
    }
    if (tagline !== undefined) updates.tagline = tagline.trim();
    if (icon !== undefined) updates.icon = icon;
    if (order !== undefined) updates.order = Number(order);
    if (isActive !== undefined) updates.isActive = Boolean(isActive);

    const updated = await ServiceCategory.findByIdAndUpdate(id, updates, {
      new: true,
      runValidators: true,
    });

    // If category name changed, update all services assigned to this category
    if (updates.name && updates.name !== oldName) {
      await Service.updateMany(
        { category: oldName },
        { $set: { category: updates.name } }
      );
    }

    return res.status(200).json({
      success: true,
      message: 'Category updated successfully.',
      category: updated,
    });
  } catch (error) {
    console.error('Error updating category:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to update category.',
      error: error.message,
    });
  }
};

/**
 * @desc Delete a category
 * @route DELETE /api/categories/:id
 * @access Private (Admin)
 */
export const deleteCategory = async (req, res) => {
  try {
    const { id } = req.params;
    const category = await ServiceCategory.findByIdAndDelete(id);

    if (!category) {
      return res.status(404).json({
        success: false,
        message: 'Category not found.',
      });
    }

    return res.status(200).json({
      success: true,
      message: `Category "${category.name}" deleted successfully.`,
    });
  } catch (error) {
    console.error('Error deleting category:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to delete category.',
      error: error.message,
    });
  }
};

