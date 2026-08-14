import React, { useState } from 'react';
import { useLocation, useNavigate, Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { ShieldCheck, ArrowLeft, Loader2, AlertCircle } from 'lucide-react';
import axios from 'axios';
import { verifyFirebasePhoneOTP } from '../services/firebaseAuthService';

const OTPScreen = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { login } = useAuth();
  const phone = location.state?.phone;
  const societyId = location.state?.societyId;
  const societyName = location.state?.societyName || 'Housing Society';
  const confirmationResult = location.state?.confirmationResult || window.confirmationResult;

  const [otp, setOtp] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  if (!phone) {
    return <Navigate to="/login" />;
  }

  const handleVerify = async (e) => {
    if (e) e.preventDefault();
    if (otp.length !== 6) {
      setError('Please enter the 6-digit SMS OTP code sent to your phone.');
      return;
    }

    setLoading(true);
    setError('');

    try {
      // 1. Verify 6-digit OTP code directly using Firebase Phone Auth confirmationResult
      const verifiedUser = await verifyFirebasePhoneOTP(confirmationResult, otp);
      
      if (!verifiedUser?.idToken) {
        throw new Error('Failed to retrieve Firebase ID token after verification.');
      }

      const idToken = verifiedUser.idToken;

      // 2. Exchange verified Firebase ID token with backend endpoint POST /api/v1/auth/firebase-login
      const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';
      const res = await axios.post(`${API_URL}/api/v1/auth/firebase-login`, {
        idToken,
        vendorId: societyId,
        phoneNumber: phone
      });

      if (res.data?.success) {
        const { token, user } = res.data.data;
        login(user, token);
        navigate('/form');
      } else {
        throw new Error(res.data?.message || 'Backend authentication failed.');
      }
    } catch (err) {
      console.error('[OTP Verification Error]', err);
      let errorMsg = 'Invalid or expired SMS OTP code. Please check and try again.';
      if (err.code === 'auth/invalid-verification-code') {
        errorMsg = 'Invalid SMS OTP code. Please check the code received on your phone.';
      } else if (err.code === 'auth/code-expired') {
        errorMsg = 'SMS OTP code has expired. Please return to login to request a new code.';
      } else if (err.response?.data?.message) {
        errorMsg = err.response.data.message;
      } else if (err.message) {
        errorMsg = err.message;
      }
      setError(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const val = e.target.value.replace(/\D/g, '');
    setOtp(val);
    if (error) setError('');
  };

  return (
    <div className="min-h-screen bg-[#f3f4f6] flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-white rounded-3xl shadow-xl overflow-hidden border border-gray-100 p-8 relative font-sans">

        <button onClick={() => navigate('/login')} className="absolute top-6 left-6 p-2 rounded-full hover:bg-gray-100 text-gray-500 transition-colors">
          <ArrowLeft size={20} />
        </button>

        <div className="text-center mb-8 mt-6">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-[#5a32fa]/10 mb-5 relative">
            <ShieldCheck className="h-10 w-10 text-[#5a32fa] relative z-10" />
            <div className="absolute inset-0 border-2 border-[#5a32fa]/20 rounded-full animate-ping" style={{ animationDuration: '3s' }}></div>
          </div>

          <span className="text-[11px] font-bold uppercase tracking-wider text-indigo-600 bg-indigo-50 px-3 py-1 rounded-full border border-indigo-100">
            {societyName}
          </span>

          <h1 className="text-2xl font-bold text-gray-900 mt-3 mb-1">Verify Firebase OTP</h1>
          <p className="text-xs text-gray-500">
            Enter 6-digit verification code sent via SMS to <br />
            <span className="font-bold text-gray-800">{phone}</span>
          </p>
        </div>

        {error && (
          <div className="mb-6 p-3 bg-red-50 border border-red-200 rounded-xl text-xs text-red-600 flex items-center space-x-2">
            <AlertCircle className="w-4 h-4 shrink-0 text-red-500" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleVerify} className="space-y-6">
          <div>
            <input
              type="text"
              maxLength={6}
              className="w-full p-4 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:ring-4 focus:ring-[#5a32fa]/10 focus:border-[#5a32fa] outline-none transition-all text-center text-3xl font-mono tracking-[0.4em] font-black text-gray-900"
              placeholder="••••••"
              value={otp}
              onChange={handleChange}
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#5a32fa] hover:bg-[#4826d1] text-white font-semibold py-4 rounded-xl transition-all duration-200 shadow-lg shadow-[#5a32fa]/25 hover:shadow-[#5a32fa]/40 flex items-center justify-center space-x-2 disabled:opacity-50"
          >
            {loading ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              <span>Verify & Login to Portal</span>
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

export default OTPScreen;
