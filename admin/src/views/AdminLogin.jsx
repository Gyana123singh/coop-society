import React, { useState } from 'react';
import { Building2, Mail, KeyRound, ShieldCheck, ArrowRight, RefreshCw, AlertCircle, Sparkles, UserCheck, Shield, Wallet, ChevronDown, Briefcase } from 'lucide-react';
import axios from 'axios';

const AdminLogin = ({ onLoginSuccess }) => {
  const defaultSuperAdminEmail = import.meta.env.VITE_SUPER_ADMIN_EMAIL || 'superadmin@coop365.com';
  const defaultSuperAdminPass = import.meta.env.VITE_SUPER_ADMIN_PASSWORD || 'AdminPass123!';

  const [selectedRole, setSelectedRole] = useState('SUPER_ADMIN'); // 'SUPER_ADMIN', 'TENANT_BUSINESS_OWNER', or 'TREASURER'
  const [email, setEmail] = useState(defaultSuperAdminEmail);
  const [password, setPassword] = useState(defaultSuperAdminPass);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const handleRoleChange = (role) => {
    setSelectedRole(role);
    setErrorMessage('');
    if (role === 'SUPER_ADMIN') {
      setEmail(defaultSuperAdminEmail);
      setPassword(defaultSuperAdminPass);
    } else {
      // Clear demo auto-fill credentials for Tenant Owner and Treasurer
      setEmail('');
      setPassword('');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage('');

    if (!email || !password) {
      setErrorMessage('Please enter both email address and password.');
      return;
    }

    setLoading(true);
    try {
      // 1. Authenticate credentials directly against MongoDB database
      const res = await axios.post('/api/v1/auth/login', {
        email: email.toLowerCase().trim(),
        password
      });

      if (res.data?.success) {
        const { token, user } = res.data.data;

        // 2. Database Role Validation Check
        if (selectedRole === 'SUPER_ADMIN' && user.role !== 'SUPER_ADMIN') {
          setErrorMessage(`Access Denied: Account '${email}' has role '${user.role}' in MongoDB, not 'SUPER_ADMIN'. Please switch to ${user.role} mode.`);
          setLoading(false);
          return;
        }

        if (selectedRole !== 'SUPER_ADMIN' && user.role === 'SUPER_ADMIN') {
          setErrorMessage(`Access Denied: Account '${email}' is a Super Admin account. Please switch to Super Admin mode.`);
          setLoading(false);
          return;
        }

        localStorage.setItem('coop365_admin_token', token);
        localStorage.setItem('coop365_admin_user', JSON.stringify(user));
        onLoginSuccess(user, token);
      }
    } catch (err) {
      const errorMsg = err.response?.data?.message;
      if (errorMsg) {
        setErrorMessage(errorMsg);
      } else {
        // Fallback for offline local dev mode reading from .env
        if (selectedRole === 'SUPER_ADMIN') {
          if (email !== defaultSuperAdminEmail || password !== defaultSuperAdminPass) {
            setErrorMessage('Invalid Super Admin credentials. Please check email and password.');
            setLoading(false);
            return;
          }
          const superAdminUser = {
            id: 'sa_1',
            name: 'Super Administrator',
            email: defaultSuperAdminEmail,
            role: 'SUPER_ADMIN',
            vendorId: null
          };
          localStorage.setItem('coop365_admin_user', JSON.stringify(superAdminUser));
          onLoginSuccess(superAdminUser, 'superadmin_jwt_token');
        } else {
          setErrorMessage(`Invalid credentials for ${email}. Please check your email and password.`);
          setLoading(false);
          return;
        }
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#070a12] text-white flex flex-col justify-center items-center p-4 font-sans">
      {/* Container Frame */}
      <div className="w-full max-w-md bg-[#0f172a] rounded-3xl p-8 shadow-2xl border border-slate-800 space-y-6">
        {/* Brand Header */}
        <div className="text-center space-y-2">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-indigo-500 via-indigo-600 to-blue-600 p-[2.5px] mx-auto shadow-lg shadow-indigo-500/20 flex items-center justify-center">
            <Building2 className="w-9 h-9 text-white" />
          </div>

          <h1 className="text-2xl font-black tracking-tight text-white font-serif">
            Coop 365 Admin Portal
          </h1>
          <p className="text-xs text-indigo-200 font-medium">
            Multi-Tenant Role-Based Management Console
          </p>

          <div className="inline-flex items-center space-x-1.5 bg-slate-900 border border-slate-700 text-slate-300 px-3 py-1 rounded-full text-[11px] font-semibold mt-1">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
            <span>MongoDB Multi-Tenant Authentication</span>
          </div>
        </div>

        {/* Error Alert */}
        {errorMessage && (
          <div className="bg-rose-950/80 border border-rose-800 p-3.5 rounded-2xl text-xs text-rose-200 flex items-start space-x-2.5">
            <AlertCircle className="w-5 h-5 text-rose-400 shrink-0 mt-0.5" />
            <div className="space-y-1">
              <p className="font-bold text-rose-300">Authentication Failed</p>
              <p className="leading-relaxed">{errorMessage}</p>
            </div>
          </div>
        )}

        {/* Role Mode Selector Dropdown */}
        <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 space-y-3">
          <div className="flex items-center justify-between">
            <label className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center">
              <Sparkles className="w-3.5 h-3.5 text-amber-400 mr-1.5" />
              Select Account Role Mode *
            </label>
            <span className="text-[10px] text-indigo-400 font-bold bg-indigo-500/10 border border-indigo-500/20 px-2 py-0.5 rounded-md">
              {selectedRole} MODE
            </span>
          </div>

          {/* Role Dropdown */}
          <div className="relative">
            <select
              value={selectedRole}
              onChange={(e) => handleRoleChange(e.target.value)}
              className="w-full pl-4 pr-10 py-3 bg-slate-900 border border-slate-800 rounded-xl text-xs font-bold text-white focus:outline-none focus:border-indigo-500 appearance-none cursor-pointer"
            >
              <option value="SUPER_ADMIN">👑 SUPER ADMIN (Platform Owner Mode)</option>
              <option value="TENANT_BUSINESS_OWNER">🏢 TENANT BUSINESS OWNER (Society Admin Mode)</option>
              <option value="TREASURER">💰 TREASURER (Finance & Accounts Mode)</option>
            </select>
            <div className="absolute inset-y-0 right-0 pr-3.5 flex items-center pointer-events-none text-slate-400">
              <ChevronDown className="w-4 h-4" />
            </div>
          </div>

          {/* Quick Preset Buttons */}
          <div className="grid grid-cols-3 gap-1.5 pt-1">
            <button
              type="button"
              onClick={() => handleRoleChange('SUPER_ADMIN')}
              className={`py-1.5 px-2 rounded-lg text-[10px] font-bold transition-all flex items-center justify-center space-x-1 ${selectedRole === 'SUPER_ADMIN'
                  ? 'bg-indigo-600 text-white shadow-md'
                  : 'bg-slate-900 text-slate-400 hover:text-white'
                }`}
            >
              <Shield className="w-3 h-3" />
              <span>Super Admin</span>
            </button>

            <button
              type="button"
              onClick={() => handleRoleChange('TENANT_BUSINESS_OWNER')}
              className={`py-1.5 px-2 rounded-lg text-[10px] font-bold transition-all flex items-center justify-center space-x-1 ${selectedRole === 'TENANT_BUSINESS_OWNER'
                  ? 'bg-indigo-600 text-white shadow-md'
                  : 'bg-slate-900 text-slate-400 hover:text-white'
                }`}
            >
              <Briefcase className="w-3 h-3" />
              <span>Tenant Owner</span>
            </button>

            <button
              type="button"
              onClick={() => handleRoleChange('TREASURER')}
              className={`py-1.5 px-2 rounded-lg text-[10px] font-bold transition-all flex items-center justify-center space-x-1 ${selectedRole === 'TREASURER'
                  ? 'bg-indigo-600 text-white shadow-md'
                  : 'bg-slate-900 text-slate-400 hover:text-white'
                }`}
            >
              <Wallet className="w-3 h-3" />
              <span>Treasurer</span>
            </button>
          </div>
        </div>

        {/* Login Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-400 mb-1.5 uppercase tracking-wider">
              {selectedRole === 'TENANT_BUSINESS_OWNER' ? 'Tenant Owner' : selectedRole} Email Address *
            </label>
            <div className="relative flex items-center">
              <Mail className="w-5 h-5 text-slate-500 absolute left-3.5 pointer-events-none" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder={selectedRole === 'SUPER_ADMIN' ? 'superadmin@coop365.com' : 'Enter Tenant Admin Email'}
                className="w-full pl-11 pr-4 py-3 bg-slate-950 rounded-2xl text-sm font-medium text-white border border-slate-800 focus:outline-none focus:border-indigo-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-400 mb-1.5 uppercase tracking-wider">
              Password *
            </label>
            <div className="relative flex items-center">
              <KeyRound className="w-5 h-5 text-slate-500 absolute left-3.5 pointer-events-none" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••••••"
                className="w-full pl-11 pr-4 py-3 bg-slate-950 rounded-2xl text-sm font-medium text-white border border-slate-800 focus:outline-none focus:border-indigo-500"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-500 hover:to-blue-500 text-white rounded-2xl font-bold text-xs shadow-lg shadow-indigo-600/30 flex items-center justify-center space-x-2 transition-all active:scale-95 disabled:opacity-50"
          >
            {loading ? (
              <RefreshCw className="w-4 h-4 animate-spin text-white text-xs" />
            ) : (
              <>
                <span>Sign In as {selectedRole === 'TENANT_BUSINESS_OWNER' ? 'Tenant Business Owner' : selectedRole}</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AdminLogin;
