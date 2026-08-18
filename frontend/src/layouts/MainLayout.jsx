import React from 'react';
import { Outlet, NavLink } from 'react-router-dom';
import { FileEdit, History, User, ShieldCheck, FileText, RotateCcw } from 'lucide-react';

const MainLayout = () => {
  return (
    <div className="flex h-screen bg-[#f8f9fc] overflow-hidden relative">

      {/* Sidebar for Desktop */}
      <aside className="hidden md:flex flex-col w-64 bg-[#1a1736] text-white h-full shadow-2xl z-20 shrink-0">
        <div className="p-6 flex items-center space-x-3 mb-6 border-b border-white/10 pb-6">
          <div className="w-10 h-10 rounded-full flex items-center justify-center p-0.5 bg-white shrink-0">
            <div className="w-full h-full rounded-full bg-gradient-to-br from-blue-500 via-red-500 to-yellow-400"></div>
          </div>
          <div>
            <h1 className="text-xl font-bold tracking-wide leading-tight">Coop 365</h1>
            <p className="text-[10px] text-gray-400 mt-0.5">Resident Portal</p>
          </div>
        </div>

        <nav className="flex-1 px-4 space-y-2">
          <NavLink
            to="/form"
            className={({ isActive }) => `flex items-center space-x-3 px-4 py-3.5 rounded-xl transition-all duration-200 ${isActive ? 'bg-[#5a32fa] text-white shadow-lg shadow-[#5a32fa]/30 translate-x-1' : 'text-gray-400 hover:bg-white/5 hover:text-white'}`}
          >
            <FileEdit size={20} />
            <span className="font-medium">Form Fill Up</span>
          </NavLink>

          <NavLink
            to="/history"
            className={({ isActive }) => `flex items-center space-x-3 px-4 py-3.5 rounded-xl transition-all duration-200 ${isActive ? 'bg-[#5a32fa] text-white shadow-lg shadow-[#5a32fa]/30 translate-x-1' : 'text-gray-400 hover:bg-white/5 hover:text-white'}`}
          >
            <History size={20} />
            <span className="font-medium">Saved History</span>
          </NavLink>

          <NavLink
            to="/profile"
            className={({ isActive }) => `flex items-center space-x-3 px-4 py-3.5 rounded-xl transition-all duration-200 ${isActive ? 'bg-[#5a32fa] text-white shadow-lg shadow-[#5a32fa]/30 translate-x-1' : 'text-gray-400 hover:bg-white/5 hover:text-white'}`}
          >
            <User size={20} />
            <span className="font-medium">Profile</span>
          </NavLink>
        </nav>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 overflow-y-auto pb-20 md:pb-0 w-full relative">
        <div className="max-w-6xl mx-auto min-h-full">
          <Outlet />
        </div>
      </main>

      {/* Bottom Navigation for Mobile */}
      <nav className="md:hidden fixed bottom-0 w-full bg-white border-t border-gray-100 flex justify-around items-center h-20 px-2 z-50 pb-2 shadow-[0_-4px_20px_rgba(0,0,0,0.05)]">
        <NavLink
          to="/form"
          className={({ isActive }) => `flex flex-col items-center justify-center w-full h-full space-y-1 ${isActive ? 'text-[#5a32fa]' : 'text-gray-400 hover:text-gray-600'}`}
        >
          {({ isActive }) => (
            <>
              <FileEdit size={24} strokeWidth={isActive ? 2.5 : 2} />
              <span className="text-[11px] font-semibold">Form</span>
            </>
          )}
        </NavLink>

        <NavLink
          to="/history"
          className={({ isActive }) => `flex flex-col items-center justify-center w-full h-full space-y-1 ${isActive ? 'text-[#5a32fa]' : 'text-gray-400 hover:text-gray-600'}`}
        >
          {({ isActive }) => (
            <>
              <History size={24} strokeWidth={isActive ? 2.5 : 2} />
              <span className="text-[11px] font-semibold">History</span>
            </>
          )}
        </NavLink>

        <NavLink
          to="/profile"
          className={({ isActive }) => `flex flex-col items-center justify-center w-full h-full space-y-1 ${isActive ? 'text-[#5a32fa]' : 'text-gray-400 hover:text-gray-600'}`}
        >
          {({ isActive }) => (
            <>
              <User size={24} strokeWidth={isActive ? 2.5 : 2} />
              <span className="text-[11px] font-semibold">Profile</span>
            </>
          )}
        </NavLink>
      </nav>
    </div>
  );
};

export default MainLayout;
