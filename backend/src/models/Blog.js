import mongoose from 'mongoose';

const blogSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Blog title is required'],
    trim: true,
    maxlength: [200, 'Title cannot exceed 200 characters']
  },
  slug: {
    type: String,
    required: [true, 'Blog slug is required'],
    unique: true,
    lowercase: true,
    trim: true,
    match: [/^[a-z0-9-]+$/, 'Slug can only contain lowercase letters, numbers, and hyphens']
  },
  excerpt: {
    type: String,
    required: [true, 'Blog excerpt is required'],
    trim: true,
    maxlength: [500, 'Excerpt cannot exceed 500 characters']
  },
  content: {
    type: String,
    required: [true, 'Blog content is required']
  },
  author: {
    type: String,
    default: 'Jeevan Dangi',
    trim: true
  },
  tags: [{
    type: String,
    trim: true,
    lowercase: true
  }],
  category: {
    type: String,
    required: [true, 'Blog category is required'],
    enum: {
      values: ['Web Development', 'JavaScript', 'React', 'Node.js', 'Tutorial', 'Tips & Tricks', 'Career', 'Technology'],
      message: 'Please select a valid category'
    },
    default: 'Web Development'
  },
  featuredImage: {
    type: String,
    default: 'https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=800&h=400&fit=crop'
  },
  isPublished: {
    type: Boolean,
    default: false
  },
  isFeatured: {
    type: Boolean,
    default: false
  },
  views: {
    type: Number,
    default: 0,
    min: 0
  },
  likes: {
    type: Number,
    default: 0,
    min: 0
  },
  readTime: {
    type: Number, // in minutes
    default: 5,
    min: 1
  },
  publishedAt: {
    type: Date,
    default: null
  },
  
  // SEO fields
  metaTitle: {
    type: String,
    trim: true,
    maxlength: [60, 'Meta title cannot exceed 60 characters']
  },
  metaDescription: {
    type: String,
    trim: true,
    maxlength: [160, 'Meta description cannot exceed 160 characters']
  },
  
  // Social sharing
  socialImage: {
    type: String
  },
  
  // Comments (for future implementation)
  commentsEnabled: {
    type: Boolean,
    default: true
  },
  
  // Analytics
  analytics: {
    totalViews: { type: Number, default: 0 },
    uniqueViews: { type: Number, default: 0 },
    avgReadTime: { type: Number, default: 0 },
    bounceRate: { type: Number, default: 0 }
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Indexes for better performance
blogSchema.index({ slug: 1 });
blogSchema.index({ category: 1 });
blogSchema.index({ isPublished: 1 });
blogSchema.index({ publishedAt: -1 });
blogSchema.index({ tags: 1 });
blogSchema.index({ title: 'text', content: 'text', excerpt: 'text' });

// Virtual for URL
blogSchema.virtual('url').get(function() {
  return `/blog/${this.slug}`;
});

// Pre-save middleware to generate slug from title if not provided
blogSchema.pre('save', function(next) {
  if (!this.slug && this.title) {
    this.slug = this.title
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim('-');
  }
  
  // Set publishedAt when publishing for the first time
  if (this.isPublished && !this.publishedAt) {
    this.publishedAt = new Date();
  }
  
  // Calculate read time based on content length (average 200 words per minute)
  if (this.content) {
    const wordCount = this.content.split(/\s+/).length;
    this.readTime = Math.max(1, Math.ceil(wordCount / 200));
  }
  
  // Auto-generate meta fields if not provided
  if (!this.metaTitle) {
    this.metaTitle = this.title.substring(0, 60);
  }
  if (!this.metaDescription) {
    this.metaDescription = this.excerpt.substring(0, 160);
  }
  
  next();
});

// Static methods
blogSchema.statics.getPublished = function() {
  return this.find({ isPublished: true }).sort({ publishedAt: -1 });
};

blogSchema.statics.getFeatured = function() {
  return this.find({ isPublished: true, isFeatured: true }).sort({ publishedAt: -1 });
};

blogSchema.statics.getByCategory = function(category) {
  return this.find({ isPublished: true, category }).sort({ publishedAt: -1 });
};

blogSchema.statics.searchBlogs = function(query) {
  return this.find({
    isPublished: true,
    $text: { $search: query }
  }).sort({ score: { $meta: 'textScore' } });
};

// Instance methods
blogSchema.methods.incrementViews = function() {
  this.views += 1;
  this.analytics.totalViews += 1;
  return this.save();
};

blogSchema.methods.incrementLikes = function() {
  this.likes += 1;
  return this.save();
};

blogSchema.methods.togglePublish = function() {
  this.isPublished = !this.isPublished;
  if (this.isPublished && !this.publishedAt) {
    this.publishedAt = new Date();
  }
  return this.save();
};

const Blog = mongoose.model('Blog', blogSchema);

export default Blog;
