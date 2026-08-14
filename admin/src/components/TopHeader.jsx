import React from 'react';
import { Building2, ShieldCheck, ChevronDown, Lock } from 'lucide-react';

const TopHeader = ({ activeVendor, vendors, onVendorChange, userRole }) => {
  const isSuperAdmin = userRole === 'SUPER_ADMIN';

  return (
    <header className="bg-[#0f172a] border-b border-slate-800/80 px-6 py-3.5 flex items-center justify-between sticky top-0 z-30 font-sans">
      {/* Tenant / Society Selector or Locked Badge based on Role */}
      <div className="flex items-center space-x-3">
        <div className="flex items-center space-x-2 text-xs font-semibold text-slate-400">
          <Building2 className="w-4 h-4 text-indigo-400" />
          <span>Active Housing Society / Tenant:</span>
        </div>

        {isSuperAdmin ? (
          /* SUPER ADMIN ONLY: Dropdown showing ALL registered Housing Societies */
          <div className="relative">
            <select
              value={activeVendor?._id || ''}
              onChange={(e) => {
                const selected = vendors.find(v => v._id === e.target.value);
                if (selected) onVendorChange(selected);
              }}
              className="appearance-none bg-slate-900 text-white text-xs font-bold py-2 pl-3 pr-8 rounded-xl border border-indigo-500/60 focus:outline-none focus:border-indigo-400 cursor-pointer shadow-sm"
            >
              {vendors.map((v) => (
                <option key={v._id} value={v._id}>
                  {v.name} ({v.regNo || 'Reg. Active'})
                </option>
              ))}
            </select>
            <ChevronDown className="w-4 h-4 text-indigo-400 absolute right-2.5 top-2.5 pointer-events-none" />
          </div>
        ) : (
          /* TENANT BUSINESS OWNER / SOCIETY ADMIN: Static locked badge displaying assigned society */
          <div className="flex items-center space-x-2 bg-slate-900 border border-slate-700 px-3 py-1.5 rounded-xl text-xs font-bold text-white shadow-xs">
            <Lock className="w-3.5 h-3.5 text-amber-400" />
            <span>{activeVendor?.name}</span>
            <span className="text-[10px] text-slate-400 font-mono">({activeVendor?.regNo})</span>
          </div>
        )}
      </div>

      {/* Admin User Profile Badge */}
      <div className="flex items-center space-x-4">
        {/* Static Authenticated Role Badge */}
        <div className="text-xs font-bold text-slate-300 bg-slate-900 border border-slate-700 px-3 py-1 rounded-lg">
          <span>Role: {isSuperAdmin ? 'SUPER_ADMIN' : 'TENANT_BUSINESS_OWNER'}</span>
        </div>

        {/* User Profile Badge */}
        <div className="flex items-center space-x-2.5 border-l border-slate-800 pl-4">
          <div className="w-8 h-8 rounded-full bg-indigo-600 text-white font-bold text-xs flex items-center justify-center shadow-sm">
            {isSuperAdmin ? 'SA' : 'TO'}
          </div>
          <div>
            <p className="text-xs font-bold text-white leading-tight">
              {isSuperAdmin ? 'Platform Super Admin' : 'Tenant Business Owner / Admin'}
            </p>
            <p className="text-[10px] text-emerald-400 flex items-center font-medium">
              <ShieldCheck className="w-3 h-3 mr-0.5" />
              {userRole || 'TENANT_BUSINESS_OWNER'}
            </p>
          </div>
        </div>
      </div>
    </header>
  );
};

export default TopHeader;
