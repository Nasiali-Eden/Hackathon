import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { MapPin, LogOut, User, PlusCircle } from 'lucide-react';
import { motion } from 'framer-motion';

export default function Navbar() {
  const { currentUser, logout, userProfile } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/');
    } catch (error) {
      console.error('Failed to logout:', error);
    }
  };

  return (
    <nav className="bg-white shadow-sm sticky top-0 z-50 border-b border-muted2/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link to="/" className="flex items-center space-x-2">
            <MapPin className="h-8 w-8 text-accent" />
            <span className="text-2xl font-bold text-brown">GigMap</span>
          </Link>

          <div className="hidden md:flex items-center space-x-6">
            <Link 
              to="/browse" 
              className="text-text hover:text-accent transition-colors font-medium"
            >
              Browse Gigs
            </Link>
            {currentUser && (
              <>
                <Link 
                  to="/create-gig" 
                  className="flex items-center space-x-1 text-text hover:text-accent transition-colors font-medium"
                >
                  <PlusCircle className="h-5 w-5" />
                  <span>Post a Gig</span>
                </Link>
                <Link 
                  to="/my-gigs" 
                  className="text-text hover:text-accent transition-colors font-medium"
                >
                  My Gigs
                </Link>
              </>
            )}
          </div>

          <div className="flex items-center space-x-4">
            {currentUser ? (
              <>
                <Link
                  to="/profile"
                  className="flex items-center space-x-2 text-text hover:text-accent transition-colors"
                >
                  <User className="h-5 w-5" />
                  <span className="hidden sm:inline">{userProfile?.displayName || currentUser.email}</span>
                </Link>
                <button
                  onClick={handleLogout}
                  className="flex items-center space-x-1 text-muted hover:text-accent transition-colors"
                >
                  <LogOut className="h-5 w-5" />
                  <span className="hidden sm:inline">Logout</span>
                </button>
              </>
            ) : (
              <div className="flex items-center space-x-3">
                <Link
                  to="/login"
                  className="text-text hover:text-accent transition-colors font-medium"
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="btn-primary"
                >
                  Sign Up
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}

