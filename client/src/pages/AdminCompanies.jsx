import React, { useState, useEffect } from 'react';
import { Search, Filter, Trash2, MoreVertical, Building2, Download, Plus, Loader2, AlertCircle, MapPin, Mail, Phone, Briefcase, X } from 'lucide-react';
import api from '../services/api';
import toast from 'react-hot-toast';

const AdminCompanies = () => {
  const [companies, setCompanies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  const [search, setSearch] = useState('');
  const [filterIndustry, setFilterIndustry] = useState('All');

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  // Add Modal State
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [newCompany, setNewCompany] = useState({ name: '', industry: '', location: '', contactEmail: '', contactPhone: '', description: '' });
  const [isAdding, setIsAdding] = useState(false);

  // --- Fetch Companies from API ---
  const fetchCompanies = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await api.get('/companies');
      setCompanies(response.data);
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to fetch companies. Please try again.');
      toast.error('Failed to load companies');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCompanies();
  }, []);

  // --- Delete Handler via API ---
  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to remove this company?')) return;
    
    try {
      await api.delete(`/companies/${id}`);
      setCompanies((prev) => prev.filter(company => company._id !== id));
      toast.success('Company deleted successfully');
    } catch (err) {
      toast.error(err.response?.data?.error || 'Failed to delete company.');
    }
  };

  // --- Add Company Handler ---
  const handleAddCompany = async (e) => {
    e.preventDefault();
    setIsAdding(true);
    try {
      await api.post('/companies', newCompany);
      toast.success('Company added successfully!');
      setIsAddModalOpen(false);
      setNewCompany({ name: '', industry: '', location: '', contactEmail: '', contactPhone: '', description: '' });
      fetchCompanies(); // Refresh list to get new company details with ID
    } catch (err) {
      toast.error(err.response?.data?.error || 'Failed to add company.');
    } finally {
      setIsAdding(false);
    }
  };

  // --- Export to CSV ---
  const handleExport = () => {
    if (companies.length === 0) return toast.error('No companies to export');
    
    const headers = ['Name', 'Industry', 'Location', 'Contact Email', 'Contact Phone', 'Joined At'];
    const csvContent = [
      headers.join(','),
      ...companies.map(c => 
        `"${c.name || ''}","${c.industry || ''}","${c.location || ''}","${c.contactEmail || ''}","${c.contactPhone || ''}","${c.createdAt || ''}"`
      )
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `tpms_companies_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success('Export downloaded successfully!');
  };

  // --- Derived State & Pagination ---
  const industries = ['All', ...new Set(companies.map(c => c.industry).filter(Boolean))];

  const filteredCompanies = companies.filter(company => {
    const nameMatch = company.name?.toLowerCase().includes(search.toLowerCase());
    const emailMatch = company.contactEmail?.toLowerCase().includes(search.toLowerCase());
    const industryMatch = filterIndustry === 'All' || company.industry === filterIndustry;
    return (nameMatch || emailMatch) && industryMatch;
  });

  const totalPages = Math.max(1, Math.ceil(filteredCompanies.length / itemsPerPage));
  const paginatedCompanies = filteredCompanies.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  // Reset pagination if searching changes bounds
  useEffect(() => {
    if (currentPage > totalPages) setCurrentPage(1);
  }, [filteredCompanies.length, currentPage, totalPages]);

  // --- Render States ---
  if (loading) {
    return (
      <div className="flex flex-col min-h-[60vh] items-center justify-center text-slate-500">
        <Loader2 className="w-10 h-10 animate-spin text-primary-600 mb-4" />
        <p className="font-medium tracking-tight">Loading partner companies...</p>
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

  // --- Main UI ---
  return (
    <div className="space-y-6 max-w-7xl mx-auto animate-fade-in relative z-0">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-slate-900 tracking-tight">Manage Companies</h1>
          <p className="text-slate-500 mt-1 font-medium">View, search, and manage hiring partners on the platform.</p>
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
            <Plus size={16} /> Add Company
          </button>
        </div>
      </div>

      {/* Action Bar (Search & Filter) */}
      <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm flex flex-col sm:flex-row justify-between gap-4">
        <div className="relative w-full sm:max-w-md group">
          <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-primary-500 transition-colors" />
          <input 
            type="text" 
            placeholder="Search by company name or email..." 
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
            value={filterIndustry}
            onChange={(e) => setFilterIndustry(e.target.value)}
            className="w-full pl-9 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:bg-white focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition-all font-medium text-slate-700 appearance-none cursor-pointer"
          >
            {industries.map(industry => (
              <option key={industry} value={industry}>{industry}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Companies Data Table */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/80 border-b border-slate-100 uppercase tracking-wider">
                <th className="px-6 py-4 text-xs font-bold text-slate-500">Company Name</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500">Industry</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500">Location</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500">Contact Info</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {paginatedCompanies.length > 0 ? (
                paginatedCompanies.map((company) => (
                  <tr key={company._id} className="hover:bg-slate-50/50 transition-colors group">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-primary-50 flex items-center justify-center text-primary-600 flex-shrink-0">
                          <Building2 size={20} />
                        </div>
                        <div>
                          <div className="text-sm font-bold text-slate-800">{company.name}</div>
                          <div className="text-xs font-medium text-slate-400 mt-0.5">Joined {new Date(company.createdAt).getFullYear()}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                       <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-indigo-50 text-indigo-600 border border-indigo-100">
                         <Briefcase size={12} /> {company.industry || 'N/A'}
                       </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-1.5 text-sm font-medium text-slate-600">
                         <MapPin size={16} className="text-slate-400" />
                         {company.location || 'Remote/Unknown'}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex flex-col gap-1 text-sm font-medium text-slate-600">
                          {company.contactEmail ? (
                             <span className="flex items-center gap-1.5"><Mail size={14} className="text-slate-400"/> {company.contactEmail}</span>
                          ) : <span className="text-slate-400 text-xs italic">No email</span>}
                          {company.contactPhone && (
                             <span className="flex items-center gap-1.5"><Phone size={14} className="text-slate-400"/> {company.contactPhone}</span>
                          )}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button className="p-1.5 text-slate-400 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition-colors">
                          <MoreVertical size={18} />
                        </button>
                        <button 
                          onClick={() => handleDelete(company._id)}
                          className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                          title="Delete Company"
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
                      <Building2 size={40} className="text-slate-300 mb-3" />
                      <p className="text-base font-medium text-slate-700">No companies found.</p>
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
              disabled={currentPage === totalPages || filteredCompanies.length === 0}
              className="px-3 py-1.5 text-sm font-semibold text-slate-600 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 disabled:opacity-50 transition-colors"
            >
              Next
            </button>
          </div>
        </div>
      </div>

      {/* Add Company Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-900/50 backdrop-blur-sm" onClick={() => setIsAddModalOpen(false)}></div>
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg relative z-10 animate-fade-in overflow-hidden">
            <div className="flex items-center justify-between p-5 border-b border-slate-100">
              <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2">
                <Building2 className="text-primary-600" size={20} /> Register New Company
              </h3>
              <button onClick={() => setIsAddModalOpen(false)} className="text-slate-400 hover:text-slate-600">
                <X size={20} />
              </button>
            </div>
            
            <form onSubmit={handleAddCompany} className="p-5 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Company Name <span className="text-red-500">*</span></label>
                  <input 
                    type="text" required
                    className="w-full form-input" placeholder="e.g. Acme Corp"
                    value={newCompany.name}
                    onChange={e => setNewCompany({...newCompany, name: e.target.value})}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Industry</label>
                  <input 
                    type="text"
                    className="w-full form-input" placeholder="e.g. Software, Finance"
                    value={newCompany.industry}
                    onChange={e => setNewCompany({...newCompany, industry: e.target.value})}
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Location</label>
                <input 
                  type="text"
                  className="w-full form-input" placeholder="City, State or Remote"
                  value={newCompany.location}
                  onChange={e => setNewCompany({...newCompany, location: e.target.value})}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Contact Email</label>
                  <input 
                    type="email"
                    className="w-full form-input" placeholder="hr@company.com"
                    value={newCompany.contactEmail}
                    onChange={e => setNewCompany({...newCompany, contactEmail: e.target.value})}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Contact Phone</label>
                  <input 
                    type="tel"
                    className="w-full form-input" placeholder="(555) 123-4567"
                    value={newCompany.contactPhone}
                    onChange={e => setNewCompany({...newCompany, contactPhone: e.target.value})}
                  />
                </div>
              </div>
              
              <div className="pt-3">
                <button 
                  type="submit" 
                  disabled={isAdding}
                  className="w-full btn btn-primary py-2.5 flex justify-center"
                >
                  {isAdding ? <Loader2 size={20} className="animate-spin" /> : 'Register Company'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};

export default AdminCompanies;
