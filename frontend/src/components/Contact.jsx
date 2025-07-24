import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  FaGithub,
  FaLinkedin,
  FaTwitter,
  FaEnvelope,
  FaPhone,
  FaMapMarkerAlt,
  FaPaperPlane,
  FaUser,
  FaComment,
  FaCheckCircle,
  FaExclamationTriangle
} from 'react-icons/fa';
import { HiSparkles, HiLightningBolt, HiMail } from 'react-icons/hi';
import { apiResponseHandler } from '../utils/apiResponse';

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState(null);
  const [focusedField, setFocusedField] = useState(null);
  const [profileData, setProfileData] = useState(null);

  useEffect(() => {
    const fetchProfileData = async () => {
      try {
        const response = await apiResponseHandler('/profile');
        if (response?.data?.success) {
          setProfileData(response.data.data);
        }
      } catch (error) {
        console.error('Error fetching profile data:', error);
      }
    };

    fetchProfileData();
  }, []);
  const [errors, setErrors] = useState({});

  const validateForm = () => {
    const newErrors = {};

    if (!formData.name.trim()) newErrors.name = 'Name is required';
    if (!formData.email.trim()) newErrors.email = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = 'Email is invalid';
    if (!formData.subject.trim()) newErrors.subject = 'Subject is required';
    if (!formData.message.trim()) newErrors.message = 'Message is required';
    else if (formData.message.trim().length < 10) newErrors.message = 'Message must be at least 10 characters';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));

    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    setIsSubmitting(true);
    setSubmitStatus(null);

    try {
      // Send message to backend API
      const response = await apiResponseHandler('/messages', 'POST', formData);

      if (response?.data?.success) {
        setSubmitStatus({
          type: 'success',
          message: response.data.message || 'Thank you! Your message has been sent successfully. I\'ll get back to you soon!'
        });
        setFormData({ name: '', email: '', subject: '', message: '' });
      } else {
        throw new Error(response?.data?.message || 'Failed to send message');
      }
    } catch (error) {
      console.error('Contact form error:', error);
      setSubmitStatus({
        type: 'error',
        message: error.message || 'Network error. Please check your connection and try again.'
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section id="contact" className="section-padding relative">
      {/* Content uses global Hero background */}

      <div className="container-max relative z-10">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, ease: [0.25, 0.46, 0.45, 0.94] }}
          className="text-center mb-16"
        >
          <motion.div
            className="inline-flex items-center gap-3 px-6 py-3 bg-gradient-to-r from-cyan-500/10 to-blue-500/10 backdrop-blur-xl border border-cyan-400/20 rounded-full text-cyan-300 font-medium mb-6"
            animate={{
              boxShadow: [
                '0 0 15px rgba(34, 211, 238, 0.2)',
                '0 0 25px rgba(34, 211, 238, 0.3)',
                '0 0 15px rgba(34, 211, 238, 0.2)'
              ]
            }}
            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
          >
            <HiMail className="text-lg" />
            <span>Get In Touch</span>
            <HiSparkles className="text-lg" />
          </motion.div>

          <h2 className="text-4xl md:text-6xl lg:text-7xl font-black mb-6">
            Let's{' '}
            <span className="bg-gradient-to-r from-blue-400 via-cyan-400 to-purple-400 bg-clip-text text-transparent">
              Connect
            </span>
          </h2>

          <p className="text-xl md:text-2xl text-gray-300 font-light leading-relaxed max-w-3xl mx-auto">
            Have a project in mind or want to collaborate? I'd love to hear from you. Let's create something amazing together!
          </p>
        </motion.div>

        {/* Contact Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">

          {/* Contact Form */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="relative"
          >
            <div className="bg-gradient-to-br from-gray-900/90 to-gray-800/90 backdrop-blur-xl border border-gray-700/50 rounded-3xl p-8 hover:border-cyan-400/50 transition-all duration-500"
              style={{
                boxShadow: '0 25px 50px rgba(0,0,0,0.5), 0 0 30px rgba(34, 211, 238, 0.1)'
              }}
            >
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Name Field */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: 0.3 }}
                >
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    <FaUser className="inline mr-2" />
                    Full Name
                  </label>
                  <motion.input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    onFocus={() => setFocusedField('name')}
                    onBlur={() => setFocusedField(null)}
                    className="w-full px-4 py-3 bg-gray-800/50 border border-gray-600/50 rounded-xl text-white placeholder-gray-400 focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/20 transition-all duration-300 backdrop-blur-sm"
                    placeholder="Enter your full name"
                    whileFocus={{ scale: 1.02 }}
                  />
                  <AnimatePresence>
                    {errors.name && (
                      <motion.p
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="text-red-400 text-sm mt-1 flex items-center gap-1"
                      >
                        <FaExclamationTriangle className="text-xs" />
                        {errors.name}
                      </motion.p>
                    )}
                  </AnimatePresence>
                </motion.div>

                {/* Email Field */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: 0.4 }}
                >
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    <FaEnvelope className="inline mr-2" />
                    Email Address
                  </label>
                  <motion.input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    onFocus={() => setFocusedField('email')}
                    onBlur={() => setFocusedField(null)}
                    className="w-full px-4 py-3 bg-gray-800/50 border border-gray-600/50 rounded-xl text-white placeholder-gray-400 focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/20 transition-all duration-300 backdrop-blur-sm"
                    placeholder="Enter your email address"
                    whileFocus={{ scale: 1.02 }}
                  />
                  <AnimatePresence>
                    {errors.email && (
                      <motion.p
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="text-red-400 text-sm mt-1 flex items-center gap-1"
                      >
                        <FaExclamationTriangle className="text-xs" />
                        {errors.email}
                      </motion.p>
                    )}
                  </AnimatePresence>
                </motion.div>

                {/* Subject Field */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: 0.5 }}
                >
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    <HiLightningBolt className="inline mr-2" />
                    Subject
                  </label>
                  <motion.input
                    type="text"
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    onFocus={() => setFocusedField('subject')}
                    onBlur={() => setFocusedField(null)}
                    className="w-full px-4 py-3 bg-gray-800/50 border border-gray-600/50 rounded-xl text-white placeholder-gray-400 focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/20 transition-all duration-300 backdrop-blur-sm"
                    placeholder="What's this about?"
                    whileFocus={{ scale: 1.02 }}
                  />
                  <AnimatePresence>
                    {errors.subject && (
                      <motion.p
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="text-red-400 text-sm mt-1 flex items-center gap-1"
                      >
                        <FaExclamationTriangle className="text-xs" />
                        {errors.subject}
                      </motion.p>
                    )}
                  </AnimatePresence>
                </motion.div>

                {/* Message Field */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: 0.6 }}
                >
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    <FaComment className="inline mr-2" />
                    Message
                  </label>
                  <motion.textarea
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    onFocus={() => setFocusedField('message')}
                    onBlur={() => setFocusedField(null)}
                    rows={5}
                    className="w-full px-4 py-3 bg-gray-800/50 border border-gray-600/50 rounded-xl text-white placeholder-gray-400 focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/20 transition-all duration-300 backdrop-blur-sm resize-none"
                    placeholder="Tell me about your project or idea..."
                    whileFocus={{ scale: 1.02 }}
                  />
                  <AnimatePresence>
                    {errors.message && (
                      <motion.p
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="text-red-400 text-sm mt-1 flex items-center gap-1"
                      >
                        <FaExclamationTriangle className="text-xs" />
                        {errors.message}
                      </motion.p>
                    )}
                  </AnimatePresence>
                </motion.div>

                {/* Submit Button */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: 0.7 }}
                >
                  <motion.button
                    type="submit"
                    disabled={isSubmitting}
                    whileHover={{
                      scale: 1.02,
                      y: -2,
                      boxShadow: '0 10px 40px rgba(34, 211, 238, 0.4)',
                    }}
                    whileTap={{ scale: 0.98 }}
                    className={`group w-full inline-flex items-center justify-center gap-3 px-8 py-4 rounded-2xl font-semibold text-lg transition-all duration-300 ${isSubmitting
                      ? 'bg-gray-600 cursor-not-allowed'
                      : 'bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 shadow-lg'
                      }`}
                  >
                    {isSubmitting ? (
                      <>
                        <motion.div
                          animate={{ rotate: 360 }}
                          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                          className="w-5 h-5 border-2 border-white border-t-transparent rounded-full"
                        />
                        <span>Sending...</span>
                      </>
                    ) : (
                      <>
                        <FaPaperPlane className="text-lg" />
                        <span>Send Message</span>
                        <motion.div
                          className="opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                          animate={{ x: [0, 3, 0] }}
                          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                        >
                          →
                        </motion.div>
                      </>
                    )}
                  </motion.button>
                </motion.div>

                {/* Status Message */}
                <AnimatePresence>
                  {submitStatus && (
                    <motion.div
                      initial={{ opacity: 0, y: 20, scale: 0.9 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: -20, scale: 0.9 }}
                      className={`p-4 rounded-xl border backdrop-blur-sm ${submitStatus.type === 'success'
                        ? 'bg-green-500/10 border-green-400/30 text-green-300'
                        : 'bg-red-500/10 border-red-400/30 text-red-300'
                        }`}
                    >
                      <div className="flex items-center gap-3">
                        {submitStatus.type === 'success' ? (
                          <FaCheckCircle className="text-lg" />
                        ) : (
                          <FaExclamationTriangle className="text-lg" />
                        )}
                        <span>{submitStatus.message}</span>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </form>
            </div>
          </motion.div>

          {/* Contact Information */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="space-y-8"
          >
            {/* Contact Info Cards */}
            <div className="space-y-6">
              <motion.div
                whileHover={{ scale: 1.02, y: -2 }}
                className="bg-gradient-to-br from-gray-900/90 to-gray-800/90 backdrop-blur-xl border border-gray-700/50 rounded-2xl p-6 hover:border-cyan-400/50 transition-all duration-500"
                style={{
                  boxShadow: '0 10px 30px rgba(0,0,0,0.3)'
                }}
              >
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-gradient-to-r from-cyan-600/20 to-blue-600/20 rounded-xl border border-cyan-400/30">
                    <FaEnvelope className="text-xl text-cyan-300" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-white mb-1">Email</h3>
                    <p className="text-gray-300">{profileData?.email || 'Loading...'}</p>
                  </div>
                </div>
              </motion.div>

              <motion.div
                whileHover={{ scale: 1.02, y: -2 }}
                className="bg-gradient-to-br from-gray-900/90 to-gray-800/90 backdrop-blur-xl border border-gray-700/50 rounded-2xl p-6 hover:border-cyan-400/50 transition-all duration-500"
                style={{
                  boxShadow: '0 10px 30px rgba(0,0,0,0.3)'
                }}
              >
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-gradient-to-r from-green-600/20 to-emerald-600/20 rounded-xl border border-green-400/30">
                    <FaPhone className="text-xl text-green-300" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-white mb-1">Phone</h3>
                    <p className="text-gray-300">{profileData?.phone || 'Loading...'}</p>
                  </div>
                </div>
              </motion.div>

              <motion.div
                whileHover={{ scale: 1.02, y: -2 }}
                className="bg-gradient-to-br from-gray-900/90 to-gray-800/90 backdrop-blur-xl border border-gray-700/50 rounded-2xl p-6 hover:border-cyan-400/50 transition-all duration-500"
                style={{
                  boxShadow: '0 10px 30px rgba(0,0,0,0.3)'
                }}
              >
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-gradient-to-r from-purple-600/20 to-pink-600/20 rounded-xl border border-purple-400/30">
                    <FaMapMarkerAlt className="text-xl text-purple-300" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-white mb-1">Location</h3>
                    <p className="text-gray-300">{profileData?.location || 'Loading...'}</p>
                  </div>
                </div>
              </motion.div>
            </div>

            {/* Social Links */}
            <div className="pt-8">
              <h3 className="text-xl font-semibold text-white mb-6 text-center">Connect With Me</h3>
              <div className="flex justify-center gap-4">
                {[
                  { icon: FaGithub, href: profileData?.socialLinks?.github || '#', label: 'GitHub', color: 'hover:text-gray-300' },
                  { icon: FaLinkedin, href: profileData?.socialLinks?.linkedin || '#', label: 'LinkedIn', color: 'hover:text-blue-400' },
                  { icon: FaTwitter, href: profileData?.socialLinks?.twitter || '#', label: 'Twitter', color: 'hover:text-cyan-400' }
                ].filter(social => social.href !== '#').map((social) => {
                  const IconComponent = social.icon;
                  return (
                    <motion.a
                      key={social.label}
                      href={social.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      whileHover={{ scale: 1.1, y: -2 }}
                      whileTap={{ scale: 0.95 }}
                      className={`p-4 bg-gradient-to-br from-gray-800/50 to-gray-700/50 backdrop-blur-xl border border-gray-600/50 rounded-xl text-gray-400 ${social.color} transition-all duration-300 hover:border-cyan-400/50`}
                      style={{
                        boxShadow: '0 5px 15px rgba(0,0,0,0.2)'
                      }}
                    >
                      <IconComponent className="text-2xl" />
                    </motion.a>
                  );
                })}
              </div>
            </div>

            {/* Quick Response Promise */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.6 }}
              className="bg-gradient-to-r from-cyan-500/10 to-blue-500/10 backdrop-blur-xl border border-cyan-400/20 rounded-2xl p-6 text-center"
            >
              <motion.div
                animate={{ scale: [1, 1.05, 1] }}
                transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                className="inline-flex items-center gap-2 text-cyan-300 mb-3"
              >
                <HiLightningBolt className="text-xl" />
                <span className="font-semibold">Quick Response</span>
              </motion.div>
              <p className="text-gray-300">
                I typically respond within 24 hours. Let's discuss your project and bring your ideas to life!
              </p>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default Contact;
