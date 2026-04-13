import React, { useState, useEffect } from 'react';
import { Building, Calendar, FileText, ExternalLink, Loader2, Info } from 'lucide-react';
import api from '../services/api';
import toast from 'react-hot-toast';

const MyApplications = () => {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchApplications = async () => {
      try {
        const response = await api.get('/applications/me');
        const sortedApps = response.data.sort((a, b) => new Date(b.appliedAt) - new Date(a.appliedAt));
        setApplications(sortedApps);
      } catch (error) {
        toast.error('Failed to load applications');
      } finally {
        setLoading(false);
      }
    };
    
    fetchApplications();
  }, []);

  const getStatusFormatting = (status) => {
    switch (status) {
      case 'shortlisted': return { color: 'text-green-700 bg-green-100 border-green-200', label: 'Shortlisted 🎉' };
      case 'interview': return { color: 'text-blue-700 bg-blue-100 border-blue-200', label: 'Interview Scheduled 📅' };
      case 'offered': return { color: 'text-purple-700 bg-purple-100 border-purple-200', label: 'Offered 🏆' };
      case 'rejected': return { color: 'text-red-700 bg-red-100 border-red-200', label: 'Not Selected' };
      default: return { color: 'text-yellow-700 bg-yellow-100 border-yellow-200', label: 'Under Review' }; // applied
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center">
        <Loader2 className="w-10 h-10 animate-spin text-primary-500" />
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 tracking-tight">My Applications</h1>
        <p className="text-gray-500 mt-2">Track and manage your ongoing recruitment processes.</p>
      </div>

      <div className="space-y-6">
        {applications.length === 0 ? (
          <div className="text-center bg-white p-16 rounded-2xl border border-gray-100 shadow-sm flex flex-col items-center">
             <div className="bg-gray-50 p-4 rounded-full mb-4">
               <FileText className="w-10 h-10 text-gray-400" />
             </div>
             <h3 className="text-xl font-medium text-gray-900 mb-2">No Applications Found</h3>
             <p className="text-gray-500 max-w-sm">You haven't submitted any job applications yet. Head over to the Job Board to find your next adventure!</p>
          </div>
        ) : (
          <div className="grid gap-6">
            {applications.map(app => {
              const job = app.job || {};
              const formatInfo = getStatusFormatting(app.status);
              
              return (
                <div key={app._id} className="card p-6 md:p-8 flex flex-col hover:shadow-md transition-shadow relative overflow-hidden group">
                   {app.status === 'offered' && <div className="absolute top-0 left-0 w-1.5 h-full bg-purple-500 rounded-l-2xl"></div>}
                   {app.status === 'shortlisted' && <div className="absolute top-0 left-0 w-1.5 h-full bg-green-500 rounded-l-2xl"></div>}

                   <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                     <div className="space-y-3 flex-1">
                       <h2 className="text-2xl font-bold text-gray-900">{job.title || 'Role Unavailable'}</h2>
                       
                       <div className="flex flex-wrap items-center gap-y-2 gap-x-5 text-sm font-medium text-gray-600">
                         <span className="flex items-center text-gray-700">
                           <Building size={16} className="mr-1.5 text-gray-400"/> 
                           Placed Opportunity
                         </span>
                         <span className="flex items-center text-gray-500">
                           <Calendar size={16} className="mr-1.5 text-gray-400"/> 
                           Applied {new Date(app.appliedAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                         </span>
                       </div>

                       {app.remarks && (
                         <div className="mt-4 bg-yellow-50/80 border border-yellow-200/50 rounded-lg p-3 flex gap-3 items-start">
                           <Info className="w-5 h-5 text-yellow-600 shrink-0 mt-0.5" />
                           <p className="text-sm text-yellow-800 leading-relaxed font-medium">Recruiter Remarks: <span className="font-normal">{app.remarks}</span></p>
                         </div>
                       )}
                     </div>

                     <div className="flex flex-col items-end gap-3 mt-2 sm:mt-0">
                       <span className={`inline-flex items-center px-3 py-1.5 rounded-full text-sm font-bold border shadow-sm ${formatInfo.color}`}>
                         {formatInfo.label}
                       </span>
                       
                       {app.resumeUrl && (
                         <a 
                           href={app.resumeUrl} 
                           target="_blank" 
                           rel="noopener noreferrer"
                           className="text-xs font-semibold text-gray-500 hover:text-primary-600 flex items-center transition-colors group-hover:underline"
                         >
                           View Sent Resume <ExternalLink size={12} className="ml-1" />
                         </a>
                       )}
                     </div>
                   </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default MyApplications;
