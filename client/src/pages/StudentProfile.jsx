import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import toast from 'react-hot-toast';
import { Camera, FileText, Loader2, Save, Upload } from 'lucide-react';

const StudentProfile = () => {
  const { user, setUser } = useAuth();
  const [loading, setLoading] = useState(false);
  
  // Form State
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    branch: '',
    cgpa: '',
    course: '',
    year: '',
    skills: '' // commas separated
  });

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || '',
        phone: user.phone || '',
        branch: user.branch || '',
        cgpa: user.cgpa || '',
        course: user.course || '',
        year: user.year || '',
        skills: user.skills ? user.skills.join(', ') : ''
      });
    }
  }, [user]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const formattedData = {
        ...formData,
        cgpa: formData.cgpa ? parseFloat(formData.cgpa) : undefined,
        year: formData.year ? parseInt(formData.year) : undefined,
        skills: formData.skills.split(',').map(s => s.trim()).filter(Boolean)
      };

      const res = await api.put('/users/me/profile', formattedData);
      setUser(res.data);
      toast.success('Profile updated successfully');
    } catch (error) {
      toast.error(error.response?.data?.error || 'Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  const handleFileUpload = async (e, type) => {
    const file = e.target.files[0];
    if (!file) return;

    const endpoint = type === 'picture' ? '/users/me/profile/picture' : '/users/me/profile/resume';
    const formDataObj = new FormData();
    formDataObj.append(type, file); // multer expects 'picture' or 'resume'

    const toastId = toast.loading(`Uploading ${type}...`);
    try {
      const res = await api.post(endpoint, formDataObj, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      setUser(res.data);
      toast.success(`${type === 'picture' ? 'Profile picture' : 'Resume'} uploaded!`, { id: toastId });
    } catch (error) {
      toast.error(error.response?.data?.error || `Failed to upload ${type}`, { id: toastId });
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <h1 className="text-2xl font-bold text-gray-900">My Profile</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Left Column: Picture & Resume */}
        <div className="space-y-6">
          <div className="card p-6 flex flex-col items-center text-center">
            <div className="relative group w-32 h-32 rounded-full overflow-hidden bg-gray-100 border-4 border-white shadow-lg mb-4">
              {user?.profilePicUrl ? (
                <img src={user.profilePicUrl} alt="Profile" className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-gray-400">
                  <Camera size={40} />
                </div>
              )}
              
              <label className="absolute inset-0 bg-black/50 hidden group-hover:flex items-center justify-center cursor-pointer transition-all">
                <span className="text-white text-xs font-semibold">Change</span>
                <input 
                  type="file" 
                  accept="image/*" 
                  className="hidden" 
                  onChange={(e) => handleFileUpload(e, 'picture')} 
                />
              </label>
            </div>
            <h2 className="text-xl font-bold text-gray-900">{user?.name}</h2>
            <p className="text-sm text-gray-500">{user?.email}</p>
            <div className="mt-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary-100 text-primary-800 capitalize">
              {user?.role}
            </div>
          </div>

          <div className="card p-6">
            <h3 className="text-sm font-medium text-gray-900 mb-4 uppercase tracking-wider">My Documents</h3>
            <div className="space-y-4">
              <div className="border border-dashed border-gray-300 rounded-lg p-4 flex flex-col items-center justify-center text-center hover:bg-gray-50 transition-colors">
                <FileText className="text-gray-400 mb-2" size={24} />
                <p className="text-sm text-gray-600 mb-2">
                  {user?.resumeUrl ? 'Resume Uploaded' : 'No Resume Uploaded'}
                </p>
                {user?.resumeUrl && (
                  <a href={user.resumeUrl} target="_blank" rel="noopener noreferrer" className="text-xs text-primary-600 hover:text-primary-700 font-medium mb-3">View Current Resume</a>
                )}
                <label className="btn-secondary text-xs px-3 py-1.5 cursor-pointer inline-flex items-center">
                  <Upload size={14} className="mr-1.5" />
                  Upload New
                  <input 
                    type="file" 
                    accept="application/pdf" 
                    className="hidden" 
                    onChange={(e) => handleFileUpload(e, 'resume')} 
                  />
                </label>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Forms */}
        <div className="md:col-span-2 space-y-6">
          <form className="card p-6 space-y-6" onSubmit={handleSubmit}>
            <div className="flex items-center justify-between border-b pb-4">
              <h3 className="text-lg font-medium text-gray-900">Personal & Academic Info</h3>
              <button 
                type="submit" 
                disabled={loading}
                className="btn-primary py-2 px-4 flex items-center shadow-sm"
              >
                {loading ? <Loader2 className="animate-spin mr-2" size={16} /> : <Save className="mr-2" size={16} />}
                Save Changes
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                <input type="text" name="name" className="input-field" value={formData.name} onChange={handleChange} required />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
                <input type="tel" name="phone" className="input-field" value={formData.phone} onChange={handleChange} placeholder="+1 234 567 890" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Course (e.g. B.Tech, MCA)</label>
                <input type="text" name="course" className="input-field" value={formData.course} onChange={handleChange} />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Branch / Major</label>
                <input type="text" name="branch" className="input-field" value={formData.branch} onChange={handleChange} />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Graduation Year</label>
                <input type="number" name="year" min="2000" max="2100" className="input-field" value={formData.year} onChange={handleChange} />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Current CGPA</label>
                <input type="number" step="0.01" min="0" max="10" name="cgpa" className="input-field" value={formData.cgpa} onChange={handleChange} />
              </div>
              <div className="sm:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">Technical Skills</label>
                <p className="text-xs text-gray-500 mb-2">Separate skills using commas (e.g., React, Node.js, Python, Figma)</p>
                <input type="text" name="skills" className="input-field" value={formData.skills} onChange={handleChange} placeholder="React, Node.js, Python" />
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default StudentProfile;
