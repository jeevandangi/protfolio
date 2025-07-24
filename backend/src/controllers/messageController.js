import Message from '../models/Message.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { ApiResponse } from '../utils/ApiResponse.js';
import { ApiError } from '../utils/ApiError.js';

// @desc    Create new message (Contact form submission)
// @route   POST /api/messages
// @access  Public
const createMessage = asyncHandler(async (req, res) => {
  const { name, email, subject, message, phone, company, website } = req.body;

  // Get client info
  const ipAddress = req.ip || req.connection.remoteAddress;
  const userAgent = req.get('User-Agent');
  const referrer = req.get('Referrer');

  const newMessage = await Message.create({
    name,
    email,
    subject,
    message,
    phone,
    company,
    website,
    ipAddress,
    userAgent,
    referrer
  });

  res.status(201).json(
    new ApiResponse(201, {
      id: newMessage._id,
      name: newMessage.name,
      email: newMessage.email,
      subject: newMessage.subject,
      createdAt: newMessage.createdAt
    }, 'Message sent successfully! I\'ll get back to you soon.')
  );
});

// @desc    Get all messages for admin
// @route   GET /api/admin/messages
// @access  Private (Admin)
const getAdminMessages = asyncHandler(async (req, res) => {
  const {
    page = 1,
    limit = 10,
    status,
    category,
    priority,
    starred,
    flagged,
    search,
    sortBy = 'createdAt',
    sortOrder = 'desc'
  } = req.query;

  let query = { isSpam: false };

  if (status) query.status = status;
  if (category) query.category = category;
  if (priority) query.priority = priority;
  if (starred !== undefined) query.isStarred = starred === 'true';
  if (flagged !== undefined) query.isFlagged = flagged === 'true';

  if (search) {
    query.$or = [
      { name: { $regex: search, $options: 'i' } },
      { email: { $regex: search, $options: 'i' } },
      { subject: { $regex: search, $options: 'i' } },
      { message: { $regex: search, $options: 'i' } }
    ];
  }

  const sortOptions = {};
  sortOptions[sortBy] = sortOrder === 'desc' ? -1 : 1;

  const messages = await Message.find(query)
    .sort(sortOptions)
    .limit(limit * 1)
    .skip((page - 1) * limit);

  const total = await Message.countDocuments(query);

  // Get counts for different statuses
  const counts = await Message.aggregate([
    { $match: { isSpam: false } },
    {
      $group: {
        _id: '$status',
        count: { $sum: 1 }
      }
    }
  ]);

  const statusCounts = counts.reduce((acc, item) => {
    acc[item._id] = item.count;
    return acc;
  }, {});

  res.status(200).json(
    new ApiResponse(200, {
      messages,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / limit)
      },
      counts: statusCounts
    }, 'Messages retrieved successfully')
  );
});

// @desc    Get single message
// @route   GET /api/admin/messages/:id
// @access  Private (Admin)
const getMessage = asyncHandler(async (req, res) => {
  const message = await Message.findById(req.params.id);

  if (!message) {
    throw new ApiError(404, 'Message not found');
  }

  // Mark as read if it's unread
  if (message.status === 'Unread') {
    await message.markAsRead();
  }

  res.status(200).json(
    new ApiResponse(200, message, 'Message retrieved successfully')
  );
});

// @desc    Update message status
// @route   PATCH /api/admin/messages/:id/status
// @access  Private (Admin)
const updateMessageStatus = asyncHandler(async (req, res) => {
  const { status } = req.body;

  if (!['Unread', 'Read', 'Replied', 'Archived', 'Spam'].includes(status)) {
    throw new ApiError(400, 'Invalid status');
  }

  const message = await Message.findById(req.params.id);

  if (!message) {
    throw new ApiError(404, 'Message not found');
  }

  message.status = status;
  if (status === 'Read' && !message.readAt) {
    message.readAt = new Date();
  }

  await message.save();

  res.status(200).json(
    new ApiResponse(200, message, 'Message status updated successfully')
  );
});

// @desc    Reply to message
// @route   POST /api/admin/messages/:id/reply
// @access  Private (Admin)
const replyToMessage = asyncHandler(async (req, res) => {
  const { subject, message: replyMessage, sentBy = 'Jeevan Dangi' } = req.body;

  if (!subject || !replyMessage) {
    throw new ApiError(400, 'Subject and message are required');
  }

  const message = await Message.findById(req.params.id);

  if (!message) {
    throw new ApiError(404, 'Message not found');
  }

  await message.addReply(subject, replyMessage, sentBy);

  res.status(200).json(
    new ApiResponse(200, message, 'Reply sent successfully')
  );
});

// @desc    Toggle star status
// @route   PATCH /api/admin/messages/:id/star
// @access  Private (Admin)
const toggleStar = asyncHandler(async (req, res) => {
  const message = await Message.findById(req.params.id);

  if (!message) {
    throw new ApiError(404, 'Message not found');
  }

  await message.toggleStar();

  res.status(200).json(
    new ApiResponse(200, message, `Message ${message.isStarred ? 'starred' : 'unstarred'} successfully`)
  );
});

// @desc    Toggle flag status
// @route   PATCH /api/admin/messages/:id/flag
// @access  Private (Admin)
const toggleFlag = asyncHandler(async (req, res) => {
  const message = await Message.findById(req.params.id);

  if (!message) {
    throw new ApiError(404, 'Message not found');
  }

  await message.toggleFlag();

  res.status(200).json(
    new ApiResponse(200, message, `Message ${message.isFlagged ? 'flagged' : 'unflagged'} successfully`)
  );
});

// @desc    Add internal note
// @route   POST /api/admin/messages/:id/notes
// @access  Private (Admin)
const addNote = asyncHandler(async (req, res) => {
  const { note } = req.body;

  if (!note) {
    throw new ApiError(400, 'Note is required');
  }

  const message = await Message.findById(req.params.id);

  if (!message) {
    throw new ApiError(404, 'Message not found');
  }

  await message.addNote(note);

  res.status(200).json(
    new ApiResponse(200, message, 'Note added successfully')
  );
});

// @desc    Delete message
// @route   DELETE /api/admin/messages/:id
// @access  Private (Admin)
const deleteMessage = asyncHandler(async (req, res) => {
  const message = await Message.findById(req.params.id);

  if (!message) {
    throw new ApiError(404, 'Message not found');
  }

  await message.deleteOne();

  res.status(200).json(
    new ApiResponse(200, null, 'Message deleted successfully')
  );
});

// @desc    Bulk update messages
// @route   PATCH /api/admin/messages/bulk
// @access  Private (Admin)
const bulkUpdateMessages = asyncHandler(async (req, res) => {
  const { messageIds, action, value } = req.body;

  if (!Array.isArray(messageIds) || messageIds.length === 0) {
    throw new ApiError(400, 'Message IDs array is required');
  }

  let updateQuery = {};

  switch (action) {
    case 'status':
      updateQuery.status = value;
      break;
    case 'star':
      updateQuery.isStarred = value;
      break;
    case 'flag':
      updateQuery.isFlagged = value;
      break;
    case 'category':
      updateQuery.category = value;
      break;
    case 'priority':
      updateQuery.priority = value;
      break;
    default:
      throw new ApiError(400, 'Invalid action');
  }

  await Message.updateMany(
    { _id: { $in: messageIds } },
    updateQuery
  );

  res.status(200).json(
    new ApiResponse(200, null, 'Messages updated successfully')
  );
});

// @desc    Get message analytics
// @route   GET /api/admin/messages/analytics
// @access  Private (Admin)
const getMessageAnalytics = asyncHandler(async (req, res) => {
  const analytics = await Message.aggregate([
    {
      $group: {
        _id: null,
        totalMessages: { $sum: 1 },
        unreadCount: {
          $sum: { $cond: [{ $eq: ['$status', 'Unread'] }, 1, 0] }
        },
        repliedCount: {
          $sum: { $cond: [{ $eq: ['$status', 'Replied'] }, 1, 0] }
        },
        starredCount: {
          $sum: { $cond: ['$isStarred', 1, 0] }
        },
        spamCount: {
          $sum: { $cond: ['$isSpam', 1, 0] }
        }
      }
    }
  ]);

  const categoryStats = await Message.aggregate([
    { $match: { isSpam: false } },
    {
      $group: {
        _id: '$category',
        count: { $sum: 1 }
      }
    }
  ]);

  const monthlyStats = await Message.aggregate([
    { $match: { isSpam: false } },
    {
      $group: {
        _id: {
          year: { $year: '$createdAt' },
          month: { $month: '$createdAt' }
        },
        count: { $sum: 1 }
      }
    },
    { $sort: { '_id.year': -1, '_id.month': -1 } },
    { $limit: 12 }
  ]);

  res.status(200).json(
    new ApiResponse(200, {
      overview: analytics[0] || {},
      categoryStats,
      monthlyStats
    }, 'Message analytics retrieved successfully')
  );
});

export {
  createMessage,
  getAdminMessages,
  getMessage,
  updateMessageStatus,
  replyToMessage,
  toggleStar,
  toggleFlag,
  addNote,
  deleteMessage,
  bulkUpdateMessages,
  getMessageAnalytics
};
