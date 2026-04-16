import React, { useState, useEffect } from 'react';
import { Search, Filter, Trash2, MoreVertical, GraduationCap, Download, Plus, Loader2, AlertCircle, X } from 'lucide-react';
import api from '../services/api';
import toast from 'react-hot-toast';

const AdminStudents = () => {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  const [search, setSearch] = useState('');
  const [filterBranch, setFilterBranch] = useState('All');

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  // Add Modal State
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [newStudent, setNewStudent] = useState({ name: '', email: '', password: '', branch: '' });
  const [isAdding, setIsAdding] = useState(false);

  // --- Fetch Students from API ---
  const fetchStudents = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await api.get('/users');
      const studentsOnly = response.data.filter(user => user.role === 'student');
      setStudents(studentsOnly);
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to fetch students. Please try again.');
      toast.error('Failed to load students');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStudents();
  }, []);

  // --- Delete Handler via API ---
  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to remove this student?')) return;
    
    try {
      await api.delete(`/users/${id}`);
      setStudents((prev) => prev.filter(student => student._id !== id));
      toast.success('Student deleted successfully');
    } catch (err) {
      toast.error(err.response?.data?.error || 'Failed to delete student.');
    }
  };

  // --- Add Student Handler ---
  const handleAddStudent = async (e) => {
    e.preventDefault();
    setIsAdding(true);
    try {
      // Create student via auth endpoint directly
      await api.post('/auth/register', { ...newStudent, role: 'student' });
      toast.success('Student added successfully!');
      setIsAddModalOpen(false);
      setNewStudent({ name: '', email: '', password: '', branch: '' });
      fetchStudents(); // Refresh list to get new student details with ID
    } catch (err) {
      toast.error(err.response?.data?.error || 'Failed to add student.');
    } finally {
      setIsAdding(false);
    }
  };

  // --- Export to CSV ---
  const handleExport = () => {
    if (students.length === 0) return toast.error('No students to export');
    
    const headers = ['Name', 'Email', 'Branch', 'CGPA', 'Skills', 'Joined At'];
    const csvContent = [
      headers.join(','),
      ...students.map(s => 
        `"${s.name || ''}","${s.email || ''}","${s.branch || ''}","${s.cgpa || ''}","${(s.skills || []).join(', ')}","${s.createdAt || ''}"`
      )
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `tpms_students_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success('Export downloaded successfully!');
  };

  // --- Derived State & Pagination ---
  const branches = ['All', ...new Set(students.map(s => s.branch).filter(Boolean))];

  const filteredStudents = students.filter(student => {
    const nameMatch = student.name?.toLowerCase().includes(search.toLowerCase());
    const emailMatch = student.email?.toLowerCase().includes(search.toLowerCase());
    const branchMatch = filterBranch === 'All' || student.branch === filterBranch;
    return (nameMatch || emailMatch) && branchMatch;
  });

  const totalPages = Math.max(1, Math.ceil(filteredStudents.length / itemsPerPage));
  const paginatedStudents = filteredStudents.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  // Reset pagination if searching changes bounds
  useEffect(() => {
    if (currentPage > totalPages) setCurrentPage(1);
  }, [filteredStudents.length, currentPage, totalPages]);

  // --- Render States ---
  if (loading) {
    return (
      <div className="flex flex-col min-h-[60vh] items-center justify-center text-slate-500">
        <Loader2 className="w-10 h-10 animate-spin text-primary-600 mb-4" />
        <p className="font-medium tracking-tight">Loading student records...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col min-h-[60vh] items-center justify-center p-6 text-center">
        <div className="bg-red-50 text-red-600 p-4 rounded-full mb-4">
          <AlertCircle size={32} />
        </div>
        <h3 className="text-xl font-bold text-slate-800 mb-2 tracking-tight">Failed to load data</h3>
        <p className="text-slate-500 font-medium max-w-md">{error}</p>
        <button 
          onClick={() => window.location.reload()} 
          className="mt-6 btn btn-primary px-5 py-2.5 rounded-xl shadow-sm text-sm font-bold"
        >
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-7xl mx-auto animate-fade-in relative z-0">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-slate-900 tracking-tight">Manage Students</h1>
          <p className="text-slate-500 mt-1 font-medium">View, search, and manage registered student profiles.</p>
        </div>
        <div className="flex items-center gap-3">
          <button 
            onClick={handleExport}
            className="bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 hover:text-slate-900 px-4 py-2 rounded-xl text-sm font-semibold transition-colors flex items-center gap-2 shadow-sm"
          >
            <Download size={16} /> Export
          </button>
          <button 
            onClick={() => setIsAddModalOpen(true)}
            className="btn btn-primary px-4 py-2 rounded-xl text-sm font-semibold transition-colors flex items-center gap-2 shadow-sm"
          >
            <Plus size={16} /> Add Student
          </button>
        </div>
      </div>

      {/* Action Bar (Search & Filter) */}
      <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm flex flex-col sm:flex-row justify-between gap-4">
        <div className="relative w-full sm:max-w-md group">
          <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-primary-500 transition-colors" />
          <input 
            type="text" 
            placeholder="Search by name or email..." 
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:bg-white focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition-all font-medium text-slate-700 placeholder:font-normal"
          />
        </div>
        
        <div className="relative w-full sm:w-48 group">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Filter size={16} className="text-slate-400 group-focus-within:text-primary-500" />
          </div>
          <select 
            value={filterBranch}
            onChange={(e) => setFilterBranch(e.target.value)}
            className="w-full pl-9 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:bg-white focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition-all font-medium text-slate-700 appearance-none cursor-pointer"
          >
            {branches.map(branch => (
              <option key={branch} value={branch}>{branch}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Students Data Table */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/80 border-b border-slate-100 uppercase tracking-wider">
                <th className="px-6 py-4 text-xs font-bold text-slate-500">Student Name</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500">Branch</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500">CGPA</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500">Core Skills</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {paginatedStudents.length > 0 ? (
                paginatedStudents.map((student) => (
                  <tr key={student._id} className="hover:bg-slate-50/50 transition-colors group">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-primary-50 flex items-center justify-center text-primary-600 flex-shrink-0 overflow-hidden">
                          {student.profilePicUrl ? (
                            <img src={student.profilePicUrl} alt="avatar" className="w-full h-full object-cover" />
                          ) : (
                            <GraduationCap size={20} />
                          )}
                        </div>
                        <div>
                          <div className="text-sm font-bold text-slate-800">{student.name || 'Unnamed'}</div>
                          <div className="text-xs font-medium text-slate-500">{student.email || 'N/A'}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="text-sm font-semibold text-slate-700">{student.branch || 'Not specified'}</span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-2">
                        <span className={`text-sm font-bold ${(student.cgpa || 0) >= 3.5 ? 'text-green-600' : 'text-slate-700'}`}>
                          {student.cgpa ? Number(student.cgpa).toFixed(2) : '-'}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 max-w-[250px]">
                      <div className="flex flex-wrap gap-1.5">
                        {student.skills && student.skills.length > 0 ? (
                          <>
                            {student.skills.slice(0, 3).map((skill, index) => (
                              <span key={index} className="inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-semibold bg-slate-100 text-slate-600 border border-slate-200/60 truncate max-w-full">
                                {skill}
                              </span>
                            ))}
                            {student.skills.length > 3 && (
                              <span className="inline-flex items-center px-1.5 py-0.5 rounded-full text-[11px] font-semibold bg-slate-50 text-slate-400">
                                +{student.skills.length - 3}
                              </span>
                            )}
                          </>
                        ) : (
                          <span className="text-xs text-slate-400 font-medium">None</span>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button className="p-1.5 text-slate-400 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition-colors">
                          <MoreVertical size={18} />
                        </button>
                        <button 
                          onClick={() => handleDelete(student._id)}
                          className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                          title="Delete Student"
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5" className="px-6 py-12 text-center text-slate-500">
                    <div className="flex flex-col items-center">
                      <Search size={40} className="text-slate-300 mb-3" />
                      <p className="text-base font-medium text-slate-700">No students found.</p>
                      <p className="text-sm mt-1">Try adjusting your filters or search query.</p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        
        {/* Pagination Footer */}
        <div className="px-6 py-4 border-t border-slate-100 bg-slate-50/50 flex items-center justify-between">
          <span className="text-sm font-medium text-slate-500">
             Showing page <span className="text-slate-800 font-bold">{currentPage}</span> of {totalPages}
          </span>
          <div className="flex items-center gap-2">
            <button 
              onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="px-3 py-1.5 text-sm font-semibold text-slate-600 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 disabled:opacity-50 transition-colors"
            >
              Prev
            </button>
            <button 
              onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages || filteredStudents.length === 0}
              className="px-3 py-1.5 text-sm font-semibold text-slate-600 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 disabled:opacity-50 transition-colors"
            >
              Next
            </button>
          </div>
        </div>
      </div>

      {/* Add Student Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-900/50 backdrop-blur-sm" onClick={() => setIsAddModalOpen(false)}></div>
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md relative z-10 animate-fade-in overflow-hidden">
            <div className="flex items-center justify-between p-5 border-b border-slate-100">
              <h3 className="text-lg font-bold text-slate-800">Add New Student</h3>
              <button onClick={() => setIsAddModalOpen(false)} className="text-slate-400 hover:text-slate-600">
                <X size={20} />
              </button>
            </div>
            
            <form onSubmit={handleAddStudent} className="p-5 space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Full Name</label>
                <input 
                  type="text" required
                  className="w-full form-input"
                  value={newStudent.name}
                  onChange={e => setNewStudent({...newStudent, name: e.target.value})}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Email <span className="text-red-500">*</span></label>
                <input 
                  type="email" required
                  className="w-full form-input"
                  value={newStudent.email}
                  onChange={e => setNewStudent({...newStudent, email: e.target.value})}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Account Password <span className="text-red-500">*</span></label>
                <input 
                  type="password" required
                  className="w-full form-input"
                  value={newStudent.password}
                  onChange={e => setNewStudent({...newStudent, password: e.target.value})}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Branch (Optional)</label>
                <input 
                  type="text"
                  className="w-full form-input" placeholder="e.g. Computer Science"
                  value={newStudent.branch}
                  onChange={e => setNewStudent({...newStudent, branch: e.target.value})}
                />
              </div>
              
              <div className="pt-3">
                <button 
                  type="submit" 
                  disabled={isAdding}
                  className="w-full btn btn-primary py-2.5 flex justify-center"
                >
                  {isAdding ? <Loader2 size={20} className="animate-spin" /> : 'Create Account'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};

export default AdminStudents;
