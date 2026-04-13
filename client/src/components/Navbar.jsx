import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { LogOut } from 'lucide-react';
import { motion } from 'framer-motion';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const isAuthPage = location.pathname === '/login' || location.pathname === '/register';

  return (
    <motion.nav 
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ type: 'spring', stiffness: 200, damping: 20 }}
      className={`fixed top-0 inset-x-0 z-50 transition-all duration-300 ${
        scrolled ? 'bg-white/70 backdrop-blur-md shadow-sm border-b border-white/20' : 'bg-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-20 items-center">
          <div className="flex">
            <Link to="/" className="flex-shrink-0 flex items-center">
              <span className="text-3xl font-extrabold font-sans tracking-tight bg-gradient-to-r from-primary-600 to-accent-500 bg-clip-text text-transparent">
                TPMS
              </span>
            </Link>
          </div>
          <div className="flex items-center">
            {user ? (
              <div className="flex items-center space-x-6">
                <span className="text-slate-600 text-sm hidden md:flex items-center font-medium bg-slate-100/50 px-4 py-2 rounded-full border border-slate-200/50 backdrop-blur-sm">
                  Welcome back, <span className="font-bold text-slate-800 ml-1">{user.name || 'User'}</span>
                </span>
                <button
                  onClick={handleLogout}
                  className="group flex items-center text-sm font-medium text-slate-500 hover:text-red-500 px-3 py-2 rounded-xl transition-all duration-200 hover:bg-red-50"
                >
                  <LogOut className="h-5 w-5 mr-1.5 transition-transform group-hover:-translate-x-1" />
                  Logout
                </button>
              </div>
            ) : !isAuthPage ? (
              <div className="flex space-x-3">
                <Link to="/login" className="btn-secondary">Log In</Link>
                <Link to="/register" className="btn-primary">Get Started</Link>
              </div>
            ) : null}
          </div>
        </div>
      </div>
    </motion.nav>
  );
};

export default Navbar;
