// pages/AuthRedirect.tsx
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export const AuthRedirect: React.FC = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const token = urlParams.get('token');
    const user = urlParams.get('user');

    if (token && user) {
      localStorage.setItem('token', token);
      localStorage.setItem('user', user);
      navigate('/');
    } else {
      console.error('No token or user found in redirect');
      navigate('/login');
    }
  }, [navigate]);

  return <p>Logging in...</p>;
};
