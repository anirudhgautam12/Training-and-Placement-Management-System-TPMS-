import React, { useState, useEffect } from 'react';
import { Building, MapPin, DollarSign, CheckCircle, Search, Calendar, Code, Briefcase, Loader2 } from 'lucide-react';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

const JobBoard = () => {
  const { user } = useAuth();
  const [jobs, setJobs] = useState([]);
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

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
        toast.error('Failed to load job listings');
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

  const filteredJobs = jobs.filter(job => 
    job.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
    (job.company && job.company.name.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  if (loading) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center">
        <Loader2 className="w-10 h-10 animate-spin text-primary-500" />
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
           <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Explore Opportunities</h1>
           <p className="text-gray-500 mt-2">Discover and apply to top tier companies recruiting right now.</p>
        </div>

        <div className="relative w-full md:w-96">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-gray-400" />
          </div>
          <input
            type="text"
            className="input-field pl-10 bg-white"
            placeholder="Search by role or company..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      <div className="space-y-6">
        {filteredJobs.length === 0 ? (
          <div className="text-center bg-white p-16 rounded-2xl border border-gray-100 shadow-sm">
            <Briefcase className="w-12 h-12 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-1">No jobs found</h3>
            <p className="text-gray-500">We couldn't find any job listings matching your search.</p>
          </div>
        ) : (
          filteredJobs.map(job => {
            const hasApplied = applications.some(app => app.job?._id === job._id || app.job === job._id);
            
            return (
              <div key={job._id} className="card p-6 md:p-8 hover:shadow-md transition-shadow group">
                <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-6">
                  {/* Left content block */}
                  <div className="flex-1 space-y-4">
                    <div>
                      <h2 className="text-2xl font-bold text-gray-900 group-hover:text-primary-700 transition-colors">
                        {job.title}
                      </h2>
                      <div className="mt-3 flex flex-wrap gap-y-2 gap-x-5 text-sm font-medium text-gray-600">
                        <span className="flex items-center"><Building size={18} className="mr-1.5 text-gray-400"/> {job.company?.name || 'Company'}</span>
                        <span className="flex items-center"><MapPin size={18} className="mr-1.5 text-gray-400"/> {job.location || 'Remote'}</span>
                        <span className="flex items-center text-green-600 bg-green-50 px-2 py-0.5 rounded-md"><DollarSign size={16} className="mr-1 shadow-sm"/> {job.salary || 'Competitive Pay'}</span>
                        {job.deadline && (
                            <span className="flex items-center text-orange-600 bg-orange-50 px-2 py-0.5 rounded-md"><Calendar size={16} className="mr-1.5"/> Deadline: {new Date(job.deadline).toLocaleDateString()}</span>
                        )}
                      </div>
                    </div>
                    
                    <p className="text-gray-600 leading-relaxed text-sm max-w-3xl line-clamp-3">
                      {job.description || "No specific job description provided by the recruitment team."}
                    </p>

                    {job.skillsRequired && job.skillsRequired.length > 0 && (
                      <div className="flex items-center gap-2 flex-wrap pt-2">
                        <Code size={16} className="text-gray-400 mr-1" />
                        {job.skillsRequired.map((skill, index) => (
                           <span key={index} className="text-xs font-semibold px-2.5 py-1 rounded-full bg-slate-100 text-slate-700 border border-slate-200">
                             {skill}
                           </span>
                        ))}
                      </div>
                    )}
                  </div>
                  
                  {/* Right CTA Block */}
                  <div className="flex flex-col sm:flex-row lg:flex-col items-center lg:items-end gap-3 lg:w-48 shrink-0">
                    {hasApplied ? (
                      <button disabled className="w-full btn-secondary opacity-70 cursor-not-allowed inline-flex justify-center items-center bg-gray-100 text-gray-500 border-none py-3">
                        <CheckCircle className="w-5 h-5 mr-2 text-green-500" />
                        Applied
                      </button>
                    ) : (
                      <button onClick={() => handleApply(job._id)} className="w-full btn-primary py-3 shadow-md">
                        Apply Now
                      </button>
                    )}
                    <span className="text-xs text-gray-400 mt-1 hidden lg:block">Posted {new Date(job.postedAt).toLocaleDateString()}</span>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};

export default JobBoard;
