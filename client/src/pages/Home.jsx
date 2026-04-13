import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, Sparkles, Building, GraduationCap, CheckCircle } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const Home = () => {
  const { user } = useAuth();

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.15 }
    }
  };

  const item = {
    hidden: { opacity: 0, y: 30 },
    show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 200, damping: 20 } }
  };

  return (
    <div className="relative min-h-screen bg-slate-50 flex flex-col justify-center overflow-hidden">
      {/* Mesh Background */}
      <div className="absolute inset-x-0 -top-40 -bottom-40 bg-mesh opacity-60 pointer-events-none" />
      
      {/* Blur overlays to soften the mesh */}
      <div className="absolute inset-0 bg-white/40 backdrop-blur-[100px] pointer-events-none" />

      <motion.div 
        variants={container}
        initial="hidden"
        animate="show"
        className="relative max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pt-32 pb-20 text-center z-10"
      >
        <motion.div variants={item} className="mb-6 flex justify-center">
          <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary-50/80 border border-primary-200/50 text-sm font-medium text-primary-700 backdrop-blur-sm shadow-sm">
            <Sparkles className="w-4 h-4 text-primary-500" />
            The Future of Recruitment is Here
          </span>
        </motion.div>

        <motion.h1 variants={item} className="text-5xl md:text-7xl font-extrabold text-slate-900 tracking-tight mb-8 leading-[1.1]">
          Seamless Placements. <br />
          <span className="bg-gradient-to-r from-primary-500 to-accent-600 bg-clip-text text-transparent">
            Brilliant Careers.
          </span>
        </motion.h1>

        <motion.p variants={item} className="text-xl md:text-2xl text-slate-600 mb-12 max-w-3xl mx-auto leading-relaxed">
          Connect talented students with world-class companies instantly. 
          A streamlined platform redefining how universities handle on-campus and remote placements.
        </motion.p>

        <motion.div variants={item} className="flex flex-col sm:flex-row justify-center gap-5 items-center">
          {user ? (
            <Link to={user.role === 'admin' ? '/admin' : user.role === 'company' ? '/company' : '/student'} className="btn-primary text-lg px-8 py-4 w-full sm:w-auto shadow-glass-glow flex items-center gap-2 group">
              Go To Dashboard
              <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
            </Link>
          ) : (
            <>
              <Link to="/register" className="btn-primary text-lg px-8 py-4 w-full sm:w-auto shadow-glass-glow flex items-center gap-2 group">
                Start Hiring or Applying
                <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
              </Link>
              <Link to="/login" className="btn-secondary text-lg px-8 py-4 w-full sm:w-auto">
                Log into Dashboard
              </Link>
            </>
          )}
        </motion.div>

        <motion.div variants={item} className="mt-24 grid grid-cols-1 md:grid-cols-3 gap-8 text-left">
          <div className="glass-card p-8">
            <div className="h-12 w-12 rounded-2xl bg-blue-100 flex items-center justify-center text-blue-600 mb-6 drop-shadow-sm">
              <GraduationCap className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold text-slate-900 mb-3">For Students</h3>
            <p className="text-slate-600 leading-relaxed">Showcase your skills with rich profiles, track statuses in real-time, and get hired by massive tech giants directly from your dorm room.</p>
          </div>
          <div className="glass-card p-8 relative top-0 md:-top-6 shadow-glow">
            <div className="absolute -top-3 -right-3 text-white bg-gradient-to-r from-primary-500 to-accent-500 rounded-full p-2 shadow-lg">
              <CheckCircle className="w-4 h-4" />
            </div>
            <div className="h-12 w-12 rounded-2xl bg-teal-100 flex items-center justify-center text-teal-600 mb-6 drop-shadow-sm">
              <Building className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold text-slate-900 mb-3">For Companies</h3>
            <p className="text-slate-600 leading-relaxed">Post jobs effortlessly, filter out the top 1% talent efficiently, and manage interview pipelines smoothly through our intuitive portal.</p>
          </div>
          <div className="glass-card p-8">
            <div className="h-12 w-12 rounded-2xl bg-accent-100 flex items-center justify-center text-accent-600 mb-6 drop-shadow-sm">
              <Sparkles className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold text-slate-900 mb-3">For Admins</h3>
            <p className="text-slate-600 leading-relaxed">Maintain total oversight. Approve companies, govern student rosters, and generate rich analytic reports to monitor university placement KPIs.</p>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default Home;
