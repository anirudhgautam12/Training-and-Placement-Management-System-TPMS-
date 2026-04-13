import React from 'react';
import { Users, FileText } from 'lucide-react';

const CompanyDashboard = () => {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">Company Dashboard</h1>
        <button className="btn-primary">Post New Job</button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="card p-6 flex items-center space-x-4">
          <div className="p-3 rounded-full bg-blue-100 text-blue-600">
            <BriefcaseIcon />
          </div>
          <div>
            <p className="text-sm font-medium text-gray-500">Active Job Postings</p>
            <p className="text-2xl font-semibold text-gray-900">5</p>
          </div>
        </div>
        <div className="card p-6 flex items-center space-x-4">
          <div className="p-3 rounded-full bg-green-100 text-green-600">
            <Users />
          </div>
          <div>
            <p className="text-sm font-medium text-gray-500">Total Applicants</p>
            <p className="text-2xl font-semibold text-gray-900">124</p>
          </div>
        </div>
      </div>

      <div className="card">
        <div className="p-6 border-b border-gray-100">
          <h2 className="text-lg font-medium text-gray-900">Recent Applications</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-gray-500">
            <thead className="text-xs text-gray-700 uppercase bg-gray-50">
              <tr>
                <th className="px-6 py-3">Applicant Name</th>
                <th className="px-6 py-3">Job Role</th>
                <th className="px-6 py-3">Applied On</th>
                <th className="px-6 py-3">Status</th>
                <th className="px-6 py-3">Action</th>
              </tr>
            </thead>
            <tbody>
              <tr className="bg-white border-b">
                <td className="px-6 py-4 font-medium text-gray-900">John Doe</td>
                <td className="px-6 py-4">Frontend Developer</td>
                <td className="px-6 py-4">Oct 24, 2023</td>
                <td className="px-6 py-4"><span className="px-2 py-1 bg-yellow-100 text-yellow-800 rounded-full text-xs">Reviewing</span></td>
                <td className="px-6 py-4">
                  <button className="text-primary-600 hover:text-primary-800 font-medium">View Profile</button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

const BriefcaseIcon = () => <FileText size={24} />;

export default CompanyDashboard;
