import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  FaPlus,
  FaEdit,
  FaTrash,
  FaSave,
  FaTimes,
  FaEye,
  FaEyeSlash,
  FaSearch,
  FaFilter,
  FaCalendar,
  FaUser,
  FaTag,
  FaHeart,
  FaComment,
  FaShare,
  FaUpload,
  FaImage,
  FaClock
} from 'react-icons/fa';
import { HiSparkles, HiLightningBolt } from 'react-icons/hi';
import { apiResponseHandler } from '../../utils/apiResponse';

const BlogCRUD = () => {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [showModal, setShowModal] = useState(false);
  const [editingBlog, setEditingBlog] = useState(null);
  const [modalType, setModalType] = useState('add');

  const categories = ['Web Development', 'JavaScript', 'React', 'Node.js', 'Tutorial', 'Tips & Tricks', 'Career'];

  useEffect(() => {
    fetchBlogs();
  }, []);

  const fetchBlogs = async () => {
    try {
      setLoading(true);
      setError(null);

      const data = await apiResponseHandler('/blogs/admin');
      const result = data.data.data;

      if (result.blogs && Array.isArray(result.blogs)) {
        setBlogs(
          result.blogs.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
        );
      } else {
        setError('No blogs found or invalid format.');
        setBlogs([]);
      }
    } catch (err) {
      console.error('Blog fetch error:', err);
      setError('Error connecting to server. Try again later.');
      setBlogs([]);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async (blogData) => {
    try {
      if (modalType === 'add') {
        const response = await apiResponseHandler('/blogs/admin', 'POST', blogData);
        if (response?.data?.success) {
          await fetchBlogs();
          setSuccess('Blog created successfully');
          closeModal();
        } else {
          setError('Failed to create blog');
        }
      } else {
        const response = await apiResponseHandler(`/blogs/admin/${editingBlog._id}`, 'PUT', blogData);
        if (response?.data?.success) {
          await fetchBlogs();
          setSuccess('Blog updated successfully');
          closeModal();
        } else {
          setError('Failed to update blog');
        }
      }
    } catch (error) {
      console.error('Blog save error:', error);
      setError('Failed to save blog');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this blog?')) return;

    try {
      const response = await apiResponseHandler(`/blogs/admin/${id}`, 'DELETE');
      if (response?.data?.success) {
        await fetchBlogs();
        setSuccess('Blog deleted successfully');
      } else {
        setError('Failed to delete blog');
      }
    } catch (error) {
      console.error('Blog delete error:', error);
      setError('Failed to delete blog');
    }
  };

  const handleTogglePublish = async (id) => {
    try {
      const response = await apiResponseHandler(`/blogs/admin/${id}/publish`, 'PATCH');
      if (response?.data?.success) {
        await fetchBlogs();
        setSuccess('Blog status updated');
      } else {
        setError('Failed to update blog status');
      }
    } catch (error) {
      console.error('Blog publish toggle error:', error);
      setError('Failed to update blog status');
    }
  };

  const openModal = (type, blog = null) => {
    setModalType(type);
    setEditingBlog(blog);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setEditingBlog(null);
    setModalType('add');
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-cyan-400 mx-auto mb-4"></div>
          <p className="text-gray-400">Loading blogs...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <p className="text-red-400 mb-4">{error}</p>
          <button
            onClick={fetchBlogs}
            className="px-4 py-2 bg-cyan-500 text-white rounded-lg hover:bg-cyan-600 transition-colors"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between"
      >
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Blog Management</h1>
          <p className="text-gray-400">Create and manage your blog posts</p>
        </div>
        <motion.button
          onClick={() => openModal('add')}
          className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-600 text-white rounded-lg hover:from-purple-600 hover:to-pink-700 transition-all duration-300"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <FaPlus />
          New Post
        </motion.button>
      </motion.div>

      {/* Success/Error Messages */}
      <AnimatePresence>
        {success && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="bg-green-500/20 border border-green-500/30 rounded-lg p-4 text-green-400"
          >
            {success}
          </motion.div>
        )}
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="bg-red-500/20 border border-red-500/30 rounded-lg p-4 text-red-400"
          >
            {error}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Filters */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-wrap gap-4 items-center"
      >
        <div className="flex-1 min-w-[300px]">
          <div className="relative">
            <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search blogs..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 bg-gray-700/50 border border-gray-600 rounded-lg text-white focus:border-cyan-400 focus:outline-none"
            />
          </div>
        </div>
        <select
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
          className="px-4 py-3 bg-gray-700/50 border border-gray-600 rounded-lg text-white focus:border-cyan-400 focus:outline-none"
        >
          <option value="all">All Categories</option>
          {categories.map(category => (
            <option key={category} value={category}>{category}</option>
          ))}
        </select>
      </motion.div>

      {/* Blogs Grid */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
      >
        {blogs.length === 0 ? (
          <div className="col-span-full text-center py-12">
            <HiSparkles className="text-6xl text-gray-400 mx-auto mb-4" />
            <p className="text-gray-400 text-lg">No blogs found. Create your first blog post!</p>
          </div>
        ) : (
          blogs.map((blog) => (
            <motion.div
              key={blog._id}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-gray-800/50 border border-gray-700 rounded-xl p-6 hover:border-cyan-400/50 transition-all duration-300"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-white mb-2 line-clamp-2">{blog.title}</h3>
                  <p className="text-gray-400 text-sm mb-2">{blog.excerpt}</p>
                  <div className="flex items-center gap-2 text-xs text-gray-500">
                    <FaCalendar />
                    <span>{new Date(blog.publishedAt).toLocaleDateString()}</span>
                    <span>•</span>
                    <FaClock />
                    <span>{blog.readTime} min read</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className={`px-2 py-1 rounded-full text-xs ${blog.isPublished
                    ? 'bg-green-500/20 text-green-400'
                    : 'bg-yellow-500/20 text-yellow-400'
                    }`}>
                    {blog.isPublished ? 'Published' : 'Draft'}
                  </span>
                  <span className="px-2 py-1 bg-purple-500/20 text-purple-400 rounded-full text-xs">
                    {blog.category}
                  </span>
                </div>

                <div className="flex gap-2">
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    onClick={() => handleTogglePublish(blog._id)}
                    className="p-2 text-blue-400 hover:bg-blue-500/20 rounded-lg transition-colors"
                  >
                    {blog.isPublished ? <FaEyeSlash /> : <FaEye />}
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    onClick={() => openModal('edit', blog)}
                    className="p-2 text-cyan-400 hover:bg-cyan-500/20 rounded-lg transition-colors"
                  >
                    <FaEdit />
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    onClick={() => handleDelete(blog._id)}
                    className="p-2 text-red-400 hover:bg-red-500/20 rounded-lg transition-colors"
                  >
                    <FaTrash />
                  </motion.button>
                </div>
              </div>
            </motion.div>
          ))
        )}
      </motion.div>

      {/* Blog Modal */}
      <AnimatePresence>
        {showModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4"
            onClick={closeModal}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-gray-800 border border-gray-700 rounded-xl p-6 w-full max-w-4xl max-h-[90vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-white">
                  {modalType === 'add' ? 'Create New Blog Post' : 'Edit Blog Post'}
                </h2>
                <button
                  onClick={closeModal}
                  className="p-2 text-gray-400 hover:text-white transition-colors"
                >
                  <FaTimes />
                </button>
              </div>

              <div className="text-center py-12">
                <HiSparkles className="text-6xl text-purple-400 mx-auto mb-4" />
                <h3 className="text-xl font-bold text-white mb-2">Blog Editor Coming Soon!</h3>
                <p className="text-gray-300">
                  The rich text editor for blog posts is currently under development.
                </p>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default BlogCRUD;
