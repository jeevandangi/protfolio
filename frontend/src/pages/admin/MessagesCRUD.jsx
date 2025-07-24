import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  FaEnvelope,
  FaReply,
  FaTrash,
  FaEye,
  FaSearch,
  FaTimes,
  FaUser,
  FaCalendar,
  FaCheck,
  FaExclamationTriangle,
  FaFilter,
  FaSort,
  FaArchive,
  FaStar,
  FaFlag
} from 'react-icons/fa';
import { HiSparkles, HiLightningBolt } from 'react-icons/hi';
import { apiResponseHandler } from '../../utils/apiResponse';
import LoadingSpinner from '../../components/LoadingSpinner';
import ErrorDisplay from '../../components/ErrorDisplay';

const MessagesCRUD = () => {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchMessages();
  }, []);

  const fetchMessages = async () => {
    try {
      setLoading(true);
      const response = await apiResponseHandler('/messages/admin');
      if (response?.data?.success) {
        const messagesData = Array.isArray(response.data.data) ? response.data.data : [];
        setMessages(messagesData);
      } else {
        setError('Failed to load messages');
        setMessages([]); // Ensure messages is always an array
      }
    } catch (error) {
      console.error('Messages fetch error:', error);
      setError('Failed to connect to server');
      setMessages([]); // Ensure messages is always an array
    } finally {
      setLoading(false);
    }
  };

  const updateMessageStatus = async (messageId, status) => {
    try {
      const response = await apiResponseHandler(`/messages/admin/${messageId}/status`, 'PATCH', { status });
      if (response?.data?.success) {
        await fetchMessages();
      } else {
        setError('Failed to update message status');
      }
    } catch (error) {
      console.error('Message status update error:', error);
      setError('Failed to update message status');
    }
  };

  const deleteMessage = async (messageId) => {
    if (!confirm('Are you sure you want to delete this message?')) return;

    try {
      const response = await apiResponseHandler(`/messages/admin/${messageId}`, 'DELETE');
      if (response?.data?.success) {
        await fetchMessages();
      } else {
        setError('Failed to delete message');
      }
    } catch (error) {
      console.error('Message delete error:', error);
      setError('Failed to delete message');
    }
  };

  const [filteredMessages, setFilteredMessages] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [selectedPriority, setSelectedPriority] = useState('all');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [sortBy, setSortBy] = useState('createdAt');
  const [sortOrder, setSortOrder] = useState('desc');
  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState('');
  const [selectedMessage, setSelectedMessage] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(5);

  // Filter and search functionality
  useEffect(() => {
    let filtered = messages.filter(message => {
      const matchesSearch = message.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        message.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        message.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
        message.message.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesStatus = selectedStatus === 'all' || message.status === selectedStatus;
      const matchesPriority = selectedPriority === 'all' || message.priority === selectedPriority;
      const matchesCategory = selectedCategory === 'all' || message.category === selectedCategory;

      return matchesSearch && matchesStatus && matchesPriority && matchesCategory;
    });

    // Sort messages
    filtered.sort((a, b) => {
      let aValue = a[sortBy];
      let bValue = b[sortBy];

      if (sortBy === 'createdAt') {
        aValue = new Date(aValue);
        bValue = new Date(bValue);
      }

      if (sortOrder === 'asc') {
        return aValue > bValue ? 1 : -1;
      } else {
        return aValue < bValue ? 1 : -1;
      }
    });

    setFilteredMessages(filtered);
    setCurrentPage(1);
  }, [messages, searchTerm, selectedStatus, selectedPriority, selectedCategory, sortBy, sortOrder]);

  // Pagination
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentMessages = filteredMessages.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredMessages.length / itemsPerPage);

  const openModal = (type, message = null) => {
    setModalType(type);
    setSelectedMessage(message);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setSelectedMessage(null);
    setModalType('');
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this message?')) return;

    try {
      const response = await apiResponseHandler(`/messages/admin/${id}`, 'DELETE');
      if (response?.data?.success) {
        await fetchMessages();
        setSuccess('Message deleted successfully');
      } else {
        setError('Failed to delete message');
      }
    } catch (error) {
      console.error('Message delete error:', error);
      setError('Failed to delete message');
    }
  };

  const handleUpdateStatus = async (id, status) => {
    try {
      const response = await apiResponseHandler(`/messages/admin/${id}/status`, 'PATCH', { status });
      if (response?.data?.success) {
        await fetchMessages();
        setSuccess('Message status updated');
      } else {
        setError('Failed to update message status');
      }
    } catch (error) {
      console.error('Message status update error:', error);
      setError('Failed to update message status');
    }
  };

  const handleToggleStar = async (id) => {
    try {
      const response = await apiResponseHandler(`/messages/admin/${id}/star`, 'PATCH');
      if (response?.data?.success) {
        await fetchMessages();
      } else {
        setError('Failed to toggle star');
      }
    } catch (error) {
      console.error('Message star toggle error:', error);
      setError('Failed to toggle star');
    }
  };

  const handleToggleFlag = async (id) => {
    try {
      const response = await apiResponseHandler(`/messages/admin/${id}/flag`, 'PATCH');
      if (response?.data?.success) {
        await fetchMessages();
      } else {
        setError('Failed to toggle flag');
      }
    } catch (error) {
      console.error('Message flag toggle error:', error);
      setError('Failed to toggle flag');
    }
  };

  const handleStatusChange = (id, newStatus) => {
    setMessages(messages.map(message =>
      message.id === id ? { ...message, status: newStatus } : message
    ));
  };

  const handleStar = (id) => {
    setMessages(messages.map(message =>
      message.id === id ? { ...message, starred: !message.starred } : message
    ));
  };

  const handleFlag = (id) => {
    setMessages(messages.map(message =>
      message.id === id ? { ...message, flagged: !message.flagged } : message
    ));
  };

  const statuses = ['all', 'Unread', 'Read'];
  const priorities = ['all', 'High', 'Medium', 'Low'];
  const categories = ['all', 'Business', 'Job Offer', 'Freelance', 'Partnership', 'Speaking', 'Nonprofit'];

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'High': return 'text-red-300 bg-red-500/20 border-red-400/30';
      case 'Medium': return 'text-yellow-300 bg-yellow-500/20 border-yellow-400/30';
      case 'Low': return 'text-green-300 bg-green-500/20 border-green-400/30';
      default: return 'text-gray-300 bg-gray-500/20 border-gray-400/30';
    }
  };

  const getCategoryColor = (category) => {
    const colors = {
      'Business': 'text-blue-300 bg-blue-500/20 border-blue-400/30',
      'Job Offer': 'text-purple-300 bg-purple-500/20 border-purple-400/30',
      'Freelance': 'text-cyan-300 bg-cyan-500/20 border-cyan-400/30',
      'Partnership': 'text-pink-300 bg-pink-500/20 border-pink-400/30',
      'Speaking': 'text-orange-300 bg-orange-500/20 border-orange-400/30',
      'Nonprofit': 'text-emerald-300 bg-emerald-500/20 border-emerald-400/30'
    };
    return colors[category] || 'text-gray-300 bg-gray-500/20 border-gray-400/30';
  };

  return (
    <div className="p-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-4xl font-black text-white mb-2">
            Messages{' '}
            <span className="bg-gradient-to-r from-blue-400 via-cyan-400 to-purple-400 bg-clip-text text-transparent">
              Management
            </span>
          </h1>
          <p className="text-xl text-gray-300">Manage contact form submissions and communications</p>
        </div>
        <div className="flex gap-4">
          <motion.button
            whileHover={{ scale: 1.05, y: -2 }}
            whileTap={{ scale: 0.98 }}
            className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-500 hover:to-emerald-500 text-white px-6 py-3 rounded-xl font-semibold flex items-center gap-2 shadow-lg"
          >
            <FaCheck className="text-lg" />
            <span>Mark All Read</span>
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.05, y: -2 }}
            whileTap={{ scale: 0.98 }}
            className="bg-gradient-to-r from-gray-600 to-gray-700 hover:from-gray-500 hover:to-gray-600 text-white px-6 py-3 rounded-xl font-semibold flex items-center gap-2 shadow-lg"
          >
            <FaArchive className="text-lg" />
            <span>Archive Selected</span>
          </motion.button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        {[
          { label: 'Total Messages', value: messages.length, icon: FaEnvelope, color: 'from-blue-500 to-cyan-500' },
          { label: 'Unread', value: messages.filter(m => m.status === 'Unread').length, icon: FaExclamationTriangle, color: 'from-red-500 to-pink-500' },
          { label: 'Starred', value: messages.filter(m => m.starred).length, icon: FaStar, color: 'from-yellow-500 to-orange-500' },
          { label: 'High Priority', value: messages.filter(m => m.priority === 'High').length, icon: FaFlag, color: 'from-purple-500 to-indigo-500' }
        ].map((stat, index) => {
          const IconComponent = stat.icon;
          return (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ y: -5 }}
              className="bg-gradient-to-br from-gray-900/90 to-gray-800/90 backdrop-blur-xl border border-gray-700/50 rounded-2xl p-6"
            >
              <div className="flex items-center justify-between mb-4">
                <div className={`w-12 h-12 bg-gradient-to-r ${stat.color} rounded-xl flex items-center justify-center`}>
                  <IconComponent className="text-white text-xl" />
                </div>
                <span className="text-3xl font-bold text-white">{stat.value}</span>
              </div>
              <h3 className="text-gray-300 font-medium">{stat.label}</h3>
            </motion.div>
          );
        })}
      </div>

      {/* Filters and Search */}
      <div className="bg-gradient-to-br from-gray-900/90 to-gray-800/90 backdrop-blur-xl border border-gray-700/50 rounded-2xl p-6 mb-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4">
          {/* Search */}
          <div className="lg:col-span-2 relative">
            <FaSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search messages..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-4 py-3 bg-gray-800/50 border border-gray-600/50 rounded-xl text-white placeholder-gray-400 focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/20 transition-all duration-300"
            />
          </div>

          {/* Status Filter */}
          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="px-4 py-3 bg-gray-800/50 border border-gray-600/50 rounded-xl text-white focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/20 transition-all duration-300"
          >
            {statuses.map(status => (
              <option key={status} value={status}>
                {status === 'all' ? 'All Status' : status}
              </option>
            ))}
          </select>

          {/* Priority Filter */}
          <select
            value={selectedPriority}
            onChange={(e) => setSelectedPriority(e.target.value)}
            className="px-4 py-3 bg-gray-800/50 border border-gray-600/50 rounded-xl text-white focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/20 transition-all duration-300"
          >
            {priorities.map(priority => (
              <option key={priority} value={priority}>
                {priority === 'all' ? 'All Priority' : priority}
              </option>
            ))}
          </select>

          {/* Category Filter */}
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="px-4 py-3 bg-gray-800/50 border border-gray-600/50 rounded-xl text-white focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/20 transition-all duration-300"
          >
            {categories.map(category => (
              <option key={category} value={category}>
                {category === 'all' ? 'All Categories' : category}
              </option>
            ))}
          </select>

          {/* Sort */}
          <div className="flex gap-2">
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="flex-1 px-4 py-3 bg-gray-800/50 border border-gray-600/50 rounded-xl text-white focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/20 transition-all duration-300"
            >
              <option value="createdAt">Date</option>
              <option value="name">Name</option>
              <option value="subject">Subject</option>
              <option value="priority">Priority</option>
            </select>
            <motion.button
              onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
              whileHover={{ scale: 1.05 }}
              className="px-4 py-3 bg-gray-700 text-white rounded-xl hover:bg-gray-600 transition-colors"
            >
              <FaSort className={`transform ${sortOrder === 'desc' ? 'rotate-180' : ''} transition-transform`} />
            </motion.button>
          </div>
        </div>
      </div>

      {/* Messages List */}
      <div className="space-y-4 mb-8">
        <AnimatePresence>
          {currentMessages.map((message, index) => (
            <motion.div
              key={message.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ y: -2 }}
              className={`bg-gradient-to-br from-gray-900/90 to-gray-800/90 backdrop-blur-xl border rounded-2xl p-6 hover:border-cyan-400/50 transition-all duration-500 ${message.status === 'Unread'
                ? 'border-cyan-400/30 shadow-lg shadow-cyan-500/10'
                : 'border-gray-700/50'
                }`}
              style={{
                boxShadow: message.status === 'Unread'
                  ? '0 25px 50px rgba(0,0,0,0.5), 0 0 30px rgba(34, 211, 238, 0.1)'
                  : '0 10px 30px rgba(0,0,0,0.3)'
              }}
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-full flex items-center justify-center">
                    <span className="text-white font-bold text-lg">
                      {message.name.charAt(0)}
                    </span>
                  </div>
                  <div>
                    <div className="flex items-center gap-3 mb-1">
                      <h4 className="text-white font-semibold">{message.name}</h4>
                      {message.starred && (
                        <FaStar className="text-yellow-400 text-sm" />
                      )}
                      {message.flagged && (
                        <FaFlag className="text-red-400 text-sm" />
                      )}
                      {message.replied && (
                        <FaReply className="text-green-400 text-sm" />
                      )}
                    </div>
                    <p className="text-gray-400 text-sm">{message.email}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${getPriorityColor(message.priority)}`}>
                    {message.priority}
                  </span>
                  <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${getCategoryColor(message.category)}`}>
                    {message.category}
                  </span>
                  <span className={`px-3 py-1 rounded-full text-xs font-semibold ${message.status === 'Unread'
                    ? 'bg-red-500/20 text-red-300 border border-red-400/30'
                    : 'bg-green-500/20 text-green-300 border border-green-400/30'
                    }`}>
                    {message.status}
                  </span>
                  <span className="text-gray-400 text-sm">{message.createdAt}</span>
                </div>
              </div>

              <div className="mb-4">
                <h5 className="text-white font-medium mb-2 flex items-center gap-2">
                  <FaEnvelope className="text-cyan-400 text-sm" />
                  {message.subject}
                </h5>
                <p className="text-gray-300 line-clamp-3">{message.message}</p>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex gap-3">
                  <motion.button
                    onClick={() => openModal('view', message)}
                    whileHover={{ scale: 1.05 }}
                    className="px-4 py-2 bg-gradient-to-r from-cyan-600 to-blue-600 text-white rounded-lg font-medium text-sm hover:from-cyan-500 hover:to-blue-500 transition-colors flex items-center gap-2"
                  >
                    <FaEye />
                    View
                  </motion.button>
                  <motion.button
                    onClick={() => openModal('reply', message)}
                    whileHover={{ scale: 1.05 }}
                    className="px-4 py-2 bg-green-600 text-white rounded-lg font-medium text-sm hover:bg-green-500 transition-colors flex items-center gap-2"
                  >
                    <FaReply />
                    Reply
                  </motion.button>
                  {message.status === 'Unread' ? (
                    <motion.button
                      onClick={() => handleStatusChange(message.id, 'Read')}
                      whileHover={{ scale: 1.05 }}
                      className="px-4 py-2 bg-gray-700 text-white rounded-lg font-medium text-sm hover:bg-gray-600 transition-colors flex items-center gap-2"
                    >
                      <FaCheck />
                      Mark Read
                    </motion.button>
                  ) : (
                    <motion.button
                      onClick={() => handleStatusChange(message.id, 'Unread')}
                      whileHover={{ scale: 1.05 }}
                      className="px-4 py-2 bg-gray-700 text-white rounded-lg font-medium text-sm hover:bg-gray-600 transition-colors flex items-center gap-2"
                    >
                      <FaEnvelope />
                      Mark Unread
                    </motion.button>
                  )}
                </div>

                <div className="flex gap-2">
                  <motion.button
                    onClick={() => handleToggleStar(message._id)}
                    whileHover={{ scale: 1.1 }}
                    className={`p-2 rounded-lg transition-colors ${message.isStarred
                      ? 'text-yellow-400 hover:bg-yellow-500/20'
                      : 'text-gray-400 hover:bg-gray-700 hover:text-yellow-400'
                      }`}
                  >
                    <FaStar />
                  </motion.button>
                  <motion.button
                    onClick={() => handleToggleFlag(message._id)}
                    whileHover={{ scale: 1.1 }}
                    className={`p-2 rounded-lg transition-colors ${message.isFlagged
                      ? 'text-red-400 hover:bg-red-500/20'
                      : 'text-gray-400 hover:bg-gray-700 hover:text-red-400'
                      }`}
                  >
                    <FaFlag />
                  </motion.button>
                  <motion.button
                    onClick={() => handleDelete(message._id)}
                    whileHover={{ scale: 1.1 }}
                    className="p-2 text-red-400 hover:bg-red-500/20 rounded-lg transition-colors"
                  >
                    <FaTrash />
                  </motion.button>
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center items-center gap-4 mb-8">
          <motion.button
            onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
            whileHover={{ scale: currentPage === 1 ? 1 : 1.05 }}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${currentPage === 1
              ? 'bg-gray-700 text-gray-500 cursor-not-allowed'
              : 'bg-gray-700 text-white hover:bg-gray-600'
              }`}
          >
            Previous
          </motion.button>

          <div className="flex gap-2">
            {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
              <motion.button
                key={page}
                onClick={() => setCurrentPage(page)}
                whileHover={{ scale: 1.1 }}
                className={`w-10 h-10 rounded-lg font-medium transition-colors ${currentPage === page
                  ? 'bg-gradient-to-r from-cyan-600 to-blue-600 text-white'
                  : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                  }`}
              >
                {page}
              </motion.button>
            ))}
          </div>

          <motion.button
            onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
            disabled={currentPage === totalPages}
            whileHover={{ scale: currentPage === totalPages ? 1 : 1.05 }}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${currentPage === totalPages
              ? 'bg-gray-700 text-gray-500 cursor-not-allowed'
              : 'bg-gray-700 text-white hover:bg-gray-600'
              }`}
          >
            Next
          </motion.button>
        </div>
      )}

      {/* Message Modal */}
      <AnimatePresence>
        {showModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50"
            onClick={closeModal}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-gradient-to-br from-gray-900/95 to-gray-800/95 backdrop-blur-xl border border-gray-700/50 rounded-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto"
            >
              {modalType === 'view' ? (
                <MessageViewer message={selectedMessage} onClose={closeModal} />
              ) : modalType === 'reply' ? (
                <ReplyForm message={selectedMessage} onClose={closeModal} />
              ) : null}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

// Message Viewer Component
const MessageViewer = ({ message, onClose }) => {
  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-white">Message Details</h2>
        <motion.button
          whileHover={{ scale: 1.1 }}
          onClick={onClose}
          className="p-2 text-gray-400 hover:text-white hover:bg-gray-700 rounded-lg transition-colors"
        >
          <FaTimes />
        </motion.button>
      </div>

      <div className="space-y-6">
        {/* Message Header */}
        <div className="bg-gray-800/30 rounded-xl p-6">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-16 h-16 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-full flex items-center justify-center">
              <span className="text-white font-bold text-2xl">
                {message?.name.charAt(0)}
              </span>
            </div>
            <div>
              <h3 className="text-xl font-bold text-white">{message?.name}</h3>
              <p className="text-gray-400">{message?.email}</p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-400">Status:</span>
              <span className={`${message?.status === 'Unread' ? 'text-red-300' : 'text-green-300'
                }`}>{message?.status}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">Priority:</span>
              <span className="text-white">{message?.priority}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">Category:</span>
              <span className="text-white">{message?.category}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">Date:</span>
              <span className="text-white">{message?.createdAt}</span>
            </div>
          </div>
        </div>

        {/* Subject */}
        <div>
          <h4 className="text-lg font-semibold text-white mb-2">Subject</h4>
          <p className="text-gray-300 bg-gray-800/30 rounded-xl p-4">{message?.subject}</p>
        </div>

        {/* Message Content */}
        <div>
          <h4 className="text-lg font-semibold text-white mb-2">Message</h4>
          <div className="text-gray-300 bg-gray-800/30 rounded-xl p-6 leading-relaxed whitespace-pre-wrap">
            {message?.message}
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-4 pt-4">
          <motion.button
            whileHover={{ scale: 1.05 }}
            className="flex-1 bg-gradient-to-r from-cyan-600 to-blue-600 text-white py-3 rounded-xl font-semibold flex items-center justify-center gap-2"
          >
            <FaReply />
            Reply to Message
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.05 }}
            className="px-8 py-3 bg-gray-700 text-white rounded-xl font-semibold hover:bg-gray-600 transition-colors"
          >
            Mark as Read
          </motion.button>
        </div>
      </div>
    </div>
  );
};

// Reply Form Component
const ReplyForm = ({ message, onClose }) => {
  const [replyData, setReplyData] = useState({
    to: message?.email || '',
    subject: `Re: ${message?.subject || ''}`,
    message: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setReplyData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle reply submission here
    console.log('Reply sent:', replyData);
    onClose();
  };

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-white">Reply to {message?.name}</h2>
        <motion.button
          whileHover={{ scale: 1.1 }}
          onClick={onClose}
          className="p-2 text-gray-400 hover:text-white hover:bg-gray-700 rounded-lg transition-colors"
        >
          <FaTimes />
        </motion.button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">To</label>
            <input
              type="email"
              name="to"
              value={replyData.to}
              onChange={handleChange}
              className="w-full px-4 py-3 bg-gray-800/50 border border-gray-600/50 rounded-xl text-white placeholder-gray-400 focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/20 transition-all duration-300"
              readOnly
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Subject</label>
            <input
              type="text"
              name="subject"
              value={replyData.subject}
              onChange={handleChange}
              className="w-full px-4 py-3 bg-gray-800/50 border border-gray-600/50 rounded-xl text-white placeholder-gray-400 focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/20 transition-all duration-300"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">Message</label>
          <textarea
            name="message"
            value={replyData.message}
            onChange={handleChange}
            rows={12}
            className="w-full px-4 py-3 bg-gray-800/50 border border-gray-600/50 rounded-xl text-white placeholder-gray-400 focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/20 transition-all duration-300 resize-none"
            placeholder="Type your reply here..."
            required
          />
        </div>

        <div className="flex gap-4">
          <motion.button
            type="submit"
            whileHover={{ scale: 1.02 }}
            className="flex-1 bg-gradient-to-r from-cyan-600 to-blue-600 text-white py-3 rounded-xl font-semibold flex items-center justify-center gap-2"
          >
            <FaReply />
            Send Reply
          </motion.button>
          <motion.button
            type="button"
            onClick={onClose}
            whileHover={{ scale: 1.02 }}
            className="px-8 py-3 bg-gray-700 text-white rounded-xl font-semibold hover:bg-gray-600 transition-colors"
          >
            Cancel
          </motion.button>
        </div>
      </form>
    </div>
  );
};

export default MessagesCRUD;
