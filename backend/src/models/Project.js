import mongoose from 'mongoose';

const projectSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  slug: {
    type: String,
    unique: true,
    lowercase: true,
    sparse: true
  },
  description: {
    type: String,
    required: true
  },
  shortDescription: {
    type: String,
    maxlength: 200
  },
  image: {
    type: String,
    required: true
  },
  images: [{
    url: String,
    caption: String,
    isMain: {
      type: Boolean,
      default: false
    }
  }],
  technologies: [{
    type: String,
    required: true
  }],
  category: {
    type: String,
    required: true,
    enum: ['fullstack', 'frontend', 'backend', 'mobile', 'desktop'],
    default: 'fullstack'
  },
  githubUrl: {
    type: String,
    validate: {
      validator: function (v) {
        return !v || /^https:\/\/github\.com\//.test(v);
      },
      message: 'GitHub URL must be a valid GitHub repository URL'
    }
  },
  liveUrl: {
    type: String,
    validate: {
      validator: function (v) {
        return !v || /^https?:\/\//.test(v);
      },
      message: 'Live URL must be a valid URL'
    }
  },
  demoUrl: {
    type: String
  },
  status: {
    type: String,
    enum: ['Planning', 'In Progress', 'Completed', 'Maintenance', 'Archived'],
    default: 'Completed'
  },
  featured: {
    type: Boolean,
    default: false
  },
  priority: {
    type: Number,
    default: 0,
    min: 0,
    max: 10
  },
  year: {
    type: String,
    default: () => new Date().getFullYear().toString()
  },
  startDate: {
    type: Date
  },
  endDate: {
    type: Date
  },
  duration: {
    type: String // e.g., "3 months", "2 weeks"
  },
  teamSize: {
    type: Number,
    default: 1
  },
  myRole: {
    type: String,
    default: 'Full Stack Developer'
  },
  challenges: [{
    type: String
  }],
  solutions: [{
    type: String
  }],
  features: [{
    type: String
  }],
  learnings: [{
    type: String
  }],

  // Analytics
  views: {
    type: Number,
    default: 0
  },
  likes: {
    type: Number,
    default: 0
  },
  clicks: {
    github: {
      type: Number,
      default: 0
    },
    live: {
      type: Number,
      default: 0
    },
    demo: {
      type: Number,
      default: 0
    }
  },

  // SEO
  seo: {
    title: String,
    description: String,
    keywords: [String]
  },

  // Status
  isActive: {
    type: Boolean,
    default: true
  },
  isPublished: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

// Indexes for efficient querying
projectSchema.index({ category: 1, featured: -1, priority: -1 });
projectSchema.index({ isActive: 1, isPublished: 1 });
// Note: slug index is already created by unique: true in schema definition
projectSchema.index({ technologies: 1 });

// Pre-save middleware to generate slug
projectSchema.pre('save', function (next) {
  if ((this.isModified('title') || this.isNew) && this.title) {
    this.slug = this.title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');
  }

  // Auto-generate short description if not provided
  if (!this.shortDescription && this.description) {
    this.shortDescription = this.description.substring(0, 150) + '...';
  }

  // Auto-generate SEO data if not provided
  if (!this.seo.title) {
    this.seo.title = `${this.title} - Jeevan Dangi Portfolio`;
  }
  if (!this.seo.description) {
    this.seo.description = this.shortDescription || this.description.substring(0, 160);
  }

  next();
});

// Instance methods
projectSchema.methods.incrementViews = function () {
  this.views += 1;
  return this.save();
};

projectSchema.methods.incrementLikes = function () {
  this.likes += 1;
  return this.save();
};

projectSchema.methods.incrementClick = function (type) {
  if (this.clicks[type] !== undefined) {
    this.clicks[type] += 1;
    return this.save();
  }
  return Promise.resolve(this);
};

// Static methods
projectSchema.statics.getFeatured = function () {
  return this.find({
    featured: true,
    isActive: true,
    isPublished: true
  }).sort({ priority: -1, createdAt: -1 });
};

projectSchema.statics.getByCategory = function (category) {
  return this.find({
    category: category,
    isActive: true,
    isPublished: true
  }).sort({ priority: -1, createdAt: -1 });
};

projectSchema.statics.getPublished = function () {
  return this.find({
    isActive: true,
    isPublished: true
  }).sort({ featured: -1, priority: -1, createdAt: -1 });
};

projectSchema.statics.search = function (query) {
  return this.find({
    $and: [
      { isActive: true, isPublished: true },
      {
        $or: [
          { title: { $regex: query, $options: 'i' } },
          { description: { $regex: query, $options: 'i' } },
          { technologies: { $in: [new RegExp(query, 'i')] } }
        ]
      }
    ]
  }).sort({ priority: -1, createdAt: -1 });
};

const Project = mongoose.model('Project', projectSchema);

export default Project;
