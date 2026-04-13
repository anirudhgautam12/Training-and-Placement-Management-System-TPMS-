import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';
import { motion } from 'framer-motion';
import { LogIn, ArrowRight } from 'lucide-react';
import api from '../services/api';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const from = location.state?.from?.pathname || '/';

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const res = await api.post('/auth/login', { email, password });
      const { token, user } = res.data;
      
      login(token, user);
      toast.success('Welcome back!');
      
      if (from === '/') {
        if (user.role === 'admin') navigate('/admin');
        else if (user.role === 'company') navigate('/company');
        else navigate('/student');
      } else {
        navigate(from, { replace: true });
      }
    } catch (error) {
      toast.error(error.response?.data?.error || 'Failed to log in');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden bg-slate-50 pt-16">
      {/* Background Mesh */}
      <div className="absolute inset-0 bg-mesh opacity-40 blur-3xl pointer-events-none" />
      
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
        className="max-w-md w-full mx-4 relative z-10"
      >
        <div className="glass-card p-10 space-y-8">
          <div className="text-center">
             <div className="inline-flex items-center justify-center p-3 bg-primary-100 rounded-2xl mb-4 text-primary-600 shadow-sm border border-primary-200/50">
               <LogIn className="w-6 h-6" />
             </div>
            <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">
              Welcome Back
            </h2>
            <p className="mt-2 text-sm text-slate-500">
              Demo: Input <span className="font-medium text-slate-700 bg-white px-1.5 py-0.5 rounded border">admin</span>, <span className="font-medium text-slate-700 bg-white px-1.5 py-0.5 rounded border">company</span>, or <span className="font-medium text-slate-700 bg-white px-1.5 py-0.5 rounded border">student</span> in your email.
            </p>
          </div>
          <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
            <div className="space-y-5">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">Email address</label>
                <input
                  name="email"
                  type="email"
                  required
                  className="input-field"
                  placeholder="name@university.edu"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="block text-sm font-medium text-slate-700">Password</label>
                  <a href="#" className="text-sm font-medium text-primary-600 hover:text-primary-500 hover:underline">Forgot?</a>
                </div>
                <input
                  name="password"
                  type="password"
                  required
                  className="input-field"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
            </div>

            <button type="submit" className="w-full btn-primary py-3 group">
              Sign In
              <ArrowRight className="w-4 h-4 ml-2 transition-transform group-hover:translate-x-1" />
            </button>
          </form>
        </div>
        
        <p className="mt-6 text-center text-sm text-slate-600">
          First time here?{' '}
          <Link to="/register" className="font-bold text-primary-600 hover:text-primary-700 hover:underline transition-colors">
            Create an account
          </Link>
        </p>
      </motion.div>
    </div>
  );
};

export default Login;
