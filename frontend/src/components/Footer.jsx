import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FaGithub, FaLinkedin, FaTwitter, FaHeart } from 'react-icons/fa';
import { apiResponseHandler } from '../utils/apiResponse';

const Footer = () => {
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

  const currentYear = new Date().getFullYear();

  return (
    <footer className="relative text-white py-12 border-t border-gray-800/50">
      <div className="max-w-6xl mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-center">
          {/* Left - Name and tagline */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center md:text-left"
          >
            <h3 className="text-xl font-bold bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
              {profileData?.name || 'Loading...'}
            </h3>
            <p className="text-gray-400 text-sm mt-1">
              {profileData?.title || 'Full Stack Developer'}
            </p>
          </motion.div>

          {/* Center - Social Links */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="flex justify-center space-x-6"
          >
            {profileData?.socialLinks && [
              { icon: FaGithub, href: profileData.socialLinks.github, label: 'GitHub' },
              { icon: FaLinkedin, href: profileData.socialLinks.linkedin, label: 'LinkedIn' },
              { icon: FaTwitter, href: profileData.socialLinks.twitter, label: 'Twitter' }
            ].filter(social => social.href).map((social, index) => (
              <motion.a
                key={social.label}
                href={social.href}
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-cyan-400 transition-colors duration-300"
                whileHover={{ scale: 1.2, y: -2 }}
                whileTap={{ scale: 0.9 }}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 + index * 0.1 }}
              >
                <social.icon className="text-xl" />
              </motion.a>
            ))}
          </motion.div>

          {/* Right - Copyright */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-center md:text-right"
          >
            <p className="text-gray-400 text-sm flex items-center justify-center md:justify-end gap-1">
              © {currentYear} {profileData?.name || 'Jeevan Dangi'}. Made with{' '}
              <motion.span
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ duration: 1, repeat: Infinity, ease: "easeInOut" }}
              >
                <FaHeart className="text-red-500 text-xs" />
              </motion.span>
            </p>
          </motion.div>
        </div>

        {/* Bottom divider */}
        <motion.div
          initial={{ scaleX: 0 }}
          whileInView={{ scaleX: 1 }}
          transition={{ duration: 1, delay: 0.3 }}
          className="mt-8 pt-6 border-t border-gray-800/30"
        >
          <p className="text-center text-gray-500 text-xs">
            Built with React, Node.js, MongoDB & lots of ☕
          </p>
        </motion.div>
      </div>
    </footer>
  );
};

export default Footer;
