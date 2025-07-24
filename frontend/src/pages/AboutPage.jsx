import { usePageTitle } from '../hooks/usePageTitle';
import About from '../components/About';

const AboutPage = () => {
  usePageTitle('About');

  return <About />;
};

export default AboutPage;
