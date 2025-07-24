import { usePageTitle } from '../hooks/usePageTitle';
import BlogPost from '../components/BlogPost';

const BlogPostPage = () => {
  usePageTitle('Blog Post');

  return <BlogPost />;
};

export default BlogPostPage;
