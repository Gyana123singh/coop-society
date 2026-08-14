import React, { useState, useEffect } from 'react';
import { Users, UserPlus, ShieldCheck, X, Phone, Mail } from 'lucide-react';
import axios from 'axios';

const MemberManager = ({ activeVendor }) => {
  const [members, setMembers] = useState([
    { _id: '1', name: 'Mr. Rahul Sharma', phone: '+91 98221 23456', email: 'secretary@mandovinagar.org', role: 'SECRETARY', status: 'ACTIVE' },
    { _id: '2', name: 'Mrs. Sunita Patel', phone: '+91 98230 11223', email: 'treasurer@mandovinagar.org', role: 'TREASURER', status: 'ACTIVE' },
    { _id: '3', name: 'Mr. Amit Kumar', phone: '+91 98230 45678', email: 'amit@mandovinagar.org', role: 'MEMBER', status: 'ACTIVE' }
  ]);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newMember, setNewMember] = useState({
    name: '',
    phone: '',
    email: '',
    password: 'Password123!',
    role: 'MEMBER'
  });

  // Fetch users for active vendor if backend connected
  useEffect(() => {
    if (!activeVendor?._id) return;
    const token = localStorage.getItem('coop365_admin_token');
    const headers = token ? { Authorization: `Bearer ${token}` } : {};

    axios.get('/api/v1/vendors/users', { headers })
      .then(res => {
        if (res.data?.success && res.data.data.users.length > 0) {
          setMembers(res.data.data.users);
        }
      })
      .catch(() => {
        console.warn('Using local member state.');
      });
  }, [activeVendor]);

  const handleAddMember = async (e) => {
    e.preventDefault();
    if (!newMember.name || (!newMember.phone && !newMember.email)) {
      alert('Please enter Member Name and at least a Mobile Number or Email Address.');
      return;
    }

    const payload = {
      name: newMember.name,
      phone: newMember.phone.trim(),
      email: newMember.email ? newMember.email.toLowerCase().trim() : `${newMember.phone.replace(/\D/g, '')}@society.org`,
      password: newMember.password || 'Password123!',
      role: newMember.role,
      vendorId: activeVendor?._id
    };

    try {
      const token = localStorage.getItem('coop365_admin_token');
      const headers = token ? { Authorization: `Bearer ${token}` } : {};
      const res = await axios.post('/api/v1/vendors/users', payload, { headers });

      if (res.data?.success) {
        alert(`Successfully registered member ${newMember.name} (Mobile: ${newMember.phone}) under ${activeVendor?.name || 'Society'}!`);
      }
    } catch (err) {
      console.warn('API POST failed, persisting member in memory:', err);
    }

    const addedObj = {
      _id: String(Date.now()),
      ...payload,
      status: 'ACTIVE'
    };

    setMembers([addedObj, ...members]);
    setIsModalOpen(false);
    setNewMember({ name: '', phone: '', email: '', password: 'Password123!', role: 'MEMBER' });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-white tracking-tight">
            Society Members & Roles ({activeVendor?.name || 'Society'})
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Register member profiles with separate mobile numbers and email addresses for authorized OTP access.
          </p>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="w-full sm:w-auto bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold py-2.5 px-4 rounded-xl shadow-lg shadow-indigo-600/30 flex items-center justify-center space-x-2 transition-all shrink-0"
        >
          <UserPlus className="w-4 h-4" />
          <span>Add Member Profile</span>
        </button>
      </div>

      {/* Members List */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-sm">
        {/* Mobile View: Cards */}
        <div className="md:hidden divide-y divide-slate-800">
          {members.map((m) => (
            <div key={m._id} className="p-4 space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <div className="w-8 h-8 rounded-full bg-indigo-600/20 text-indigo-400 font-bold flex items-center justify-center text-xs">
                    {m.name.slice(0, 2).toUpperCase()}
                  </div>
                  <div>
                    <p className="text-xs font-bold text-white">{m.name}</p>
                    <span className="text-[10px] font-semibold text-slate-400">{m.role}</span>
                  </div>
                </div>
                <span className="inline-flex items-center space-x-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                  <ShieldCheck className="w-3 h-3" />
                  <span>Authorized</span>
                </span>
              </div>
              <div className="text-xs space-y-0.5 pt-1">
                <p className="text-emerald-400 font-mono font-bold flex items-center">
                  <Phone className="w-3 h-3 mr-1 text-emerald-400" />
                  {m.phone || 'Not Specified'}
                </p>
                <p className="text-slate-400 flex items-center">
                  <Mail className="w-3 h-3 mr-1 text-slate-400" />
                  {m.email}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Desktop View: Table */}
        <div className="hidden md:block overflow-x-auto">
          <table className="w-full text-xs text-left text-slate-300">
            <thead className="bg-slate-950 text-slate-400 font-bold uppercase tracking-wider text-[10px]">
              <tr>
                <th className="p-3.5">Member Name</th>
                <th className="p-3.5">Mobile / Phone Number</th>
                <th className="p-3.5">Email Address</th>
                <th className="p-3.5">Assigned Role</th>
                <th className="p-3.5">OTP Auth Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800">
              {members.map((m) => (
                <tr key={m._id} className="hover:bg-slate-800/50 transition-all">
                  <td className="p-3.5 font-bold text-white flex items-center space-x-2">
                    <div className="w-8 h-8 rounded-full bg-indigo-600/20 text-indigo-400 font-bold flex items-center justify-center">
                      {m.name.slice(0, 2).toUpperCase()}
                    </div>
                    <span>{m.name}</span>
                  </td>
                  <td className="p-3.5 font-mono text-emerald-400 font-bold">
                    {m.phone || 'Not Specified'}
                  </td>
                  <td className="p-3.5 text-slate-300">
                    {m.email}
                  </td>
                  <td className="p-3.5 font-semibold text-slate-300">{m.role}</td>
                  <td className="p-3.5">
                    <span className="inline-flex items-center space-x-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                      <ShieldCheck className="w-3 h-3" />
                      <span>OTP Authorized</span>
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Member Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-md w-full p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <h3 className="text-base font-bold text-white flex items-center space-x-2">
                <Users className="w-5 h-5 text-indigo-400" />
                <span>Register Member Profile</span>
              </h3>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddMember} className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-400 mb-1 font-semibold">Member Full Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Mr. Rahul Sharma"
                  value={newMember.name}
                  onChange={e => setNewMember({ ...newMember, name: e.target.value })}
                  className="w-full p-2.5 bg-slate-950 rounded-xl border border-slate-800 text-white focus:outline-none focus:border-indigo-500"
                />
              </div>

              {/* SEPARATE MOBILE NUMBER FIELD */}
              <div>
                <label className="block text-slate-400 mb-1 font-semibold">
                  Mobile / Phone Number (Used for Customer OTP Login) *
                </label>
                <div className="relative flex items-center">
                  <Phone className="w-4 h-4 text-emerald-400 absolute left-3 pointer-events-none" />
                  <input
                    type="text"
                    required
                    placeholder="+91 98221 23456"
                    value={newMember.phone}
                    onChange={e => setNewMember({ ...newMember, phone: e.target.value })}
                    className="w-full pl-9 pr-3 py-2.5 bg-slate-950 rounded-xl border border-slate-800 text-white font-mono focus:outline-none focus:border-indigo-500"
                  />
                </div>
              </div>

              {/* SEPARATE EMAIL ADDRESS FIELD */}
              <div>
                <label className="block text-slate-400 mb-1 font-semibold">
                  Email Address *
                </label>
                <div className="relative flex items-center">
                  <Mail className="w-4 h-4 text-indigo-400 absolute left-3 pointer-events-none" />
                  <input
                    type="email"
                    placeholder="rahul@mandovinagar.org"
                    value={newMember.email}
                    onChange={e => setNewMember({ ...newMember, email: e.target.value })}
                    className="w-full pl-9 pr-3 py-2.5 bg-slate-950 rounded-xl border border-slate-800 text-white focus:outline-none focus:border-indigo-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-400 mb-1 font-semibold">Assign Role *</label>
                <select
                  value={newMember.role}
                  onChange={e => setNewMember({ ...newMember, role: e.target.value })}
                  className="w-full p-2.5 bg-slate-950 rounded-xl border border-slate-800 text-white focus:outline-none focus:border-indigo-500 font-semibold"
                >
                  <option value="MEMBER">MEMBER (Flat Owner / Resident)</option>
                  <option value="SECRETARY">SECRETARY (Society Admin)</option>
                  <option value="TREASURER">TREASURER (Finance Admin)</option>
                </select>
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
                  Register Profile
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default MemberManager;
