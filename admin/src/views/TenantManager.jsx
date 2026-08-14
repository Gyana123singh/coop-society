import React, { useState } from 'react';
import { Building2, Plus, Search, ShieldCheck, ShieldAlert, Trash2, X } from 'lucide-react';

const TenantManager = ({ vendors, onCreateVendor, onUpdateVendorStatus, onDeleteVendor }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    businessType: 'Housing Cooperative Society',
    regNo: '',
    address: '',
    contactEmail: '',
    contactPhone: '',
    adminName: '',
    adminEmail: '',
    adminPassword: ''
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.name || !formData.regNo || !formData.adminEmail) {
      alert('Please fill in required tenant details.');
      return;
    }
    onCreateVendor(formData);
    setIsModalOpen(false);
    setFormData({
      name: '',
      businessType: 'Housing Cooperative Society',
      regNo: '',
      address: '',
      contactEmail: '',
      contactPhone: '',
      adminName: '',
      adminEmail: '',
      adminPassword: ''
    });
  };

  const filteredVendors = vendors.filter(v => 
    v.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    v.regNo.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Header & Provision Button */}
      <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-white tracking-tight">
            Multi-Tenant Business & Society Manager
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Super Admin capability to onboard, provision, suspend, or delete housing societies & vendor businesses.
          </p>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="w-full sm:w-auto bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold py-2.5 px-4 rounded-xl shadow-lg shadow-indigo-600/30 flex items-center justify-center space-x-2 transition-all shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>Provision New Business / Society</span>
        </button>
      </div>

      {/* Search Bar */}
      <div className="relative">
        <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3 pointer-events-none" />
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Search businesses by name or registration number..."
          className="w-full pl-10 pr-4 py-2.5 bg-slate-900 rounded-xl text-xs text-white border border-slate-800 focus:outline-none focus:border-indigo-500"
        />
      </div>

      {/* Tenants Table */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-sm">
        {/* Mobile View: Cards */}
        <div className="md:hidden divide-y divide-slate-800">
          {filteredVendors.map((v) => (
            <div key={v._id} className="p-4 space-y-3">
              <div className="flex items-start justify-between">
                <div className="flex items-center space-x-2 min-w-0">
                  <div className="w-8 h-8 rounded-lg bg-indigo-500/10 text-indigo-400 flex items-center justify-center shrink-0">
                    <Building2 className="w-4 h-4" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-xs font-bold text-white truncate">{v.name}</p>
                    <p className="text-[10px] text-slate-500 truncate">{v.address}</p>
                  </div>
                </div>
                <span className={`inline-flex items-center space-x-1 px-2 py-0.5 rounded-full text-[10px] font-bold shrink-0 ${
                  v.status === 'SUSPENDED'
                    ? 'bg-rose-500/10 text-rose-400 border border-rose-500/20'
                    : 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                }`}>
                  {v.status === 'SUSPENDED' ? <ShieldAlert className="w-3 h-3" /> : <ShieldCheck className="w-3 h-3" />}
                  <span>{v.status || 'ACTIVE'}</span>
                </span>
              </div>

              <div className="text-[11px] text-slate-400 space-y-0.5">
                <p><span className="font-bold text-slate-300">Reg No:</span> {v.regNo}</p>
                <p><span className="font-bold text-slate-300">Category:</span> {v.businessType || 'Housing Society'}</p>
                <p><span className="font-bold text-slate-300">Email:</span> {v.contactEmail || 'secretary@mandovinagar.org'}</p>
              </div>

              <div className="flex items-center justify-end space-x-2 pt-2 border-t border-slate-800/60">
                <button
                  onClick={() => onUpdateVendorStatus(v._id, v.status === 'ACTIVE' ? 'SUSPENDED' : 'ACTIVE')}
                  className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold"
                >
                  {v.status === 'ACTIVE' ? 'Suspend' : 'Activate'}
                </button>
                <button
                  onClick={() => onDeleteVendor && onDeleteVendor(v._id)}
                  className="px-3 py-1.5 rounded-lg bg-rose-950/80 hover:bg-rose-900 border border-rose-800 text-rose-300 text-xs font-bold inline-flex items-center space-x-1"
                >
                  <Trash2 className="w-3.5 h-3.5 text-rose-400" />
                  <span>Delete</span>
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Desktop View: Table */}
        <div className="hidden md:block overflow-x-auto">
          <table className="w-full text-xs text-left text-slate-300">
            <thead className="bg-slate-950 text-slate-400 font-bold uppercase tracking-wider text-[10px]">
              <tr>
                <th className="p-3.5">Business / Society</th>
                <th className="p-3.5">Type</th>
                <th className="p-3.5">Registration No.</th>
                <th className="p-3.5">Contact Email</th>
                <th className="p-3.5">Status</th>
                <th className="p-3.5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800">
              {filteredVendors.map((v) => (
                <tr key={v._id} className="hover:bg-slate-800/50 transition-all">
                  <td className="p-3.5 font-bold text-white">
                    <div className="flex items-center space-x-2">
                      <div className="w-8 h-8 rounded-lg bg-indigo-500/10 text-indigo-400 flex items-center justify-center shrink-0">
                        <Building2 className="w-4 h-4" />
                      </div>
                      <div>
                        <p className="text-xs font-bold text-white">{v.name}</p>
                        <p className="text-[10px] text-slate-500 truncate max-w-[200px]">{v.address}</p>
                      </div>
                    </div>
                  </td>
                  <td className="p-3.5 text-slate-300 font-medium">{v.businessType || 'Housing Society'}</td>
                  <td className="p-3.5 font-mono text-slate-300">{v.regNo}</td>
                  <td className="p-3.5 text-slate-400">{v.contactEmail || 'secretary@mandovinagar.org'}</td>
                  <td className="p-3.5">
                    <span className={`inline-flex items-center space-x-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                      v.status === 'SUSPENDED'
                        ? 'bg-rose-500/10 text-rose-400 border border-rose-500/20'
                        : 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                    }`}>
                      {v.status === 'SUSPENDED' ? <ShieldAlert className="w-3 h-3" /> : <ShieldCheck className="w-3 h-3" />}
                      <span>{v.status || 'ACTIVE'}</span>
                    </span>
                  </td>
                  <td className="p-3.5 text-right space-x-2">
                    <button
                      onClick={() => onUpdateVendorStatus(v._id, v.status === 'ACTIVE' ? 'SUSPENDED' : 'ACTIVE')}
                      className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-[11px] font-semibold transition-all"
                    >
                      {v.status === 'ACTIVE' ? 'Suspend' : 'Activate'}
                    </button>

                    <button
                      onClick={() => onDeleteVendor && onDeleteVendor(v._id)}
                      className="px-2.5 py-1 rounded-lg bg-rose-950/80 hover:bg-rose-900 border border-rose-800 text-rose-300 text-[11px] font-bold transition-all inline-flex items-center space-x-1"
                      title="Delete Housing Society"
                    >
                      <Trash2 className="w-3 h-3 text-rose-400" />
                      <span>Delete</span>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Provision New Business Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-lg w-full p-4 sm:p-6 shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <h3 className="text-base font-bold text-white flex items-center space-x-2">
                <Building2 className="w-5 h-5 text-indigo-400" />
                <span>Provision New Multi-Tenant Business</span>
              </h3>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-400 mb-1 font-semibold">Business / Society Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Sunlight Commercial Complex Co-Op"
                  value={formData.name}
                  onChange={e => setFormData({ ...formData, name: e.target.value })}
                  className="w-full p-2.5 bg-slate-950 rounded-xl border border-slate-800 text-white focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-400 mb-1 font-semibold">Business Category *</label>
                  <select
                    value={formData.businessType}
                    onChange={e => setFormData({ ...formData, businessType: e.target.value })}
                    className="w-full p-2.5 bg-slate-950 rounded-xl border border-slate-800 text-white focus:outline-none focus:border-indigo-500"
                  >
                    <option value="Housing Cooperative Society">Housing Cooperative Society</option>
                    <option value="Commercial Real Estate">Commercial Real Estate</option>
                    <option value="Facility Management">Facility Management</option>
                    <option value="Vendor Entity">Vendor Entity</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-400 mb-1 font-semibold">Reg. No / GSTIN / Tax ID *</label>
                  <input
                    type="text"
                    required
                    placeholder="HSG-(b)-102/GOA"
                    value={formData.regNo}
                    onChange={e => setFormData({ ...formData, regNo: e.target.value })}
                    className="w-full p-2.5 bg-slate-950 rounded-xl border border-slate-800 text-white focus:outline-none focus:border-indigo-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-400 mb-1 font-semibold">Official Address *</label>
                <input
                  type="text"
                  required
                  placeholder="Dada Vaidya Road, Panaji - Goa"
                  value={formData.address}
                  onChange={e => setFormData({ ...formData, address: e.target.value })}
                  className="w-full p-2.5 bg-slate-950 rounded-xl border border-slate-800 text-white focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 border-t border-slate-800">
                <div>
                  <label className="block text-slate-400 mb-1 font-semibold">Initial Admin Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="Secretary / Admin Name"
                    value={formData.adminName}
                    onChange={e => setFormData({ ...formData, adminName: e.target.value })}
                    className="w-full p-2.5 bg-slate-950 rounded-xl border border-slate-800 text-white focus:outline-none focus:border-indigo-500"
                  />
                </div>

                <div>
                  <label className="block text-slate-400 mb-1 font-semibold">Initial Admin Email *</label>
                  <input
                    type="email"
                    required
                    placeholder="admin@business.com"
                    value={formData.adminEmail}
                    onChange={e => setFormData({ ...formData, adminEmail: e.target.value })}
                    className="w-full p-2.5 bg-slate-950 rounded-xl border border-slate-800 text-white focus:outline-none focus:border-indigo-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-400 mb-1 font-semibold">Initial Admin Password *</label>
                <input
                  type="password"
                  required
                  placeholder="Admin Password"
                  value={formData.adminPassword}
                  onChange={e => setFormData({ ...formData, adminPassword: e.target.value })}
                  className="w-full p-2.5 bg-slate-950 rounded-xl border border-slate-800 text-white focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div className="pt-3 flex justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="py-2.5 px-4 rounded-xl border border-slate-700 text-slate-300 font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="py-2.5 px-5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold shadow-lg shadow-indigo-600/30"
                >
                  Provision & Create Admin
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default TenantManager;
