import React from 'react';
import { Outlet, NavLink } from 'react-router-dom';
import Navbar from '../components/Navbar';
import { useAuth } from '../context/AuthContext';
import { LayoutDashboard, Users, User, Briefcase, FileText } from 'lucide-react';
import { cn } from '../utils/cn';

const ADMIN_LINKS = [
  { label: 'Overview', path: '/admin', icon: <LayoutDashboard size={20} /> },
  { label: 'Manage Companies', path: '/admin/companies', icon: <Briefcase size={20} /> },
  { label: 'Manage Students', path: '/admin/students', icon: <Users size={20} /> },
];

const STUDENT_LINKS = [
  { label: 'Dashboard', path: '/student', icon: <LayoutDashboard size={20} /> },
  { label: 'Jobs', path: '/jobs', icon: <Briefcase size={20} /> },
  { label: 'My Applications', path: '/student/applications', icon: <FileText size={20} /> },
  { label: 'Profile', path: '/student/profile', icon: <User size={20} /> },
];

const COMPANY_LINKS = [
  { label: 'Dashboard', path: '/company', icon: <LayoutDashboard size={20} /> },
  { label: 'Post Job', path: '/company/post-job', icon: <Briefcase size={20} /> },
  { label: 'Applicants', path: '/company/applicants', icon: <Users size={20} /> },
];

const DashboardLayout = () => {
  const { user } = useAuth();

  let links = [];
  if (user?.role === 'admin') links = ADMIN_LINKS;
  else if (user?.role === 'student') links = STUDENT_LINKS;
  else if (user?.role === 'company') links = COMPANY_LINKS;

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col pt-20">
      <Navbar />
      <div className="flex-1 flex overflow-hidden">
        {/* Sidebar */}
        <aside className="w-64 bg-white border-r border-gray-200 hidden md:flex flex-col">
          <div className="p-4 flex-1 overflow-y-auto">
            <nav className="space-y-1">
              {links.map((link) => (
                <NavLink
                  key={link.path}
                  to={link.path}
                  end={link.path === '/admin' || link.path === '/student' || link.path === '/company'}
                  className={({ isActive }) =>
                    cn(
                      'flex items-center px-4 py-3 rounded-xl transition-all duration-300',
                      isActive 
                        ? 'bg-gradient-to-r from-primary-50 to-white text-primary-700 font-semibold shadow-sm border border-primary-100' 
                        : 'text-slate-500 hover:bg-slate-50 hover:text-slate-900 border border-transparent'
                    )
                  }
                >
                  {({ isActive }) => (
                    <>
                      <span className={cn("mr-3", isActive ? "text-primary-600" : "text-slate-400")}>{link.icon}</span>
                      {link.label}
                    </>
                  )}
                </NavLink>
              ))}
            </nav>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 overflow-y-auto p-4 md:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
