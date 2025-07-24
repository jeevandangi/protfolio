import { usePageTitle } from '../hooks/usePageTitle';
import Hero from '../components/Hero';
import About from '../components/About';
import Projects from '../components/Projects';
import FeaturedBlogs from '../components/FeaturedBlogs';
import Contact from '../components/Contact';

const HomePage = () => {
  usePageTitle(); // Uses default title from profile

  return (
    <>
      <Hero />
      <About />
      <Projects />
      <FeaturedBlogs />
      <Contact />
    </>
  );
};

export default HomePage;
