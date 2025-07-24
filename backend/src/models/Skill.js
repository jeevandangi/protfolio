import mongoose from 'mongoose';

const skillSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true
  },
  category: {
    type: String,
    required: true,
    enum: ['Frontend', 'Backend', 'Database', 'Tools', 'Languages', 'Cloud', 'Mobile'],
    default: 'Frontend'
  },
  level: {
    type: Number,
    required: true,
    min: 0,
    max: 100,
    default: 50
  },
  icon: {
    type: String,
    required: true,
    default: 'FaCode' // React icon component name
  },
  color: {
    type: String,
    required: true,
    default: 'text-blue-400' // Tailwind CSS color class
  },
  description: {
    type: String,
    default: ''
  },
  yearsOfExperience: {
    type: Number,
    default: 0
  },
  projects: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Project'
  }],
  certifications: [{
    name: String,
    issuer: String,
    date: Date,
    url: String
  }],
  isActive: {
    type: Boolean,
    default: true
  },
  order: {
    type: Number,
    default: 0
  }
}, {
  timestamps: true
});

// Index for efficient querying
skillSchema.index({ category: 1, order: 1 });
skillSchema.index({ isActive: 1 });

// Static method to get skills by category
skillSchema.statics.getByCategory = function(category) {
  return this.find({ 
    category: category, 
    isActive: true 
  }).sort({ order: 1, level: -1 });
};

// Static method to get all active skills grouped by category
skillSchema.statics.getAllGrouped = function() {
  return this.aggregate([
    { $match: { isActive: true } },
    { $sort: { order: 1, level: -1 } },
    {
      $group: {
        _id: '$category',
        skills: { $push: '$$ROOT' }
      }
    },
    { $sort: { _id: 1 } }
  ]);
};

// Static method to get top skills
skillSchema.statics.getTopSkills = function(limit = 12) {
  return this.find({ isActive: true })
    .sort({ level: -1, order: 1 })
    .limit(limit);
};

const Skill = mongoose.model('Skill', skillSchema);

export default Skill;
