import { useEffect, useState } from 'react';
import { apiResponseHandler } from '../utils/apiResponse';

export const usePageTitle = (pageTitle = '') => {
  const [profileData, setProfileData] = useState(null);

  useEffect(() => {
    const fetchProfileData = async () => {
      try {
        const response = await apiResponseHandler('/profile');
        if (response?.data?.success) {
          setProfileData(response.data.data);
        }
      } catch (error) {
        console.error('Error fetching profile data for title:', error);
      }
    };

    fetchProfileData();
  }, []);

  useEffect(() => {
    if (profileData) {
      const baseTitle = profileData.seo?.title || `${profileData.name} - ${profileData.title}`;
      const fullTitle = pageTitle ? `${pageTitle} | ${baseTitle}` : baseTitle;
      document.title = fullTitle;
      
      // Update meta description
      const metaDescription = document.querySelector('meta[name="description"]');
      if (metaDescription && profileData.seo?.description) {
        metaDescription.setAttribute('content', profileData.seo.description);
      }
      
      // Update meta keywords
      const metaKeywords = document.querySelector('meta[name="keywords"]');
      if (metaKeywords && profileData.seo?.keywords) {
        metaKeywords.setAttribute('content', profileData.seo.keywords.join(', '));
      }
    }
  }, [profileData, pageTitle]);

  return profileData;
};
