import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  FaReact, FaNodeJs, FaJs, FaPython, FaDocker, FaHtml5, FaCss3Alt, FaGitAlt, FaServer
} from 'react-icons/fa';
import {
  SiTypescript, SiNextdotjs, SiTailwindcss, SiMongodb, SiPostgresql,
  SiExpress, SiGraphql
} from 'react-icons/si';
import { apiResponseHandler } from '../utils/apiResponse';
import LoadingSpinner from './LoadingSpinner';
import ErrorDisplay from './ErrorDisplay';

// Icon mapping for dynamic skills
const iconMap = {
  FaJs: FaJs,
  FaReact: FaReact,
  FaNodeJs: FaNodeJs,
  FaPython: FaPython,
  FaDatabase: SiMongodb, // Use MongoDB icon for database
  FaHtml5: FaHtml5,
  FaCss3Alt: FaCss3Alt,
  FaGitAlt: FaGitAlt,
  FaDocker: FaDocker,
  FaServer: FaServer,
  SiTypescript: SiTypescript,
  SiNextdotjs: SiNextdotjs,
  SiMongodb: SiMongodb,
  SiPostgresql: SiPostgresql,
  SiExpress: SiExpress,
  SiGraphql: SiGraphql,
  SiTailwindcss: SiTailwindcss
};

const About = () => {
  const [profileData, setProfileData] = useState(null);
  const [skillsData, setSkillsData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [imageLoaded, setImageLoaded] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch profile data
        const profileResponse = await apiResponseHandler('/profile');
        if (profileResponse?.data?.success) {
          setProfileData(profileResponse.data.data);
        } else {
          setError('Failed to load profile data');
          return;
        }

        // Fetch skills data
        const skillsResponse = await apiResponseHandler('/skills');
        if (skillsResponse?.data?.success) {
          setSkillsData(skillsResponse.data.data);
        } else {
          setError('Failed to load skills data');
        }
      } catch (error) {
        console.error('Error fetching data:', error);
        setError('Failed to connect to server');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Error state
  if (error) {
    return (
      <section id="about" className="py-20 px-6">
        <div className="max-w-6xl mx-auto">
          <ErrorDisplay message={error} />
        </div>
      </section>
    );
  }

  // Loading state or no data
  if (loading || !profileData || skillsData.length === 0) {
    return (
      <section id="about" className="py-20 px-6">
        <div className="max-w-6xl mx-auto">
          <LoadingSpinner message="Loading about section..." />
        </div>
      </section>
    );
  }

  const profile = profileData;
  const skills = skillsData;

  return (
    <section id="about" className="min-h-screen relative">
      {/* Content uses global background */}

      {/* MAIN CONTENT */}
      <div className="relative z-10 container mx-auto px-6 py-20">
        {/* Hero Section */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 1, ease: "easeOut" }}
          className="text-center mb-20"
        >
          <motion.h1
            className="text-6xl md:text-8xl font-black mb-6"
            style={{
              background: 'linear-gradient(45deg, #06b6d4, #3b82f6, #8b5cf6, #06b6d4)',
              backgroundSize: '300% 300%',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text'
            }}
            animate={{
              backgroundPosition: ['0% 50%', '100% 50%', '0% 50%']
            }}
            transition={{
              duration: 5,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          >
            JEEVAN DANGI
          </motion.h1>

          <motion.p
            className="text-2xl md:text-3xl text-gray-300 mb-8"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ delay: 0.5, duration: 1 }}
          >
            Full Stack Developer & Digital Innovator
          </motion.p>

          <motion.div
            className="w-32 h-1 bg-gradient-to-r from-cyan-400 to-purple-500 mx-auto rounded-full"
            initial={{ width: 0 }}
            whileInView={{ width: 128 }}
            transition={{ delay: 1, duration: 1 }}
          />
        </motion.div>

        {/* Main Content Grid */}
        <div className="grid lg:grid-cols-2 gap-20 items-start">
          {/* Left Column - Profile & Bio */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 1, delay: 0.2 }}
            className="space-y-12"
          >
            {/* Profile Image */}
            <div className="relative group">
              <motion.div
                className="relative w-80 h-80 mx-auto lg:mx-0"
                whileHover={{ scale: 1.05 }}
                transition={{ duration: 0.3 }}
              >
                {/* Animated Border */}
                <motion.div
                  className="absolute inset-0 rounded-full p-1"
                  style={{
                    background: 'linear-gradient(45deg, #06b6d4, #3b82f6, #8b5cf6, #06b6d4)',
                    backgroundSize: '300% 300%'
                  }}
                  animate={{
                    backgroundPosition: ['0% 50%', '100% 50%', '0% 50%']
                  }}
                  transition={{
                    duration: 3,
                    repeat: Infinity,
                    ease: "linear"
                  }}
                >
                  <div className="w-full h-full rounded-full bg-black p-2 relative">
                    {/* Loading placeholder */}
                    {!imageLoaded && (
                      <div className="absolute inset-2 rounded-full bg-gradient-to-br from-gray-800 to-gray-900 flex items-center justify-center">
                        <motion.div
                          className="w-8 h-8 border-2 border-cyan-400 border-t-transparent rounded-full"
                          animate={{ rotate: 360 }}
                          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                        />
                      </div>
                    )}

                    <motion.img
                      src={profile.profileImage}
                      alt={profile.name}
                      className="w-full h-full object-cover rounded-full"
                      initial={{ opacity: 0, scale: 0.8, rotate: -10 }}
                      animate={{
                        opacity: imageLoaded ? 1 : 0,
                        scale: imageLoaded ? 1 : 0.8,
                        rotate: imageLoaded ? 0 : -10
                      }}
                      transition={{
                        duration: 1.2,
                        delay: 0.3,
                        type: "spring",
                        stiffness: 100
                      }}
                      whileHover={{
                        scale: 1.1,
                        rotate: 5,
                        transition: { duration: 0.3 }
                      }}
                      onLoad={() => setImageLoaded(true)}
                    />

                    {/* Hover overlay effect */}
                    <motion.div
                      className="absolute inset-2 rounded-full bg-gradient-to-t from-cyan-900/30 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                      initial={{ opacity: 0 }}
                    />
                  </div>
                </motion.div>

                {/* Floating Elements */}
                <motion.div
                  className="absolute -top-4 -right-4 w-16 h-16 bg-cyan-500/20 rounded-full backdrop-blur-sm border border-cyan-400/30 flex items-center justify-center"
                  animate={{
                    y: [0, -10, 0],
                    rotate: [0, 180, 360]
                  }}
                  transition={{
                    duration: 4,
                    repeat: Infinity,
                    ease: "easeInOut"
                  }}
                >
                  <span className="text-cyan-400 text-xl">⚡</span>
                </motion.div>

                <motion.div
                  className="absolute -bottom-4 -left-4 w-12 h-12 bg-purple-500/20 rounded-full backdrop-blur-sm border border-purple-400/30 flex items-center justify-center"
                  animate={{
                    y: [0, 10, 0],
                    rotate: [360, 180, 0]
                  }}
                  transition={{
                    duration: 3,
                    repeat: Infinity,
                    ease: "easeInOut",
                    delay: 1
                  }}
                >
                  <span className="text-purple-400 text-sm">🚀</span>
                </motion.div>
              </motion.div>
            </div>

            {/* Bio Text */}
            <motion.div
              className="space-y-6"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.8 }}
            >
              <h3 className="text-3xl font-bold text-white">
                Passionate Developer & Problem Solver
              </h3>

              <p className="text-lg text-gray-300 leading-relaxed">
                {profile.bio}
              </p>

              <p className="text-lg text-gray-300 leading-relaxed">
                {profile.bioExtended}
              </p>

              <motion.button
                className="px-8 py-3 bg-gradient-to-r from-cyan-500 to-purple-500 text-white font-semibold rounded-full hover:shadow-lg hover:shadow-cyan-500/25 transition-all duration-300"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Let's Connect
              </motion.button>
            </motion.div>
          </motion.div>

          {/* Right Column - Skills */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 1, delay: 0.4 }}
            className="space-y-8"
          >
            <h3 className="text-4xl font-bold text-white mb-8">
              <span className="bg-gradient-to-r from-cyan-400 to-purple-500 bg-clip-text text-transparent">
                Technologies & Expertise
              </span>
            </h3>

            <div className="grid grid-cols-2 gap-6">
              {skills.map((skill, index) => (
                <motion.div
                  key={skill.name}
                  initial={{ opacity: 0, scale: 0.8 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1, duration: 0.5 }}
                  whileHover={{
                    scale: 1.05,
                    boxShadow: '0 10px 30px rgba(6, 182, 212, 0.3)'
                  }}
                  className="p-6 bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl hover:border-cyan-400/30 transition-all duration-300 group"
                >
                  <div className="flex items-center space-x-4 mb-4">
                    {iconMap[skill.icon] ? (
                      React.createElement(iconMap[skill.icon], {
                        className: `text-3xl ${skill.color} group-hover:scale-110 transition-transform duration-300`
                      })
                    ) : (
                      <div className={`text-3xl ${skill.color} group-hover:scale-110 transition-transform duration-300`}>
                        🔧
                      </div>
                    )}
                    <span className="text-white font-medium">{skill.name}</span>
                  </div>

                  <div className="w-full bg-gray-700/50 rounded-full h-2 overflow-hidden">
                    <motion.div
                      className="h-full bg-gradient-to-r from-cyan-400 to-purple-500 rounded-full"
                      initial={{ width: 0 }}
                      whileInView={{ width: `${skill.level}%` }}
                      viewport={{ once: true }}
                      transition={{ delay: index * 0.1 + 0.5, duration: 1 }}
                    />
                  </div>

                  <div className="text-right mt-2">
                    <span className="text-sm text-gray-400">{skill.level}%</span>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default About;
