import Skill from '../models/Skill.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { ApiResponse } from '../utils/ApiResponse.js';
import { ApiError } from '../utils/ApiError.js';

// @desc    Get all skills
// @route   GET /api/skills
// @access  Public
const getSkills = asyncHandler(async (req, res) => {
  const { category, limit } = req.query;

  let skills;

  if (category) {
    skills = await Skill.getByCategory(category);
  } else if (limit) {
    skills = await Skill.getTopSkills(parseInt(limit));
  } else {
    skills = await Skill.find({ isActive: true }).sort({ order: 1, level: -1 });
  }

  res.status(200).json(
    new ApiResponse(200, skills, 'Skills retrieved successfully')
  );
});

// @desc    Get skills grouped by category
// @route   GET /api/skills/grouped
// @access  Public
const getSkillsGrouped = asyncHandler(async (req, res) => {
  const skillsGrouped = await Skill.getAllGrouped();

  res.status(200).json(
    new ApiResponse(200, skillsGrouped, 'Grouped skills retrieved successfully')
  );
});

// @desc    Get skills by category
// @route   GET /api/skills/category/:category
// @access  Public
const getSkillsByCategory = asyncHandler(async (req, res) => {
  const { category } = req.params;
  const skills = await Skill.getByCategory(category);

  res.status(200).json(
    new ApiResponse(200, skills, `${category} skills retrieved successfully`)
  );
});

// @desc    Get top skills
// @route   GET /api/skills/top
// @access  Public
const getTopSkills = asyncHandler(async (req, res) => {
  const { limit = 12 } = req.query;
  const skills = await Skill.getTopSkills(parseInt(limit));

  res.status(200).json(
    new ApiResponse(200, skills, 'Top skills retrieved successfully')
  );
});

// @desc    Get all skills for admin
// @route   GET /api/admin/skills
// @access  Private (Admin)
const getAdminSkills = asyncHandler(async (req, res) => {
  const { page = 1, limit = 20, category, search } = req.query;


  let query = {};

  if (category) {
    query.category = category;
  }

  if (search) {
    query.name = { $regex: search, $options: 'i' };
  }

  const skills = await Skill.find(query)
    .sort({ order: 1, level: -1 })
    .limit(limit * 1)
    .skip((page - 1) * limit);

  const total = await Skill.countDocuments(query);

  res.status(200).json(
    new ApiResponse(200, {
      skills,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / limit)
      }
    }, 'Admin skills retrieved successfully')
  );
});

// @desc    Create new skill
// @route   POST /api/admin/skills
// @access  Private (Admin)
const createSkill = asyncHandler(async (req, res) => {
  const skill = await Skill.create(req.body);

  res.status(201).json(
    new ApiResponse(201, skill, 'Skill created successfully')
  );
});

// @desc    Get single skill
// @route   GET /api/admin/skills/:id
// @access  Private (Admin)
const getSkill = asyncHandler(async (req, res) => {
  const skill = await Skill.findById(req.params.id).populate('projects');

  if (!skill) {
    throw new ApiError(404, 'Skill not found');
  }

  res.status(200).json(
    new ApiResponse(200, skill, 'Skill retrieved successfully')
  );
});

// @desc    Update skill
// @route   PUT /api/admin/skills/:id
// @access  Private (Admin)
const updateSkill = asyncHandler(async (req, res) => {
  const skill = await Skill.findById(req.params.id);

  if (!skill) {
    throw new ApiError(404, 'Skill not found');
  }

  const updatedSkill = await Skill.findByIdAndUpdate(
    req.params.id,
    req.body,
    { new: true, runValidators: true }
  );

  res.status(200).json(
    new ApiResponse(200, updatedSkill, 'Skill updated successfully')
  );
});

// @desc    Delete skill
// @route   DELETE /api/admin/skills/:id
// @access  Private (Admin)
const deleteSkill = asyncHandler(async (req, res) => {
  const skill = await Skill.findById(req.params.id);

  if (!skill) {
    throw new ApiError(404, 'Skill not found');
  }

  await skill.deleteOne();

  res.status(200).json(
    new ApiResponse(200, null, 'Skill deleted successfully')
  );
});

// @desc    Bulk update skill order
// @route   PUT /api/admin/skills/reorder
// @access  Private (Admin)
const reorderSkills = asyncHandler(async (req, res) => {
  const { skills } = req.body; // Array of { id, order }

  if (!Array.isArray(skills)) {
    throw new ApiError(400, 'Skills must be an array');
  }

  const updatePromises = skills.map(({ id, order }) =>
    Skill.findByIdAndUpdate(id, { order }, { new: true })
  );

  await Promise.all(updatePromises);

  res.status(200).json(
    new ApiResponse(200, null, 'Skills reordered successfully')
  );
});

// @desc    Toggle skill active status
// @route   PATCH /api/admin/skills/:id/toggle
// @access  Private (Admin)
const toggleSkillStatus = asyncHandler(async (req, res) => {
  const skill = await Skill.findById(req.params.id);

  if (!skill) {
    throw new ApiError(404, 'Skill not found');
  }

  skill.isActive = !skill.isActive;
  await skill.save();

  res.status(200).json(
    new ApiResponse(200, skill, `Skill ${skill.isActive ? 'activated' : 'deactivated'} successfully`)
  );
});

export {
  getSkills,
  getSkillsGrouped,
  getSkillsByCategory,
  getTopSkills,
  getAdminSkills,
  createSkill,
  getSkill,
  updateSkill,
  deleteSkill,
  reorderSkills,
  toggleSkillStatus
};
