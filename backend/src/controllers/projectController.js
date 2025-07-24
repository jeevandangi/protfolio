import Project from '../models/Project.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { ApiResponse } from '../utils/ApiResponse.js';
import { ApiError } from '../utils/ApiError.js';

// @desc    Get all published projects
// @route   GET /api/projects
// @access  Public
const getProjects = asyncHandler(async (req, res) => {
  const { category, featured, limit, search } = req.query;

  let projects;

  if (search) {
    projects = await Project.search(search);
  } else if (featured === 'true') {
    projects = await Project.getFeatured();
  } else if (category) {
    projects = await Project.getByCategory(category);
  } else {
    projects = await Project.getPublished();
  }

  if (limit) {
    projects = projects.slice(0, parseInt(limit));
  }

  res.status(200).json(
    new ApiResponse(200, projects, 'Projects retrieved successfully')
  );
});

// @desc    Get featured projects
// @route   GET /api/projects/featured
// @access  Public
const getFeaturedProjects = asyncHandler(async (req, res) => {
  const projects = await Project.getFeatured();

  res.status(200).json(
    new ApiResponse(200, projects, 'Featured projects retrieved successfully')
  );
});

// @desc    Get projects by category
// @route   GET /api/projects/category/:category
// @access  Public
const getProjectsByCategory = asyncHandler(async (req, res) => {
  const { category } = req.params;
  const projects = await Project.getByCategory(category);

  res.status(200).json(
    new ApiResponse(200, projects, `${category} projects retrieved successfully`)
  );
});

// @desc    Get single project by slug
// @route   GET /api/projects/:slug
// @access  Public
const getProjectBySlug = asyncHandler(async (req, res) => {
  const project = await Project.findOne({
    slug: req.params.slug,
    isActive: true,
    isPublished: true
  });

  if (!project) {
    throw new ApiError(404, 'Project not found');
  }

  // Increment views
  await project.incrementViews();

  res.status(200).json(
    new ApiResponse(200, project, 'Project retrieved successfully')
  );
});

// @desc    Search projects
// @route   GET /api/projects/search
// @access  Public
const searchProjects = asyncHandler(async (req, res) => {
  const { q } = req.query;

  if (!q) {
    throw new ApiError(400, 'Search query is required');
  }

  const projects = await Project.search(q);

  res.status(200).json(
    new ApiResponse(200, projects, 'Search results retrieved successfully')
  );
});

// @desc    Get all projects for admin
// @route   GET /api/admin/projects
// @access  Private (Admin)
const getAdminProjects = asyncHandler(async (req, res) => {
  const {
    page = 1,
    limit = 10,
    category,
    status,
    featured,
    search,
    sortBy = 'createdAt',
    sortOrder = 'desc'
  } = req.query;

  let query = {};

  if (category) query.category = category;
  if (status) query.status = status;
  if (featured !== undefined) query.featured = featured === 'true';

  if (search) {
    query.$or = [
      { title: { $regex: search, $options: 'i' } },
      { description: { $regex: search, $options: 'i' } },
      { technologies: { $in: [new RegExp(search, 'i')] } }
    ];
  }

  const sortOptions = {};
  sortOptions[sortBy] = sortOrder === 'desc' ? -1 : 1;

  const projects = await Project.find(query)
    .sort(sortOptions)
    .limit(limit * 1)
    .skip((page - 1) * limit);

  const total = await Project.countDocuments(query);

  res.status(200).json(
    new ApiResponse(200, {
      projects,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / limit)
      }
    }, 'Admin projects retrieved successfully')
  );
});

// @desc    Create new project
// @route   POST /api/admin/projects
// @access  Private (Admin)
const createProject = asyncHandler(async (req, res) => {
  const project = await Project.create(req.body);

  res.status(201).json(
    new ApiResponse(201, project, 'Project created successfully')
  );
});

// @desc    Get single project for admin
// @route   GET /api/admin/projects/:id
// @access  Private (Admin)
const getAdminProject = asyncHandler(async (req, res) => {
  const project = await Project.findById(req.params.id);

  if (!project) {
    throw new ApiError(404, 'Project not found');
  }

  res.status(200).json(
    new ApiResponse(200, project, 'Project retrieved successfully')
  );
});

// @desc    Update project
// @route   PUT /api/admin/projects/:id
// @access  Private (Admin)
const updateProject = asyncHandler(async (req, res) => {
  const project = await Project.findById(req.params.id);

  if (!project) {
    throw new ApiError(404, 'Project not found');
  }

  const updatedProject = await Project.findByIdAndUpdate(
    req.params.id,
    req.body,
    { new: true, runValidators: true }
  );

  res.status(200).json(
    new ApiResponse(200, updatedProject, 'Project updated successfully')
  );
});

// @desc    Delete project
// @route   DELETE /api/admin/projects/:id
// @access  Private (Admin)
const deleteProject = asyncHandler(async (req, res) => {
  const project = await Project.findById(req.params.id);

  if (!project) {
    throw new ApiError(404, 'Project not found');
  }

  await project.deleteOne();

  res.status(200).json(
    new ApiResponse(200, null, 'Project deleted successfully')
  );
});

// @desc    Toggle project featured status
// @route   PATCH /api/admin/projects/:id/featured
// @access  Private (Admin)
const toggleFeatured = asyncHandler(async (req, res) => {
  const project = await Project.findById(req.params.id);

  if (!project) {
    throw new ApiError(404, 'Project not found');
  }

  project.featured = !project.featured;
  await project.save();

  res.status(200).json(
    new ApiResponse(200, project, `Project ${project.featured ? 'featured' : 'unfeatured'} successfully`)
  );
});

// @desc    Increment project likes
// @route   POST /api/projects/:slug/like
// @access  Public
const likeProject = asyncHandler(async (req, res) => {
  const project = await Project.findOne({
    slug: req.params.slug,
    isActive: true,
    isPublished: true
  });

  if (!project) {
    throw new ApiError(404, 'Project not found');
  }

  await project.incrementLikes();

  res.status(200).json(
    new ApiResponse(200, { likes: project.likes }, 'Project liked successfully')
  );
});

// @desc    Track project link clicks
// @route   POST /api/projects/:slug/click/:type
// @access  Public
const trackClick = asyncHandler(async (req, res) => {
  const { slug, type } = req.params;

  if (!['github', 'live', 'demo'].includes(type)) {
    throw new ApiError(400, 'Invalid click type');
  }

  const project = await Project.findOne({
    slug,
    isActive: true,
    isPublished: true
  });

  if (!project) {
    throw new ApiError(404, 'Project not found');
  }

  await project.incrementClick(type);

  res.status(200).json(
    new ApiResponse(200, null, 'Click tracked successfully')
  );
});

export {
  getProjects,
  getFeaturedProjects,
  getProjectsByCategory,
  getProjectBySlug,
  searchProjects,
  getAdminProjects,
  createProject,
  getAdminProject,
  updateProject,
  deleteProject,
  toggleFeatured,
  likeProject,
  trackClick
};
