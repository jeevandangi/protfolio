import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  FaCalendar,
  FaClock,
  FaEye,
  FaHeart,
  FaTag,
  FaUser,
  FaArrowLeft,
  FaShare,
  FaTwitter,
  FaFacebook,
  FaLinkedin
} from 'react-icons/fa';
import { apiResponseHandler } from '../utils/apiResponse';

const BlogPost = () => {
  const { slug } = useParams();
  const [blog, setBlog] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [liked, setLiked] = useState(false);

  useEffect(() => {
    if (slug) {
      fetchBlog();
    }
  }, [slug]);

  const fetchBlog = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await apiResponseHandler(`/blogs/${slug}`);
      
      if (response?.data?.success) {
        setBlog(response.data.data);
      } else {
        setError('Blog post not found');
      }
    } catch (error) {
      console.error('Blog fetch error:', error);
      setError('Failed to load blog post');
    } finally {
      setLoading(false);
    }
  };

  const handleLike = async () => {
    if (liked) return; // Prevent multiple likes
    
    try {
      const response = await apiResponseHandler(`/blogs/${slug}/like`, 'PATCH');
      if (response?.data?.success) {
        setBlog(prev => ({
          ...prev,
          likes: response.data.data.likes
        }));
        setLiked(true);
      }
    } catch (error) {
      console.error('Like error:', error);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const shareUrl = window.location.href;
  const shareTitle = blog?.title || 'Check out this blog post';

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-cyan-400 mx-auto mb-4"></div>
          <p className="text-gray-400 text-lg">Loading blog post...</p>
        </div>
      </div>
    );
  }

  if (error || !blog) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-white mb-4">Blog Post Not Found</h1>
          <p className="text-gray-400 text-lg mb-8">{error}</p>
          <Link
            to="/blog"
            className="inline-flex items-center gap-2 px-6 py-3 bg-cyan-500 text-white rounded-lg hover:bg-cyan-600 transition-colors"
          >
            <FaArrowLeft />
            Back to Blog
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black py-20">
      <div className="max-w-4xl mx-auto px-6">
        {/* Back Button */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="mb-8"
        >
          <Link
            to="/blog"
            className="inline-flex items-center gap-2 text-cyan-400 hover:text-cyan-300 transition-colors"
          >
            <FaArrowLeft />
            Back to Blog
          </Link>
        </motion.div>

        {/* Blog Header */}
        <motion.header
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          {/* Category and Featured Badge */}
          <div className="flex items-center gap-3 mb-4">
            <span className="px-3 py-1 bg-cyan-500/20 text-cyan-400 text-sm rounded-full">
              {blog.category}
            </span>
            {blog.isFeatured && (
              <span className="px-3 py-1 bg-purple-500/20 text-purple-400 text-sm rounded-full">
                Featured
              </span>
            )}
          </div>

          {/* Title */}
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-6 leading-tight">
            {blog.title}
          </h1>

          {/* Meta Information */}
          <div className="flex flex-wrap items-center gap-6 text-gray-400 mb-6">
            <div className="flex items-center gap-2">
              <FaUser />
              <span>{blog.author}</span>
            </div>
            <div className="flex items-center gap-2">
              <FaCalendar />
              <span>{formatDate(blog.publishedAt || blog.createdAt)}</span>
            </div>
            <div className="flex items-center gap-2">
              <FaClock />
              <span>{blog.readTime} min read</span>
            </div>
            <div className="flex items-center gap-2">
              <FaEye />
              <span>{blog.views} views</span>
            </div>
          </div>

          {/* Featured Image */}
          {blog.featuredImage && (
            <div className="rounded-xl overflow-hidden mb-8">
              <img
                src={blog.featuredImage}
                alt={blog.title}
                className="w-full h-64 md:h-96 object-cover"
              />
            </div>
          )}
        </motion.header>

        {/* Blog Content */}
        <motion.article
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="prose prose-lg prose-invert max-w-none mb-8"
        >
          <div className="text-gray-300 leading-relaxed whitespace-pre-wrap">
            {blog.content}
          </div>
        </motion.article>

        {/* Tags */}
        {blog.tags && blog.tags.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="mb-8"
          >
            <h3 className="text-lg font-semibold text-white mb-4">Tags</h3>
            <div className="flex flex-wrap gap-2">
              {blog.tags.map((tag, index) => (
                <span
                  key={index}
                  className="px-3 py-1 bg-gray-700/50 text-gray-300 text-sm rounded-full flex items-center gap-1"
                >
                  <FaTag className="text-xs" />
                  {tag}
                </span>
              ))}
            </div>
          </motion.div>
        )}

        {/* Actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="flex items-center justify-between p-6 bg-gray-800/50 border border-gray-700 rounded-xl"
        >
          {/* Like Button */}
          <button
            onClick={handleLike}
            disabled={liked}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
              liked
                ? 'bg-red-500/20 text-red-400 cursor-not-allowed'
                : 'bg-gray-700/50 text-gray-300 hover:bg-red-500/20 hover:text-red-400'
            }`}
          >
            <FaHeart className={liked ? 'text-red-400' : ''} />
            <span>{blog.likes} {liked ? 'Liked!' : 'Like'}</span>
          </button>

          {/* Share Buttons */}
          <div className="flex items-center gap-3">
            <span className="text-gray-400 mr-2">Share:</span>
            <a
              href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(shareTitle)}&url=${encodeURIComponent(shareUrl)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 bg-blue-500/20 text-blue-400 rounded-lg hover:bg-blue-500/30 transition-colors"
            >
              <FaTwitter />
            </a>
            <a
              href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 bg-blue-600/20 text-blue-400 rounded-lg hover:bg-blue-600/30 transition-colors"
            >
              <FaFacebook />
            </a>
            <a
              href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 bg-blue-700/20 text-blue-400 rounded-lg hover:bg-blue-700/30 transition-colors"
            >
              <FaLinkedin />
            </a>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default BlogPost;
