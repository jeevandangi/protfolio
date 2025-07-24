import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaGithub, FaExternalLinkAlt, FaLaptopCode, FaMobile, FaServer, FaDatabase } from 'react-icons/fa';
import { HiSparkles, HiLightningBolt } from 'react-icons/hi';
import { apiResponseHandler } from '../utils/apiResponse';
import LoadingSpinner from './LoadingSpinner';
import ErrorDisplay from './ErrorDisplay';
import { SiReact, SiNodedotjs, SiMongodb, SiExpress, SiNextdotjs, SiTailwindcss, SiTypescript, SiPostgresql } from 'react-icons/si';

const Projects = () => {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [projectsData, setProjectsData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const response = await apiResponseHandler('/projects');
        if (response?.data?.success) {
          const projects = Array.isArray(response.data.data) ? response.data.data : [];
          setProjectsData(projects);
        } else {
          setError('Failed to load projects');
          setProjectsData([]); // Ensure projectsData is always an array
        }
      } catch (error) {
        console.error('Error fetching projects:', error);
        setError('Failed to connect to server');
        setProjectsData([]); // Ensure projectsData is always an array
      } finally {
        setLoading(false);
      }
    };

    fetchProjects();
  }, []);
  const [hoveredProject, setHoveredProject] = useState(null);

  // Error state
  if (error) {
    return (
      <section id="projects" className="py-20 px-6">
        <div className="max-w-6xl mx-auto">
          <ErrorDisplay message={error} />
        </div>
      </section>
    );
  }

  // Loading state or no data
  if (loading || projectsData.length === 0) {
    return (
      <section id="projects" className="py-20 px-6">
        <div className="max-w-6xl mx-auto">
          <LoadingSpinner
            message={loading ? 'Loading projects...' : 'No projects found'}
          />
        </div>
      </section>
    );
  }

  // Use dynamic projects data
  const projects = projectsData;

  const categories = [
    { id: 'all', name: 'All Projects', icon: FaLaptopCode },
    { id: 'fullstack', name: 'Full Stack', icon: FaServer },
    { id: 'frontend', name: 'Frontend', icon: FaMobile },
    { id: 'backend', name: 'Backend', icon: FaDatabase },
  ];

  const filteredProjects = selectedCategory === 'all'
    ? projects
    : projects.filter(project => project.category === selectedCategory);

  const getTechIcon = (tech) => {
    const icons = {
      'React': SiReact,
      'Node.js': SiNodedotjs,
      'MongoDB': SiMongodb,
      'Express': SiExpress,
      'Next.js': SiNextdotjs,
      'Tailwind CSS': SiTailwindcss,
      'TypeScript': SiTypescript,
      'PostgreSQL': SiPostgresql,
    };
    return icons[tech] || HiSparkles;
  };

  return (
    <section id="projects" className="section-padding relative">
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
            <HiLightningBolt className="text-lg" />
            <span>Featured Work</span>
            <HiSparkles className="text-lg" />
          </motion.div>

          <h2 className="text-4xl md:text-6xl lg:text-7xl font-black mb-6">
            My{' '}
            <span className="bg-gradient-to-r from-blue-400 via-cyan-400 to-purple-400 bg-clip-text text-transparent">
              Projects
            </span>
          </h2>

          <p className="text-xl md:text-2xl text-gray-300 font-light leading-relaxed max-w-3xl mx-auto">
            Explore my latest work showcasing modern web technologies, innovative solutions, and creative problem-solving approaches.
          </p>
        </motion.div>

        {/* Category Filter */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="flex flex-wrap justify-center gap-4 mb-12"
        >
          {categories.map((category) => {
            const IconComponent = category.icon;
            return (
              <motion.button
                key={category.id}
                onClick={() => setSelectedCategory(category.id)}
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.98 }}
                className={`group inline-flex items-center gap-3 px-6 py-3 rounded-2xl font-semibold transition-all duration-300 ${selectedCategory === category.id
                  ? 'bg-gradient-to-r from-cyan-600 to-blue-600 text-white shadow-lg shadow-cyan-500/25'
                  : 'bg-gradient-to-r from-gray-800/50 to-gray-700/50 text-gray-300 hover:from-gray-700/50 hover:to-gray-600/50 border border-gray-600/30'
                  } backdrop-blur-xl`}
              >
                <IconComponent className="text-lg" />
                <span>{category.name}</span>
                {selectedCategory === category.id && (
                  <motion.div
                    layoutId="activeCategory"
                    className="w-2 h-2 bg-white rounded-full"
                    initial={false}
                    transition={{ type: "spring", stiffness: 500, damping: 30 }}
                  />
                )}
              </motion.button>
            );
          })}
        </motion.div>

        {/* Projects Grid */}
        <AnimatePresence mode="wait">
          <motion.div
            key={selectedCategory}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.5 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
          >
            {filteredProjects.map((project, index) => (
              <motion.div
                key={project._id}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                onHoverStart={() => setHoveredProject(project._id)}
                onHoverEnd={() => setHoveredProject(null)}
                className="group relative bg-gradient-to-br from-gray-900/90 to-gray-800/90 backdrop-blur-xl border border-gray-700/50 rounded-2xl overflow-hidden hover:border-cyan-400/50 transition-all duration-500"
                style={{
                  boxShadow: hoveredProject === project._id
                    ? '0 25px 50px rgba(0,0,0,0.5), 0 0 30px rgba(34, 211, 238, 0.2)'
                    : '0 10px 30px rgba(0,0,0,0.3)'
                }}
              >
                {/* Project Image */}
                <div className="relative h-48 overflow-hidden">
                  <motion.img
                    src={project.image}
                    alt={project.title}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-gray-900/80 via-transparent to-transparent" />

                  {/* Status Badge */}
                  <div className="absolute top-4 left-4">
                    <span className="px-3 py-1 bg-green-500/20 text-green-300 text-xs font-semibold rounded-full border border-green-400/30 backdrop-blur-sm">
                      {project.status}
                    </span>
                  </div>

                  {/* Featured Badge */}
                  {project.featured && (
                    <div className="absolute top-4 right-4">
                      <motion.div
                        animate={{ rotate: [0, 5, 0] }}
                        transition={{ duration: 2, repeat: Infinity }}
                        className="px-3 py-1 bg-gradient-to-r from-yellow-500/20 to-orange-500/20 text-yellow-300 text-xs font-semibold rounded-full border border-yellow-400/30 backdrop-blur-sm"
                      >
                        ⭐ Featured
                      </motion.div>
                    </div>
                  )}

                  {/* Hover Overlay */}
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: hoveredProject === project._id ? 1 : 0 }}
                    className="absolute inset-0 bg-gradient-to-t from-cyan-900/50 via-blue-900/30 to-transparent flex items-center justify-center gap-4"
                  >
                    <motion.a
                      href={project.githubUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      className="p-3 bg-gray-900/80 text-white rounded-full hover:bg-gray-800 transition-colors backdrop-blur-sm"
                    >
                      <FaGithub className="text-xl" />
                    </motion.a>
                    {project.liveUrl && (
                      <motion.a
                        href={project.liveUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        className="p-3 bg-cyan-600/80 text-white rounded-full hover:bg-cyan-500 transition-colors backdrop-blur-sm"
                      >
                        <FaExternalLinkAlt className="text-xl" />
                      </motion.a>
                    )}
                  </motion.div>
                </div>

                {/* Project Content */}
                <div className="p-6">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="text-xl font-bold text-white group-hover:text-cyan-300 transition-colors">
                      {project.title}
                    </h3>
                    <span className="text-sm text-gray-400 font-mono">{project.year}</span>
                  </div>

                  <p className="text-gray-300 text-sm leading-relaxed mb-4 line-clamp-3">
                    {project.description}
                  </p>

                  {/* Technologies */}
                  <div className="flex flex-wrap gap-2">
                    {project.technologies.slice(0, 4).map((tech) => {
                      const IconComponent = getTechIcon(tech);
                      return (
                        <motion.div
                          key={tech}
                          whileHover={{ scale: 1.05 }}
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-gradient-to-r from-gray-700/50 to-gray-600/50 text-gray-300 text-xs font-medium rounded-lg border border-gray-600/30 backdrop-blur-sm"
                        >
                          <IconComponent className="text-xs" />
                          <span>{tech}</span>
                        </motion.div>
                      );
                    })}
                    {project.technologies.length > 4 && (
                      <div className="inline-flex items-center px-3 py-1.5 bg-gradient-to-r from-cyan-600/20 to-blue-600/20 text-cyan-300 text-xs font-medium rounded-lg border border-cyan-400/30">
                        +{project.technologies.length - 4} more
                      </div>
                    )}
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </AnimatePresence>

        {/* View All Projects CTA */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="text-center mt-16"
        >
          <motion.a
            href="https://github.com/jeevan"
            target="_blank"
            rel="noopener noreferrer"
            whileHover={{
              scale: 1.05,
              y: -3,
              boxShadow: '0 10px 40px rgba(34, 211, 238, 0.4)',
            }}
            whileTap={{ scale: 0.98 }}
            className="group inline-flex items-center gap-3 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 px-8 py-4 rounded-2xl font-semibold text-white shadow-lg transition-all duration-300"
          >
            <FaGithub className="text-lg" />
            <span className="text-lg">View All Projects on GitHub</span>
            <motion.div
              className="opacity-0 group-hover:opacity-100 transition-opacity duration-300"
              animate={{ x: [0, 3, 0] }}
              transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            >
              →
            </motion.div>
          </motion.a>
        </motion.div>
      </div>
    </section>
  );
};

export default Projects;
