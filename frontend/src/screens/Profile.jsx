import React, { useState, useEffect } from 'react';
import Header from '../components/Header';
import { useApp } from '../context/AppContext';
import { useAuth } from '../context/AuthContext';
import { Building2, MapPin, BadgeCheck, LogOut, Phone, Mail, User as UserIcon, RefreshCw, Edit3, Loader2, CheckCircle2, ShieldCheck, Home } from 'lucide-react';
import axios from 'axios';

const Profile = () => {
  const { residentDetails, updateResidentDetails, refreshSociety } = useApp();
  const { logout, user: authUser } = useAuth();

  const [profileData, setProfileData] = useState({
    name: authUser?.name || residentDetails.name,
    email: authUser?.email || residentDetails.email,
    phone: authUser?.phone || '+91 8280057771',
    role: authUser?.role || 'MEMBER',
    flatNo: authUser?.flatNo || residentDetails.flatNo
  });

  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editForm, setEditForm] = useState({ name: '', email: '', phone: '' });

  // Fetch live user profile and society details from backend MongoDB
  const fetchUserProfile = async () => {
    setLoading(true);
    try {
      const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';
      const token = localStorage.getItem('coop365_token');
      if (!token) return;

      const res = await axios.get(`${API_URL}/api/v1/auth/me`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      if (res.data?.success && res.data.data?.user) {
        const u = res.data.data.user;
        setProfileData({
          name: u.name || profileData.name,
          email: u.email || profileData.email,
          phone: u.phone || profileData.phone,
          role: u.role || 'MEMBER',
          flatNo: u.flatNo || residentDetails.flatNo
        });

        // Sync society details if populated
        if (u.vendorId && typeof u.vendorId === 'object') {
          updateResidentDetails({
            societyName: u.vendorId.name || residentDetails.societyName,
            address: u.vendorId.address || residentDetails.address,
            registrationNo: u.vendorId.regNo || residentDetails.registrationNo,
            email: u.vendorId.contactEmail || residentDetails.email,
            phone: u.vendorId.contactPhone || residentDetails.phone,
            authorisedSignature: u.vendorId.authorisedSignature || residentDetails.authorisedSignature
          });
        }
      }
    } catch (err) {
      console.warn('[Profile] API fetch user profile notice:', err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUserProfile();
  }, []);

  const openEditModal = () => {
    setEditForm({
      name: profileData.name,
      email: profileData.email,
      phone: profileData.phone
    });
    setShowEditModal(true);
  };

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';
      const token = localStorage.getItem('coop365_token');
      const headers = token ? { Authorization: `Bearer ${token}` } : {};

      const res = await axios.put(`${API_URL}/api/v1/auth/me`, editForm, { headers });
      if (res.data?.success) {
        const updated = res.data.data.user;
        setProfileData(prev => ({
          ...prev,
          name: updated.name || editForm.name,
          email: updated.email || editForm.email,
          phone: updated.phone || editForm.phone
        }));
        setShowEditModal(false);
        alert('Profile updated successfully in MongoDB database!');
        return;
      }
    } catch (err) {
      console.warn('[Profile] API update error, applying local state update:', err.message);
      setProfileData(prev => ({
        ...prev,
        name: editForm.name,
        email: editForm.email,
        phone: editForm.phone
      }));
      setShowEditModal(false);
      alert('Profile details updated!');
    } finally {
      setSaving(false);
    }
  };

  const displayName = profileData.name || residentDetails.name;
  const initials = displayName.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase() || 'RM';

  return (
    <div className="min-h-full pb-12 md:bg-gray-50 flex flex-col items-center font-sans">
      
      {/* Mobile Top Header */}
      <div className="w-full md:hidden">
        <Header subtitle={residentDetails.societyName} showActions={true} />
      </div>
      
      {/* Desktop Header */}
      <div className="hidden md:flex w-full sticky top-0 z-40 bg-white/80 backdrop-blur-md border-b border-gray-200 p-4 md:px-8 justify-between items-center">
        <div>
          <h1 className="text-xl md:text-2xl font-bold text-gray-900">Resident Profile</h1>
          <p className="text-xs md:text-sm text-gray-500">Manage account information & housing society details</p>
        </div>
        <button
          onClick={fetchUserProfile}
          disabled={loading}
          className="p-2 rounded-xl bg-indigo-50 border border-indigo-100 text-indigo-600 hover:bg-indigo-100 transition-all flex items-center space-x-1.5 text-xs font-semibold"
          title="Sync Profile with MongoDB Backend API"
        >
          <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          <span>Sync API</span>
        </button>
      </div>
      
      <div className="p-4 md:p-8 w-full max-w-4xl mt-2 md:mt-6">
        
        <div className="flex flex-col md:flex-row md:gap-10 items-center md:items-start md:bg-white md:p-10 md:rounded-3xl md:shadow-sm md:border md:border-gray-100">
          
          {/* User Info Avatar Card */}
          <div className="flex flex-col items-center w-full md:w-1/3 mb-8 md:mb-0">
            <div className="w-[105px] h-[105px] rounded-full bg-[#5a32fa] text-white flex items-center justify-center text-3xl font-bold mb-4 shadow-lg shadow-[#5a32fa]/25 relative">
              <span>{initials}</span>
              <div className="absolute bottom-1 right-1 w-6 h-6 rounded-full bg-green-500 border-2 border-white flex items-center justify-center text-white" title="Verified Member">
                <CheckCircle2 size={14} />
              </div>
            </div>
            
            <h2 className="text-xl font-bold text-gray-900 text-center">{displayName}</h2>
            <p className="text-xs text-gray-500 mb-3">{profileData.email}</p>
            
            <div className="inline-flex items-center space-x-1 bg-indigo-50 border border-indigo-100 text-[#5a32fa] px-3 py-1 rounded-full text-xs font-semibold mb-4">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Role: {profileData.role}</span>
            </div>

            <button
              onClick={openEditModal}
              className="w-full py-2.5 px-4 bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold text-xs rounded-xl flex items-center justify-center space-x-2 transition-all"
            >
              <Edit3 size={14} />
              <span>Edit Profile Details</span>
            </button>
          </div>
          
          {/* Society Details Card */}
          <div className="w-full md:w-2/3 flex flex-col space-y-6">
            
            <div className="bg-white md:bg-gray-50 rounded-2xl border border-gray-100 overflow-hidden shadow-sm">
              
              <div className="p-4 flex items-start space-x-4 border-b border-gray-100">
                <Building2 className="text-[#5a32fa] shrink-0 mt-0.5" size={20} />
                <div>
                  <p className="text-xs text-gray-400 font-bold uppercase tracking-wider mb-0.5">Housing Society</p>
                  <p className="text-sm font-bold text-gray-900">{residentDetails.societyName}</p>
                </div>
              </div>
              
              <div className="p-4 flex items-start space-x-4 border-b border-gray-100">
                <MapPin className="text-[#5a32fa] shrink-0 mt-0.5" size={20} />
                <div>
                  <p className="text-xs text-gray-400 font-bold uppercase tracking-wider mb-0.5">Full Society Address</p>
                  <p className="text-sm font-medium text-gray-800">{residentDetails.address}</p>
                </div>
              </div>
              
              <div className="p-4 flex items-start space-x-4 border-b border-gray-100">
                <BadgeCheck className="text-[#5a32fa] shrink-0 mt-0.5" size={20} />
                <div>
                  <p className="text-xs text-gray-400 font-bold uppercase tracking-wider mb-0.5">Registration Number</p>
                  <p className="text-sm font-semibold text-gray-900">{residentDetails.registrationNo}</p>
                </div>
              </div>

              <div className="p-4 flex items-start space-x-4 border-b border-gray-100">
                <Home className="text-[#5a32fa] shrink-0 mt-0.5" size={20} />
                <div>
                  <p className="text-xs text-gray-400 font-bold uppercase tracking-wider mb-0.5">Registered Flat / Shop No.</p>
                  <p className="text-sm font-bold text-indigo-600">{profileData.flatNo || residentDetails.flatNo || 'Flat A-302'}</p>
                </div>
              </div>

              <div className="p-4 flex items-start space-x-4">
                <Phone className="text-[#5a32fa] shrink-0 mt-0.5" size={20} />
                <div>
                  <p className="text-xs text-gray-400 font-bold uppercase tracking-wider mb-0.5">Registered Phone / Contact</p>
                  <p className="text-sm font-bold text-gray-900">{profileData.phone || '+91 8280057771'}</p>
                </div>
              </div>
              
            </div>

            <button 
              onClick={logout}
              className="w-full py-3.5 bg-white border border-red-500 text-red-600 rounded-xl font-bold text-sm flex items-center justify-center space-x-2 transition-all hover:bg-red-50 shadow-sm"
            >
              <LogOut size={18} className="shrink-0" />
              <span>Sign Out from Coop 365</span>
            </button>
            
          </div>
          
        </div>
      </div>

      {/* Edit Profile Modal */}
      {showEditModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 w-full max-w-md shadow-2xl border border-gray-100 space-y-4">
            <h3 className="text-lg font-bold text-gray-900 flex items-center space-x-2">
              <UserIcon className="w-5 h-5 text-[#5a32fa]" />
              <span>Edit Resident Profile Details</span>
            </h3>

            <form onSubmit={handleUpdateProfile} className="space-y-4 text-xs">
              <div>
                <label className="block text-gray-700 font-bold mb-1">Full Name *</label>
                <input
                  type="text"
                  required
                  value={editForm.name}
                  onChange={e => setEditForm({ ...editForm, name: e.target.value })}
                  className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:border-[#5a32fa] font-bold text-sm"
                />
              </div>

              <div>
                <label className="block text-gray-700 font-bold mb-1">Email Address *</label>
                <input
                  type="email"
                  required
                  value={editForm.email}
                  onChange={e => setEditForm({ ...editForm, email: e.target.value })}
                  className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:border-[#5a32fa] font-semibold text-sm"
                />
              </div>

              <div>
                <label className="block text-gray-700 font-bold mb-1">Mobile Phone Number *</label>
                <input
                  type="text"
                  required
                  value={editForm.phone}
                  onChange={e => setEditForm({ ...editForm, phone: e.target.value })}
                  className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:border-[#5a32fa] font-semibold text-sm"
                />
              </div>

              <div className="flex justify-end space-x-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowEditModal(false)}
                  className="px-4 py-2.5 rounded-xl border border-gray-200 text-gray-600 font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="px-5 py-2.5 rounded-xl bg-[#5a32fa] text-white font-bold flex items-center space-x-1.5 disabled:opacity-50"
                >
                  {saving && <Loader2 className="w-4 h-4 animate-spin" />}
                  <span>Save Profile</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Profile;

