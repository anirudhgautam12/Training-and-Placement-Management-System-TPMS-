import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './context/AuthContext';

// Layouts & Protected Routes
import Navbar from './components/Navbar';
import DashboardLayout from './layouts/DashboardLayout';
import ProtectedRoute from './components/ProtectedRoute';
import RoleBasedRoute from './components/RoleBasedRoute';

// Basic Pages
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';

// Dashboard Pages
import AdminDashboard from './pages/AdminDashboard';
import JobBoard from './pages/JobBoard';
import StudentDashboard from './pages/StudentDashboard';
import MyApplications from './pages/MyApplications';
import StudentProfile from './pages/StudentProfile';
import CompanyDashboard from './pages/CompanyDashboard';
import PostJob from './pages/PostJob';

// Mock Unauth / NotFound
const Unauthorized = () => <div className="p-8 text-center"><h1 className="text-3xl font-bold">Unauthorized Access</h1></div>;
const NotFound = () => <div className="p-8 text-center"><h1 className="text-3xl font-bold text-red-500">404 - Page Not Found</h1></div>;

const App = () => {
  return (
    <Router>
      <AuthProvider>
        <div className="flex flex-col min-h-screen">
          <Toaster position="top-right" />
          <Routes>
            {/* Public Routes without Sidebar */}
            <Route path="/" element={<><Navbar /><Home /></>} />
            <Route path="/login" element={<><Navbar /><Login /></>} />
            <Route path="/register" element={<><Navbar /><Register /></>} />
            <Route path="/unauthorized" element={<><Navbar /><Unauthorized /></>} />

            {/* Dashboard Layouts - Protected */}
            <Route element={<ProtectedRoute />}>
              <Route element={<DashboardLayout />}>
                
                {/* Admin Routes */}
                <Route element={<RoleBasedRoute allowedRoles={['admin']} />}>
                  <Route path="/admin" element={<AdminDashboard />} />
                  <Route path="/admin/companies" element={<div className="p-4">Manage Companies (Mock)</div>} />
                  <Route path="/admin/students" element={<div className="p-4">Manage Students (Mock)</div>} />
                </Route>

                {/* Student Routes */}
                <Route element={<RoleBasedRoute allowedRoles={['student']} />}>
                  <Route path="/student" element={<StudentDashboard />} />
                  <Route path="/student/applications" element={<MyApplications />} />
                  <Route path="/student/profile" element={<StudentProfile />} />
                  <Route path="/jobs" element={<JobBoard />} />
                </Route>

                {/* Company Routes */}
                <Route element={<RoleBasedRoute allowedRoles={['company']} />}>
                  <Route path="/company" element={<CompanyDashboard />} />
                  <Route path="/company/post-job" element={<PostJob />} />
                  <Route path="/company/applicants" element={<div className="p-4">Applicants List (Mock)</div>} />
                </Route>
                
              </Route>
            </Route>
            
            {/* Catch All */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </div>
      </AuthProvider>
    </Router>
  );
};

export default App;
