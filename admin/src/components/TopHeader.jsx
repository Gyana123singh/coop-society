import React from 'react';
import { Building2, ShieldCheck, ChevronDown, Lock, Menu } from 'lucide-react';

const TopHeader = ({ activeVendor, vendors, onVendorChange, userRole, onToggleMobileSidebar }) => {
  const isSuperAdmin = userRole === 'SUPER_ADMIN';

  return (
    <header className="bg-[#0f172a] border-b border-slate-800/80 px-3 sm:px-6 py-3 flex flex-wrap items-center justify-between sticky top-0 z-30 font-sans gap-2">
      {/* Mobile Hamburger + Tenant / Society Selector */}
      <div className="flex items-center space-x-2 sm:space-x-3 min-w-0 flex-1">
        <button
          onClick={onToggleMobileSidebar}
          className="md:hidden p-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 hover:text-white shrink-0"
          aria-label="Open Mobile Menu"
        >
          <Menu className="w-5 h-5" />
        </button>

        <div className="flex items-center space-x-1.5 text-xs font-semibold text-slate-400 shrink-0">
          <Building2 className="w-4 h-4 text-indigo-400 shrink-0" />
          <span className="hidden sm:inline">Active Housing Society:</span>
        </div>

        {isSuperAdmin ? (
          /* SUPER ADMIN ONLY: Dropdown showing ALL registered Housing Societies */
          <div className="relative flex-1 max-w-xs sm:max-w-md">
            <select
              value={activeVendor?._id || ''}
              onChange={(e) => {
                const selected = vendors.find(v => v._id === e.target.value);
                if (selected) onVendorChange(selected);
              }}
              className="w-full appearance-none bg-slate-900 text-white text-xs font-bold py-2 pl-3 pr-8 rounded-xl border border-indigo-500/60 focus:outline-none focus:border-indigo-400 cursor-pointer shadow-sm truncate"
            >
              {vendors.map((v) => (
                <option key={v._id} value={v._id}>
                  {v.name}
                </option>
              ))}
            </select>
            <ChevronDown className="w-4 h-4 text-indigo-400 absolute right-2.5 top-2.5 pointer-events-none" />
          </div>
        ) : (
          /* TENANT BUSINESS OWNER / SOCIETY ADMIN: Static locked badge */
          <div className="flex items-center space-x-1.5 bg-slate-900 border border-slate-700 px-2.5 py-1.5 rounded-xl text-xs font-bold text-white shadow-xs min-w-0 truncate">
            <Lock className="w-3.5 h-3.5 text-amber-400 shrink-0" />
            <span className="truncate">{activeVendor?.name}</span>
          </div>
        )}
      </div>

      {/* Admin User Profile Badge */}
      <div className="flex items-center space-x-2 sm:space-x-3 shrink-0 ml-auto">
        {/* User Profile Badge */}
        <div className="flex items-center space-x-2 sm:pl-3">
          <div className="w-8 h-8 rounded-full bg-indigo-600 text-white font-bold text-xs flex items-center justify-center shadow-sm shrink-0">
            {isSuperAdmin ? 'SA' : 'TO'}
          </div>
          <div className="hidden lg:block">
            <p className="text-xs font-bold text-white leading-tight">
              {isSuperAdmin ? 'Platform Super Admin' : 'Society Admin'}
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
