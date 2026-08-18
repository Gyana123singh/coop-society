import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Building2, Loader2, ChevronDown, RefreshCw, ShieldCheck, Phone, ArrowRight } from 'lucide-react';
import axios from 'axios';
import { sendFirebasePhoneOTP, initRecaptchaVerifier } from '../services/firebaseAuthService';

const LoginScreen = () => {
  const [societies, setSocieties] = useState([]);
  const [loadingSocieties, setLoadingSocieties] = useState(true);
  const [selectedSocietyId, setSelectedSocietyId] = useState('');
  
  // Real-time Firebase Mobile Phone OTP State
  const [phone, setPhone] = useState('+91 98221 23456');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const navigate = useNavigate();
  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

  // Fetch active housing societies from MongoDB & local persistent cache
  const fetchLiveSocieties = async () => {
    setLoadingSocieties(true);
    setError('');
    let fetched = [];
    try {
      const res = await axios.get(`${API_URL}/api/v1/auth/public-vendors?t=${Date.now()}`);
      if (res.data?.success && res.data.data?.vendors?.length > 0) {
        fetched = res.data.data.vendors;
      }
    } catch (err) {
      console.warn('Failed to fetch live housing societies from backend API:', err.message);
    }

    // Merge with local storage cache (so newly created societies in local/dev mode appear)
    const localSaved = localStorage.getItem('coop365_admin_vendors');
    if (localSaved) {
      try {
        const parsed = JSON.parse(localSaved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          parsed.forEach(lv => {
            if (lv && lv._id && !fetched.some(f => String(f._id) === String(lv._id))) {
              fetched.push(lv);
            }
          });
        }
      } catch (e) { }
    }

    if (fetched.length > 0) {
      setSocieties(fetched);
      setSelectedSocietyId(fetched[0]._id);
    } else {
      setSocieties([]);
      setSelectedSocietyId('');
    }
    setLoadingSocieties(false);
  };

  useEffect(() => {
    fetchLiveSocieties();
    // Initialize Firebase Recaptcha Verifier safely
    setTimeout(() => {
      initRecaptchaVerifier('recaptcha-container');
    }, 500);
  }, []);

  // Firebase Phone OTP Login Handler
  const handleSendOtp = async (e) => {
    e.preventDefault();

    if (!selectedSocietyId) {
      setError('Please select your Housing Society from the dropdown list.');
      return;
    }

    if (!phone || phone.trim().length < 8) {
      setError('Please enter a valid registered mobile phone number.');
      return;
    }

    setError('');
    setLoading(true);

    let formattedPhone = phone.trim();
    if (!formattedPhone.startsWith('+')) {
      const rawDigits = formattedPhone.replace(/\D/g, '');
      if (rawDigits.length === 10) {
        formattedPhone = `+91${rawDigits}`;
      } else {
        formattedPhone = `+${rawDigits}`;
      }
    }

    const targetSociety = societies.find(s => String(s._id) === String(selectedSocietyId)) || societies[0];

    try {
      const confirmationResult = await sendFirebasePhoneOTP(formattedPhone);
      navigate('/otp', {
        state: {
          phone: formattedPhone,
          societyId: selectedSocietyId,
          societyName: targetSociety?.name || 'Housing Society',
          confirmationResult
        }
      });
    } catch (err) {
      console.error('[Firebase Phone Auth Error]', err);
      let errorMsg = 'Failed to send SMS OTP. Please check your phone number and try again.';
      if (err.code === 'auth/invalid-phone-number') {
        errorMsg = 'Invalid phone number format. Please enter a valid number with country code (e.g. +91 98221 23456).';
      } else if (err.code === 'auth/too-many-requests') {
        errorMsg = 'Too many OTP requests. Please wait a few minutes before trying again.';
      } else if (err.message) {
        errorMsg = err.message;
      }
      setError(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#f3f4f6] flex items-center justify-center p-4">
      {/* Hidden Firebase Recaptcha Container */}
      <div id="recaptcha-container"></div>

      <div className="w-full max-w-md bg-white rounded-3xl shadow-xl overflow-hidden border border-gray-100 font-sans">

        {/* Header Graphic */}
        <div className="bg-[#1a1736] p-8 text-center relative overflow-hidden">
          <div className="absolute top-0 right-0 -mr-8 -mt-8 w-32 h-32 rounded-full bg-white/5 blur-2xl"></div>
          <div className="absolute bottom-0 left-0 -ml-8 -mb-8 w-24 h-24 rounded-full bg-[#5a32fa]/20 blur-xl"></div>

          <div className="w-16 h-16 rounded-full flex items-center justify-center p-1 bg-white mx-auto mb-3 relative z-10 font-sans shadow-lg">
            <div className="w-full h-full rounded-full bg-gradient-to-br from-indigo-500 via-purple-500 to-emerald-400 flex items-center justify-center">
              <Building2 className="w-8 h-8 text-white" />
            </div>
          </div>
          <h1 className="text-2xl font-bold text-white relative z-10 tracking-tight">Coop 365</h1>
          <p className="text-xs text-gray-300 relative z-10 mt-1">Resident Portal Login</p>

          <div className="inline-flex items-center space-x-1.5 bg-indigo-950/80 border border-indigo-700/60 text-indigo-300 px-3 py-1 rounded-full text-[11px] font-semibold mt-2 relative z-10">
            <ShieldCheck className="w-3.5 h-3.5 text-indigo-400" />
            <span>Real-time Firebase Phone OTP</span>
          </div>
        </div>

        <div className="p-8">
          <div className="mb-6">
            <h2 className="text-xl font-bold text-gray-900 mb-1.5">Welcome Resident</h2>
            <p className="text-sm text-gray-500">Select your Housing Society and enter your registered mobile number to sign in via Firebase SMS OTP.</p>
          </div>

          <form onSubmit={handleSendOtp} className="space-y-4">
            
            {/* HOUSING SOCIETY DROPDOWN WITH LIVE REFRESH BUTTON */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-xs font-bold uppercase tracking-wider text-gray-700">
                  Select Your Housing Society *
                </label>
                <button
                  type="button"
                  onClick={fetchLiveSocieties}
                  disabled={loadingSocieties}
                  className="text-[11px] font-bold text-indigo-600 hover:text-indigo-800 flex items-center space-x-1 bg-indigo-50 px-2 py-0.5 rounded-md border border-indigo-100 transition-all"
                  title="Refresh Live Housing Societies"
                >
                  <RefreshCw className={`w-3 h-3 ${loadingSocieties ? 'animate-spin' : ''}`} />
                  <span>Refresh</span>
                </button>
              </div>

              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Building2 className="h-5 w-5 text-indigo-600" />
                </div>
                <select
                  value={selectedSocietyId}
                  disabled={loadingSocieties}
                  onChange={(e) => {
                    setSelectedSocietyId(e.target.value);
                    if (error) setError('');
                  }}
                  className="pl-12 pr-10 w-full p-3.5 bg-gray-50 border border-gray-200 rounded-xl outline-none transition-all text-sm font-bold text-gray-900 focus:bg-white focus:ring-4 focus:ring-[#5a32fa]/10 focus:border-[#5a32fa] appearance-none cursor-pointer disabled:opacity-60"
                  required
                >
                  {loadingSocieties ? (
                    <option value="">Loading Housing Societies...</option>
                  ) : societies.length === 0 ? (
                    <option value="">No Active Housing Societies Found</option>
                  ) : (
                    societies.map((s) => (
                      <option key={s._id} value={s._id}>
                        {s.name} ({s.regNo || 'Co-Op'})
                      </option>
                    ))
                  )}
                </select>
                <div className="absolute inset-y-0 right-0 pr-4 flex items-center pointer-events-none text-gray-500">
                  {loadingSocieties ? <Loader2 className="w-4 h-4 animate-spin text-indigo-600" /> : <ChevronDown className="w-4 h-4" />}
                </div>
              </div>
            </div>

            {/* REGISTERED MOBILE PHONE NUMBER INPUT */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-1.5">
                Registered Mobile Number *
              </label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Phone className={`h-5 w-5 transition-colors ${error ? 'text-red-400' : 'text-gray-400 group-focus-within:text-[#5a32fa]'}`} />
                </div>
                <input
                  type="tel"
                  className={`pl-12 w-full p-3.5 bg-gray-50 border rounded-xl outline-none transition-all text-sm font-semibold ${error ? 'border-red-500 bg-red-50 focus:ring-2 focus:ring-red-500/20' : 'border-gray-200 focus:bg-white focus:ring-4 focus:ring-[#5a32fa]/10 focus:border-[#5a32fa]'}`}
                  placeholder="e.g. +91 98221 23456"
                  value={phone}
                  onChange={(e) => {
                    setPhone(e.target.value);
                    if (error) setError('');
                  }}
                  required
                />
              </div>
            </div>

            {error && (
              <div className="bg-red-50 border border-red-200 p-3 rounded-xl flex items-start space-x-2 text-xs text-red-600">
                <span className="w-1.5 h-1.5 rounded-full bg-red-500 mt-1.5 shrink-0"></span>
                <p className="font-medium">{error}</p>
              </div>
            )}

            <button
              type="submit"
              disabled={loading || loadingSocieties}
              className="w-full bg-[#5a32fa] hover:bg-[#4826d1] text-white font-semibold py-4 rounded-xl transition-all duration-200 shadow-lg shadow-[#5a32fa]/25 hover:shadow-[#5a32fa]/40 flex items-center justify-center space-x-2 disabled:opacity-50 mt-3"
            >
              {loading ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <span className="flex items-center space-x-2">
                  <span>Send Real-Time SMS OTP</span>
                  <ArrowRight className="w-4 h-4" />
                </span>
              )}
            </button>
          </form>

          <div className="mt-8 pt-6 border-t border-gray-100 flex items-center justify-center space-x-2 text-xs text-gray-400">
            <Building2 size={14} />
            <span>Secure Housing Society Resident Portal</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginScreen;
