import mongoose from 'mongoose';

const profileSchema = new mongoose.Schema({
  // Hero Section Data
  name: {
    type: String,
    required: true,
    default: 'Jeevan Dangi'
  },
  title: {
    type: String,
    required: true,
    default: 'Full Stack Developer'
  },
  subtitle: {
    type: String,
    default: 'Full Stack Developer & Digital Innovator'
  },
  greeting: {
    type: String,
    default: "Hi, I'm Jeevan Dangi 👋"
  },
  typewriterTexts: [{
    type: String,
    default: ['Full Stack Developer', 'MERN Stack Engineer', 'React UI Specialist', 'Node.js Backend Builder']
  }],
  description: {
    type: String,
    required: true,
    default: 'I craft beautiful, scalable, and innovative web applications using modern technologies and best practices.'
  },
  
  // About Section Data
  bio: {
    type: String,
    required: true,
    default: "I'm a dedicated Full Stack Developer with a passion for creating innovative digital solutions. With expertise in modern web technologies, I transform ideas into powerful, scalable applications that make a real impact."
  },
  bioExtended: {
    type: String,
    default: "My journey in tech is driven by curiosity and a commitment to continuous learning. I believe in writing clean, efficient code and creating user experiences that truly matter."
  },
  profileImage: {
    type: String,
    default: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop&crop=face'
  },
  
  // Contact Information
  email: {
    type: String,
    required: true,
    default: 'jeevan.dangi@example.com'
  },
  phone: {
    type: String,
    default: '+1 (555) 123-4567'
  },
  location: {
    type: String,
    default: 'San Francisco, CA'
  },
  
  // Social Links
  socialLinks: {
    github: {
      type: String,
      default: 'https://github.com/jeevan'
    },
    linkedin: {
      type: String,
      default: 'https://linkedin.com/in/jeevan'
    },
    twitter: {
      type: String,
      default: 'https://twitter.com/jeevan'
    }
  },
  
  // Resume
  resumeUrl: {
    type: String,
    default: '/resume.pdf'
  },
  
  // Terminal Code Display
  terminalCommands: [{
    command: String,
    output: String,
    type: {
      type: String,
      enum: ['command', 'output', 'json'],
      default: 'command'
    }
  }],
  
  // SEO Data
  seo: {
    title: {
      type: String,
      default: 'Jeevan Dangi - Full Stack Developer Portfolio'
    },
    description: {
      type: String,
      default: 'Full Stack Developer specializing in React, Node.js, and modern web technologies. View my projects and get in touch for collaboration.'
    },
    keywords: [{
      type: String,
      default: ['Full Stack Developer', 'React', 'Node.js', 'JavaScript', 'Web Development', 'MERN Stack']
    }]
  },
  
  // Status
  isActive: {
    type: Boolean,
    default: true
  },
  
  // Analytics
  views: {
    type: Number,
    default: 0
  },
  lastUpdated: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

// Default terminal commands
profileSchema.pre('save', function(next) {
  if (this.isNew && (!this.terminalCommands || this.terminalCommands.length === 0)) {
    this.terminalCommands = [
      {
        command: 'whoami',
        output: 'Jeevan Dangi - Full Stack Developer',
        type: 'command'
      },
      {
        command: 'cat skills.json',
        output: '{\n  "frontend": ["React", "Next.js", "TypeScript"],\n  "backend": ["Node.js", "Express", "MongoDB"],\n  "tools": ["Git", "Docker", "AWS"]\n}',
        type: 'json'
      },
      {
        command: 'npm start',
        output: '✓ Portfolio server running on port 3000',
        type: 'output'
      }
    ];
  }
  next();
});

// Instance method to increment views
profileSchema.methods.incrementViews = function() {
  this.views += 1;
  this.lastUpdated = new Date();
  return this.save();
};

// Static method to get active profile
profileSchema.statics.getActiveProfile = function() {
  return this.findOne({ isActive: true });
};

const Profile = mongoose.model('Profile', profileSchema);

export default Profile;
