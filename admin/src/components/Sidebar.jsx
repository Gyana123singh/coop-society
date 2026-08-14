import React from 'react';
import {
  LayoutDashboard,
  Building2,
  FileText,
  PieChart,
  Users,
  Settings,
  ShieldAlert,
  LogOut,
  X
} from 'lucide-react';

const Sidebar = ({ activeView, onViewChange, userRole, onLogout, isMobileOpen, onCloseMobile }) => {
  const isSuperAdmin = userRole === 'SUPER_ADMIN';

  const menuItems = [
    { id: 'dashboard', label: 'Super Admin Dashboard', icon: LayoutDashboard, superOnly: true },
    { id: 'tenants', label: 'Multi-Tenant Manager', icon: Building2, superOnly: true },
    { id: 'receipts', label: 'Receipt Manager', icon: FileText, superOnly: false },
    { id: 'reports', label: 'Financial Analytics', icon: PieChart, superOnly: false },
    { id: 'members', label: 'Members & Roles', icon: Users, superOnly: false },
    { id: 'settings', label: 'Society Settings', icon: Settings, superOnly: false }
  ];

  return (
    <aside className={`w-64 bg-[#090d16] border-r border-slate-800/80 flex flex-col justify-between shrink-0 h-full min-h-screen text-slate-300 fixed inset-y-0 left-0 z-50 transform transition-transform duration-300 ease-in-out md:static md:translate-x-0 ${isMobileOpen ? 'translate-x-0 shadow-2xl' : '-translate-x-full'}`}>
      <div>
        {/* Brand Header */}
        <div className="p-5 border-b border-slate-800/80 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-indigo-500 to-blue-600 p-[2px] flex items-center justify-center font-bold text-white shadow-md shadow-indigo-500/20">
              <Building2 className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-base font-bold text-white tracking-tight leading-tight">
                Coop 365 Admin
              </h1>
              <span className="text-[10px] font-semibold text-indigo-400 uppercase tracking-widest">
                {isSuperAdmin ? 'Super Admin Portal' : 'Society Portal'}
              </span>
            </div>
          </div>

          {/* Close button on mobile */}
          <button 
            onClick={onCloseMobile} 
            className="md:hidden p-1.5 rounded-lg bg-slate-900 text-slate-400 hover:text-white"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* System Role Badge */}
        <div className="mx-4 my-3 p-2.5 rounded-xl bg-slate-900 border border-slate-800 flex items-center space-x-2">
          <ShieldAlert className="w-4 h-4 text-indigo-400 shrink-0" />
          <div className="min-w-0 flex-1">
            <p className="text-[11px] font-bold text-slate-200 truncate">
              {isSuperAdmin ? 'Platform Administrator' : 'Society Administrator'}
            </p>
            <p className="text-[10px] text-slate-400">Multi-Vendor Control Mode</p>
          </div>
        </div>

        {/* Navigation Links */}
        <nav className="px-3 py-2 space-y-1">
          {menuItems.map((item) => {
            if (item.superOnly && !isSuperAdmin) return null;
            const Icon = item.icon;
            const isActive = activeView === item.id;
            return (
              <button
                key={item.id}
                onClick={() => onViewChange(item.id)}
                className={`w-full flex items-center space-x-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                  isActive
                    ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-slate-400'}`} />
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>
      </div>

      {/* Logout / Exit Action */}
      <div className="p-4 border-t border-slate-800/80">
        <button
          onClick={onLogout}
          className="w-full flex items-center justify-center space-x-2 py-2.5 px-3 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 text-rose-400 hover:text-rose-300 text-xs font-semibold transition-all"
        >
          <LogOut className="w-4 h-4" />
          <span>Exit Admin Portal</span>
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
