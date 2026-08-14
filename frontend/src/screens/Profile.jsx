import React from 'react';
import Header from '../components/Header';
import { useApp } from '../context/AppContext';
import { useAuth } from '../context/AuthContext';
import { Building2, MapPin, BadgeCheck, LogOut, Phone } from 'lucide-react';

const Profile = () => {
  const { residentDetails } = useApp();
  const { logout, user } = useAuth();

  const initials = residentDetails.role.split(' ').map(n => n[0]).join('');

  return (
    <div className="min-h-full pb-8 md:bg-gray-50 flex flex-col items-center">
      
      {/* Mobile Top Header (from original design) */}
      <div className="w-full md:hidden">
        <Header subtitle={residentDetails.societyName} showActions={true} />
      </div>
      
      {/* Desktop Header */}
      <div className="hidden md:flex w-full sticky top-0 z-40 bg-white/80 backdrop-blur-md border-b border-gray-200 p-4 md:px-8 justify-between items-center">
        <div>
          <h1 className="text-xl md:text-2xl font-bold text-gray-900">Profile</h1>
          <p className="text-xs md:text-sm text-gray-500">Manage your account and society details</p>
        </div>
      </div>
      
      <div className="p-6 w-full max-w-4xl mt-4 md:mt-8">
        
        <div className="flex flex-col md:flex-row md:gap-12 items-center md:items-start md:bg-white md:p-10 md:rounded-3xl md:shadow-sm md:border md:border-gray-100">
          
          {/* User Info */}
          <div className="flex flex-col items-center w-full md:w-1/3 mb-10 md:mb-0">
            <div className="w-[100px] h-[100px] rounded-full bg-[#5a32fa] text-white flex items-center justify-center text-4xl font-bold mb-5">
              {initials}
            </div>
            
            <h2 className="text-[22px] font-bold text-[#1f2937] mb-1">{residentDetails.role}</h2>
            <p className="text-[#6b7280] text-sm mb-4">{residentDetails.email}</p>
            
            <div className="bg-[#e6f4ea] text-[#137333] px-4 py-1.5 rounded-full text-[13px] font-semibold tracking-wide">
              Signed in via Phone
            </div>
          </div>
          
          {/* Society Details Card */}
          <div className="w-full md:w-2/3 flex flex-col">
            
            <div className="bg-[#f9fafb] md:bg-white rounded-[16px] md:rounded-none border border-[#f3f4f6] md:border-none overflow-hidden mb-8">
              
              <div className="p-[18px] flex items-start space-x-4 border-b border-[#f3f4f6] md:border-gray-100">
                <Building2 className="text-[#5a32fa] shrink-0" size={22} />
                <div>
                  <p className="text-[13px] text-[#4b5563] mb-0.5">Housing Society</p>
                  <p className="text-[15px] font-medium text-[#1f2937]">{residentDetails.societyName}</p>
                </div>
              </div>
              
              <div className="p-[18px] flex items-start space-x-4 border-b border-[#f3f4f6] md:border-gray-100">
                <MapPin className="text-[#5a32fa] shrink-0" size={22} />
                <div>
                  <p className="text-[13px] text-[#4b5563] mb-0.5">Address</p>
                  <p className="text-[15px] font-medium text-[#1f2937]">{residentDetails.address}</p>
                </div>
              </div>
              
              <div className="p-[18px] flex items-start space-x-4 border-b border-[#f3f4f6] md:border-gray-100">
                <BadgeCheck className="text-[#5a32fa] shrink-0" size={22} />
                <div>
                  <p className="text-[13px] text-[#4b5563] mb-0.5">Registration No.</p>
                  <p className="text-[15px] font-medium text-[#1f2937]">{residentDetails.registrationNo}</p>
                </div>
              </div>

              {/* Extra Phone Field Requested by User */}
              <div className="p-[18px] flex items-start space-x-4">
                <Phone className="text-[#5a32fa] shrink-0" size={22} />
                <div>
                  <p className="text-[13px] text-[#4b5563] mb-0.5">Phone Number</p>
                  <p className="text-[15px] font-medium text-[#1f2937]">+91 {user?.phone || 'N/A'}</p>
                </div>
              </div>
              
            </div>

            <button 
              onClick={logout}
              className="w-full py-[14px] bg-white border border-[#ef4444] text-[#ef4444] rounded-[10px] font-semibold flex items-center justify-center space-x-2 transition-colors md:hover:bg-red-50"
            >
              <LogOut size={18} className="mr-1 shrink-0" />
              <span className="text-[15px]">Sign Out from Coop 365</span>
            </button>
            
          </div>
          
        </div>
      </div>
    </div>
  );
};

export default Profile;
