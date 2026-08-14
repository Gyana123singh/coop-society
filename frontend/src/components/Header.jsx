import React from 'react';
import { FileText, Save } from 'lucide-react';

const Header = ({ title = "Coop 365", subtitle, showActions = true }) => {
  return (
    <div className="bg-[#1a1736] text-white p-4 flex justify-between items-center sticky top-0 z-40">
      <div className="flex items-center space-x-3">
        <div className="w-8 h-8 rounded-full flex items-center justify-center p-0.5 bg-white">
          <div className="w-full h-full rounded-full bg-gradient-to-br from-blue-500 via-red-500 to-yellow-400"></div>
        </div>
        <div>
          <h1 className="text-base font-bold leading-none">{title}</h1>
          {subtitle && <p className="text-[10px] text-gray-300 mt-1">{subtitle}</p>}
        </div>
      </div>
      
      {showActions && (
        <div className="flex space-x-4">
          <button className="text-white hover:text-gray-300">
            <FileText size={20} />
          </button>
          <button className="text-white hover:text-gray-300">
            <Save size={20} />
          </button>
        </div>
      )}
    </div>
  );
};

export default Header;
