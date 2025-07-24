import mongoose from 'mongoose';

const messageSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
    maxlength: 100
  },
  email: {
    type: String,
    required: true,
    trim: true,
    lowercase: true,
    validate: {
      validator: function(v) {
        return /^\S+@\S+\.\S+$/.test(v);
      },
      message: 'Please enter a valid email address'
    }
  },
  subject: {
    type: String,
    required: true,
    trim: true,
    maxlength: 200
  },
  message: {
    type: String,
    required: true,
    trim: true,
    minlength: 10,
    maxlength: 2000
  },
  phone: {
    type: String,
    trim: true
  },
  company: {
    type: String,
    trim: true
  },
  website: {
    type: String,
    trim: true
  },
  
  // Classification
  category: {
    type: String,
    enum: ['Business', 'Job Offer', 'Freelance', 'Partnership', 'Speaking', 'Nonprofit', 'General', 'Spam'],
    default: 'General'
  },
  priority: {
    type: String,
    enum: ['Low', 'Medium', 'High', 'Urgent'],
    default: 'Medium'
  },
  
  // Status Management
  status: {
    type: String,
    enum: ['Unread', 'Read', 'Replied', 'Archived', 'Spam'],
    default: 'Unread'
  },
  isStarred: {
    type: Boolean,
    default: false
  },
  isFlagged: {
    type: Boolean,
    default: false
  },
  
  // Response Management
  replies: [{
    subject: String,
    message: String,
    sentAt: {
      type: Date,
      default: Date.now
    },
    sentBy: {
      type: String,
      default: 'Jeevan Dangi'
    }
  }],
  lastRepliedAt: {
    type: Date
  },
  
  // Metadata
  ipAddress: {
    type: String
  },
  userAgent: {
    type: String
  },
  referrer: {
    type: String
  },
  source: {
    type: String,
    enum: ['Portfolio Website', 'LinkedIn', 'GitHub', 'Email', 'Other'],
    default: 'Portfolio Website'
  },
  
  // Analytics
  readAt: {
    type: Date
  },
  readCount: {
    type: Number,
    default: 0
  },
  
  // Notes (internal)
  internalNotes: [{
    note: String,
    addedAt: {
      type: Date,
      default: Date.now
    }
  }],
  
  // Tags for organization
  tags: [{
    type: String,
    trim: true
  }],
  
  // Follow-up
  followUpDate: {
    type: Date
  },
  followUpNotes: {
    type: String
  },
  
  // Spam detection
  spamScore: {
    type: Number,
    default: 0,
    min: 0,
    max: 100
  },
  isSpam: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true
});

// Indexes for efficient querying
messageSchema.index({ status: 1, createdAt: -1 });
messageSchema.index({ category: 1, priority: 1 });
messageSchema.index({ email: 1 });
messageSchema.index({ isStarred: 1 });
messageSchema.index({ isFlagged: 1 });
messageSchema.index({ isSpam: 1 });

// Pre-save middleware for spam detection
messageSchema.pre('save', function(next) {
  // Simple spam detection logic
  const spamKeywords = ['viagra', 'casino', 'lottery', 'winner', 'congratulations', 'click here', 'free money'];
  const messageText = (this.message + ' ' + this.subject).toLowerCase();
  
  let spamScore = 0;
  spamKeywords.forEach(keyword => {
    if (messageText.includes(keyword)) {
      spamScore += 20;
    }
  });
  
  // Check for excessive links
  const linkCount = (messageText.match(/http/g) || []).length;
  if (linkCount > 3) spamScore += 30;
  
  // Check for excessive caps
  const capsRatio = (messageText.match(/[A-Z]/g) || []).length / messageText.length;
  if (capsRatio > 0.5) spamScore += 25;
  
  this.spamScore = Math.min(spamScore, 100);
  this.isSpam = spamScore > 60;
  
  // Auto-categorize based on content
  if (!this.isModified('category') || this.category === 'General') {
    const messageContent = messageText;
    if (messageContent.includes('job') || messageContent.includes('position') || messageContent.includes('hire')) {
      this.category = 'Job Offer';
    } else if (messageContent.includes('freelance') || messageContent.includes('project') || messageContent.includes('contract')) {
      this.category = 'Freelance';
    } else if (messageContent.includes('partnership') || messageContent.includes('collaborate')) {
      this.category = 'Partnership';
    } else if (messageContent.includes('speak') || messageContent.includes('presentation') || messageContent.includes('conference')) {
      this.category = 'Speaking';
    }
  }
  
  next();
});

// Instance methods
messageSchema.methods.markAsRead = function() {
  if (this.status === 'Unread') {
    this.status = 'Read';
    this.readAt = new Date();
  }
  this.readCount += 1;
  return this.save();
};

messageSchema.methods.addReply = function(subject, message, sentBy = 'Jeevan Dangi') {
  this.replies.push({
    subject,
    message,
    sentBy,
    sentAt: new Date()
  });
  this.status = 'Replied';
  this.lastRepliedAt = new Date();
  return this.save();
};

messageSchema.methods.toggleStar = function() {
  this.isStarred = !this.isStarred;
  return this.save();
};

messageSchema.methods.toggleFlag = function() {
  this.isFlagged = !this.isFlagged;
  return this.save();
};

messageSchema.methods.addNote = function(note) {
  this.internalNotes.push({
    note,
    addedAt: new Date()
  });
  return this.save();
};

// Static methods
messageSchema.statics.getUnread = function() {
  return this.find({ status: 'Unread', isSpam: false }).sort({ createdAt: -1 });
};

messageSchema.statics.getByStatus = function(status) {
  return this.find({ status, isSpam: false }).sort({ createdAt: -1 });
};

messageSchema.statics.getByCategory = function(category) {
  return this.find({ category, isSpam: false }).sort({ createdAt: -1 });
};

messageSchema.statics.getStarred = function() {
  return this.find({ isStarred: true, isSpam: false }).sort({ createdAt: -1 });
};

messageSchema.statics.getFlagged = function() {
  return this.find({ isFlagged: true, isSpam: false }).sort({ createdAt: -1 });
};

messageSchema.statics.getSpam = function() {
  return this.find({ isSpam: true }).sort({ createdAt: -1 });
};

messageSchema.statics.search = function(query) {
  return this.find({
    $and: [
      { isSpam: false },
      {
        $or: [
          { name: { $regex: query, $options: 'i' } },
          { email: { $regex: query, $options: 'i' } },
          { subject: { $regex: query, $options: 'i' } },
          { message: { $regex: query, $options: 'i' } }
        ]
      }
    ]
  }).sort({ createdAt: -1 });
};

const Message = mongoose.model('Message', messageSchema);

export default Message;
