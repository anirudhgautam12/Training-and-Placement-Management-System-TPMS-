import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Briefcase, MapPin, DollarSign, Calendar, Code, AlignLeft, CheckCircle } from 'lucide-react';
import api from '../services/api';
import toast from 'react-hot-toast';

const PostJob = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  
  const [formData, setFormData] = useState({
    title: '',
    location: '',
    salary: '',
    skillsRequired: '',
    deadline: '',
    description: ''
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.title || !formData.location || !formData.description) {
      toast.error('Please fill in all required fields.');
      return;
    }

    setLoading(true);
    const toastId = toast.loading('Publishing job slot...');
    
    try {
      const payload = {
        ...formData,
        skillsRequired: formData.skillsRequired.split(',').map(s => s.trim()).filter(s => s)
      };

      await api.post('/jobs', payload);
      toast.success('Job successfully published!', { id: toastId });
      navigate('/company');
    } catch (error) {
      toast.error(error.response?.data?.error || 'Failed to post job', { id: toastId });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 tracking-tight flex items-center gap-2">
          <Briefcase className="text-primary-600" />
          Create a New Job Listing
        </h1>
        <p className="text-gray-500 mt-2">Publish an open role to attract top university talent immediately.</p>
      </div>

      <div className="card p-6 md:p-8">
        <form onSubmit={handleSubmit} className="space-y-6">
          
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-gray-900 border-b border-gray-100 pb-2">Basic Details</h3>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Job Title <span className="text-red-500">*</span></label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Briefcase className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  name="title"
                  className="input-field pl-10"
                  placeholder="e.g. Senior React Developer"
                  value={formData.title}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Location <span className="text-red-500">*</span></label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <MapPin className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="text"
                    name="location"
                    className="input-field pl-10"
                    placeholder="e.g. Remote, Mumbai"
                    value={formData.location}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Salary Indication</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <DollarSign className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="text"
                    name="salary"
                    className="input-field pl-10"
                    placeholder="e.g. $80k - $120k"
                    value={formData.salary}
                    onChange={handleChange}
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-4 pt-4">
            <h3 className="text-lg font-medium text-gray-900 border-b border-gray-100 pb-2">Requirements & Timeline</h3>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Required Skills</label>
              <div className="relative">
                <div className="absolute top-3 left-0 pl-3 flex pointer-events-none">
                  <Code className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  name="skillsRequired"
                  className="input-field pl-10"
                  placeholder="Separate with commas (e.g., React, Node, Python)"
                  value={formData.skillsRequired}
                  onChange={handleChange}
                />
              </div>
              <p className="mt-1 text-xs text-gray-500">Press comma to separate multiple skills.</p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Application Deadline</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Calendar className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="date"
                  name="deadline"
                  className="input-field pl-10"
                  value={formData.deadline}
                  onChange={handleChange}
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Job Description <span className="text-red-500">*</span></label>
              <div className="relative">
                <div className="absolute top-3 left-0 pl-3 flex pointer-events-none">
                  <AlignLeft className="h-5 w-5 text-gray-400" />
                </div>
                <textarea
                  name="description"
                  className="input-field pl-10 py-3 min-h-[150px] resize-y"
                  placeholder="Describe the role, responsibilities, and ideal candidate profile..."
                  value={formData.description}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>
          </div>

          <div className="pt-6 flex justify-end">
            <button 
              type="submit" 
              disabled={loading}
              className="btn-primary flex items-center px-8"
            >
              <CheckCircle className="w-5 h-5 mr-2" />
              {loading ? 'Publishing...' : 'Publish Job'}
            </button>
          </div>
          
        </form>
      </div>
    </div>
  );
};

export default PostJob;
