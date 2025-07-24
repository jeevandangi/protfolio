import Profile from '../models/Profile.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { ApiResponse } from '../utils/ApiResponse.js';
import { ApiError } from '../utils/ApiError.js';
import { deleteFile, getFileUrl } from '../middlewares/upload.js';
import path from 'path';

// @desc    Get active profile
// @route   GET /api/profile
// @access  Public
const getProfile = asyncHandler(async (req, res) => {
  const profile = await Profile.getActiveProfile();

  if (!profile) {
    throw new ApiError(404, 'Profile not found');
  }

  // Increment views
  await profile.incrementViews();

  res.status(200).json(
    new ApiResponse(200, profile, 'Profile retrieved successfully')
  );
});

// @desc    Get profile for admin (with sensitive data)
// @route   GET /api/admin/profile
// @access  Private (Admin)
const getAdminProfile = asyncHandler(async (req, res) => {
  const profile = await Profile.getActiveProfile();

  if (!profile) {
    throw new ApiError(404, 'Profile not found');
  }

  res.status(200).json(
    new ApiResponse(200, profile, 'Admin profile retrieved successfully')
  );
});

// @desc    Update profile
// @route   PUT /api/admin/profile
// @access  Private (Admin)
const updateProfile = asyncHandler(async (req, res) => {
  const profile = await Profile.getActiveProfile();

  if (!profile) {
    throw new ApiError(404, 'Profile not found');
  }

  // Update fields
  const allowedFields = [
    'name', 'title', 'subtitle', 'greeting', 'typewriterTexts', 'description',
    'bio', 'bioExtended', 'profileImage', 'email', 'phone', 'location',
    'socialLinks', 'resumeUrl', 'terminalCommands', 'seo'
  ];

  allowedFields.forEach(field => {
    if (req.body[field] !== undefined) {
      profile[field] = req.body[field];
    }
  });

  profile.lastUpdated = new Date();
  await profile.save();

  res.status(200).json(
    new ApiResponse(200, profile, 'Profile updated successfully')
  );
});

// @desc    Create new profile (if none exists)
// @route   POST /api/admin/profile
// @access  Private (Admin)
const createProfile = asyncHandler(async (req, res) => {
  const existingProfile = await Profile.getActiveProfile();

  if (existingProfile) {
    throw new ApiError(400, 'Profile already exists. Use update instead.');
  }

  const profile = await Profile.create(req.body);

  res.status(201).json(
    new ApiResponse(201, profile, 'Profile created successfully')
  );
});

// @desc    Get profile analytics
// @route   GET /api/admin/profile/analytics
// @access  Private (Admin)
const getProfileAnalytics = asyncHandler(async (req, res) => {
  const profile = await Profile.getActiveProfile();

  if (!profile) {
    throw new ApiError(404, 'Profile not found');
  }

  const analytics = {
    totalViews: profile.views,
    lastUpdated: profile.lastUpdated,
    createdAt: profile.createdAt,
    updatedAt: profile.updatedAt
  };

  res.status(200).json(
    new ApiResponse(200, analytics, 'Profile analytics retrieved successfully')
  );
});

// @desc    Update terminal commands
// @route   PUT /api/admin/profile/terminal
// @access  Private (Admin)
const updateTerminalCommands = asyncHandler(async (req, res) => {
  const profile = await Profile.getActiveProfile();

  if (!profile) {
    throw new ApiError(404, 'Profile not found');
  }

  const { terminalCommands } = req.body;

  if (!Array.isArray(terminalCommands)) {
    throw new ApiError(400, 'Terminal commands must be an array');
  }

  profile.terminalCommands = terminalCommands;
  profile.lastUpdated = new Date();
  await profile.save();

  res.status(200).json(
    new ApiResponse(200, profile.terminalCommands, 'Terminal commands updated successfully')
  );
});

// @desc    Update social links
// @route   PUT /api/admin/profile/social
// @access  Private (Admin)
const updateSocialLinks = asyncHandler(async (req, res) => {
  const profile = await Profile.getActiveProfile();

  if (!profile) {
    throw new ApiError(404, 'Profile not found');
  }

  const { socialLinks } = req.body;

  if (socialLinks) {
    profile.socialLinks = { ...profile.socialLinks, ...socialLinks };
    profile.lastUpdated = new Date();
    await profile.save();
  }

  res.status(200).json(
    new ApiResponse(200, profile.socialLinks, 'Social links updated successfully')
  );
});

// @desc    Update SEO data
// @route   PUT /api/admin/profile/seo
// @access  Private (Admin)
const updateSEO = asyncHandler(async (req, res) => {
  const profile = await Profile.getActiveProfile();

  if (!profile) {
    throw new ApiError(404, 'Profile not found');
  }

  const { seo } = req.body;

  if (seo) {
    profile.seo = { ...profile.seo, ...seo };
    profile.lastUpdated = new Date();
    await profile.save();
  }

  res.status(200).json(
    new ApiResponse(200, profile.seo, 'SEO data updated successfully')
  );
});

// @desc    Upload profile image
// @route   POST /api/profile/admin/upload-image
// @access  Private (Admin)
const uploadProfileImage = asyncHandler(async (req, res) => {
  if (!req.file) {
    throw new ApiError(400, 'No image file provided');
  }

  try {
    // Get or create profile
    let profile = await Profile.getActiveProfile();
    if (!profile) {
      profile = await Profile.create({
        name: 'Default Profile',
        isActive: true
      });
    }

    // Delete old profile image if exists
    if (profile.profileImage) {
      const oldImagePath = profile.profileImage.replace(process.env.BASE_URL || 'http://localhost:8000', '');
      const fullOldPath = path.join(process.cwd(), oldImagePath);
      deleteFile(fullOldPath);
    }

    // Update profile with new image URL
    const imageUrl = getFileUrl(req.file.filename, 'profile-image');
    profile.profileImage = imageUrl;
    await profile.save();

    res.status(200).json(
      new ApiResponse(200, {
        profileImageUrl: imageUrl,
        filename: req.file.filename
      }, 'Profile image uploaded successfully')
    );
  } catch (error) {
    // Delete uploaded file if database update fails
    deleteFile(req.file.path);
    throw error;
  }
});

// @desc    Upload resume PDF
// @route   POST /api/profile/admin/upload-resume
// @access  Private (Admin)
const uploadResume = asyncHandler(async (req, res) => {
  if (!req.file) {
    throw new ApiError(400, 'No resume file provided');
  }

  try {
    // Get or create profile
    let profile = await Profile.getActiveProfile();
    if (!profile) {
      profile = await Profile.create({
        name: 'Default Profile',
        isActive: true
      });
    }

    // Delete old resume if exists
    if (profile.resumeUrl) {
      const oldResumePath = profile.resumeUrl.replace(process.env.BASE_URL || 'http://localhost:8000', '');
      const fullOldPath = path.join(process.cwd(), oldResumePath);
      deleteFile(fullOldPath);
    }

    // Update profile with new resume URL
    const resumeUrl = getFileUrl(req.file.filename, 'resume');
    profile.resumeUrl = resumeUrl;
    await profile.save();

    res.status(200).json(
      new ApiResponse(200, {
        resumeUrl: resumeUrl,
        filename: req.file.filename
      }, 'Resume uploaded successfully')
    );
  } catch (error) {
    // Delete uploaded file if database update fails
    deleteFile(req.file.path);
    throw error;
  }
});

export {
  getProfile,
  getAdminProfile,
  updateProfile,
  createProfile,
  getProfileAnalytics,
  updateTerminalCommands,
  updateSocialLinks,
  updateSEO,
  uploadProfileImage,
  uploadResume
};
