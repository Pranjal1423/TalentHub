import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

const PageTitle = () => {
  const location = useLocation();

  useEffect(() => {
    const getPageTitle = (pathname) => {
      switch (pathname) {
        case '/':
          return 'TalentHub - Find Your Dream Job';
        case '/login':
          return 'Login - TalentHub';
        case '/register':
          return 'Sign Up - TalentHub';
        case '/jobs':
          return 'Browse Jobs - TalentHub';
        case '/post-job':
          return 'Post a Job - TalentHub';
        case '/dashboard':
          return 'Dashboard - TalentHub';
        case '/dashboard/applications':
          return 'My Applications - TalentHub';
        case '/dashboard/jobs':
          return 'My Jobs - TalentHub';
        case '/dashboard/profile':
          return 'Profile - TalentHub';
        default:
          if (pathname.startsWith('/jobs/')) {
            return 'Job Details - TalentHub';
          }
          return 'TalentHub - Find Your Dream Job';
      }
    };

    const title = getPageTitle(location.pathname);
    document.title = title;
  }, [location.pathname]);

  return null;
};

export default PageTitle; 