import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  FaCalendar,
  FaClock,
  FaEye,
  FaHeart,
  FaTag,
  FaSearch,
  FaFilter,
  FaArrowRight,
  FaUser
} from 'react-icons/fa';
import { apiResponseHandler } from '../utils/apiResponse';

const Blog = () => {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [filteredBlogs, setFilteredBlogs] = useState([]);

  const categories = ['Web Development', 'JavaScript', 'React', 'Node.js', 'Tutorial', 'Tips & Tricks', 'Career', 'Technology'];

  useEffect(() => {
    fetchBlogs();
  }, []);

  useEffect(() => {
    filterBlogs();
  }, [blogs, searchTerm, selectedCategory]);

  const fetchBlogs = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await apiResponseHandler('/blogs');

      if (response?.data?.success) {
        const blogsData = Array.isArray(response.data.data.blogs) ? response.data.data.blogs : [];
        setBlogs(blogsData);
      } else {
        setError('Failed to load blogs');
        setBlogs([]);
      }
    } catch (error) {
      console.error('Blog fetch error:', error);
      setError('Failed to connect to server');
      setBlogs([]);
    } finally {
      setLoading(false);
    }
  };

  const filterBlogs = () => {
    let filtered = blogs;

    if (selectedCategory !== 'all') {
      filtered = filtered.filter(blog => blog.category === selectedCategory);
    }

    if (searchTerm) {
      filtered = filtered.filter(blog =>
        blog.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        blog.excerpt.toLowerCase().includes(searchTerm.toLowerCase()) ||
        blog.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }

    setFilteredBlogs(filtered);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-cyan-400 mx-auto mb-4"></div>
          <p className="text-gray-400 text-lg">Loading blogs...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-400 text-lg mb-4">{error}</p>
          <button
            onClick={fetchBlogs}
            className="px-6 py-3 bg-cyan-500 text-white rounded-lg hover:bg-cyan-600 transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black py-20">
      <div className="max-w-7xl mx-auto px-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-16"
        >
          <h1 className="text-5xl md:text-6xl font-bold text-white mb-6">
            My <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-600">Blog</span>
          </h1>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Sharing insights, tutorials, and thoughts on web development, technology, and programming
          </p>
        </motion.div>

        {/* Search and Filter */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="flex flex-col md:flex-row gap-4 mb-12"
        >
          <div className="flex-1 relative">
            <FaSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search blogs..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-4 py-4 bg-gray-800/50 border border-gray-700 rounded-xl text-white placeholder-gray-400 focus:border-cyan-400 focus:outline-none transition-colors"
            />
          </div>
          <div className="relative">
            <FaFilter className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="pl-12 pr-8 py-4 bg-gray-800/50 border border-gray-700 rounded-xl text-white focus:border-cyan-400 focus:outline-none transition-colors appearance-none cursor-pointer"
            >
              <option value="all">All Categories</option>
              {categories.map(category => (
                <option key={category} value={category}>{category}</option>
              ))}
            </select>
          </div>
        </motion.div>

        {/* Blog Grid */}
        <AnimatePresence>
          {filteredBlogs.length === 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-20"
            >
              <div className="text-6xl text-gray-600 mb-4">📝</div>
              <h3 className="text-2xl font-bold text-white mb-2">No blogs found</h3>
              <p className="text-gray-400">
                {searchTerm || selectedCategory !== 'all'
                  ? 'Try adjusting your search or filter criteria'
                  : 'Blog posts will appear here soon!'}
              </p>
            </motion.div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredBlogs.map((blog, index) => (
                <motion.article
                  key={blog._id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="bg-gray-800/50 border border-gray-700 rounded-xl overflow-hidden hover:border-cyan-400/50 transition-all duration-300 group"
                >
                  {/* Featured Image */}
                  <div className="relative overflow-hidden">
                    <img
                      src={blog.featuredImage}
                      alt={blog.title}
                      className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute top-4 left-4">
                      <span className="px-3 py-1 bg-cyan-500/90 text-white text-sm rounded-full">
                        {blog.category}
                      </span>
                    </div>
                    {blog.isFeatured && (
                      <div className="absolute top-4 right-4">
                        <span className="px-3 py-1 bg-purple-500/90 text-white text-sm rounded-full">
                          Featured
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Content */}
                  <div className="p-6">
                    <div className="flex items-center gap-4 text-sm text-gray-400 mb-3">
                      <div className="flex items-center gap-1">
                        <FaUser />
                        <span>{blog.author}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <FaCalendar />
                        <span>{formatDate(blog.publishedAt || blog.createdAt)}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <FaClock />
                        <span>{blog.readTime} min</span>
                      </div>
                    </div>

                    <h2 className="text-xl font-bold text-white mb-3 line-clamp-2 group-hover:text-cyan-400 transition-colors">
                      {blog.title}
                    </h2>

                    <p className="text-gray-300 mb-4 line-clamp-3">
                      {blog.excerpt}
                    </p>

                    {/* Tags */}
                    {blog.tags && blog.tags.length > 0 && (
                      <div className="flex flex-wrap gap-2 mb-4">
                        {blog.tags.slice(0, 3).map((tag, tagIndex) => (
                          <span
                            key={tagIndex}
                            className="px-2 py-1 bg-gray-700/50 text-gray-300 text-xs rounded-full flex items-center gap-1"
                          >
                            <FaTag className="text-xs" />
                            {tag}
                          </span>
                        ))}
                        {blog.tags.length > 3 && (
                          <span className="px-2 py-1 bg-gray-700/50 text-gray-300 text-xs rounded-full">
                            +{blog.tags.length - 3} more
                          </span>
                        )}
                      </div>
                    )}

                    {/* Stats and Read More */}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4 text-sm text-gray-400">
                        <div className="flex items-center gap-1">
                          <FaEye />
                          <span>{blog.views}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <FaHeart />
                          <span>{blog.likes}</span>
                        </div>
                      </div>

                      <button className="flex items-center gap-2 text-cyan-400 hover:text-cyan-300 transition-colors group">
                        <span>Read More</span>
                        <FaArrowRight className="group-hover:translate-x-1 transition-transform" />
                      </button>
                    </div>
                  </div>
                </motion.article>
              ))}
            </div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default Blog;
