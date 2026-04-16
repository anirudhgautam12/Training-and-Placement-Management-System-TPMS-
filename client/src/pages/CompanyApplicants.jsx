import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Loader2, User, FileText, Briefcase, Mail, Phone, GraduationCap, Building2, CheckCircle, ExternalLink } from 'lucide-react';
import api from '../services/api';
import toast from 'react-hot-toast';

const STATUS_OPTIONS = [
  { value: 'applied', label: 'Applied', color: 'bg-gray-100 text-gray-800 border-gray-200' },
  { value: 'shortlisted', label: 'Shortlisted', color: 'bg-green-100 text-green-800 border-green-200' },
  { value: 'interview', label: 'Interview Scheduled', color: 'bg-blue-100 text-blue-800 border-blue-200' },
  { value: 'offered', label: 'Offered', color: 'bg-purple-100 text-purple-800 border-purple-200' },
  { value: 'rejected', label: 'Rejected', color: 'bg-red-100 text-red-800 border-red-200' },
];

const ApplicationCard = ({ app, onUpdateStatus }) => {
  const [status, setStatus] = useState(app.status);
  const [remarks, setRemarks] = useState(app.remarks || '');
  const [isUpdating, setIsUpdating] = useState(false);

  const student = app.student || {};
  const job = app.job || {};

  const handleUpdate = async () => {
    setIsUpdating(true);
    try {
      await api.put(`/applications/${app._id}/status`, { status, remarks });
      toast.success('Application updated successfully');
      onUpdateStatus(app._id, status, remarks);
    } catch (error) {
      toast.error(error.response?.data?.error || 'Failed to update application');
      setStatus(app.status);
      setRemarks(app.remarks || '');
    } finally {
      setIsUpdating(false);
    }
  };

  const statusObj = STATUS_OPTIONS.find(s => s.value === status) || STATUS_OPTIONS[0];

  return (
    <motion.div 
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow group"
    >
      <div className="p-6">
        <div className="flex justify-between items-start mb-6">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-primary-100 flex items-center justify-center text-primary-600">
              <User size={24} />
            </div>
            <div>
              <h3 className="text-lg font-bold text-gray-900 group-hover:text-primary-600 transition-colors">
                {student.name || 'Unknown Student'}
              </h3>
              <p className="text-sm text-gray-500 font-medium">Applied for: {job.title || 'Unknown Job'}</p>
            </div>
          </div>
          <span className={`px-3 py-1 rounded-full text-xs font-bold border ${statusObj.color}`}>
            {statusObj.label}
          </span>
        </div>

        <div className="grid grid-cols-2 gap-y-4 gap-x-2 text-sm mb-6 border-y border-gray-50 py-4 font-medium text-gray-600">
          <div className="flex items-center gap-2">
            <Mail size={16} className="text-gray-400" />
            <span className="truncate">{student.email || 'N/A'}</span>
          </div>
          <div className="flex items-center gap-2">
            <Phone size={16} className="text-gray-400" />
            <span>{student.phone || 'N/A'}</span>
          </div>
          <div className="flex items-center gap-2">
            <Building2 size={16} className="text-gray-400" />
            <span>{student.branch || 'N/A'}</span>
          </div>
          <div className="flex items-center gap-2">
            <GraduationCap size={16} className="text-gray-400" />
            <span>CGPA: {student.cgpa || 'N/A'}</span>
          </div>
        </div>

        <div className="space-y-4 bg-gray-50/50 p-4 rounded-xl border border-gray-100">
          <div>
            <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Update Status</label>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              className="w-full form-input py-2 bg-white"
            >
              {STATUS_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Recruiter Remarks</label>
            <textarea
              value={remarks}
              onChange={(e) => setRemarks(e.target.value)}
              placeholder="e.g. Good communication skills, technical interview scheduled."
              className="w-full form-input py-2 text-sm bg-white resize-none"
              rows={2}
            />
          </div>
          <div className="flex items-center justify-between pt-2">
             {app.resumeUrl ? (
                <a
                  href={app.resumeUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1.5 text-sm font-semibold text-primary-600 hover:text-primary-700 transition-colors"
                >
                  <FileText size={16} /> View Resume
                </a>
              ) : (
                <span className="text-xs text-gray-400 flex items-center gap-1"><FileText size={14}/> No Resume Attached</span>
              )}
            <button
              onClick={handleUpdate}
              disabled={isUpdating || (status === app.status && remarks === (app.remarks || ''))}
              className="btn btn-primary py-2 px-4 text-sm flex items-center gap-2 disabled:opacity-50"
            >
              {isUpdating ? <Loader2 size={16} className="animate-spin" /> : <CheckCircle size={16} />}
              Save Changes
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

const CompanyApplicants = () => {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterJob, setFilterJob] = useState('All');

  useEffect(() => {
    const fetchApplicants = async () => {
      try {
        const response = await api.get('/applications/company');
        const sorted = response.data.sort((a, b) => new Date(b.appliedAt) - new Date(a.appliedAt));
        setApplications(sorted);
      } catch (error) {
        toast.error('Failed to load top applicants');
      } finally {
        setLoading(false);
      }
    };
    fetchApplicants();
  }, []);

  const handleUpdateStatus = (appId, newStatus, newRemarks) => {
    setApplications(apps => apps.map(app => 
      app._id === appId ? { ...app, status: newStatus, remarks: newRemarks } : app
    ));
  };

  // Extract unique job titles for filtering
  const uniqueJobs = ['All', ...new Set(applications.map(app => app.job?.title).filter(Boolean))];

  const filteredApplications = filterJob === 'All' 
    ? applications 
    : applications.filter(app => app.job?.title === filterJob);

  if (loading) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center">
        <Loader2 className="w-10 h-10 animate-spin text-primary-500" />
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto space-y-8 animate-fade-in">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Manage Applicants</h1>
          <p className="text-gray-500 mt-2">Review applications for your posted roles and update their assessment status.</p>
        </div>
        
        {applications.length > 0 && (
          <div className="w-full md:w-64">
            <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Filter by Role</label>
            <select 
              value={filterJob} 
              onChange={(e) => setFilterJob(e.target.value)}
              className="w-full form-input shadow-sm font-medium"
            >
              {uniqueJobs.map(job => (
                <option key={job} value={job}>{job}</option>
              ))}
            </select>
          </div>
        )}
      </div>

      <div className="space-y-6">
        {applications.length === 0 ? (
           <div className="text-center bg-white p-16 rounded-2xl border border-gray-100 shadow-sm flex flex-col items-center">
           <div className="bg-primary-50 p-4 rounded-full mb-4">
             <Briefcase className="w-10 h-10 text-primary-500" />
           </div>
           <h3 className="text-xl font-medium text-gray-900 mb-2">No Applications Yet</h3>
           <p className="text-gray-500 max-w-sm font-medium">When students apply to your job postings, they will appear here. Consider posting a new job opportunity!</p>
        </div>
        ) : filteredApplications.length === 0 ? (
          <div className="text-center bg-white p-16 rounded-2xl border border-gray-100 shadow-sm flex flex-col items-center">
            <h3 className="text-xl font-medium text-gray-900">No applicants for exactly this role.</h3>
            <button onClick={() => setFilterJob('All')} className="mt-4 text-primary-600 font-semibold hover:underline">Clear Filter</button>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            <AnimatePresence>
              {filteredApplications.map(app => (
                <ApplicationCard key={app._id} app={app} onUpdateStatus={handleUpdateStatus} />
              ))}
            </AnimatePresence>
          </div>
        )}
      </div>
    </div>
  );
};

export default CompanyApplicants;
