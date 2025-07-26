import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { TypeAnimation } from 'react-type-animation';
import { FaDownload, FaFolder, FaCode } from 'react-icons/fa';
import { HiSparkles } from 'react-icons/hi';
import { apiResponseHandler } from '../utils/apiResponse';
import LoadingSpinner from './LoadingSpinner';
import ErrorDisplay from './ErrorDisplay';

const Hero = () => {
  const [profileData, setProfileData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProfileData = async () => {
      try {
        const response = await apiResponseHandler('/profile');
        console.log(response);

        if (response?.data?.success) {
          setProfileData(response.data.data);
        } else {
          setError('Failed to load profile data');
        }
      } catch (error) {
        console.error('Error fetching profile data:', error);
        setError('Failed to connect to server');
      } finally {
        setLoading(false);
      }
    };

    fetchProfileData();
  }, []);

  console.log("profileData", profileData?.bio);


  // Loading state
  if (loading) {
    return (
      <section
        id="home"
        className="min-h-screen relative text-white flex items-center justify-center px-6"
      >
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-cyan-400 mx-auto"></div>
          <p className="mt-4 text-cyan-300">Loading...</p>
        </div>
      </section>
    );
  }

  // Error state
  if (error) {
    return (
      <section
        id="home"
        className="min-h-screen relative text-white flex items-center justify-center px-6"
      >
        <ErrorDisplay message={error} />
      </section>
    );
  }

  // Loading state
  if (loading || !profileData) {
    return (
      <section
        id="home"
        className="min-h-screen relative text-white flex items-center justify-center px-6"
      >
        <LoadingSpinner message="Loading profile..." />
      </section>
    );
  }

  const data = profileData;

  return (
    <section
      id="home"
      className="min-h-screen mt-20 relative text-white flex items-center justify-center px-6"
    >
      {/* Content uses global Hero background */}

      {/* Hero Container */}
      <div className="max-w-6xl w-full space-y-16">
        {/* Main Content - Name and Description */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.3 }}
          className="text-center space-y-8"
        >
          {/* Greeting */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.1 }}
            className="inline-block"
          >
            <div className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-cyan-500/10 to-blue-500/10 backdrop-blur-xl border border-cyan-400/20 rounded-full text-cyan-300 font-medium mb-6">
              <motion.div
                animate={{
                  scale: [1, 1.1, 1],
                  opacity: [0.8, 1, 0.8]
                }}
                transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                className="w-3 h-3 bg-green-400 rounded-full mr-3"
                style={{ boxShadow: '0 0 8px rgba(34, 197, 94, 0.6)' }}
              />
              <span className="text-xl">{data.greeting}</span>
            </div>
          </motion.div>

          {/* Main Title */}
          <motion.h1
            className="text-5xl md:text-7xl lg:text-8xl font-black leading-tight"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 1.2 }}
          >
            I'm a{' '}
            <span className="bg-gradient-to-r from-blue-400 via-cyan-400 to-purple-400 bg-clip-text text-transparent">
              <TypeAnimation
                sequence={data.typewriterTexts?.length > 0 ? data.typewriterTexts.reduce((acc, text) => {
                  acc.push(text, 2500);
                  return acc;
                }, []) : ['Developer', 2500]}
                wrapper="span"
                speed={50}
                repeat={Infinity}
                className="font-bold"
              />
            </span>
          </motion.h1>

          {/* Description */}
          <motion.p
            className="text-xl md:text-2xl text-gray-300 font-light leading-relaxed max-w-4xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 1 }}
          >
            {data.description}
          </motion.p>

          {/* CTA Buttons */}
          <motion.div
            className="flex flex-col sm:flex-row gap-6 justify-center items-center pt-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8, duration: 1 }}
          >
            <motion.a
              href={data.resumeUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="group relative px-8 py-4 bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-semibold rounded-lg overflow-hidden transition-all duration-300 hover:shadow-2xl hover:shadow-cyan-500/25"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <span className="relative z-10 flex items-center gap-3">
                <FaDownload className="text-lg" />
                Download Resume
              </span>
              <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-purple-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            </motion.a>

            <motion.a
              href="#projects"
              className="group px-8 py-4 border-2 border-cyan-400 text-cyan-400 font-semibold rounded-lg hover:bg-cyan-400 hover:text-black transition-all duration-300"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <span className="flex items-center gap-3">
                <FaFolder className="text-lg" />
                View Projects
              </span>
            </motion.a>
          </motion.div>
        </motion.div>

        {/* Terminal Section */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.2, delay: 1 }}
          className="max-w-4xl mx-auto"
        >
          <div className="relative bg-black/95 rounded-2xl overflow-hidden"
            style={{
              background: 'linear-gradient(135deg, rgba(0,0,0,0.95) 0%, rgba(20,20,40,0.95) 50%, rgba(0,0,0,0.95) 100%)',
              boxShadow: '0 25px 50px rgba(0,0,0,0.5), 0 0 50px rgba(34, 211, 238, 0.1)',
              border: '1px solid rgba(34, 211, 238, 0.2)'
            }}
          >
            {/* Terminal Header */}
            <div className="flex items-center justify-between px-6 py-4 bg-gray-800/50 border-b border-cyan-400/20">
              <div className="flex items-center space-x-3">
                <div className="flex space-x-2">
                  <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                  <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                  <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                </div>
                <span className="text-cyan-300 font-mono text-sm">portfolio.js</span>
              </div>
              <div className="text-gray-400 text-xs font-mono">~/projects/portfolio</div>
            </div>

            {/* Terminal Content */}
            <div className="p-6 font-mono text-sm space-y-3">
              {data.terminalCommands?.length > 0 ? data.terminalCommands.map((cmd, index) => (
                <div key={index}>
                  <div className="text-green-400">
                    <span className="text-cyan-400">$</span> {cmd.command}
                  </div>
                  <div className={`ml-4 ${cmd.type === 'json' ? 'text-yellow-300' : 'text-white'}`}>
                    {cmd.output}
                  </div>
                  {index < data.terminalCommands.length - 1 && <div className="mt-4"></div>}
                </div>
              )) : (
                <div>
                  <div className="text-green-400">
                    <span className="text-cyan-400">$</span> echo "Loading..."
                  </div>
                  <div className="text-white ml-4">Please wait while data loads...</div>
                </div>
              )}

              <motion.div
                className="text-green-400 mt-4"
                animate={{ opacity: [0, 1, 0] }}
                transition={{ duration: 1.5, repeat: Infinity }}
              >
                <span className="text-cyan-400">$</span> <span className="bg-cyan-400 w-2 h-4 inline-block ml-1"></span>
              </motion.div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default Hero;
