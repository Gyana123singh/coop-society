import React, { useState, useEffect } from 'react';
import { Users, UserPlus, ShieldCheck, X, Phone, Mail, Home, Search, Eye, Edit2, Trash2, CheckCircle2, UserCheck, Shield, FileText, CreditCard, Upload } from 'lucide-react';
import axios from 'axios';

const initialTestMembers = [
  { _id: '1', name: 'Mr. Rahul Sharma', phone: '+91 98221 23456', email: 'secretary@mandovinagar.org', flatNo: 'Flat A-101', panNo: 'AAAAA0000A', panDocUrl: '', role: 'SECRETARY', status: 'ACTIVE', createdAt: '2024-01-15' },
  { _id: '2', name: 'Mrs. Sunita Patel', phone: '+91 98230 11223', email: 'treasurer@mandovinagar.org', flatNo: 'Flat A-204', panNo: 'AAAAA0000A', panDocUrl: '', role: 'TREASURER', status: 'ACTIVE', createdAt: '2024-02-01' },
  { _id: '3', name: 'Mr. Amit Kumar', phone: '+91 98230 45678', email: 'amit@mandovinagar.org', flatNo: 'Flat B-302', panNo: 'AAAAA0000A', panDocUrl: '', role: 'MEMBER', status: 'ACTIVE', createdAt: '2024-03-10' },
  { _id: '4', name: 'Mrs. Priya Singh', phone: '+91 98231 99887', email: 'gyan123priya@gmail.com', flatNo: 'Flat B-105', panNo: 'AAAAA0000A', panDocUrl: '', role: 'MEMBER', status: 'ACTIVE', createdAt: '2024-04-12' },
  { _id: '5', name: 'Mr. Gyana Singh', phone: '+91 98221 88776', email: 'gyana@mandovinagar.org', flatNo: 'Flat C-401', panNo: 'AAAAA0000A', panDocUrl: '', role: 'MEMBER', status: 'ACTIVE', createdAt: '2024-05-02' }
];

const MemberManager = ({ activeVendor, receipts = [], onOpenPDF }) => {
  const vendorKey = activeVendor?._id ? `coop365_admin_members_${activeVendor._id}` : 'coop365_admin_members_default';

  const [members, setMembers] = useState(() => {
    const saved = localStorage.getItem(vendorKey);
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {}
    }
    return initialTestMembers;
  });

  const [searchQuery, setSearchQuery] = useState('');
  const [roleFilter, setRoleFilter] = useState('ALL');

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedMember, setSelectedMember] = useState(null); // for View Details Modal
  const [editingMember, setEditingMember] = useState(null); // for Edit Modal
  const [previewPanDoc, setPreviewPanDoc] = useState(null); // for PAN Document Modal Preview

  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    flatNo: 'Flat A-101',
    panNo: '',
    panDocUrl: '',
    password: 'Password123!',
    role: 'MEMBER',
    status: 'ACTIVE'
  });

  // Calculate submitted receipts for selected member in View Modal
  const memberReceipts = selectedMember ? receipts.filter(r => {
    const nameMatch = r.receivedFrom && r.receivedFrom.toLowerCase().includes(selectedMember.name.toLowerCase());
    const flatMatch = (r.flatShopNo || r.flatNo) && selectedMember.flatNo && String(r.flatShopNo || r.flatNo).toLowerCase().includes(String(selectedMember.flatNo).toLowerCase());
    return nameMatch || flatMatch;
  }) : [];

  const memberTotalPaid = memberReceipts.reduce((sum, r) => sum + (parseFloat(r.totalAmount) || 0), 0);

  // Helper to persist members state to localStorage
  const saveMembersToCache = (updatedList) => {
    setMembers(updatedList);
    if (vendorKey) {
      localStorage.setItem(vendorKey, JSON.stringify(updatedList));
    }
  };

  // Fetch users for active vendor if backend connected
  useEffect(() => {
    if (!activeVendor?._id) return;
    
    // Load from cache first
    const saved = localStorage.getItem(vendorKey);
    if (saved) {
      try {
        setMembers(JSON.parse(saved));
      } catch (e) {}
    }

    const token = localStorage.getItem('coop365_admin_token');
    const headers = token ? { Authorization: `Bearer ${token}` } : {};

    axios.get(`/api/v1/vendors/users?vendorId=${activeVendor._id}`, { headers })
      .then(res => {
        if (res.data?.success && res.data.data?.users && res.data.data.users.length > 0) {
          saveMembersToCache(res.data.data.users);
        }
      })
      .catch(() => {
        console.warn('Using persistent local member state.');
      });
  }, [activeVendor?._id]);

  const openAddModal = () => {
    setEditingMember(null);
    setFormData({
      name: '',
      phone: '',
      email: '',
      flatNo: 'Flat A-101',
      panNo: '',
      panDocUrl: '',
      password: 'Password123!',
      role: 'MEMBER',
      status: 'ACTIVE'
    });
    setIsModalOpen(true);
  };

  const openEditModal = (member) => {
    setEditingMember(member);
    setFormData({
      name: member.name || '',
      phone: member.phone || '',
      email: member.email || '',
      flatNo: member.flatNo || 'Flat A-101',
      panNo: member.panNo || member.panCard || '',
      panDocUrl: member.panDocUrl || '',
      password: '',
      role: member.role || 'MEMBER',
      status: member.status || 'ACTIVE'
    });
    setIsModalOpen(true);
  };

  const handleSaveMember = async (e) => {
    e.preventDefault();
    if (!formData.name || (!formData.phone && !formData.email)) {
      alert('Please enter Member Name and at least a Mobile Number or Email Address.');
      return;
    }

    let updatedList = [];

    if (editingMember) {
      // Edit Existing Member in MongoDB Database
      if (editingMember._id && String(editingMember._id).length === 24) {
        try {
          const token = localStorage.getItem('coop365_admin_token');
          const headers = token ? { Authorization: `Bearer ${token}` } : {};
          await axios.put(`/api/v1/vendors/users/${editingMember._id}`, {
            name: formData.name,
            phone: formData.phone.trim(),
            email: formData.email.trim(),
            flatNo: formData.flatNo,
            panNo: formData.panNo ? formData.panNo.toUpperCase().trim() : '',
            panDocUrl: formData.panDocUrl,
            role: formData.role,
            status: formData.status
          }, { headers });
        } catch (err) {
          console.warn('API PUT member failed, updating local state:', err);
        }
      }

      updatedList = members.map(m => m._id === editingMember._id ? {
        ...m,
        name: formData.name,
        phone: formData.phone.trim(),
        email: formData.email.trim(),
        flatNo: formData.flatNo,
        panNo: formData.panNo ? formData.panNo.toUpperCase().trim() : '',
        panDocUrl: formData.panDocUrl,
        role: formData.role,
        status: formData.status
      } : m);
      saveMembersToCache(updatedList);
      alert(`Updated details for ${formData.name}`);
    } else {
      // Add New Member to MongoDB Database
      const payload = {
        name: formData.name,
        phone: formData.phone.trim(),
        email: formData.email ? formData.email.toLowerCase().trim() : `${formData.phone.replace(/\D/g, '')}@society.org`,
        flatNo: formData.flatNo,
        panNo: formData.panNo ? formData.panNo.toUpperCase().trim() : '',
        panDocUrl: formData.panDocUrl,
        password: formData.password || 'Password123!',
        role: formData.role,
        status: formData.status,
        vendorId: activeVendor?._id
      };

      try {
        const token = localStorage.getItem('coop365_admin_token');
        const headers = token ? { Authorization: `Bearer ${token}` } : {};
        const res = await axios.post('/api/v1/vendors/users', payload, { headers });
        if (res.data?.success && res.data.data?.user) {
          updatedList = [res.data.data.user, ...members];
          saveMembersToCache(updatedList);
          alert(`Registered new member ${formData.name} in MongoDB database!`);
          setIsModalOpen(false);
          return;
        }
      } catch (err) {
        console.warn('API POST failed, persisting member in memory:', err);
      }

      const addedObj = {
        _id: String(Date.now()),
        ...payload,
        createdAt: new Date().toISOString().split('T')[0]
      };
      updatedList = [addedObj, ...members];
      saveMembersToCache(updatedList);
      alert(`Registered new member ${formData.name} under ${activeVendor?.name || 'Society'}!`);
    }

    setIsModalOpen(false);
  };

  const handleDeleteMember = async (id, name) => {
    if (window.confirm(`Are you sure you want to delete ${name} permanently?`)) {
      if (id && String(id).length === 24) {
        try {
          const token = localStorage.getItem('coop365_admin_token');
          const headers = token ? { Authorization: `Bearer ${token}` } : {};
          await axios.delete(`/api/v1/vendors/users/${id}`, { headers });
        } catch (err) {
          console.warn('API DELETE member failed, removing from local state:', err);
        }
      }

      const updatedList = members.filter(m => String(m._id) !== String(id));
      saveMembersToCache(updatedList);
      alert(`Successfully deleted ${name} permanently.`);
    }
  };

  // Filtered Members
  const filteredMembers = members.filter(m => {
    const matchesRole = roleFilter === 'ALL' || m.role === roleFilter;
    const q = searchQuery.toLowerCase();
    const matchesSearch = !q || (
      m.name?.toLowerCase().includes(q) ||
      m.email?.toLowerCase().includes(q) ||
      m.phone?.includes(q) ||
      m.flatNo?.toLowerCase().includes(q)
    );
    return matchesRole && matchesSearch;
  });

  const getRoleBadgeStyle = (role) => {
    switch (role) {
      case 'SECRETARY': return 'bg-indigo-500/20 text-indigo-300 border-indigo-500/30';
      case 'TREASURER': return 'bg-purple-500/20 text-purple-300 border-purple-500/30';
      default: return 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30';
    }
  };

  return (
    <div className="space-y-6 font-sans">
      
      {/* Top Title & Header Actions */}
      <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-white tracking-tight flex items-center space-x-2">
            <Users className="w-5 h-5 text-indigo-400" />
            <span>Society Members & Roles ({activeVendor?.name || 'Society'})</span>
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Complete management of resident user details, flat numbers, roles, and OTP authentication access.
          </p>
        </div>

        <button
          onClick={openAddModal}
          className="w-full sm:w-auto bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold py-2.5 px-4 rounded-xl shadow-lg shadow-indigo-600/30 flex items-center justify-center space-x-2 transition-all shrink-0"
        >
          <UserPlus className="w-4 h-4" />
          <span>Add New Member Profile</span>
        </button>
      </div>

      {/* Summary KPI Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-slate-900 border border-slate-800 p-4 rounded-2xl">
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Total Members</p>
          <p className="text-2xl font-black text-white mt-1">{members.length}</p>
        </div>
        <div className="bg-slate-900 border border-slate-800 p-4 rounded-2xl">
          <p className="text-[10px] font-bold text-indigo-400 uppercase tracking-wider">Secretaries</p>
          <p className="text-2xl font-black text-indigo-300 mt-1">{members.filter(m => m.role === 'SECRETARY').length}</p>
        </div>
        <div className="bg-slate-900 border border-slate-800 p-4 rounded-2xl">
          <p className="text-[10px] font-bold text-purple-400 uppercase tracking-wider">Treasurers</p>
          <p className="text-2xl font-black text-purple-300 mt-1">{members.filter(m => m.role === 'TREASURER').length}</p>
        </div>
        <div className="bg-slate-900 border border-slate-800 p-4 rounded-2xl">
          <p className="text-[10px] font-bold text-emerald-400 uppercase tracking-wider">Residents / Owners</p>
          <p className="text-2xl font-black text-emerald-300 mt-1">{members.filter(m => m.role === 'MEMBER').length}</p>
        </div>
      </div>

      {/* Search & Filter Bar */}
      <div className="bg-slate-900 border border-slate-800 p-4 rounded-2xl flex flex-col md:flex-row gap-4 justify-between items-center text-xs">
        
        {/* Search Input */}
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5 pointer-events-none" />
          <input
            type="text"
            placeholder="Search name, phone, email, flat..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-2 bg-slate-950 rounded-xl border border-slate-800 text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
          />
        </div>

        {/* Role Pills */}
        <div className="flex flex-wrap gap-2 w-full md:w-auto">
          {['ALL', 'SECRETARY', 'TREASURER', 'MEMBER'].map(role => (
            <button
              key={role}
              onClick={() => setRoleFilter(role)}
              className={`px-3 py-1.5 rounded-xl font-bold transition-all text-xs ${roleFilter === role ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30' : 'bg-slate-950 text-slate-400 hover:text-white border border-slate-800'}`}
            >
              {role}
            </button>
          ))}
        </div>
      </div>

      {/* Members List Table / Cards */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-sm">
        
        {/* Mobile View */}
        <div className="md:hidden divide-y divide-slate-800">
          {filteredMembers.map((m) => (
            <div key={m._id} className="p-4 space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2.5">
                  <div className="w-10 h-10 rounded-xl bg-indigo-600/20 text-indigo-300 font-bold flex items-center justify-center text-sm border border-indigo-500/20">
                    {m.name.slice(0, 2).toUpperCase()}
                  </div>
                  <div>
                    <p className="text-sm font-bold text-white leading-tight">{m.name}</p>
                    <div className="flex items-center space-x-2 mt-0.5">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold border ${getRoleBadgeStyle(m.role)}`}>
                        {m.role}
                      </span>
                      <span className="text-[11px] font-semibold text-indigo-400 flex items-center">
                        <Home className="w-3 h-3 mr-1" />
                        {m.flatNo || 'Flat A-101'}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center space-x-1">
                  <button onClick={() => setSelectedMember(m)} className="p-2 text-slate-400 hover:text-indigo-400" title="View Full Details">
                    <Eye className="w-4 h-4" />
                  </button>
                  <button onClick={() => openEditModal(m)} className="p-2 text-slate-400 hover:text-amber-400" title="Edit Member">
                    <Edit2 className="w-4 h-4" />
                  </button>
                  <button onClick={() => handleDeleteMember(m._id, m.name)} className="p-2 text-slate-400 hover:text-red-400" title="Delete Member">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
              
              <div className="text-xs space-y-1 pt-1 bg-slate-950 p-3 rounded-xl border border-slate-800">
                <p className="text-emerald-400 font-mono font-bold flex items-center">
                  <Phone className="w-3.5 h-3.5 mr-1.5 text-emerald-400" />
                  {m.phone || 'Not Specified'}
                </p>
                <p className="text-slate-300 flex items-center truncate">
                  <Mail className="w-3.5 h-3.5 mr-1.5 text-slate-400" />
                  {m.email}
                </p>
              </div>
            </div>
          ))}
          {filteredMembers.length === 0 && (
            <div className="p-8 text-center text-slate-400 text-xs">No members found matching filter criteria.</div>
          )}
        </div>

        {/* Desktop View */}
        <div className="hidden md:block overflow-x-auto">
          <table className="w-full text-xs text-left text-slate-300">
            <thead className="bg-slate-950 text-slate-400 font-bold uppercase tracking-wider text-[10px] border-b border-slate-800">
              <tr>
                <th className="p-4">Member Name & Email</th>
                <th className="p-4">Flat / Shop No.</th>
                <th className="p-4">Mobile / Phone</th>
                <th className="p-4">Assigned Role</th>
                <th className="p-4">Auth Status</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/80">
              {filteredMembers.map((m) => (
                <tr key={m._id} className="hover:bg-slate-800/40 transition-all">
                  <td className="p-4 font-bold text-white flex items-center space-x-3">
                    <div className="w-9 h-9 rounded-xl bg-indigo-600/20 text-indigo-300 font-bold flex items-center justify-center border border-indigo-500/20 shrink-0">
                      {m.name.slice(0, 2).toUpperCase()}
                    </div>
                    <div>
                      <p className="text-xs font-bold text-white">{m.name}</p>
                      <p className="text-[11px] font-medium text-slate-400 flex items-center mt-0.5">
                        <Mail className="w-3 h-3 mr-1 text-slate-500" />
                        {m.email}
                      </p>
                    </div>
                  </td>
                  <td className="p-4 font-semibold text-indigo-300">
                    <div className="flex items-center space-x-1.5 bg-slate-950 px-2.5 py-1 rounded-lg border border-slate-800 w-max">
                      <Home className="w-3.5 h-3.5 text-indigo-400" />
                      <span>{m.flatNo || 'Flat A-101'}</span>
                    </div>
                  </td>
                  <td className="p-4 font-mono text-emerald-400 font-bold">
                    <div className="flex items-center space-x-1">
                      <Phone className="w-3.5 h-3.5 text-emerald-400" />
                      <span>{m.phone || 'Not Specified'}</span>
                    </div>
                  </td>
                  <td className="p-4">
                    <span className={`px-2.5 py-1 rounded-lg text-[10px] font-bold uppercase border ${getRoleBadgeStyle(m.role)}`}>
                      {m.role}
                    </span>
                  </td>
                  <td className="p-4">
                    <span className="inline-flex items-center space-x-1 px-2.5 py-1 rounded-full text-[10px] font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                      <ShieldCheck className="w-3.5 h-3.5" />
                      <span>OTP Authorized</span>
                    </span>
                  </td>
                  <td className="p-4 text-right">
                    <div className="flex items-center justify-end space-x-1">
                      <button onClick={() => setSelectedMember(m)} className="p-2 text-slate-400 hover:text-indigo-400 hover:bg-slate-800 rounded-lg transition-colors" title="View Details">
                        <Eye className="w-4 h-4" />
                      </button>
                      <button onClick={() => openEditModal(m)} className="p-2 text-slate-400 hover:text-amber-400 hover:bg-slate-800 rounded-lg transition-colors" title="Edit Member">
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button onClick={() => handleDeleteMember(m._id, m.name)} className="p-2 text-slate-400 hover:text-red-400 hover:bg-slate-800 rounded-lg transition-colors" title="Delete Member">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {filteredMembers.length === 0 && (
                <tr>
                  <td colSpan="6" className="p-8 text-center text-slate-400 text-xs">
                    No society members found matching query.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* View Member Full Details Modal */}
      {selectedMember && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-2xl w-full p-6 shadow-2xl space-y-5 text-xs text-slate-300 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <h3 className="text-base font-bold text-white flex items-center space-x-2">
                <UserCheck className="w-5 h-5 text-indigo-400" />
                <span>Member Profile & Submitted Receipts Details</span>
              </h3>
              <button onClick={() => setSelectedMember(null)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* User Header Profile Card */}
            <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="flex items-center space-x-4">
                <div className="w-14 h-14 rounded-2xl bg-indigo-600 text-white font-bold flex items-center justify-center text-xl shadow-lg shadow-indigo-600/30 shrink-0">
                  {selectedMember.name.slice(0, 2).toUpperCase()}
                </div>
                <div>
                  <h4 className="text-base font-bold text-white">{selectedMember.name}</h4>
                  <p className="text-xs text-indigo-400 font-semibold">{selectedMember.flatNo || 'Flat A-101'}</p>
                  <div className="flex flex-wrap items-center gap-2 mt-1.5">
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold border ${getRoleBadgeStyle(selectedMember.role)}`}>
                      Role: {selectedMember.role}
                    </span>
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-500/10 text-amber-400 border border-amber-500/30 font-mono flex items-center">
                      <CreditCard className="w-3 h-3 mr-1 text-amber-400" />
                      <span>PAN: {selectedMember.panNo || selectedMember.panCard || activeVendor?.panNo || 'AAAAA0000A'}</span>
                    </span>
                  </div>
                </div>
              </div>

              <div className="text-right bg-slate-900 p-3 rounded-xl border border-slate-800 shrink-0 w-full sm:w-auto">
                <p className="text-[10px] font-bold text-slate-400 uppercase">Total Paid</p>
                <p className="text-base font-black text-emerald-400">₹ {memberTotalPaid.toFixed(2)}</p>
                <p className="text-[10px] text-slate-400">{memberReceipts.length} Vouchers Submitted</p>
              </div>
            </div>

            {/* Member Contact & Account Details */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 bg-slate-950 p-4 rounded-xl border border-slate-800">
              <div className="flex justify-between items-center border-b border-slate-800/80 pb-2">
                <span className="text-slate-400 font-semibold">Mobile Phone:</span>
                <span className="font-mono font-bold text-emerald-400">{selectedMember.phone || 'Not Specified'}</span>
              </div>

              <div className="flex justify-between items-center border-b border-slate-800/80 pb-2">
                <span className="text-slate-400 font-semibold">Email:</span>
                <span className="font-semibold text-white truncate max-w-[160px]">{selectedMember.email}</span>
              </div>

              <div className="flex justify-between items-center border-b border-slate-800/80 pb-2">
                <span className="text-slate-400 font-semibold flex items-center">
                  <CreditCard className="w-3.5 h-3.5 text-amber-400 mr-1.5" />
                  <span>PAN Card No:</span>
                </span>
                <span className="font-mono font-bold text-amber-300">
                  {selectedMember.panNo || selectedMember.panCard || activeVendor?.panNo || 'AAAAA0000A'}
                </span>
              </div>

              <div className="flex justify-between items-center border-b border-slate-800/80 pb-2">
                <span className="text-slate-400 font-semibold flex items-center">
                  <FileText className="w-3.5 h-3.5 text-indigo-400 mr-1.5" />
                  <span>PAN Document:</span>
                </span>
                <button
                  type="button"
                  onClick={() => {
                    const docUrl = selectedMember.panDocUrl || activeVendor?.panDocUrl || '';
                    const panNum = selectedMember.panNo || selectedMember.panCard || activeVendor?.panNo || 'AAAAA0000A';
                    setPreviewPanDoc({
                      url: docUrl,
                      memberName: selectedMember.name,
                      panNo: panNum
                    });
                  }}
                  className="text-[11px] bg-amber-500/20 text-amber-300 hover:bg-amber-500/30 px-2.5 py-1 rounded-lg border border-amber-500/30 font-bold transition-all flex items-center space-x-1"
                >
                  <Eye className="w-3.5 h-3.5 mr-1" />
                  <span>View PAN Card</span>
                </button>
              </div>

              <div className="flex justify-between items-center pt-1">
                <span className="text-slate-400 font-semibold">OTP Auth:</span>
                <span className="text-emerald-400 font-bold flex items-center">
                  <CheckCircle2 className="w-3.5 h-3.5 mr-1" />
                  Active Access
                </span>
              </div>

              <div className="flex justify-between items-center pt-1">
                <span className="text-slate-400 font-semibold">Joined Date:</span>
                <span className="font-mono text-slate-300">{selectedMember.createdAt ? String(selectedMember.createdAt).slice(0, 10) : '2024-01-15'}</span>
              </div>
            </div>

            {/* Member Submitted Receipts Table */}
            <div className="space-y-3 pt-1">
              <h4 className="text-xs font-bold text-white uppercase tracking-wider flex items-center space-x-1.5">
                <FileText className="w-4 h-4 text-indigo-400" />
                <span>Submitted Receipt Vouchers ({memberReceipts.length})</span>
              </h4>

              {memberReceipts.length === 0 ? (
                <div className="bg-slate-950 p-6 rounded-xl border border-slate-800 text-center text-slate-500 text-xs">
                  No submitted receipt vouchers found for {selectedMember.name} yet.
                </div>
              ) : (
                <div className="bg-slate-950 border border-slate-800 rounded-xl overflow-hidden">
                  <table className="w-full text-xs text-left text-slate-300">
                    <thead className="bg-slate-900 text-slate-400 font-bold uppercase text-[10px]">
                      <tr>
                        <th className="p-2.5">Receipt #</th>
                        <th className="p-2.5">Date</th>
                        <th className="p-2.5">Payment Mode</th>
                        <th className="p-2.5 text-right">Amount</th>
                        <th className="p-2.5 text-center">Action</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800/60">
                      {memberReceipts.map(r => (
                        <tr key={r._id || r.id} className="hover:bg-slate-900/60">
                          <td className="p-2.5 font-mono font-bold text-indigo-300">#{r.receiptNo}</td>
                          <td className="p-2.5 text-slate-400">{r.date}</td>
                          <td className="p-2.5 font-medium">{r.paymentMode} ({r.cashChequeNo || r.refNo || 'N/A'})</td>
                          <td className="p-2.5 text-right font-bold text-emerald-400">₹ {parseFloat(r.totalAmount || 0).toFixed(2)}</td>
                          <td className="p-2.5 text-center">
                            <button
                              onClick={() => {
                                setSelectedMember(null);
                                if (onOpenPDF) onOpenPDF(r);
                              }}
                              className="px-2 py-1 rounded bg-indigo-600/30 text-indigo-300 hover:bg-indigo-600/50 text-[11px] font-bold"
                            >
                              View PDF
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>

            <div className="flex justify-end pt-2">
              <button
                onClick={() => setSelectedMember(null)}
                className="py-2.5 px-6 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold"
              >
                Close Details
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add / Edit Member Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-md w-full p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <h3 className="text-base font-bold text-white flex items-center space-x-2">
                <Users className="w-5 h-5 text-indigo-400" />
                <span>{editingMember ? 'Edit Member Profile' : 'Register New Member Profile'}</span>
              </h3>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveMember} className="space-y-3.5 text-xs">
              <div>
                <label className="block text-slate-300 mb-1 font-semibold">Member Full Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Mr. Rahul Sharma"
                  value={formData.name}
                  onChange={e => setFormData({ ...formData, name: e.target.value })}
                  className="w-full p-2.5 bg-slate-950 rounded-xl border border-slate-800 text-white focus:outline-none focus:border-indigo-500 font-bold"
                />
              </div>

              <div>
                <label className="block text-slate-300 mb-1 font-semibold flex items-center space-x-1">
                  <Home className="w-3.5 h-3.5 text-indigo-400" />
                  <span>Flat / Shop Number *</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Flat A-101"
                  value={formData.flatNo}
                  onChange={e => setFormData({ ...formData, flatNo: e.target.value })}
                  className="w-full p-2.5 bg-slate-950 rounded-xl border border-slate-800 text-white focus:outline-none focus:border-indigo-500 font-semibold"
                />
              </div>

              <div>
                <label className="block text-slate-300 mb-1 font-semibold flex items-center space-x-1">
                  <Phone className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Mobile Phone Number (For Mobile OTP Login) *</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="+91 98221 23456"
                  value={formData.phone}
                  onChange={e => setFormData({ ...formData, phone: e.target.value })}
                  className="w-full p-2.5 bg-slate-950 rounded-xl border border-slate-800 text-white font-mono focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="block text-slate-300 mb-1 font-semibold flex items-center space-x-1">
                  <Mail className="w-3.5 h-3.5 text-indigo-400" />
                  <span>Email Address *</span>
                </label>
                <input
                  type="email"
                  placeholder="rahul@mandovinagar.org"
                  value={formData.email}
                  onChange={e => setFormData({ ...formData, email: e.target.value })}
                  className="w-full p-2.5 bg-slate-950 rounded-xl border border-slate-800 text-white focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="block text-slate-300 mb-1 font-semibold flex items-center space-x-1">
                  <CreditCard className="w-3.5 h-3.5 text-amber-400" />
                  <span>Member PAN Card Number (Permanent Account Number)</span>
                </label>
                <input
                  type="text"
                  placeholder="e.g. ABCDE1234F"
                  value={formData.panNo}
                  onChange={e => setFormData({ ...formData, panNo: e.target.value.toUpperCase() })}
                  className="w-full p-2.5 bg-slate-950 rounded-xl border border-slate-800 text-white font-mono focus:outline-none focus:border-indigo-500 uppercase"
                />
              </div>

              <div>
                <label className="block text-slate-300 mb-1 font-semibold">PAN Card Document Attachment (Image/PDF)</label>
                <div className="flex items-center space-x-2">
                  <input
                    type="text"
                    placeholder="Document URL or upload file..."
                    value={formData.panDocUrl}
                    onChange={e => setFormData({ ...formData, panDocUrl: e.target.value })}
                    className="flex-1 p-2.5 bg-slate-950 rounded-xl border border-slate-800 text-white text-xs"
                  />
                  <label className="px-3 py-2.5 bg-slate-800 hover:bg-slate-700 text-amber-400 font-bold rounded-xl border border-slate-700 cursor-pointer text-xs shrink-0">
                    <span>Upload</span>
                    <input
                      type="file"
                      accept="image/*,.pdf"
                      className="hidden"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          const reader = new FileReader();
                          reader.onloadend = () => {
                            setFormData(prev => ({ ...prev, panDocUrl: reader.result }));
                            alert(`PAN Document "${file.name}" attached successfully!`);
                          };
                          reader.readAsDataURL(file);
                        }
                      }}
                    />
                  </label>
                </div>
              </div>

              <div>
                <label className="block text-slate-300 mb-1 font-semibold">Assign Role *</label>
                <select
                  value={formData.role}
                  onChange={e => setFormData({ ...formData, role: e.target.value })}
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
                  {editingMember ? 'Save Changes' : 'Register Profile'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* PAN Card Modal Preview */}
      {previewPanDoc && (
        <div className="fixed inset-0 z-50 bg-slate-950/90 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-xl w-full p-6 shadow-2xl space-y-4 font-sans text-xs">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center space-x-2">
                <CreditCard className="w-5 h-5 text-amber-400" />
                <h3 className="text-sm font-bold text-white">
                  PAN Card Document - {previewPanDoc.memberName}
                </h3>
              </div>
              <button onClick={() => setPreviewPanDoc(null)} className="text-slate-400 hover:text-white p-1">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3">
              <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 flex justify-between items-center text-xs font-mono">
                <span className="text-slate-400 font-semibold font-sans">Permanent Account Number (PAN):</span>
                <span className="text-amber-300 font-bold text-sm tracking-wider">{previewPanDoc.panNo}</span>
              </div>

              {previewPanDoc.url ? (
                <div className="bg-slate-950 p-2 rounded-xl border border-slate-800 max-h-[60vh] overflow-auto flex items-center justify-center">
                  {previewPanDoc.url.startsWith('data:application/pdf') || previewPanDoc.url.endsWith('.pdf') ? (
                    <iframe src={previewPanDoc.url} title="PAN Document PDF" className="w-full h-80 rounded-lg" />
                  ) : (
                    <img src={previewPanDoc.url} alt="PAN Card Document" className="max-h-96 w-auto rounded-lg object-contain shadow-lg" />
                  )}
                </div>
              ) : (
                <div className="bg-slate-950 p-8 rounded-xl border border-slate-800 text-center space-y-3">
                  <CreditCard className="w-12 h-12 text-amber-400/40 mx-auto" />
                  <div>
                    <p className="text-xs font-bold text-slate-300">No Scanned Document Attached Yet</p>
                    <p className="text-[11px] text-slate-500 mt-1">
                      Member PAN Number <span className="font-mono text-amber-300 font-bold">{previewPanDoc.panNo}</span> is saved in profile. You can attach a scanned copy or image of the PAN Card below.
                    </p>
                  </div>
                </div>
              )}
            </div>

            <div className="flex flex-col sm:flex-row justify-between items-center gap-3 pt-2 border-t border-slate-800">
              <label className="w-full sm:w-auto px-3.5 py-2.5 bg-slate-800 hover:bg-slate-700 text-amber-400 font-bold text-xs rounded-xl border border-slate-700 cursor-pointer flex items-center justify-center space-x-1.5 transition-all">
                <Upload className="w-3.5 h-3.5" />
                <span>Upload / Replace PAN Document</span>
                <input
                  type="file"
                  accept="image/*,.pdf"
                  className="hidden"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) {
                      const reader = new FileReader();
                      reader.onloadend = () => {
                        const newUrl = reader.result;
                        setPreviewPanDoc(prev => ({ ...prev, url: newUrl }));
                        if (selectedMember) {
                          const updatedM = { ...selectedMember, panDocUrl: newUrl };
                          setSelectedMember(updatedM);
                          setMembers(prev => prev.map(m => m._id === selectedMember._id ? updatedM : m));
                        }
                        alert(`Successfully uploaded "${file.name}"!`);
                      };
                      reader.readAsDataURL(file);
                    }
                  }}
                />
              </label>

              <button
                onClick={() => setPreviewPanDoc(null)}
                className="w-full sm:w-auto py-2.5 px-6 bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs rounded-xl"
              >
                Close Preview
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MemberManager;
