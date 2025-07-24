
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useEffect } from 'react';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import HomePage from './pages/HomePage';
import AboutPage from './pages/AboutPage';
import ProjectsPage from './pages/ProjectsPage';
import ContactPage from './pages/ContactPage';
import BlogPage from './pages/BlogPage';
import BlogPostPage from './pages/BlogPostPage';
import Admin from './pages/Admin';
import ThemeProvider from './context/ThemeContext';

// Component to handle conditional navbar/footer rendering
function AppContent() {
  const location = useLocation();
  const isAdminRoute = location.pathname.startsWith('/admin');

  // Update page title based on current route
  useEffect(() => {
    const getPageTitle = (pathname) => {
      const baseName = 'Jeevan Dangi - Full Stack Developer';

      switch (pathname) {
        case '/':
          return baseName;
        case '/about':
          return `About - ${baseName}`;
        case '/projects':
          return `Projects - ${baseName}`;
        case '/blog':
          return `Blog - ${baseName}`;
        case '/contact':
          return `Contact - ${baseName}`;
        case '/admin':
          return `Admin Dashboard - ${baseName}`;
        default:
          if (pathname.startsWith('/blog/')) {
            return `Blog Post - ${baseName}`;
          }
          if (pathname.startsWith('/admin')) {
            return `Admin - ${baseName}`;
          }
          return baseName;
      }
    };

    document.title = getPageTitle(location.pathname);
  }, [location.pathname]);

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* EXACT HERO BACKGROUND FOR ENTIRE WEBSITE */}
      <div className="absolute inset-0 -z-10">
        {/* Brighter DNA Helix Code Strands */}
        {Array.from({ length: 3 }).map((_, i) => (
          <motion.div
            key={`dna-${i}`}
            className="absolute"
            style={{
              left: `${20 + i * 30}%`,
              top: '10%',
              height: '80%',
              width: '2px'
            }}
          >
            {Array.from({ length: 20 }).map((_, j) => (
              <motion.div
                key={j}
                initial={{ opacity: 0, scale: 0 }}
                animate={{
                  opacity: [0, 0.8, 0],
                  scale: [0, 1.2, 0],
                  x: [0, Math.sin(j * 0.5) * 30, 0]
                }}
                transition={{
                  duration: 4,
                  repeat: Infinity,
                  delay: j * 0.2 + i * 1.5,
                  ease: "easeInOut"
                }}
                className="absolute w-1.5 h-1.5 bg-cyan-300 rounded-full"
                style={{
                  top: `${j * 5}%`,
                  boxShadow: '0 0 12px rgba(34, 211, 238, 1)'
                }}
              />
            ))}
          </motion.div>
        ))}

        {/* Brighter Holographic Code Panels */}
        {Array.from({ length: 4 }).map((_, i) => (
          <motion.div
            key={`holo-${i}`}
            initial={{ opacity: 0, rotateY: 90 }}
            animate={{
              opacity: [0, 0.5, 0],
              rotateY: [90, 0, -90],
              scale: [0.8, 1, 0.8]
            }}
            transition={{
              duration: 8,
              repeat: Infinity,
              delay: i * 2,
              ease: "easeInOut"
            }}
            className="absolute bg-gradient-to-r from-cyan-500/20 to-blue-500/20 backdrop-blur-sm border border-cyan-400/40 rounded-lg p-4"
            style={{
              left: `${10 + i * 20}%`,
              top: `${20 + Math.sin(i) * 30}%`,
              width: '200px',
              height: '120px',
              transform: 'perspective(1000px)',
              boxShadow: '0 0 20px rgba(34, 211, 238, 0.3)'
            }}
          >
            <div className="text-cyan-300 font-mono text-xs opacity-80">
              {['function()', 'const data', 'return jsx', 'export {}'][i]}
            </div>
          </motion.div>
        ))}

        {/* Brighter Quantum Particles */}
        {Array.from({ length: 25 }).map((_, i) => (
          <motion.div
            key={`quantum-${i}`}
            initial={{ opacity: 0 }}
            animate={{
              opacity: [0, 0.9, 0],
              scale: [0, 1.8, 0],
              x: [0, Math.random() * 200 - 100],
              y: [0, Math.random() * 200 - 100]
            }}
            transition={{
              duration: 3 + Math.random() * 2,
              repeat: Infinity,
              delay: Math.random() * 5,
              ease: "easeOut"
            }}
            className="absolute w-1.5 h-1.5 bg-purple-300 rounded-full"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              boxShadow: '0 0 10px rgba(168, 85, 247, 1)'
            }}
          />
        ))}

        {/* Brighter Neural Network Connections */}
        <svg className="absolute inset-0 w-full h-full opacity-35" viewBox="0 0 1000 1000">
          <defs>
            <linearGradient id="neuralGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#22d3ee" />
              <stop offset="50%" stopColor="#3b82f6" />
              <stop offset="100%" stopColor="#8b5cf6" />
            </linearGradient>
          </defs>

          {Array.from({ length: 15 }).map((_, i) => (
            <motion.circle
              key={`node-${i}`}
              cx={100 + (i % 5) * 200}
              cy={150 + Math.floor(i / 5) * 200}
              r="3"
              fill="url(#neuralGradient)"
              initial={{ opacity: 0, scale: 0 }}
              animate={{
                opacity: [0, 1, 0],
                scale: [0, 1.5, 0]
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                delay: i * 0.3,
                ease: "easeInOut"
              }}
            />
          ))}

          {Array.from({ length: 20 }).map((_, i) => (
            <motion.path
              key={`connection-${i}`}
              d={`M${100 + (i % 5) * 200},${150 + Math.floor(i / 5) * 200} L${300 + (i % 3) * 200},${350 + Math.floor(i / 3) * 150}`}
              stroke="url(#neuralGradient)"
              strokeWidth="1"
              fill="none"
              initial={{ pathLength: 0, opacity: 0 }}
              animate={{
                pathLength: [0, 1, 0],
                opacity: [0, 0.6, 0]
              }}
              transition={{
                duration: 3,
                repeat: Infinity,
                delay: i * 0.2,
                ease: "easeInOut"
              }}
            />
          ))}
        </svg>

        {/* Brighter Neon Glow Orbs */}
        <motion.div
          animate={{
            scale: [1, 1.5, 1],
            opacity: [0.15, 0.4, 0.15]
          }}
          transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-10 left-10 w-96 h-96 bg-gradient-to-r from-cyan-500/20 to-blue-500/20 rounded-full blur-3xl"
          style={{ filter: 'blur(60px)' }}
        />
        <motion.div
          animate={{
            scale: [1.2, 1, 1.2],
            opacity: [0.12, 0.3, 0.12]
          }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
          className="absolute bottom-10 right-10 w-[500px] h-[500px] bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-full blur-3xl"
          style={{ filter: 'blur(80px)' }}
        />

        {/* Brighter Code Editor Grid Lines */}
        <div className="absolute inset-0">
          {Array.from({ length: 20 }).map((_, i) => (
            <motion.div
              key={`grid-h-${i}`}
              initial={{ opacity: 0 }}
              animate={{ opacity: [0, 0.15, 0] }}
              transition={{
                duration: 4,
                repeat: Infinity,
                delay: i * 0.2
              }}
              className="absolute w-full h-px bg-cyan-400/15"
              style={{ top: `${i * 5}%` }}
            />
          ))}
          {Array.from({ length: 30 }).map((_, i) => (
            <motion.div
              key={`grid-v-${i}`}
              initial={{ opacity: 0 }}
              animate={{ opacity: [0, 0.08, 0] }}
              transition={{
                duration: 6,
                repeat: Infinity,
                delay: i * 0.1
              }}
              className="absolute h-full w-px bg-blue-400/8"
              style={{ left: `${i * 3.33}%` }}
            />
          ))}
        </div>

        {/* Brighter Flowing Binary Code */}
        {Array.from({ length: 8 }).map((_, i) => (
          <motion.div
            key={`binary-${i}`}
            initial={{ opacity: 0, y: "100vh" }}
            animate={{
              opacity: [0, 0.4, 0],
              y: ["-10vh", "-110vh"]
            }}
            transition={{
              duration: 15 + i * 2,
              repeat: Infinity,
              delay: i * 3,
              ease: "linear"
            }}
            className="absolute text-cyan-300/30 font-mono text-xs whitespace-nowrap"
            style={{
              left: `${10 + i * 12}%`,
              transform: `rotate(${-15 + i * 5}deg)`,
              textShadow: '0 0 4px rgba(34, 211, 238, 0.5)'
            }}
          >
            {Array.from({ length: 50 }).map((_, j) => (
              <div key={j} className="mb-2">
                {Math.random() > 0.5 ? '1' : '0'}{Math.random() > 0.5 ? '1' : '0'}{Math.random() > 0.5 ? '1' : '0'}{Math.random() > 0.5 ? '1' : '0'}
              </div>
            ))}
          </motion.div>
        ))}

        {/* Brighter Particle Network */}
        {Array.from({ length: 12 }).map((_, i) => (
          <motion.div
            key={`particle-${i}`}
            initial={{ opacity: 0 }}
            animate={{
              opacity: [0, 0.8, 0],
              scale: [0.5, 1.2, 0.5],
              x: [0, Math.sin(i) * 100, 0],
              y: [0, Math.cos(i) * 100, 0]
            }}
            transition={{
              duration: 6 + i * 0.5,
              repeat: Infinity,
              delay: i * 0.8,
              ease: "easeInOut"
            }}
            className="absolute w-2.5 h-2.5 bg-cyan-300/70 rounded-full"
            style={{
              left: `${20 + i * 7}%`,
              top: `${15 + Math.sin(i) * 30}%`,
              boxShadow: '0 0 15px rgba(34, 211, 238, 0.8)'
            }}
          />
        ))}
      </div>
      {/* Conditionally render navbar - hide on admin routes */}
      {!isAdminRoute && <Navbar />}

      <main>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/projects" element={<ProjectsPage />} />
          <Route path="/blog" element={<BlogPage />} />
          <Route path="/blog/:slug" element={<BlogPostPage />} />
          <Route path="/contact" element={<ContactPage />} />
          <Route path="/admin" element={<Admin />} />
        </Routes>
      </main>

      {/* Conditionally render footer - hide on admin routes */}
      {!isAdminRoute && <Footer />}
    </div>
  );
}

function App() {
  return (
    <ThemeProvider>
      <Router>
        <AppContent />
      </Router>
    </ThemeProvider>
  );
}

export default App;
