import { usePageTitle } from '../hooks/usePageTitle';
import Blog from '../components/Blog';

const BlogPage = () => {
  usePageTitle('Blog');

  return <Blog />;
};

export default BlogPage;
