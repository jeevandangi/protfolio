import { usePageTitle } from '../hooks/usePageTitle';
import Projects from '../components/Projects';

const ProjectsPage = () => {
  usePageTitle('Projects');

  return <Projects />;
};

export default ProjectsPage;
