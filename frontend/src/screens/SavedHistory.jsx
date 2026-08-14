import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { useNavigate } from 'react-router-dom';
import { FileText, ChevronRight, Calendar, CreditCard, Search, RefreshCw, Filter, Loader2 } from 'lucide-react';
import axios from 'axios';

const SavedHistory = () => {
  const { receipts, refreshReceipts } = useApp();
  const navigate = useNavigate();
  
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [paymentFilter, setPaymentFilter] = useState('ALL');

  const handleRefresh = async () => {
    setLoading(true);
    try {
      if (refreshReceipts) {
        await refreshReceipts();
      }
    } catch (err) {
      console.warn('Refresh notice:', err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    handleRefresh();
  }, []);

  // Filter receipts by search query and selected payment mode filter
  const filteredReceipts = receipts.filter(r => {
    const matchesSearch = 
      !searchQuery ||
      (r.receiptNo && String(r.receiptNo).toLowerCase().includes(searchQuery.toLowerCase())) ||
      (r.receivedFrom && r.receivedFrom.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (r.flatNo && r.flatNo.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (r.flatShopNo && r.flatShopNo.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesPaymentMode = 
      paymentFilter === 'ALL' || 
      (r.paymentMode && r.paymentMode.toUpperCase() === paymentFilter.toUpperCase());

    return matchesSearch && matchesPaymentMode;
  });

  return (
    <div className="min-h-full pb-10 bg-[#f9fafb]">
      {/* Top Header */}
      <div className="sticky top-0 z-40 bg-white/80 backdrop-blur-md border-b border-gray-200 p-4 md:px-8 flex justify-between items-center">
        <div>
          <h1 className="text-xl md:text-2xl font-bold text-gray-900">Receipt History</h1>
          <p className="text-xs md:text-sm text-gray-500">View and manage past transactions stored in database</p>
        </div>
        <button
          onClick={handleRefresh}
          disabled={loading}
          className="p-2 rounded-xl bg-indigo-50 border border-indigo-100 text-indigo-600 hover:bg-indigo-100 transition-all flex items-center space-x-1 text-xs font-semibold"
          title="Refresh receipts from MongoDB API"
        >
          <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          <span className="hidden sm:inline">Sync API</span>
        </button>
      </div>

      <div className="p-4 md:p-8 max-w-6xl mx-auto space-y-6">

        {/* Search & Filter Controls */}
        <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm flex flex-col md:flex-row gap-4 justify-between items-center">
          {/* Search Input */}
          <div className="relative w-full md:w-96">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Search by receipt #, member name, flat..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm font-medium focus:bg-white focus:outline-none focus:border-[#5a32fa] transition-all"
            />
          </div>

          {/* Payment Mode Pills */}
          <div className="flex items-center space-x-1.5 w-full md:w-auto overflow-x-auto pb-1 md:pb-0 text-xs">
            {['ALL', 'Cash', 'Cheque', 'NEFT'].map(mode => (
              <button
                key={mode}
                onClick={() => setPaymentFilter(mode)}
                className={`px-3.5 py-2 rounded-xl font-bold transition-all shrink-0 ${paymentFilter === mode ? 'bg-[#5a32fa] text-white shadow-md shadow-[#5a32fa]/20' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
              >
                {mode === 'ALL' ? 'All Payments' : mode}
              </button>
            ))}
          </div>
        </div>

        {/* Receipts Content */}
        {loading ? (
          <div className="flex flex-col items-center justify-center py-24 bg-white rounded-3xl border border-gray-100">
            <Loader2 className="w-10 h-10 text-[#5a32fa] animate-spin mb-4" />
            <p className="text-sm font-bold text-gray-600">Fetching receipts from database...</p>
          </div>
        ) : filteredReceipts.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 bg-white rounded-3xl border border-dashed border-gray-300">
            <div className="w-20 h-20 rounded-full bg-indigo-50 flex items-center justify-center mb-5">
              <FileText className="h-10 w-10 text-[#5a32fa]" />
            </div>
            <h2 className="text-xl font-bold text-gray-800">
              {searchQuery || paymentFilter !== 'ALL' ? 'No Matching Receipts Found' : 'No Receipts Found'}
            </h2>
            <p className="text-gray-500 text-xs md:text-sm mt-1.5 max-w-sm text-center">
              {searchQuery || paymentFilter !== 'ALL' 
                ? 'Try adjusting your search criteria or payment mode filter.'
                : "You haven't stored any receipt vouchers yet. Click below to create your first receipt."}
            </p>
            {!(searchQuery || paymentFilter !== 'ALL') && (
              <button 
                onClick={() => navigate('/form')} 
                className="mt-6 px-6 py-3 bg-[#5a32fa] text-white rounded-xl font-semibold text-sm shadow-lg shadow-[#5a32fa]/20 hover:bg-[#4826d1] transition-all"
              >
                Create First Receipt
              </button>
            )}
          </div>
        ) : (
          <>
            {/* Mobile View: List */}
            <div className="md:hidden divide-y divide-gray-100 bg-white rounded-2xl overflow-hidden border border-gray-100 shadow-sm">
              {filteredReceipts.map((receipt) => (
                <div
                  key={receipt.id || receipt._id}
                  onClick={() => navigate(`/history/${receipt.id || receipt._id}`, { state: { receipt } })}
                  className="flex items-center px-4 py-4 cursor-pointer hover:bg-gray-50 active:bg-gray-100 transition-colors"
                >
                  <div className="w-10 h-10 rounded-xl bg-[#f4f2ff] flex items-center justify-center text-[#5a32fa] shrink-0 mr-4">
                    <FileText size={20} strokeWidth={1.5} />
                  </div>

                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-bold text-gray-900 truncate">Receipt #{receipt.receiptNo}</p>
                    <p className="text-xs text-gray-500 truncate">{receipt.receivedFrom} ({receipt.flatNo || receipt.flatShopNo || 'Flat'})</p>
                    <div className="flex items-center gap-3 mt-1">
                      <span className="text-[11px] text-gray-400 flex items-center">
                        <Calendar size={11} className="mr-1 text-gray-400" />
                        {receipt.date}
                      </span>
                      <span className="text-[11px] text-gray-300">·</span>
                      <span className="text-[11px] text-gray-500 font-semibold flex items-center">
                        <CreditCard size={11} className="mr-1 text-gray-400" />
                        {receipt.paymentMode}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 ml-3 shrink-0">
                    <span className="text-sm font-black text-gray-900">
                      ₹{parseFloat(receipt.totalAmount || 0).toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                    </span>
                    <ChevronRight size={16} className="text-gray-400" />
                  </div>
                </div>
              ))}
            </div>

            {/* Desktop View: Grid */}
            <div className="hidden md:grid md:grid-cols-2 xl:grid-cols-3 gap-6">
              {filteredReceipts.map((receipt) => (
                <div
                  key={receipt.id || receipt._id}
                  onClick={() => navigate(`/history/${receipt.id || receipt._id}`, { state: { receipt } })}
                  className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 cursor-pointer hover:shadow-xl hover:shadow-[#5a32fa]/5 hover:border-[#5a32fa]/20 transition-all duration-300 group relative overflow-hidden flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-start justify-between mb-4">
                      <div className="w-12 h-12 rounded-xl bg-[#f4f2ff] flex items-center justify-center text-[#5a32fa] group-hover:scale-110 transition-transform">
                        <FileText size={24} strokeWidth={1.5} />
                      </div>
                      <span className="inline-block px-3 py-1 bg-green-50 text-green-600 text-[10px] font-bold uppercase tracking-wider rounded-full border border-green-100">
                        VERIFIED
                      </span>
                    </div>

                    <div className="space-y-1 mb-5">
                      <h3 className="text-lg font-bold text-gray-900">Receipt #{receipt.receiptNo}</h3>
                      <p className="text-xs font-semibold text-gray-500">{receipt.receivedFrom}</p>
                      <p className="text-xs text-indigo-600 font-bold">{receipt.flatNo || receipt.flatShopNo || 'Flat A-302'}</p>
                    </div>

                    <div className="grid grid-cols-2 gap-3 mb-5">
                      <div className="flex items-center text-xs text-gray-500 bg-gray-50 p-2 rounded-lg">
                        <Calendar size={14} className="mr-1.5 text-gray-400" />
                        <span>{receipt.date}</span>
                      </div>
                      <div className="flex items-center text-xs text-gray-500 bg-gray-50 p-2 rounded-lg">
                        <CreditCard size={14} className="mr-1.5 text-gray-400" />
                        <span className="font-semibold">{receipt.paymentMode}</span>
                      </div>
                    </div>
                  </div>

                  <div className="pt-4 border-t border-gray-100 flex items-center justify-between">
                    <div>
                      <p className="text-[10px] uppercase font-bold text-gray-400 tracking-wider">Total Amount</p>
                      <p className="text-xl font-black text-gray-900">
                        ₹{parseFloat(receipt.totalAmount || 0).toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                      </p>
                    </div>
                    <div className="w-9 h-9 rounded-full bg-indigo-50 flex items-center justify-center text-[#5a32fa] group-hover:bg-[#5a32fa] group-hover:text-white transition-all shadow-sm">
                      <ChevronRight size={18} />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default SavedHistory;
