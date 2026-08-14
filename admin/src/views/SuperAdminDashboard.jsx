import React from 'react';
import { Building2, DollarSign, FileText, Users, Plus, ShieldCheck, ArrowUpRight } from 'lucide-react';

const SuperAdminDashboard = ({ stats, vendors, onOpenProvisionModal }) => {
  return (
    <div className="space-y-6">
      {/* Title & Action */}
      <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-white tracking-tight">
            Super Admin Platform Dashboard
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Cross-tenant housing society oversight, subscriptions, and system analytics.
          </p>
        </div>

        <button
          onClick={onOpenProvisionModal}
          className="w-full sm:w-auto bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold py-2.5 px-4 rounded-xl shadow-lg shadow-indigo-600/30 flex items-center justify-center space-x-2 transition-all shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>Provision New Tenant / Society</span>
        </button>
      </div>

      {/* Global Stat Metrics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1 */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Total Tenants</span>
            <div className="w-8 h-8 rounded-xl bg-indigo-500/10 text-indigo-400 flex items-center justify-center">
              <Building2 className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-black text-white mt-2">{stats.totalVendors}</div>
          <p className="text-[11px] text-emerald-400 mt-1 flex items-center font-medium">
            <ArrowUpRight className="w-3.5 h-3.5 mr-0.5" />
            {stats.activeVendors} Active Societies
          </p>
        </div>

        {/* Card 2 */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Grand Total Collections</span>
            <div className="w-8 h-8 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center">
              <DollarSign className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-black text-white mt-2">
            ₹ {parseFloat(stats.grandTotalCollection || 0).toLocaleString('en-IN')}
          </div>
          <p className="text-[11px] text-slate-400 mt-1">Across all registered societies</p>
        </div>

        {/* Card 3 */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Issued Vouchers</span>
            <div className="w-8 h-8 rounded-xl bg-blue-500/10 text-blue-400 flex items-center justify-center">
              <FileText className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-black text-white mt-2">{stats.totalReceipts}</div>
          <p className="text-[11px] text-slate-400 mt-1">System PDF Receipts generated</p>
        </div>

        {/* Card 4 */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Total Members</span>
            <div className="w-8 h-8 rounded-xl bg-amber-500/10 text-amber-400 flex items-center justify-center">
              <Users className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-black text-white mt-2">{stats.totalUsers}</div>
          <p className="text-[11px] text-slate-400 mt-1">Secretaries, Treasurers & Members</p>
        </div>
      </div>

      {/* Active Tenants / Housing Societies Table */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-sm">
        <div className="p-4 border-b border-slate-800 flex items-center justify-between">
          <h3 className="text-sm font-bold text-white">Registered Multi-Tenant Housing Societies</h3>
          <span className="text-xs font-semibold text-slate-400">{vendors.length} Societies</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left text-slate-300">
            <thead className="bg-slate-950 text-slate-400 font-bold uppercase tracking-wider text-[10px]">
              <tr>
                <th className="p-3.5">Society / Tenant Name</th>
                <th className="p-3.5">Registration No.</th>
                <th className="p-3.5">Contact Email</th>
                <th className="p-3.5">Book / Last Receipt</th>
                <th className="p-3.5 text-center">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800">
              {vendors.map((v) => (
                <tr key={v._id} className="hover:bg-slate-800/50 transition-all">
                  <td className="p-3.5 font-bold text-white flex items-center space-x-2">
                    <Building2 className="w-4 h-4 text-indigo-400 shrink-0" />
                    <span>{v.name}</span>
                  </td>
                  <td className="p-3.5 font-mono text-slate-300">{v.regNo}</td>
                  <td className="p-3.5 text-slate-400">{v.contactEmail || 'secretary@mandovinagar.org'}</td>
                  <td className="p-3.5 font-semibold text-slate-300">
                    Book {v.currentBookNo || '1'} / Receipt #{v.lastReceiptNo || '180'}
                  </td>
                  <td className="p-3.5 text-center">
                    <span className="inline-flex items-center space-x-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                      <ShieldCheck className="w-3 h-3" />
                      <span>{v.status || 'ACTIVE'}</span>
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default SuperAdminDashboard;
