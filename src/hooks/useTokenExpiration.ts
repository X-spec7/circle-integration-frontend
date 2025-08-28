import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export const useTokenExpiration = (onTokenExpired?: () => void) => {
  const navigate = useNavigate();

  useEffect(() => {
    const handleTokenExpired = () => {
      console.log('Token expired, redirecting to login');
      if (onTokenExpired) {
        onTokenExpired();
      }
      navigate('/login?tokenExpired=true', { replace: true });
    };

    window.addEventListener('tokenExpired', handleTokenExpired);

    return () => {
      window.removeEventListener('tokenExpired', handleTokenExpired);
    };
  }, [navigate, onTokenExpired]);
}; 