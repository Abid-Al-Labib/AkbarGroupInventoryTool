import React, { useEffect } from 'react';
import { useAuth } from '@/context/AuthContext'; // Adjust the import path as needed
import { useNavigate } from 'react-router-dom';
import { Loader } from 'lucide-react';

interface PrivateRouteProps {
  children: React.ReactNode;
}

const PrivateRoute: React.FC<PrivateRouteProps> = ({ children }) => {
  const { session, loading } = useAuth(); // Get session and loading state
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && !session) { // Only redirect when loading is done
        navigate('/login');
    }
  }, [session, loading, navigate]);

  if (loading) {
    return (
        <div className="absolute inset-0 flex justify-center items-center"><Loader/></div>
    ); // Show a loading message while session is being checked
  }

  // If session exists, render the children
  return session ? <>{children}</> : null;
};

export default PrivateRoute;
