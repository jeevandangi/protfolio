import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  FaProjectDiagram,
  FaEnvelope,
  FaUser,
  FaEye,
  FaChartLine,
  FaCog,
  FaCode
} from 'react-icons/fa';
import { apiResponseHandler } from '../../utils/apiResponse';
import LoadingSpinner from '../../components/LoadingSpinner';
import ErrorDisplay from '../../components/ErrorDisplay';

const Dashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchDashboardStats = async () => {
      try {
        setLoading(true);

        // Fetch data from multiple endpoints
        const [profileRes, projectsRes, skillsRes, messagesRes] = await Promise.all([
          apiResponseHandler('/profile'),
          apiResponseHandler('/projects'),
          apiResponseHandler('/skills'),
          apiResponseHandler('/messages/admin')
        ]);

        // Extract data with fallbacks to empty arrays
        const projects = Array.isArray(projectsRes?.data?.data) ? projectsRes.data.data : [];
        const skills = Array.isArray(skillsRes?.data?.data) ? skillsRes.data.data : [];
        const messages = Array.isArray(messagesRes?.data?.data) ? messagesRes.data.data : [];

        setStats({
          totalProjects: projects.length,
          featuredProjects: projects.filter(p => p.featured).length,
          totalSkills: skills.length,
          totalMessages: messages.length,
          unreadMessages: messages.filter(m => m.status === 'Unread').length,
          recentProjects: projects.slice(0, 3),
          recentMessages: messages.slice(0, 5)
        });

        if (!projectsRes?.data?.success || !skillsRes?.data?.success || !messagesRes?.data?.success) {
          setError('Failed to load dashboard data');
        }
      } catch (error) {
        console.error('Dashboard error:', error);
        setError('Failed to connect to server');
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardStats();
  }, []);

  if (loading) return <LoadingSpinner message="Loading dashboard..." />;
  if (error) return <ErrorDisplay message={error} />;

  const statCards = [
    {
      title: 'Total Projects',
      value: stats.totalProjects,
      icon: FaProjectDiagram,
      color: 'from-blue-500 to-cyan-500',
      change: '+2 this month'
    },
    {
      title: 'Featured Projects',
      value: stats.featuredProjects,
      icon: FaCog,
      color: 'from-purple-500 to-pink-500',
      change: `${Math.round((stats.featuredProjects / stats.totalProjects) * 100)}% featured`
    },
    {
      title: 'Total Skills',
      value: stats.totalSkills,
      icon: FaCode,
      color: 'from-green-500 to-emerald-500',
      change: '+3 this month'
    },
    {
      title: 'Messages',
      value: stats.totalMessages,
      icon: FaEnvelope,
      color: 'from-orange-500 to-red-500',
      change: `${stats.unreadMessages} unread`
    }
  ];

  return (
    <div className="space-y-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between"
      >
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Dashboard</h1>
          <p className="text-gray-400">Welcome back! Here's what's happening with your portfolio.</p>
        </div>
        <motion.div
          className="text-4xl text-cyan-400"
          animate={{ rotate: [0, 10, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          <FaChartLine />
        </motion.div>
      </motion.div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((stat, index) => (
          <motion.div
            key={stat.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="relative overflow-hidden rounded-xl bg-gray-800/50 backdrop-blur-sm border border-gray-700/50 p-6"
          >
            <div className={`absolute inset-0 bg-gradient-to-br ${stat.color} opacity-10`} />
            <div className="relative">
              <div className="flex items-center justify-between mb-4">
                <stat.icon className={`text-2xl bg-gradient-to-r ${stat.color} bg-clip-text text-transparent`} />
                <span className="text-xs text-gray-400">{stat.change}</span>
              </div>
              <div className="space-y-1">
                <p className="text-2xl font-bold text-white">{stat.value}</p>
                <p className="text-sm text-gray-400">{stat.title}</p>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Recent Projects */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-gray-800/50 backdrop-blur-sm border border-gray-700/50 rounded-xl p-6"
        >
          <h3 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
            <FaProjectDiagram className="text-cyan-400" />
            Recent Projects
          </h3>
          <div className="space-y-3">
            {stats.recentProjects.map((project, index) => (
              <motion.div
                key={project._id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 + index * 0.1 }}
                className="flex items-center justify-between p-3 bg-gray-700/30 rounded-lg"
              >
                <div>
                  <p className="text-white font-medium">{project.title}</p>
                  <p className="text-sm text-gray-400">{project.category}</p>
                </div>
                <div className="flex items-center gap-2">
                  {project.featured && (
                    <span className="px-2 py-1 bg-yellow-500/20 text-yellow-400 text-xs rounded">
                      Featured
                    </span>
                  )}
                  <span className="text-xs text-gray-500">{project.status}</span>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Recent Messages */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-gray-800/50 backdrop-blur-sm border border-gray-700/50 rounded-xl p-6"
        >
          <h3 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
            <FaEnvelope className="text-cyan-400" />
            Recent Messages
          </h3>
          <div className="space-y-3">
            {stats.recentMessages.map((message, index) => (
              <motion.div
                key={message._id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 + index * 0.1 }}
                className="flex items-start justify-between p-3 bg-gray-700/30 rounded-lg"
              >
                <div className="flex-1">
                  <p className="text-white font-medium">{message.name}</p>
                  <p className="text-sm text-gray-400 truncate">{message.subject}</p>
                  <p className="text-xs text-gray-500 mt-1">
                    {new Date(message.createdAt).toLocaleDateString()}
                  </p>
                </div>
                <span className={`px-2 py-1 text-xs rounded ${message.status === 'Unread'
                  ? 'bg-red-500/20 text-red-400'
                  : 'bg-green-500/20 text-green-400'
                  }`}>
                  {message.status}
                </span>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Dashboard;
