import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  FaHome, FaProjectDiagram, FaBlog, FaEnvelope,
  FaUser, FaCog, FaSignOutAlt, FaChartBar, FaLock
} from 'react-icons/fa';
import { HiSparkles, HiLightningBolt } from 'react-icons/hi';
import Dashboard from './admin/Dashboard';
import ProfileCRUD from './admin/ProfileCRUD';
import SkillsCRUD from './admin/SkillsCRUD';
import ProjectsCRUD from './admin/ProjectsCRUD';
import BlogCRUD from './admin/BlogCRUD';
import MessagesCRUD from './admin/MessagesCRUD';
import { apiResponseHandler } from '../utils/apiResponse';

const Admin = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loginData, setLoginData] = useState({ email: '', password: '' });
  const [loginLoading, setLoginLoading] = useState(false);
  const [loginError, setLoginError] = useState('');
  const [authToken, setAuthToken] = useState(localStorage.getItem('adminToken'));
  const [adminUser, setAdminUser] = useState(() =>
    JSON.parse(localStorage.getItem('adminUser')) || {}
  );

  // Auto-authenticate on mount
  useEffect(() => {
    if (authToken && (adminUser?.role === 'admin' || adminUser?.role === 'super_admin')) {
      setIsAuthenticated(true);
    } else {
      setIsAuthenticated(false);
    }

    // Optional: handle logout from other tabs
    // const handleStorageChange = () => {
    //   if (!localStorage.getItem('adminToken')) {
    //     setIsAuthenticated(false);
    //   }
    // };
    // window.addEventListener('storage', handleStorageChange);
    // return () => window.removeEventListener('storage', handleStorageChange);
  }, [authToken, adminUser]);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoginLoading(true);
    setLoginError('');

    try {
      const response = await apiResponseHandler('/auth/admin/login', 'POST', {
        email: loginData.email,
        password: loginData.password
      });

      if (response?.data?.success) {
        const { token, admin } = response.data.data;

        if (admin.role !== 'super_admin' && admin.role !== 'admin') {
          setLoginError('Unauthorized: Not an admin');
          return;
        }

        localStorage.setItem('adminToken', token);
        localStorage.setItem('adminUser', JSON.stringify(admin));
        setAuthToken(token);
        setAdminUser(admin);
        setIsAuthenticated(true);
        setLoginData({ email: '', password: '' });
      } else {
        setLoginError(response?.data?.message || 'Login failed');
      }
    } catch (error) {
      console.error('Login error:', error);
      setLoginError('Failed to connect to server. Please try again.');
    } finally {
      setLoginLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      await apiResponseHandler('/auth/logout', 'POST', null, {
        Authorization: `Bearer ${authToken}`
      });
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      localStorage.removeItem('adminToken');
      localStorage.removeItem('adminUser');
      setIsAuthenticated(false);
      setAuthToken(null);
      setAdminUser({});
      setActiveTab('dashboard');
    }
  };

  const sidebarTabs = [
    { id: 'dashboard', icon: FaHome, label: 'Dashboard' },
    { id: 'profile', icon: FaUser, label: 'Profile' },
    { id: 'skills', icon: FaChartBar, label: 'Skills' },
    { id: 'projects', icon: FaProjectDiagram, label: 'Projects' },
    { id: 'blogs', icon: FaBlog, label: 'Blog Posts' },
    { id: 'messages', icon: FaEnvelope, label: 'Messages' },
    { id: 'settings', icon: FaCog, label: 'Settings' }
  ];

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900 flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-br from-gray-900/90 to-gray-800/90 backdrop-blur-xl border border-gray-700/50 rounded-3xl p-8 w-full max-w-md"
        >
          <div className="text-center mb-8">
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
              <HiLightningBolt className="text-lg" />
              <span>Admin Portal</span>
              <HiSparkles className="text-lg" />
            </motion.div>

            <h1 className="text-3xl font-bold text-white mb-2">Welcome Back</h1>
            <p className="text-gray-300">Sign in to manage your portfolio</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-6">
            {loginError && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-red-500/20 border border-red-500/50 text-red-400 px-4 py-3 rounded-lg text-sm"
              >
                {loginError}
              </motion.div>
            )}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                <FaUser className="inline mr-2" />
                Email Address
              </label>
              <input
                type="email"
                value={loginData.email}
                onChange={(e) => setLoginData({ ...loginData, email: e.target.value })}
                className="w-full px-4 py-3 bg-gray-800/50 border border-gray-600/50 rounded-xl text-white"
                placeholder="Enter your email address"
                required
                disabled={loginLoading}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                <FaLock className="inline mr-2" />
                Password
              </label>
              <input
                type="password"
                value={loginData.password}
                onChange={(e) => setLoginData({ ...loginData, password: e.target.value })}
                className="w-full px-4 py-3 bg-gray-800/50 border border-gray-600/50 rounded-xl text-white"
                placeholder="Enter your password"
                required
                disabled={loginLoading}
              />
            </div>

            <motion.button
              type="submit"
              disabled={loginLoading}
              whileHover={!loginLoading ? { scale: 1.02, y: -2 } : {}}
              whileTap={!loginLoading ? { scale: 0.98 } : {}}
              className={`w-full font-semibold py-3 px-6 rounded-xl transition-all duration-300 shadow-lg ${loginLoading
                ? 'bg-gray-600 cursor-not-allowed'
                : 'bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500'
                } text-white`}
            >
              {loginLoading ? (
                <div className="flex items-center justify-center gap-2">
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  Signing In...
                </div>
              ) : (
                'Sign In'
              )}
            </motion.button>
          </form>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900">
      <div className="flex">
        {/* Sidebar */}
        <motion.div
          initial={{ x: -300 }}
          animate={{ x: 0 }}
          className="w-64 bg-gradient-to-b from-gray-900/95 to-gray-800/95 backdrop-blur-xl border-r border-gray-700/50 min-h-screen"
        >
          <div className="p-6">
            <div className="flex items-center gap-3 mb-8">
              <div className="w-10 h-10 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-xl flex items-center justify-center">
                <HiLightningBolt className="text-white text-lg" />
              </div>
              <div>
                <h2 className="text-white font-bold text-lg">Admin Panel</h2>
                <p className="text-gray-400 text-sm">Portfolio Manager</p>
              </div>
            </div>

            <nav className="space-y-2">
              {sidebarTabs.map(({ id, icon: Icon, label }) => (
                <motion.button
                  key={id}
                  onClick={() => setActiveTab(id)}
                  whileHover={{ x: 5 }}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 ${activeTab === id
                    ? 'bg-gradient-to-r from-cyan-600/20 to-blue-600/20 text-cyan-300 border border-cyan-400/30'
                    : 'text-gray-400 hover:text-white hover:bg-gray-800/50'
                    }`}
                >
                  <Icon className="text-lg" />
                  <span className="font-medium">{label}</span>
                </motion.button>
              ))}
            </nav>

            <div className="mt-8 pt-8 border-t border-gray-700/50">
              <motion.button
                onClick={handleLogout}
                whileHover={{ x: 5 }}
                className="w-full flex items-center gap-3 px-4 py-3 text-red-400 hover:text-red-300 hover:bg-red-500/10 rounded-xl transition-all duration-300"
              >
                <FaSignOutAlt className="text-lg" />
                <span className="font-medium">Sign Out</span>
              </motion.button>
            </div>
          </div>
        </motion.div>

        {/* Main Content */}
        <div className="flex-1 p-8">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            {activeTab === 'dashboard' && <Dashboard />}
            {activeTab === 'profile' && <ProfileCRUD />}
            {activeTab === 'skills' && <SkillsCRUD />}
            {activeTab === 'projects' && <ProjectsCRUD />}
            {activeTab === 'blogs' && <BlogCRUD />}
            {activeTab === 'messages' && <MessagesCRUD />}
            {activeTab === 'settings' && (
              <div className="text-white">
                <h2 className="text-2xl font-bold mb-4">Settings</h2>
                <p className="text-gray-400">More customization here...</p>
              </div>
            )}
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default Admin;
