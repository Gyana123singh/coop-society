import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Phone, Building2, Flame, Loader2, ChevronDown, RefreshCw } from 'lucide-react';
import axios from 'axios';
import { sendFirebasePhoneOTP, initRecaptchaVerifier } from '../services/firebaseAuthService';

const LoginScreen = () => {
  const [societies, setSocieties] = useState([]);
  const [loadingSocieties, setLoadingSocieties] = useState(true);
  const [selectedSocietyId, setSelectedSocietyId] = useState('');
  const [phone, setPhone] = useState('8280057771');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

  // Fetch active housing societies directly from MongoDB & local persistent cache
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
      console.warn('Failed to fetch real housing societies from MongoDB API:', err.message);
    }

    // Merge with local storage cache (so newly provisioned businesses in dev/offline mode appear immediately)
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
      } catch (e) {}
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
    initRecaptchaVerifier('recaptcha-container');
  }, []);

  const handleSendOTP = async (e) => {
    e.preventDefault();

    if (!selectedSocietyId) {
      setError('Please select your Housing Society from the dropdown list.');
      return;
    }

    const cleanDigits = phone.replace(/\D/g, '');
    if (cleanDigits.length < 10) {
      setError('Please enter a valid 10-digit mobile number.');
      return;
    }

    const formattedPhone = cleanDigits.length === 10 ? `+91${cleanDigits}` : `+${cleanDigits}`;
    const targetSociety = societies.find(s => s._id === selectedSocietyId) || societies[0];
    const societyName = targetSociety?.name || 'Housing Society';

    setError('');
    setLoading(true);

    try {
      // Dispatch Firebase SMS OTP directly (No backend OTP generation/storage)
      await sendFirebasePhoneOTP(formattedPhone);

      navigate('/otp', {
        state: {
          phone: formattedPhone,
          societyId: selectedSocietyId,
          societyName
        }
      });
    } catch (err) {
      console.error('[Firebase SMS Error]', err);
      const errorMsg = err.message || 'Firebase SMS OTP dispatch failed. Please check your mobile number and retry.';
      setError(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setPhone(e.target.value);
    if (error) setError('');
  };

  return (
    <div className="min-h-screen bg-[#f3f4f6] flex items-center justify-center p-4">
      {/* Invisible Firebase Recaptcha verifier container */}
      <div id="recaptcha-container"></div>

      <div className="w-full max-w-md bg-white rounded-3xl shadow-xl overflow-hidden border border-gray-100 font-sans">

        {/* Header Graphic */}
        <div className="bg-[#1a1736] p-8 text-center relative overflow-hidden">
          <div className="absolute top-0 right-0 -mr-8 -mt-8 w-32 h-32 rounded-full bg-white/5 blur-2xl"></div>
          <div className="absolute bottom-0 left-0 -ml-8 -mb-8 w-24 h-24 rounded-full bg-[#5a32fa]/20 blur-xl"></div>

          <div className="w-16 h-16 rounded-full flex items-center justify-center p-1 bg-white mx-auto mb-3 relative z-10 font-sans shadow-lg">
            <div className="w-full h-full rounded-full bg-gradient-to-br from-blue-500 via-red-500 to-yellow-400"></div>
          </div>
          <h1 className="text-2xl font-bold text-white relative z-10">Coop 365</h1>
          <p className="text-xs text-gray-300 relative z-10 mt-1">Resident Portal Login</p>

          <div className="inline-flex items-center space-x-1.5 bg-orange-950/80 border border-orange-800 text-orange-300 px-3 py-1 rounded-full text-[11px] font-semibold mt-2 relative z-10">
            <Flame className="w-3.5 h-3.5 text-orange-400" />
            <span>Firebase Phone SMS OTP</span>
          </div>
        </div>

        <div className="p-8">
          <div className="mb-6">
            <h2 className="text-xl font-bold text-gray-900 mb-1.5">Welcome Resident</h2>
            <p className="text-sm text-gray-500">Select your Housing Society and sign in with your registered phone number.</p>
          </div>

          <form onSubmit={handleSendOTP} className="space-y-5">
            {/* HOUSING SOCIETY DROPDOWN WITH LIVE REFRESH BUTTON */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="block text-xs font-bold uppercase tracking-wider text-gray-700">
                  Select Your Housing Society *
                </label>
                <button
                  type="button"
                  onClick={fetchLiveSocieties}
                  disabled={loadingSocieties}
                  className="text-[11px] font-bold text-indigo-600 hover:text-indigo-800 flex items-center space-x-1 bg-indigo-50 px-2 py-0.5 rounded-md border border-indigo-100 transition-all"
                  title="Refresh Live Housing Societies from MongoDB"
                >
                  <RefreshCw className={`w-3 h-3 ${loadingSocieties ? 'animate-spin' : ''}`} />
                  <span>Refresh List</span>
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
                  className="pl-12 pr-10 w-full p-4 bg-gray-50 border border-gray-200 rounded-xl outline-none transition-all text-sm font-bold text-gray-900 focus:bg-white focus:ring-4 focus:ring-[#5a32fa]/10 focus:border-[#5a32fa] appearance-none cursor-pointer disabled:opacity-60"
                  required
                >
                  {loadingSocieties ? (
                    <option value="">Loading Housing Societies from MongoDB...</option>
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

            {/* MOBILE NUMBER INPUT */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-2">
                Registered Mobile Number *
              </label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Phone className={`h-5 w-5 transition-colors ${error ? 'text-red-400' : 'text-gray-400 group-focus-within:text-[#5a32fa]'}`} />
                </div>
                <input
                  type="tel"
                  className={`pl-12 w-full p-4 bg-gray-50 border rounded-xl outline-none transition-all text-sm font-semibold ${error ? 'border-red-500 bg-red-50 focus:ring-2 focus:ring-red-500/20' : 'border-gray-200 focus:bg-white focus:ring-4 focus:ring-[#5a32fa]/10 focus:border-[#5a32fa]'}`}
                  placeholder="e.g. 8280057771"
                  value={phone}
                  onChange={handleChange}
                  required
                />
              </div>
              {error && (
                <p className="text-red-500 text-xs mt-2 ml-1 font-medium flex items-center">
                  <span className="w-1.5 h-1.5 rounded-full bg-red-500 mr-1.5 inline-block"></span>
                  {error}
                </p>
              )}
            </div>

            <button
              type="submit"
              disabled={loading || loadingSocieties}
              className="w-full bg-[#5a32fa] hover:bg-[#4826d1] text-white font-semibold py-4 rounded-xl transition-all duration-200 shadow-lg shadow-[#5a32fa]/25 hover:shadow-[#5a32fa]/40 flex items-center justify-center space-x-2 disabled:opacity-50 mt-2"
            >
              {loading ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <span>Send Firebase SMS OTP</span>
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
