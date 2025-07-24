import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  FaPlus,
  FaEdit,
  FaTrash,
  FaEye,
  FaSearch,
  FaSave,
  FaTimes,
  FaUpload,
  FaGithub,
  FaExternalLinkAlt,
  FaCode,
  FaCalendar,
  FaHeart,
  FaStar,
  FaFilter,
  FaSort,
  FaDownload,
  FaShare
} from 'react-icons/fa';
import { HiSparkles, HiLightningBolt } from 'react-icons/hi';
import { apiResponseHandler } from '../../utils/apiResponse';
import LoadingSpinner from '../../components/LoadingSpinner';
import ErrorDisplay from '../../components/ErrorDisplay';

const ProjectsCRUD = () => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState('');
  const [filteredProjects, setFilteredProjects] = useState([]);

  useEffect(() => {
    fetchProjects();
  }, []);

  useEffect(() => {
    setFilteredProjects(projects);
  }, [projects]);

  const fetchProjects = async () => {
    try {
      setLoading(true);
      setError(null);

      const data = await apiResponseHandler('/projects/admin/all');
      const result = data.data.data;

      if (result.projects && Array.isArray(result.projects)) {
        setProjects(
          result.projects.sort((a, b) => a.priority - b.priority || a.title.localeCompare(b.title))
        );
      } else {
        setError('No projects found or invalid format.');
        setProjects([]);
      }
    } catch (err) {
      console.error('Projects fetch error:', err);
      setError('Error connecting to server. Try again later.');
      setProjects([]);
    } finally {
      setLoading(false);
    }
  };
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [sortBy, setSortBy] = useState('createdAt');
  const [sortOrder, setSortOrder] = useState('desc');
  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState('');
  const [selectedProject, setSelectedProject] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(6);

  // Filter and search functionality
  useEffect(() => {
    let filtered = projects.filter(project => {
      const matchesSearch = project.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        project.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        project.technologies.some(tech => tech.toLowerCase().includes(searchTerm.toLowerCase()));

      const matchesCategory = selectedCategory === 'all' || project.category === selectedCategory;
      const matchesStatus = selectedStatus === 'all' || project.status === selectedStatus;

      return matchesSearch && matchesCategory && matchesStatus;
    });

    // Sort projects
    filtered.sort((a, b) => {
      let aValue = a[sortBy];
      let bValue = b[sortBy];

      if (sortBy === 'createdAt' || sortBy === 'updatedAt') {
        aValue = new Date(aValue);
        bValue = new Date(bValue);
      }

      if (sortOrder === 'asc') {
        return aValue > bValue ? 1 : -1;
      } else {
        return aValue < bValue ? 1 : -1;
      }
    });

    setFilteredProjects(filtered);
    setCurrentPage(1);
  }, [projects, searchTerm, selectedCategory, selectedStatus, sortBy, sortOrder]);

  // Pagination
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentProjects = filteredProjects.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredProjects.length / itemsPerPage);

  const openModal = (type, project = null) => {
    setModalType(type);
    setSelectedProject(project);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setSelectedProject(null);
    setModalType('');
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this project?')) return;

    try {
      const response = await apiResponseHandler(`/projects/admin/${id}`, 'DELETE');
      if (response?.data?.success) {
        await fetchProjects();
        setSuccess('Project deleted successfully');
      } else {
        setError('Failed to delete project');
      }
    } catch (error) {
      console.error('Project delete error:', error);
      setError('Failed to delete project');
    }
  };

  const handleSave = async (projectData) => {
    try {
      if (modalType === 'add') {
        const response = await apiResponseHandler('/projects/admin', 'POST', projectData);
        if (response?.data?.success) {
          await fetchProjects();
          setSuccess('Project created successfully');
          closeModal();
        } else {
          setError('Failed to create project');
        }
      } else if (modalType === 'edit') {
        const response = await apiResponseHandler(`/projects/admin/${selectedProject._id}`, 'PUT', projectData);
        if (response?.data?.success) {
          await fetchProjects();
          setSuccess('Project updated successfully');
          closeModal();
        } else {
          setError('Failed to update project');
        }
      }
    } catch (error) {
      console.error('Project save error:', error);
      setError('Failed to save project');
    }
  };

  const categories = ['all', 'Full Stack', 'Frontend', 'Backend', 'Mobile'];
  const statuses = ['all', 'Published', 'Draft', 'Archived'];

  if (loading) return <LoadingSpinner message="Loading projects..." />;
  if (error) return <ErrorDisplay message={error} onRetry={fetchProjects} />;

  return (
    <div className="p-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-4xl font-black text-white mb-2">
            Projects{' '}
            <span className="bg-gradient-to-r from-blue-400 via-cyan-400 to-purple-400 bg-clip-text text-transparent">
              Management
            </span>
          </h1>
          <p className="text-xl text-gray-300">Create, manage, and showcase your portfolio projects</p>
        </div>
        <motion.button
          onClick={() => openModal('add')}
          whileHover={{ scale: 1.05, y: -2 }}
          whileTap={{ scale: 0.98 }}
          className="bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white px-8 py-4 rounded-2xl font-semibold flex items-center gap-3 shadow-lg"
        >
          <FaPlus className="text-lg" />
          <span>New Project</span>
          <HiSparkles className="text-lg" />
        </motion.button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        {[
          { label: 'Total Projects', value: projects.length, icon: FaCode, color: 'from-blue-500 to-cyan-500' },
          { label: 'Published', value: projects.filter(p => p.status === 'Published').length, icon: FaEye, color: 'from-green-500 to-emerald-500' },
          { label: 'Total Views', value: projects.reduce((sum, p) => sum + p.views, 0), icon: FaHeart, color: 'from-purple-500 to-pink-500' },
          { label: 'Featured', value: projects.filter(p => p.featured).length, icon: FaStar, color: 'from-orange-500 to-red-500' }
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
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
          {/* Search */}
          <div className="lg:col-span-2 relative">
            <FaSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search projects..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-4 py-3 bg-gray-800/50 border border-gray-600/50 rounded-xl text-white placeholder-gray-400 focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/20 transition-all duration-300"
            />
          </div>

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

          {/* Sort */}
          <div className="flex gap-2">
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="flex-1 px-4 py-3 bg-gray-800/50 border border-gray-600/50 rounded-xl text-white focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/20 transition-all duration-300"
            >
              <option value="createdAt">Created Date</option>
              <option value="updatedAt">Updated Date</option>
              <option value="title">Title</option>
              <option value="views">Views</option>
              <option value="likes">Likes</option>
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

      {/* Projects Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-8 mb-8">
        <AnimatePresence>
          {currentProjects.map((project, index) => (
            <motion.div
              key={project.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ y: -5 }}
              className="bg-gradient-to-br from-gray-900/90 to-gray-800/90 backdrop-blur-xl border border-gray-700/50 rounded-2xl overflow-hidden hover:border-cyan-400/50 transition-all duration-500"
              style={{
                boxShadow: '0 25px 50px rgba(0,0,0,0.5), 0 0 30px rgba(34, 211, 238, 0.1)'
              }}
            >
              {/* Project Image */}
              <div className="relative h-48 overflow-hidden">
                <img
                  src={project.image}
                  alt={project.title}
                  className="w-full h-full object-cover transition-transform duration-500 hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-gray-900/80 via-transparent to-transparent" />

                {/* Status & Featured Badges */}
                <div className="absolute top-4 left-4 flex gap-2">
                  <span className={`px-3 py-1 rounded-full text-xs font-semibold ${project.status === 'Published'
                    ? 'bg-green-500/20 text-green-300 border border-green-400/30'
                    : project.status === 'Draft'
                      ? 'bg-yellow-500/20 text-yellow-300 border border-yellow-400/30'
                      : 'bg-gray-500/20 text-gray-300 border border-gray-400/30'
                    }`}>
                    {project.status}
                  </span>
                  {project.featured && (
                    <span className="px-3 py-1 bg-gradient-to-r from-yellow-500/20 to-orange-500/20 text-yellow-300 text-xs font-semibold rounded-full border border-yellow-400/30">
                      ⭐ Featured
                    </span>
                  )}
                </div>

                {/* Quick Actions */}
                <div className="absolute top-4 right-4 flex gap-2">
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    onClick={() => openModal('view', project)}
                    className="p-2 bg-gray-900/80 text-white rounded-full hover:bg-gray-800 transition-colors backdrop-blur-sm"
                  >
                    <FaEye />
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    onClick={() => openModal('edit', project)}
                    className="p-2 bg-blue-600/80 text-white rounded-full hover:bg-blue-500 transition-colors backdrop-blur-sm"
                  >
                    <FaEdit />
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    onClick={() => handleDelete(project._id)}
                    className="p-2 bg-red-600/80 text-white rounded-full hover:bg-red-500 transition-colors backdrop-blur-sm"
                  >
                    <FaTrash />
                  </motion.button>
                </div>

                {/* Stats Overlay */}
                <div className="absolute bottom-4 left-4 flex gap-4 text-white text-sm">
                  <div className="flex items-center gap-1">
                    <FaEye className="text-xs" />
                    <span>{project.views}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <FaHeart className="text-xs" />
                    <span>{project.likes}</span>
                  </div>
                </div>
              </div>

              {/* Project Content */}
              <div className="p-6">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-xl font-bold text-white hover:text-cyan-300 transition-colors">
                    {project.title}
                  </h3>
                  <span className="text-sm text-gray-400 font-mono">{project.createdAt}</span>
                </div>

                <p className="text-gray-300 text-sm leading-relaxed mb-4 line-clamp-3">
                  {project.description}
                </p>

                {/* Project Meta */}
                <div className="space-y-3 mb-4">
                  <div className="flex items-center gap-4 text-sm text-gray-400">
                    <div className="flex items-center gap-1">
                      <FaCalendar className="text-xs" />
                      <span>{project.duration}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <FaCode className="text-xs" />
                      <span>{project.difficulty}</span>
                    </div>
                  </div>

                  {/* Technologies */}
                  <div className="flex flex-wrap gap-2">
                    {project.technologies.slice(0, 4).map((tech, techIndex) => (
                      <span
                        key={techIndex}
                        className="px-2 py-1 bg-gradient-to-r from-gray-700/50 to-gray-600/50 text-gray-300 text-xs font-medium rounded-lg border border-gray-600/30"
                      >
                        {tech}
                      </span>
                    ))}
                    {project.technologies.length > 4 && (
                      <span className="px-2 py-1 bg-gradient-to-r from-cyan-600/20 to-blue-600/20 text-cyan-300 text-xs font-medium rounded-lg border border-cyan-400/30">
                        +{project.technologies.length - 4}
                      </span>
                    )}
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-3">
                  <motion.a
                    href={project.githubUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    whileHover={{ scale: 1.05 }}
                    className="flex-1 px-4 py-2 bg-gray-700 text-white rounded-lg font-medium text-sm hover:bg-gray-600 transition-colors flex items-center justify-center gap-2"
                  >
                    <FaGithub />
                    Code
                  </motion.a>
                  {project.liveUrl && (
                    <motion.a
                      href={project.liveUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      whileHover={{ scale: 1.05 }}
                      className="flex-1 px-4 py-2 bg-gradient-to-r from-cyan-600 to-blue-600 text-white rounded-lg font-medium text-sm hover:from-cyan-500 hover:to-blue-500 transition-colors flex items-center justify-center gap-2"
                    >
                      <FaExternalLinkAlt />
                      Live
                    </motion.a>
                  )}
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center items-center gap-4">
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

      {/* Project Modal */}
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
                // View Project Modal
                <div className="p-8">
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-3xl font-bold text-white">{selectedProject?.title}</h2>
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      onClick={closeModal}
                      className="p-2 text-gray-400 hover:text-white hover:bg-gray-700 rounded-lg transition-colors"
                    >
                      <FaTimes />
                    </motion.button>
                  </div>

                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {/* Project Image */}
                    <div className="space-y-6">
                      <div className="relative h-64 rounded-xl overflow-hidden">
                        <img
                          src={selectedProject?.image}
                          alt={selectedProject?.title}
                          className="w-full h-full object-cover"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-gray-900/50 to-transparent" />
                      </div>

                      {/* Project Links */}
                      <div className="flex gap-4">
                        <motion.a
                          href={selectedProject?.githubUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          whileHover={{ scale: 1.05 }}
                          className="flex-1 px-6 py-3 bg-gray-700 text-white rounded-xl font-medium hover:bg-gray-600 transition-colors flex items-center justify-center gap-2"
                        >
                          <FaGithub />
                          View Code
                        </motion.a>
                        {selectedProject?.liveUrl && (
                          <motion.a
                            href={selectedProject?.liveUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            whileHover={{ scale: 1.05 }}
                            className="flex-1 px-6 py-3 bg-gradient-to-r from-cyan-600 to-blue-600 text-white rounded-xl font-medium hover:from-cyan-500 hover:to-blue-500 transition-colors flex items-center justify-center gap-2"
                          >
                            <FaExternalLinkAlt />
                            Live Demo
                          </motion.a>
                        )}
                      </div>
                    </div>

                    {/* Project Details */}
                    <div className="space-y-6">
                      <div>
                        <h3 className="text-xl font-bold text-white mb-3">Description</h3>
                        <p className="text-gray-300 leading-relaxed">{selectedProject?.longDescription}</p>
                      </div>

                      <div>
                        <h3 className="text-xl font-bold text-white mb-3">Technologies</h3>
                        <div className="flex flex-wrap gap-2">
                          {selectedProject?.technologies.map((tech, index) => (
                            <span
                              key={index}
                              className="px-3 py-1 bg-gradient-to-r from-gray-700/50 to-gray-600/50 text-gray-300 text-sm font-medium rounded-lg border border-gray-600/30"
                            >
                              {tech}
                            </span>
                          ))}
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <h4 className="text-lg font-semibold text-white mb-2">Project Info</h4>
                          <div className="space-y-2 text-sm">
                            <div className="flex justify-between">
                              <span className="text-gray-400">Category:</span>
                              <span className="text-white">{selectedProject?.category}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-gray-400">Status:</span>
                              <span className={`${selectedProject?.status === 'Published' ? 'text-green-300' : 'text-yellow-300'
                                }`}>{selectedProject?.status}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-gray-400">Duration:</span>
                              <span className="text-white">{selectedProject?.duration}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-gray-400">Difficulty:</span>
                              <span className="text-white">{selectedProject?.difficulty}</span>
                            </div>
                          </div>
                        </div>

                        <div>
                          <h4 className="text-lg font-semibold text-white mb-2">Statistics</h4>
                          <div className="space-y-2 text-sm">
                            <div className="flex justify-between">
                              <span className="text-gray-400">Views:</span>
                              <span className="text-white">{selectedProject?.views}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-gray-400">Likes:</span>
                              <span className="text-white">{selectedProject?.likes}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-gray-400">Created:</span>
                              <span className="text-white">{selectedProject?.createdAt}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-gray-400">Updated:</span>
                              <span className="text-white">{selectedProject?.updatedAt}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                // Add/Edit Project Modal
                <ProjectForm
                  project={selectedProject}
                  modalType={modalType}
                  onSave={handleSave}
                  onClose={closeModal}
                />
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

// Project Form Component
const ProjectForm = ({ project, modalType, onSave, onClose }) => {
  const [formData, setFormData] = useState({
    title: project?.title || '',
    description: project?.description || '',
    longDescription: project?.longDescription || '',
    image: project?.image || '',
    technologies: project?.technologies?.join(', ') || '',
    githubUrl: project?.githubUrl || '',
    liveUrl: project?.liveUrl || '',
    category: project?.category || 'Full Stack',
    status: project?.status || 'Draft',
    featured: project?.featured || false,
    difficulty: project?.difficulty || 'Intermediate',
    duration: project?.duration || '',
    teamSize: project?.teamSize || 1
  });

  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));

    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.title.trim()) newErrors.title = 'Title is required';
    if (!formData.description.trim()) newErrors.description = 'Description is required';
    if (!formData.longDescription.trim()) newErrors.longDescription = 'Long description is required';
    if (!formData.technologies.trim()) newErrors.technologies = 'Technologies are required';
    if (!formData.githubUrl.trim()) newErrors.githubUrl = 'GitHub URL is required';
    if (!formData.duration.trim()) newErrors.duration = 'Duration is required';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    const projectData = {
      ...formData,
      technologies: formData.technologies.split(',').map(tech => tech.trim()).filter(tech => tech)
    };

    onSave(projectData);
  };

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-white">
          {modalType === 'add' ? 'Create New Project' : 'Edit Project'}
        </h2>
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
            <label className="block text-sm font-medium text-gray-300 mb-2">Project Title *</label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              className="w-full px-4 py-3 bg-gray-800/50 border border-gray-600/50 rounded-xl text-white placeholder-gray-400 focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/20 transition-all duration-300"
              placeholder="Enter project title"
            />
            {errors.title && <p className="text-red-400 text-sm mt-1">{errors.title}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Category</label>
            <select
              name="category"
              value={formData.category}
              onChange={handleChange}
              className="w-full px-4 py-3 bg-gray-800/50 border border-gray-600/50 rounded-xl text-white focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/20 transition-all duration-300"
            >
              <option>Full Stack</option>
              <option>Frontend</option>
              <option>Backend</option>
              <option>Mobile</option>
            </select>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">Short Description *</label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            rows={3}
            className="w-full px-4 py-3 bg-gray-800/50 border border-gray-600/50 rounded-xl text-white placeholder-gray-400 focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/20 transition-all duration-300 resize-none"
            placeholder="Brief description for project cards"
          />
          {errors.description && <p className="text-red-400 text-sm mt-1">{errors.description}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">Detailed Description *</label>
          <textarea
            name="longDescription"
            value={formData.longDescription}
            onChange={handleChange}
            rows={5}
            className="w-full px-4 py-3 bg-gray-800/50 border border-gray-600/50 rounded-xl text-white placeholder-gray-400 focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/20 transition-all duration-300 resize-none"
            placeholder="Detailed description for project view"
          />
          {errors.longDescription && <p className="text-red-400 text-sm mt-1">{errors.longDescription}</p>}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">GitHub URL *</label>
            <input
              type="url"
              name="githubUrl"
              value={formData.githubUrl}
              onChange={handleChange}
              className="w-full px-4 py-3 bg-gray-800/50 border border-gray-600/50 rounded-xl text-white placeholder-gray-400 focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/20 transition-all duration-300"
              placeholder="https://github.com/..."
            />
            {errors.githubUrl && <p className="text-red-400 text-sm mt-1">{errors.githubUrl}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Live URL</label>
            <input
              type="url"
              name="liveUrl"
              value={formData.liveUrl}
              onChange={handleChange}
              className="w-full px-4 py-3 bg-gray-800/50 border border-gray-600/50 rounded-xl text-white placeholder-gray-400 focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/20 transition-all duration-300"
              placeholder="https://..."
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">Technologies *</label>
          <input
            type="text"
            name="technologies"
            value={formData.technologies}
            onChange={handleChange}
            className="w-full px-4 py-3 bg-gray-800/50 border border-gray-600/50 rounded-xl text-white placeholder-gray-400 focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/20 transition-all duration-300"
            placeholder="React, Node.js, MongoDB (comma separated)"
          />
          {errors.technologies && <p className="text-red-400 text-sm mt-1">{errors.technologies}</p>}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Status</label>
            <select
              name="status"
              value={formData.status}
              onChange={handleChange}
              className="w-full px-4 py-3 bg-gray-800/50 border border-gray-600/50 rounded-xl text-white focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/20 transition-all duration-300"
            >
              <option>Draft</option>
              <option>Published</option>
              <option>Archived</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Difficulty</label>
            <select
              name="difficulty"
              value={formData.difficulty}
              onChange={handleChange}
              className="w-full px-4 py-3 bg-gray-800/50 border border-gray-600/50 rounded-xl text-white focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/20 transition-all duration-300"
            >
              <option>Beginner</option>
              <option>Intermediate</option>
              <option>Advanced</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Duration *</label>
            <input
              type="text"
              name="duration"
              value={formData.duration}
              onChange={handleChange}
              className="w-full px-4 py-3 bg-gray-800/50 border border-gray-600/50 rounded-xl text-white placeholder-gray-400 focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/20 transition-all duration-300"
              placeholder="e.g., 2 months"
            />
            {errors.duration && <p className="text-red-400 text-sm mt-1">{errors.duration}</p>}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">Project Image URL</label>
          <input
            type="url"
            name="image"
            value={formData.image}
            onChange={handleChange}
            className="w-full px-4 py-3 bg-gray-800/50 border border-gray-600/50 rounded-xl text-white placeholder-gray-400 focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/20 transition-all duration-300"
            placeholder="https://..."
          />
        </div>

        <div className="flex items-center gap-3">
          <input
            type="checkbox"
            name="featured"
            id="featured"
            checked={formData.featured}
            onChange={handleChange}
            className="w-5 h-5 text-cyan-600 bg-gray-800 border-gray-600 rounded focus:ring-cyan-500 focus:ring-2"
          />
          <label htmlFor="featured" className="text-sm font-medium text-gray-300">
            Mark as Featured Project
          </label>
        </div>

        <div className="flex gap-4 pt-6">
          <motion.button
            type="submit"
            whileHover={{ scale: 1.02 }}
            className="flex-1 bg-gradient-to-r from-cyan-600 to-blue-600 text-white py-3 rounded-xl font-semibold flex items-center justify-center gap-2"
          >
            <FaSave />
            {modalType === 'add' ? 'Create Project' : 'Update Project'}
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

export default ProjectsCRUD;
