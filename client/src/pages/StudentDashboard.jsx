import React, { useState, useEffect } from 'react';
import { Building, MapPin, DollarSign, CheckCircle, Loader2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

const StudentDashboard = () => {
  const { user } = useAuth();
  const [jobs, setJobs] = useState([]);
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [jobsRes, appsRes] = await Promise.all([
          api.get('/jobs'),
          api.get('/applications/me')
        ]);
        setJobs(jobsRes.data);
        setApplications(appsRes.data);
      } catch (error) {
        toast.error('Failed to load dashboard data');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleApply = async (jobId) => {
    if (!user?.resumeUrl) {
      toast.error('Please upload a resume in your profile first!');
      return;
    }
    
    const toastId = toast.loading('Submitting application...');
    try {
      const res = await api.post(`/applications/jobs/${jobId}/apply`, {
        resumeUrl: user.resumeUrl 
      });
      
      const appliedJob = jobs.find(j => j._id === jobId);
      const newApp = { ...res.data, job: appliedJob };
      
      setApplications([...applications, newApp]);
      toast.success('Successfully applied!', { id: toastId });
    } catch (error) {
      toast.error(error.response?.data?.error || 'Failed to apply', { id: toastId });
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'shortlisted': return 'text-green-600';
      case 'interview': return 'text-blue-600';
      case 'offered': return 'text-purple-600';
      case 'rejected': return 'text-red-600';
      default: return 'text-yellow-600'; // applied
    }
  };

  if (loading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary-500" />
      </div>
    );
  }

  // Calculate profile completion roughly
  let completionCount = 0;
  if (user?.name) completionCount += 20;
  if (user?.phone) completionCount += 20;
  if (user?.branch) completionCount += 20;
  if (user?.cgpa) completionCount += 20;
  if (user?.resumeUrl) completionCount += 20;

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-900">Student Dashboard</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <div className="flex justify-between items-end">
            <h2 className="text-lg font-medium text-gray-900">Recommended Jobs</h2>
            <Link to="/jobs" className="text-sm font-medium text-primary-600 hover:text-primary-700">View all jobs &rarr;</Link>
          </div>
          
          <div className="space-y-4">
            {jobs.length === 0 ? (
              <div className="text-center text-gray-500 py-8 bg-white rounded-xl border border-gray-100">
                No active jobs posted by companies yet. Check back soon!
              </div>
            ) : (
              jobs.map(job => {
                const hasApplied = applications.some(app => app.job?._id === job._id || app.job === job._id);
                
                return (
                  <div key={job._id} className="card p-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 hover:border-primary-200 transition-colors">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">{job.title}</h3>
                      <div className="mt-2 flex flex-wrap gap-4 text-sm text-gray-500">
                        <span className="flex items-center"><Building size={16} className="mr-1"/> {job.company?.name || 'Company'}</span>
                        <span className="flex items-center"><MapPin size={16} className="mr-1"/> {job.location || 'Remote'}</span>
                        <span className="flex items-center text-green-600"><DollarSign size={16} className="mr-1"/> {job.salary || 'Competitive'}</span>
                      </div>
                    </div>
                    {hasApplied ? (
                      <button disabled className="btn-secondary flex-shrink-0 opacity-70 cursor-not-allowed inline-flex items-center bg-gray-100 text-gray-500 border-none">
                        <CheckCircle className="w-4 h-4 mr-1.5 text-green-500" />
                        Applied
                      </button>
                    ) : (
                      <button onClick={() => handleApply(job._id)} className="btn-primary flex-shrink-0">
                        Apply Now
                      </button>
                    )}
                  </div>
                );
              })
            )}
          </div>
        </div>

        <div className="space-y-6">
          <div className="card p-6 bg-gradient-to-br from-primary-50 to-white">
            <h3 className="text-lg font-medium text-gray-900 mb-2">Profile Status</h3>
            <div className="w-full bg-gray-200 rounded-full h-2.5 mb-4 mt-4 overflow-hidden">
              <div className="bg-primary-600 h-2.5 rounded-full transition-all duration-1000" style={{ width: `${completionCount}%` }}></div>
            </div>
            <p className="text-sm text-gray-600">Your profile is {completionCount}% complete.</p>
            {completionCount < 100 && (
              <Link to="/student/profile" className="mt-4 block text-center text-sm font-medium text-primary-600 border border-primary-200 py-2 rounded-md hover:bg-primary-50 transition-colors">
                Complete Profile
              </Link>
            )}
          </div>

          <div className="card p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Application Status</h3>
            {applications.length === 0 ? (
              <p className="text-sm text-gray-500">You haven't applied to any jobs yet.</p>
            ) : (
              <ul className="space-y-4">
                 {applications.map(app => (
                   <li key={app._id} className="flex justify-between items-center text-sm border-b border-gray-50 pb-3 last:border-0 last:pb-0">
                     <span className="text-gray-700 font-medium truncate pr-4">{app.job?.title || 'Unknown Role'}</span>
                     <span className={`font-semibold capitalize text-xs px-2 py-0.5 rounded-full bg-slate-50 border whitespace-nowrap ${getStatusColor(app.status)}`}>
                       {app.status}
                     </span>
                   </li>
                 ))}
              </ul>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentDashboard;
