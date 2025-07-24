import Blog from '../models/Blog.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { ApiResponse } from '../utils/ApiResponse.js';
import { ApiError } from '../utils/ApiError.js';

// @desc    Get all published blogs
// @route   GET /api/blogs
// @access  Public
const getBlogs = asyncHandler(async (req, res) => {
  const {
    page = 1,
    limit = 10,
    category,
    featured,
    search,
    sortBy = 'publishedAt',
    sortOrder = 'desc'
  } = req.query;

  let query = { isPublished: true };

  if (category && category !== 'all') {
    query.category = category;
  }

  if (featured === 'true') {
    query.isFeatured = true;
  }

  if (search) {
    query.$or = [
      { title: { $regex: search, $options: 'i' } },
      { excerpt: { $regex: search, $options: 'i' } },
      { content: { $regex: search, $options: 'i' } },
      { tags: { $in: [new RegExp(search, 'i')] } }
    ];
  }

  const sortOptions = {};
  sortOptions[sortBy] = sortOrder === 'desc' ? -1 : 1;

  const blogs = await Blog.find(query)
    .select('-content') // Exclude full content for list view
    .sort(sortOptions)
    .limit(limit * 1)
    .skip((page - 1) * limit)
    .lean();

  const total = await Blog.countDocuments(query);

  res.status(200).json(
    new ApiResponse(200, {
      blogs,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / limit)
      }
    }, 'Blogs retrieved successfully')
  );
});

// @desc    Get single blog by slug
// @route   GET /api/blogs/:slug
// @access  Public
const getBlogBySlug = asyncHandler(async (req, res) => {
  const blog = await Blog.findOne({
    slug: req.params.slug,
    isPublished: true
  });

  if (!blog) {
    throw new ApiError(404, 'Blog post not found');
  }

  // Increment views
  await blog.incrementViews();

  res.status(200).json(
    new ApiResponse(200, blog, 'Blog retrieved successfully')
  );
});

// @desc    Get featured blogs
// @route   GET /api/blogs/featured
// @access  Public
const getFeaturedBlogs = asyncHandler(async (req, res) => {
  const { limit = 5 } = req.query;

  const blogs = await Blog.find({
    isPublished: true,
    isFeatured: true
  })
    .select('-content')
    .sort({ publishedAt: -1 })
    .limit(parseInt(limit))
    .lean();

  res.status(200).json(
    new ApiResponse(200, blogs, 'Featured blogs retrieved successfully')
  );
});

// @desc    Get blogs by category
// @route   GET /api/blogs/category/:category
// @access  Public
const getBlogsByCategory = asyncHandler(async (req, res) => {
  const { category } = req.params;
  const { page = 1, limit = 10 } = req.query;

  const blogs = await Blog.find({
    isPublished: true,
    category
  })
    .select('-content')
    .sort({ publishedAt: -1 })
    .limit(limit * 1)
    .skip((page - 1) * limit)
    .lean();

  const total = await Blog.countDocuments({
    isPublished: true,
    category
  });

  res.status(200).json(
    new ApiResponse(200, {
      blogs,
      category,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / limit)
      }
    }, `Blogs in ${category} category retrieved successfully`)
  );
});

// @desc    Search blogs
// @route   GET /api/blogs/search
// @access  Public
const searchBlogs = asyncHandler(async (req, res) => {
  const { q: query, page = 1, limit = 10 } = req.query;

  if (!query) {
    throw new ApiError(400, 'Search query is required');
  }

  const blogs = await Blog.find({
    isPublished: true,
    $or: [
      { title: { $regex: query, $options: 'i' } },
      { excerpt: { $regex: query, $options: 'i' } },
      { content: { $regex: query, $options: 'i' } },
      { tags: { $in: [new RegExp(query, 'i')] } }
    ]
  })
    .select('-content')
    .sort({ publishedAt: -1 })
    .limit(limit * 1)
    .skip((page - 1) * limit)
    .lean();

  const total = await Blog.countDocuments({
    isPublished: true,
    $or: [
      { title: { $regex: query, $options: 'i' } },
      { excerpt: { $regex: query, $options: 'i' } },
      { content: { $regex: query, $options: 'i' } },
      { tags: { $in: [new RegExp(query, 'i')] } }
    ]
  });

  res.status(200).json(
    new ApiResponse(200, {
      blogs,
      query,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / limit)
      }
    }, 'Search results retrieved successfully')
  );
});

// @desc    Like a blog post
// @route   PATCH /api/blogs/:slug/like
// @access  Public
const likeBlog = asyncHandler(async (req, res) => {
  const blog = await Blog.findOne({
    slug: req.params.slug,
    isPublished: true
  });

  if (!blog) {
    throw new ApiError(404, 'Blog post not found');
  }

  await blog.incrementLikes();

  res.status(200).json(
    new ApiResponse(200, { likes: blog.likes }, 'Blog liked successfully')
  );
});

// ADMIN ROUTES

// @desc    Get all blogs for admin
// @route   GET /api/blogs/admin
// @access  Private (Admin)
const getAdminBlogs = asyncHandler(async (req, res) => {

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

  if (category && category !== 'all') {
    query.category = category;
  }

  if (status === 'published') {
    query.isPublished = true;
  } else if (status === 'draft') {
    query.isPublished = false;
  }

  if (featured !== undefined) {
    query.isFeatured = featured === 'true';
  }

  if (search) {
    query.$or = [
      { title: { $regex: search, $options: 'i' } },
      { excerpt: { $regex: search, $options: 'i' } },
      { content: { $regex: search, $options: 'i' } },
      { tags: { $in: [new RegExp(search, 'i')] } }
    ];
  }

  const sortOptions = {};
  sortOptions[sortBy] = sortOrder === 'desc' ? -1 : 1;

  const blogs = await Blog.find(query)
    .sort(sortOptions)
    .limit(limit * 1)
    .skip((page - 1) * limit);

  const total = await Blog.countDocuments(query);

  res.status(200).json(
    new ApiResponse(200, {
      blogs,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / limit)
      }
    }, 'Admin blogs retrieved successfully')
  );
});

// @desc    Create new blog
// @route   POST /api/blogs/admin
// @access  Private (Admin)
const createBlog = asyncHandler(async (req, res) => {
  const blog = await Blog.create(req.body);

  res.status(201).json(
    new ApiResponse(201, blog, 'Blog created successfully')
  );
});

// @desc    Get single blog for admin
// @route   GET /api/blogs/admin/:id
// @access  Private (Admin)
const getAdminBlog = asyncHandler(async (req, res) => {
  const blog = await Blog.findById(req.params.id);

  if (!blog) {
    throw new ApiError(404, 'Blog not found');
  }

  res.status(200).json(
    new ApiResponse(200, blog, 'Blog retrieved successfully')
  );
});

// @desc    Update blog
// @route   PUT /api/blogs/admin/:id
// @access  Private (Admin)
const updateBlog = asyncHandler(async (req, res) => {
  const blog = await Blog.findById(req.params.id);

  if (!blog) {
    throw new ApiError(404, 'Blog not found');
  }

  const updatedBlog = await Blog.findByIdAndUpdate(
    req.params.id,
    req.body,
    { new: true, runValidators: true }
  );

  res.status(200).json(
    new ApiResponse(200, updatedBlog, 'Blog updated successfully')
  );
});

// @desc    Delete blog
// @route   DELETE /api/blogs/admin/:id
// @access  Private (Admin)
const deleteBlog = asyncHandler(async (req, res) => {
  const blog = await Blog.findById(req.params.id);

  if (!blog) {
    throw new ApiError(404, 'Blog not found');
  }

  await Blog.findByIdAndDelete(req.params.id);

  res.status(200).json(
    new ApiResponse(200, null, 'Blog deleted successfully')
  );
});

// @desc    Toggle blog publish status
// @route   PATCH /api/blogs/admin/:id/publish
// @access  Private (Admin)
const toggleBlogPublish = asyncHandler(async (req, res) => {
  const blog = await Blog.findById(req.params.id);

  if (!blog) {
    throw new ApiError(404, 'Blog not found');
  }

  await blog.togglePublish();

  res.status(200).json(
    new ApiResponse(200, blog, `Blog ${blog.isPublished ? 'published' : 'unpublished'} successfully`)
  );
});

// @desc    Toggle blog featured status
// @route   PATCH /api/blogs/admin/:id/featured
// @access  Private (Admin)
const toggleBlogFeatured = asyncHandler(async (req, res) => {
  const blog = await Blog.findById(req.params.id);

  if (!blog) {
    throw new ApiError(404, 'Blog not found');
  }

  blog.isFeatured = !blog.isFeatured;
  await blog.save();

  res.status(200).json(
    new ApiResponse(200, blog, `Blog ${blog.isFeatured ? 'featured' : 'unfeatured'} successfully`)
  );
});

export {
  getBlogs,
  getBlogBySlug,
  getFeaturedBlogs,
  getBlogsByCategory,
  searchBlogs,
  likeBlog,
  getAdminBlogs,
  createBlog,
  getAdminBlog,
  updateBlog,
  deleteBlog,
  toggleBlogPublish,
  toggleBlogFeatured
};
