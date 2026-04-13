import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { motion } from 'framer-motion';
import { UserPlus, ArrowRight } from 'lucide-react';
import api from '../services/api';

const Register = () => {
  const [role, setRole] = useState('student');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      await api.post('/auth/register', { name, email, password, role });
      toast.success('Account created brilliantly! Please log in.');
      navigate('/login');
    } catch (error) {
      toast.error(error.response?.data?.error || 'Registration failed');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center relative bg-slate-50 overflow-hidden pt-16">
      {/* Background Mesh Subtle */}
      <div className="absolute inset-0 bg-mesh-subtle opacity-70 blur-2xl pointer-events-none" />
      
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.4, ease: 'easeOut' }}
        className="max-w-md w-full mx-4 relative z-10"
      >
        <div className="glass-card p-10 space-y-8">
          <div className="text-center">
             <div className="inline-flex items-center justify-center p-3 bg-accent-100 rounded-2xl mb-4 text-accent-600 shadow-sm border border-accent-200/50">
               <UserPlus className="w-6 h-6" />
             </div>
            <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">
              Create an account
            </h2>
            <p className="mt-2 text-sm text-slate-500">
              Join the finest platform bridging academia and industry.
            </p>
          </div>
          
          <form className="mt-4 space-y-5" onSubmit={handleSubmit}>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">I am a...</label>
                <select 
                  value={role} 
                  onChange={(e) => setRole(e.target.value)}
                  className="input-field cursor-pointer"
                >
                  <option value="student">Student looking for placements</option>
                  <option value="company">Company seeking talent</option>
                </select>
              </div>
              <div>
                 <label className="block text-sm font-medium text-slate-700 mb-1.5">Full Name</label>
                <input type="text" required className="input-field" placeholder={role === 'company' ? "Corporate Entity Ltd." : "John Doe"} value={name} onChange={(e) => setName(e.target.value)} />
              </div>
              <div>
                 <label className="block text-sm font-medium text-slate-700 mb-1.5">Email address</label>
                <input type="email" required className="input-field" placeholder="name@domain.com" value={email} onChange={(e) => setEmail(e.target.value)} />
              </div>
              <div>
                 <label className="block text-sm font-medium text-slate-700 mb-1.5">Password</label>
                <input type="password" required className="input-field" placeholder="••••••••" value={password} onChange={(e) => setPassword(e.target.value)} />
              </div>
            </div>

            <button type="submit" className="w-full btn-primary py-3 group mt-4">
              Create Account
              <ArrowRight className="w-4 h-4 ml-2 transition-transform group-hover:translate-x-1" />
            </button>
          </form>
        </div>
        
        <p className="mt-6 text-center text-sm text-slate-600">
          Already have an account?{' '}
          <Link to="/login" className="font-bold text-accent-600 hover:text-accent-700 hover:underline transition-colors">
            Sign in
          </Link>
        </p>
      </motion.div>
    </div>
  );
};

export default Register;
