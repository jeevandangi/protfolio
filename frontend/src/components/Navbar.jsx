import { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { HiMenu, HiX } from 'react-icons/hi';
import { apiResponseHandler } from '../utils/apiResponse';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [profileData, setProfileData] = useState(null);
  const location = useLocation();
  const navigate = useNavigate();

  // Fetch profile data for logo
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

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close mobile menu when route changes
  useEffect(() => {
    setIsOpen(false);
  }, [location]);

  const navItems = [
    { name: 'Home', href: '/', section: 'home' },
    { name: 'About', href: '#about', section: 'about' },
    { name: 'Projects', href: '#projects', section: 'projects' },
    { name: 'Blog', href: '/blog', section: 'blog' },
    { name: 'Contact', href: '#contact', section: 'contact' },
  ];

  const scrollToSection = (sectionId) => {
    if (location.pathname !== '/') {
      // If not on home page, navigate to home first then scroll
      navigate('/', { replace: true });
      setTimeout(() => {
        const element = document.getElementById(sectionId);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth' });
        }
      }, 100);
      return;
    }

    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleNavClick = (item) => {
    if (item.href.startsWith('#')) {
      // Handle section scrolling for same page
      scrollToSection(item.section);
    } else {
      // Handle route navigation
      navigate(item.href);
    }
    setIsOpen(false);
  };

  return (
    <motion.nav
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.8, type: "spring", bounce: 0.3 }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${scrolled
        ? 'bg-white/10 dark:bg-black/20 backdrop-blur-xl border-b border-white/10 shadow-2xl shadow-black/10'
        : 'bg-transparent'
        }`}
    >
      <div className="container-max px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Link
              to="/"
              className="relative text-2xl font-black bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent hover:from-purple-400 hover:to-pink-500 transition-all duration-300"
            >
              <span className="relative z-10">
                {profileData?.name
                  ? profileData.name.split(' ').map(word => word[0]).join('').toUpperCase()
                  : 'JD'
                }
              </span>
              <div className="absolute inset-0 bg-gradient-to-r from-blue-400/20 to-purple-500/20 blur-lg opacity-0 hover:opacity-100 transition-opacity duration-300"></div>
            </Link>
          </motion.div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-2">
            {navItems.map((item, index) => (
              <motion.button
                key={item.name}
                onClick={() => handleNavClick(item)}
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1, duration: 0.5 }}
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.95 }}
                className="relative px-4 py-2 text-white/80 hover:text-white font-medium transition-all duration-300 group"
              >
                <span className="relative z-10">{item.name}</span>
                <div className="absolute inset-0 bg-white/10 backdrop-blur-sm rounded-full opacity-0 group-hover:opacity-100 transition-all duration-300 scale-0 group-hover:scale-100"></div>
                <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-0 h-0.5 bg-gradient-to-r from-blue-400 to-purple-500 transition-all duration-300 group-hover:w-full"></div>
              </motion.button>
            ))}
          </div>

          {/* Mobile Menu Button */}
          <div className="flex items-center">
            <motion.button
              onClick={() => setIsOpen(!isOpen)}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              className="md:hidden p-3 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-white/80 hover:text-white hover:bg-white/20 transition-all duration-300"
              aria-label="Toggle menu"
            >
              <motion.div
                animate={{ rotate: isOpen ? 180 : 0 }}
                transition={{ duration: 0.3 }}
              >
                {isOpen ? <HiX className="w-6 h-6" /> : <HiMenu className="w-6 h-6" />}
              </motion.div>
            </motion.button>
          </div>
        </div>

        {/* Mobile Navigation */}
        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0, y: -20 }}
              animate={{ opacity: 1, height: 'auto', y: 0 }}
              exit={{ opacity: 0, height: 0, y: -20 }}
              transition={{ duration: 0.4, type: "spring" }}
              className="md:hidden overflow-hidden"
            >
              <div className="py-6 space-y-1 bg-black/20 backdrop-blur-xl rounded-2xl mt-4 shadow-2xl border border-white/10">
                {navItems.map((item, index) => (
                  <motion.button
                    key={item.name}
                    onClick={() => handleNavClick(item)}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1, duration: 0.3 }}
                    whileHover={{ scale: 1.02, x: 10 }}
                    whileTap={{ scale: 0.98 }}
                    className="block w-full text-left px-6 py-4 text-white/80 hover:text-white hover:bg-white/10 transition-all duration-300 font-medium rounded-xl mx-2 relative group"
                  >
                    <span className="relative z-10">{item.name}</span>
                    <div className="absolute left-0 top-1/2 transform -translate-y-1/2 w-1 h-0 bg-gradient-to-b from-blue-400 to-purple-500 transition-all duration-300 group-hover:h-full rounded-full"></div>
                  </motion.button>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.nav>
  );
};

export default Navbar;
