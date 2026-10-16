import { Portfolio } from '../models/Portfolio.js';

/**
 * Upload an image to ImageKit using ImageKit REST API
 * Supports Base64 data URI or image URL
 * @route POST /api/portfolio/upload
 * @access Private (Admin)
 */
export const uploadToImageKit = async (req, res) => {
  try {
    const { file, fileName, folder } = req.body;

    if (!file) {
      return res.status(400).json({
        success: false,
        message: 'No file provided for upload',
      });
    }

    const privateKey =
      process.env.IMAGEKIT_PRIVATE_KEY || 'private_hgocBb/9P01Vzmt7GHigL/52nec=';
    const authHeader = 'Basic ' + Buffer.from(privateKey + ':').toString('base64');

    const cleanFileName = (fileName || `website_${Date.now()}.png`).replace(/[^a-zA-Z0-9._-]/g, '_');

    const formData = new FormData();
    formData.append('file', file);
    formData.append('fileName', cleanFileName);
    formData.append('folder', folder || '/portfolio');
    formData.append('useUniqueFileName', 'true');

    const response = await fetch('https://upload.imagekit.io/api/v1/files/upload', {
      method: 'POST',
      headers: {
        Authorization: authHeader,
      },
      body: formData,
    });

    const data = await response.json();

    if (!response.ok) {
      console.error('[ImageKit Upload Error]:', data);
      return res.status(response.status || 500).json({
        success: false,
        message: data.message || 'ImageKit upload failed',
        details: data,
      });
    }

    return res.status(200).json({
      success: true,
      message: 'Image uploaded to ImageKit successfully',
      url: data.url,
      fileId: data.fileId,
      name: data.name,
      thumbnailUrl: data.thumbnailUrl,
    });
  } catch (error) {
    console.error('[uploadToImageKit Error]:', error);
    return res.status(500).json({
      success: false,
      message: error.message || 'Server error during ImageKit upload',
    });
  }
};

/**
 * Get all portfolio websites
 * @route GET /api/portfolio
 * @access Public
 */
export const getWebsites = async (req, res) => {
  try {
    const { all, search } = req.query;

    const query = {};
    if (all !== 'true') {
      query.isActive = true;
    }

    if (search && search.trim()) {
      query.$or = [
        { title: { $regex: search.trim(), $options: 'i' } },
        { category: { $regex: search.trim(), $options: 'i' } },
        { description: { $regex: search.trim(), $options: 'i' } },
      ];
    }

    const websites = await Portfolio.find(query).sort({ order: 1, createdAt: -1 });

    return res.status(200).json({
      success: true,
      count: websites.length,
      websites,
    });
  } catch (error) {
    console.error('[getWebsites Error]:', error);
    return res.status(500).json({
      success: false,
      message: error.message || 'Failed to fetch websites',
    });
  }
};

/**
 * Get single website by ID
 * @route GET /api/portfolio/:id
 * @access Public
 */
export const getWebsiteById = async (req, res) => {
  try {
    const website = await Portfolio.findById(req.params.id);
    if (!website) {
      return res.status(404).json({
        success: false,
        message: 'Website not found',
      });
    }

    return res.status(200).json({
      success: true,
      website,
    });
  } catch (error) {
    console.error('[getWebsiteById Error]:', error);
    return res.status(500).json({
      success: false,
      message: error.message || 'Failed to fetch website',
    });
  }
};

/**
 * Create a new website
 * @route POST /api/portfolio
 * @access Private (Admin)
 */
export const createWebsite = async (req, res) => {
  try {
    const {
      title,
      category,
      liveUrl,
      image,
      tallImage,
      imageKitFileId,
      description,
      order,
      isActive,
    } = req.body;

    if (!title || !title.trim()) {
      return res.status(400).json({
        success: false,
        message: 'Website title is required',
      });
    }

    const previewImg = image || tallImage || '';
    const scrollImg = tallImage || image || '';

    const newWebsite = await Portfolio.create({
      title: title.trim(),
      category: category ? category.trim() : 'Web Application',
      liveUrl: liveUrl ? liveUrl.trim() : '',
      image: previewImg,
      tallImage: scrollImg,
      imageKitFileId: imageKitFileId || '',
      description: description ? description.trim() : '',
      order: typeof order === 'number' ? order : 0,
      isActive: isActive !== undefined ? isActive : true,
    });

    return res.status(201).json({
      success: true,
      message: 'Website created successfully',
      website: newWebsite,
    });
  } catch (error) {
    console.error('[createWebsite Error]:', error);
    return res.status(500).json({
      success: false,
      message: error.message || 'Failed to create website',
    });
  }
};

/**
 * Update a website
 * @route PUT /api/portfolio/:id
 * @access Private (Admin)
 */
export const updateWebsite = async (req, res) => {
  try {
    const website = await Portfolio.findById(req.params.id);

    if (!website) {
      return res.status(404).json({
        success: false,
        message: 'Website not found',
      });
    }

    const {
      title,
      category,
      liveUrl,
      image,
      tallImage,
      imageKitFileId,
      description,
      order,
      isActive,
    } = req.body;

    if (title !== undefined) website.title = title.trim();
    if (category !== undefined) website.category = category.trim();
    if (liveUrl !== undefined) website.liveUrl = liveUrl.trim();
    if (image !== undefined) website.image = image.trim();
    if (tallImage !== undefined) website.tallImage = tallImage.trim();
    if (imageKitFileId !== undefined) website.imageKitFileId = imageKitFileId;
    if (description !== undefined) website.description = description.trim();
    if (order !== undefined) website.order = Number(order);
    if (isActive !== undefined) website.isActive = Boolean(isActive);

    const updated = await website.save();

    return res.status(200).json({
      success: true,
      message: 'Website updated successfully',
      website: updated,
    });
  } catch (error) {
    console.error('[updateWebsite Error]:', error);
    return res.status(500).json({
      success: false,
      message: error.message || 'Failed to update website',
    });
  }
};

/**
 * Delete a website
 * @route DELETE /api/portfolio/:id
 * @access Private (Admin)
 */
export const deleteWebsite = async (req, res) => {
  try {
    const website = await Portfolio.findById(req.params.id);

    if (!website) {
      return res.status(404).json({
        success: false,
        message: 'Website not found',
      });
    }

    await Portfolio.findByIdAndDelete(req.params.id);

    return res.status(200).json({
      success: true,
      message: `Website "${website.title}" deleted successfully`,
    });
  } catch (error) {
    console.error('[deleteWebsite Error]:', error);
    return res.status(500).json({
      success: false,
      message: error.message || 'Failed to delete website',
    });
  }
};
