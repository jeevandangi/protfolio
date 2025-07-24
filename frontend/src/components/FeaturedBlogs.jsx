import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import {
  FaCalendar,
  FaClock,
  FaEye,
  FaHeart,
  FaTag,
  FaArrowRight,
  FaUser,
  FaBlog
} from 'react-icons/fa';
import { apiResponseHandler } from '../utils/apiResponse';

const FeaturedBlogs = () => {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchFeaturedBlogs();
  }, []);

  const fetchFeaturedBlogs = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await apiResponseHandler('/blogs/featured?limit=3');
      
      if (response?.data?.success) {
        const blogsData = Array.isArray(response.data.data) ? response.data.data : [];
        setBlogs(blogsData);
      } else {
        setError('Failed to load featured blogs');
        setBlogs([]);
      }
    } catch (error) {
      console.error('Featured blogs fetch error:', error);
      setError('Failed to connect to server');
      setBlogs([]);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  if (loading) {
    return (
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-cyan-400 mx-auto mb-4"></div>
            <p className="text-gray-400">Loading featured blogs...</p>
          </div>
        </div>
      </section>
    );
  }

  if (error || blogs.length === 0) {
    return null; // Don't show the section if there are no blogs
  }

  return (
    <section className="py-20">
      <div className="max-w-7xl mx-auto px-6">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <div className="flex items-center justify-center gap-3 mb-4">
            <FaBlog className="text-3xl text-cyan-400" />
            <h2 className="text-4xl md:text-5xl font-bold text-white">
              Latest <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-600">Blog Posts</span>
            </h2>
          </div>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Insights, tutorials, and thoughts on web development and technology
          </p>
        </motion.div>

        {/* Featured Blogs Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
          {blogs.map((blog, index) => (
            <motion.article
              key={blog._id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
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

                <h3 className="text-xl font-bold text-white mb-3 line-clamp-2 group-hover:text-cyan-400 transition-colors">
                  {blog.title}
                </h3>

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
                  
                  <Link 
                    to={`/blog/${blog.slug}`}
                    className="flex items-center gap-2 text-cyan-400 hover:text-cyan-300 transition-colors group"
                  >
                    <span>Read More</span>
                    <FaArrowRight className="group-hover:translate-x-1 transition-transform" />
                  </Link>
                </div>
              </div>
            </motion.article>
          ))}
        </div>

        {/* View All Blogs Button */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center"
        >
          <Link
            to="/blog"
            className="inline-flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-cyan-500 to-purple-600 text-white font-semibold rounded-xl hover:from-cyan-600 hover:to-purple-700 transition-all duration-300 transform hover:scale-105"
          >
            <FaBlog />
            <span>View All Blog Posts</span>
            <FaArrowRight />
          </Link>
        </motion.div>
      </div>
    </section>
  );
};

export default FeaturedBlogs;
