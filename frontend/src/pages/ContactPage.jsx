import { usePageTitle } from '../hooks/usePageTitle';
import Contact from '../components/Contact';

const ContactPage = () => {
  usePageTitle('Contact');

  return <Contact />;
};

export default ContactPage;
