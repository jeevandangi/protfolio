import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Ensure upload directories exist
const uploadsDir = path.join(__dirname, '../../uploads');
const profileImagesDir = path.join(uploadsDir, 'profile-images');
const resumesDir = path.join(uploadsDir, 'resumes');

// Create directories if they don't exist
[uploadsDir, profileImagesDir, resumesDir].forEach(dir => {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
});

// Storage configuration for profile images
const profileImageStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, profileImagesDir);
  },
  filename: (req, file, cb) => {
    // Generate unique filename with timestamp
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const extension = path.extname(file.originalname);
    cb(null, `profile-${uniqueSuffix}${extension}`);
  }
});

// Storage configuration for resumes
const resumeStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, resumesDir);
  },
  filename: (req, file, cb) => {
    // Generate unique filename with timestamp
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, `resume-${uniqueSuffix}.pdf`);
  }
});

// File filter for profile images
const imageFileFilter = (req, file, cb) => {
  // Check if file is an image
  if (file.mimetype.startsWith('image/')) {
    // Allow common image formats
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Invalid image format. Only JPEG, PNG, GIF, and WebP are allowed.'), false);
    }
  } else {
    cb(new Error('Only image files are allowed.'), false);
  }
};

// File filter for resumes
const resumeFileFilter = (req, file, cb) => {
  // Check if file is a PDF
  if (file.mimetype === 'application/pdf') {
    cb(null, true);
  } else {
    cb(new Error('Only PDF files are allowed for resumes.'), false);
  }
};

// Multer configuration for profile images
export const uploadProfileImage = multer({
  storage: profileImageStorage,
  fileFilter: imageFileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB limit
    files: 1 // Only one file at a time
  }
}).single('profileImage');

// Multer configuration for resumes
export const uploadResume = multer({
  storage: resumeStorage,
  fileFilter: resumeFileFilter,
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB limit
    files: 1 // Only one file at a time
  }
}).single('resume');

// Error handling middleware for multer
export const handleUploadError = (error, req, res, next) => {
  if (error instanceof multer.MulterError) {
    let message = 'File upload error';
    
    switch (error.code) {
      case 'LIMIT_FILE_SIZE':
        message = 'File size too large';
        break;
      case 'LIMIT_FILE_COUNT':
        message = 'Too many files';
        break;
      case 'LIMIT_UNEXPECTED_FILE':
        message = 'Unexpected file field';
        break;
      default:
        message = error.message;
    }
    
    return res.status(400).json({
      success: false,
      message,
      code: 'UPLOAD_ERROR'
    });
  }
  
  if (error) {
    return res.status(400).json({
      success: false,
      message: error.message,
      code: 'FILE_ERROR'
    });
  }
  
  next();
};

// Helper function to delete old files
export const deleteFile = (filePath) => {
  try {
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
      return true;
    }
  } catch (error) {
    console.error('Error deleting file:', error);
  }
  return false;
};

// Helper function to get file URL
export const getFileUrl = (filename, type = 'profile-image') => {
  const baseUrl = process.env.BASE_URL || 'http://localhost:8000';
  return `${baseUrl}/uploads/${type === 'resume' ? 'resumes' : 'profile-images'}/${filename}`;
};
