import React, { useState, useEffect } from 'react';
import { PieChart, TrendingUp, CreditCard, DollarSign, RefreshCw, Download, Filter, Search, Calendar, FileSpreadsheet, Layers, AlertCircle } from 'lucide-react';
import axios from 'axios';

const FinancialReports = ({ activeVendor }) => {
  const [receipts, setReceipts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modeFilter, setModeFilter] = useState('ALL');
  const [searchTerm, setSearchTerm] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [apiError, setApiError] = useState(null);

  // Real-time API Integration: Fetch live financial receipt vouchers directly from MongoDB backend API
  const fetchLiveAnalyticsData = async () => {
    setLoading(true);
    setApiError(null);
    try {
      const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';
      const token = localStorage.getItem('coop365_admin_token') || localStorage.getItem('coop365_token');
      const headers = token ? { Authorization: `Bearer ${token}` } : {};

      const params = { limit: 500 };
      if (activeVendor?._id && !activeVendor._id.startsWith('v1')) {
        params.vendorId = activeVendor._id;
      }
      if (modeFilter !== 'ALL') {
        params.paymentMode = modeFilter;
      }
      if (searchTerm) {
        params.search = searchTerm;
      }
      if (startDate) params.startDate = startDate;
      if (endDate) params.endDate = endDate;

      let res;
      try {
        res = await axios.get(`${API_URL}/api/v1/receipts/analytics`, { headers, params });
      } catch (e) {
        res = await axios.get(`${API_URL}/api/v1/receipts`, { headers, params });
      }

      if (res.data?.success) {
        const payload = res.data.data;
        if (Array.isArray(payload?.receipts)) {
          setReceipts(payload.receipts);
        } else {
          setReceipts([]);
        }
      } else {
        setReceipts([]);
      }
    } catch (err) {
      console.error('[Financial Analytics API Error]:', err.message);
      setApiError(err.response?.data?.message || err.message || 'Failed to fetch financial analytics from backend API');
      setReceipts([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLiveAnalyticsData();
  }, [activeVendor?._id, modeFilter, startDate, endDate]);

  // Real-Time Analytics Calculations from live API data
  const totalRevenue = receipts.reduce((sum, r) => sum + (parseFloat(r.totalAmount) || 0), 0);
  const totalCount = receipts.length;
  const avgReceiptAmount = totalCount > 0 ? (totalRevenue / totalCount) : 0;

  // Real-Time Payment Channel Breakdown
  const paymentModeMap = {};
  receipts.forEach(r => {
    const mode = r.paymentMode || 'Cash';
    if (!paymentModeMap[mode]) {
      paymentModeMap[mode] = { count: 0, amount: 0 };
    }
    paymentModeMap[mode].count += 1;
    paymentModeMap[mode].amount += (parseFloat(r.totalAmount) || 0);
  });

  const paymentModes = Object.keys(paymentModeMap).map(mode => ({
    mode,
    amount: paymentModeMap[mode].amount,
    count: paymentModeMap[mode].count,
    percentage: totalRevenue > 0 ? Math.round((paymentModeMap[mode].amount / totalRevenue) * 100) : 0
  })).sort((a, b) => b.amount - a.amount);

  const topMode = paymentModes.length > 0 ? paymentModes[0] : null;

  // Real-Time Line Item Particulars Revenue Breakdown
  const categoryMap = {};
  receipts.forEach(r => {
    if (r.items && Array.isArray(r.items) && r.items.length > 0) {
      r.items.forEach(it => {
        const title = it.title || it.name || 'Maintenance Charges';
        const amt = parseFloat(it.amount) || 0;
        categoryMap[title] = (categoryMap[title] || 0) + amt;
      });
    } else {
      categoryMap['Maintenance Charges'] = (categoryMap['Maintenance Charges'] || 0) + (parseFloat(r.totalAmount) || 0);
    }
  });

  const categoryData = Object.keys(categoryMap).map(title => {
    const amt = categoryMap[title];
    const percentage = totalRevenue > 0 ? Math.round((amt / totalRevenue) * 100) : 0;
    return { title, amount: amt, percentage };
  }).sort((a, b) => b.amount - a.amount);

  // Export Live Financial Collection Report to CSV
  const handleExportCSV = () => {
    if (receipts.length === 0) {
      alert('No financial collection records available to export.');
      return;
    }

    const headers = ['Receipt No', 'Date', 'Member / Resident', 'Flat / Shop No', 'Payment Mode', 'Ref / Cheque No', 'Drawn On Bank', 'Total Amount (Rs.)'];
    const rows = receipts.map(r => [
      `"${r.receiptNo || ''}"`,
      `"${r.date || ''}"`,
      `"${r.receivedFrom || ''}"`,
      `"${r.flatShopNo || ''}"`,
      `"${r.paymentMode || ''}"`,
      `"${r.cashChequeNo || ''}"`,
      `"${r.drawnOn || ''}"`,
      `"${parseFloat(r.totalAmount || 0).toFixed(2)}"`
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `Financial_Collection_Report_${activeVendor?.name || 'Society'}_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6 text-xs text-slate-300 font-sans">
      
      {/* Title & Real-time Action Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-900 border border-slate-800 p-5 rounded-2xl shadow-sm">
        <div>
          <div className="flex items-center space-x-2">
            <h2 className="text-lg font-bold text-white tracking-tight">
              Financial Collection Analytics
            </h2>
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
              {activeVendor?.name || 'Society'}
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Real-time API integration • Computing live revenue collection directly from MongoDB database.
          </p>
        </div>

        <div className="flex items-center space-x-2">
          <button
            onClick={fetchLiveAnalyticsData}
            disabled={loading}
            className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold transition-all flex items-center space-x-1.5 border border-slate-700 disabled:opacity-50"
            title="Refetch real-time API collection analytics"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin text-indigo-400' : ''}`} />
            <span>Refetch API</span>
          </button>

          <button
            onClick={handleExportCSV}
            disabled={receipts.length === 0}
            className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold transition-all flex items-center space-x-1.5 shadow-lg shadow-emerald-600/20 disabled:opacity-50"
          >
            <FileSpreadsheet className="w-3.5 h-3.5" />
            <span>Export CSV Report</span>
          </button>
        </div>
      </div>

      {apiError && (
        <div className="bg-rose-500/10 border border-rose-500/20 rounded-2xl p-4 flex items-center space-x-3 text-rose-400 text-xs font-semibold">
          <AlertCircle className="w-5 h-5 text-rose-400 shrink-0" />
          <span>API Notice: {apiError}</span>
        </div>
      )}

      {/* Real-time Filter Toolbar */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 flex flex-col md:flex-row items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
          {/* Mode Selector */}
          <div className="flex items-center space-x-1 bg-slate-950 p-1 rounded-xl border border-slate-800">
            {['ALL', 'Cash', 'Cheque', 'NEFT'].map(mode => (
              <button
                key={mode}
                onClick={() => setModeFilter(mode)}
                className={`px-3 py-1.5 rounded-lg font-bold text-[11px] transition-all ${modeFilter === mode ? 'bg-indigo-600 text-white shadow-md' : 'text-slate-400 hover:text-white'}`}
              >
                {mode}
              </button>
            ))}
          </div>

          {/* Date Range Inputs */}
          <div className="flex items-center space-x-1.5 bg-slate-950 px-3 py-1 rounded-xl border border-slate-800">
            <Calendar className="w-3.5 h-3.5 text-slate-400" />
            <input
              type="date"
              value={startDate}
              onChange={e => setStartDate(e.target.value)}
              className="bg-transparent text-white outline-none text-[11px]"
            />
            <span className="text-slate-600">to</span>
            <input
              type="date"
              value={endDate}
              onChange={e => setEndDate(e.target.value)}
              className="bg-transparent text-white outline-none text-[11px]"
            />
          </div>
        </div>

        {/* Real-time Search Input */}
        <div className="relative w-full md:w-64">
          <Search className="w-3.5 h-3.5 text-slate-500 absolute left-3 top-2.5" />
          <input
            type="text"
            placeholder="Search member, flat, receipt..."
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            onKeyDown={e => { if (e.key === 'Enter') fetchLiveAnalyticsData(); }}
            className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-9 pr-3 py-1.5 text-xs text-white placeholder-slate-500 outline-none focus:border-indigo-500"
          />
        </div>
      </div>

      {/* Summary KPI Cards computed from Real-time API */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 space-y-1">
          <div className="flex justify-between items-center text-slate-400">
            <span className="text-[11px] font-bold uppercase tracking-wider">Total Collection</span>
            <DollarSign className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-2xl font-black text-emerald-400">
            ₹ {totalRevenue.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
          </div>
          <p className="text-[10px] text-slate-400 font-medium">Real-time MongoDB sum</p>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 space-y-1">
          <div className="flex justify-between items-center text-slate-400">
            <span className="text-[11px] font-bold uppercase tracking-wider">Total Vouchers</span>
            <Layers className="w-4 h-4 text-indigo-400" />
          </div>
          <div className="text-2xl font-black text-white">
            {totalCount} <span className="text-xs font-semibold text-slate-400">Issued</span>
          </div>
          <p className="text-[10px] text-slate-400">API returned count</p>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 space-y-1">
          <div className="flex justify-between items-center text-slate-400">
            <span className="text-[11px] font-bold uppercase tracking-wider">Average Voucher Size</span>
            <TrendingUp className="w-4 h-4 text-amber-400" />
          </div>
          <div className="text-2xl font-black text-amber-300">
            ₹ {avgReceiptAmount.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
          </div>
          <p className="text-[10px] text-slate-400">Average per receipt entry</p>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 space-y-1">
          <div className="flex justify-between items-center text-slate-400">
            <span className="text-[11px] font-bold uppercase tracking-wider">Top Payment Channel</span>
            <CreditCard className="w-4 h-4 text-sky-400" />
          </div>
          <div className="text-2xl font-black text-sky-400">
            {topMode ? topMode.mode : 'None'}
          </div>
          <p className="text-[10px] text-slate-400">Highest collection channel</p>
        </div>
      </div>

      {/* Category Breakdown & Payment Distribution Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Particulars Revenue Breakdown */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-4">
          <div className="flex justify-between items-center pb-2 border-b border-slate-800">
            <h3 className="text-sm font-bold text-white flex items-center space-x-2">
              <PieChart className="w-4 h-4 text-indigo-400" />
              <span>Particulars Revenue Breakdown</span>
            </h3>
            <span className="text-[10px] font-bold text-slate-400 uppercase">{categoryData.length} Particular Heads</span>
          </div>

          <div className="space-y-3.5">
            {categoryData.map((cat, idx) => (
              <div key={idx} className="space-y-1">
                <div className="flex justify-between text-xs font-semibold">
                  <span className="text-slate-300">{cat.title}</span>
                  <span className="text-white font-mono font-bold">
                    ₹ {cat.amount.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                    <span className="text-slate-400 text-[10px] font-normal ml-1.5">({cat.percentage}%)</span>
                  </span>
                </div>
                <div className="w-full h-2 bg-slate-950 rounded-full overflow-hidden border border-slate-800">
                  <div
                    className="h-full bg-gradient-to-r from-indigo-500 to-indigo-400 rounded-full"
                    style={{ width: `${Math.max(Math.min(cat.percentage, 100), 5)}%` }}
                  ></div>
                </div>
              </div>
            ))}
            {categoryData.length === 0 && (
              <p className="text-slate-500 text-center py-4 text-xs font-medium">
                No particular heads returned from real-time API.
              </p>
            )}
          </div>
        </div>

        {/* Payment Channel Distribution */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-4">
          <div className="flex justify-between items-center pb-2 border-b border-slate-800">
            <h3 className="text-sm font-bold text-white flex items-center space-x-2">
              <CreditCard className="w-4 h-4 text-emerald-400" />
              <span>Payment Channel Distribution</span>
            </h3>
            <span className="text-[10px] font-bold text-slate-400 uppercase">{paymentModes.length} Active Channels</span>
          </div>

          <div className="space-y-3">
            {paymentModes.map((pm, idx) => (
              <div key={idx} className="p-3.5 bg-slate-950 rounded-xl border border-slate-800 flex items-center justify-between">
                <div>
                  <p className="text-xs font-bold text-white flex items-center space-x-1.5">
                    <span>{pm.mode}</span>
                    <span className="px-2 py-0.5 rounded text-[10px] bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                      {pm.percentage}%
                    </span>
                  </p>
                  <p className="text-[11px] text-slate-400 mt-0.5">{pm.count} Vouchers processed</p>
                </div>
                <span className="text-sm font-mono font-black text-emerald-400">
                  ₹ {pm.amount.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                </span>
              </div>
            ))}
            {paymentModes.length === 0 && (
              <p className="text-slate-500 text-center py-4 text-xs font-medium">
                No payment modes returned from real-time API.
              </p>
            )}
          </div>
        </div>

      </div>

      {/* Financial Collection Voucher Records Table */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-sm space-y-3 p-5">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <h3 className="text-sm font-bold text-white flex items-center space-x-2">
            <FileSpreadsheet className="w-4 h-4 text-indigo-400" />
            <span>Collection Voucher Records ({receipts.length})</span>
          </h3>
          <span className="text-[10px] font-mono text-emerald-400 font-bold flex items-center space-x-1">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse mr-1"></span>
            <span>Real-time MongoDB API</span>
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left text-slate-300">
            <thead className="bg-slate-950 text-slate-400 font-bold uppercase tracking-wider text-[10px] border-b border-slate-800">
              <tr>
                <th className="p-3">Receipt No</th>
                <th className="p-3">Date</th>
                <th className="p-3">Member Name & Flat</th>
                <th className="p-3">Payment Mode & Ref</th>
                <th className="p-3 text-right">Amount (Rs.)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/80 font-sans">
              {receipts.map((r, i) => (
                <tr key={r._id || i} className="hover:bg-slate-800/40 transition-all">
                  <td className="p-3 font-mono font-bold text-indigo-400">
                    #{r.receiptNo}
                  </td>
                  <td className="p-3 text-slate-400">
                    {r.date}
                  </td>
                  <td className="p-3">
                    <p className="font-bold text-white">{r.receivedFrom}</p>
                    <p className="text-[11px] text-slate-400">{r.flatShopNo || r.flatNo}</p>
                  </td>
                  <td className="p-3">
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-slate-950 border border-slate-700 text-slate-300 mr-2">
                      {r.paymentMode}
                    </span>
                    <span className="text-slate-400 font-mono">{r.cashChequeNo || r.refNo || 'N/A'}</span>
                  </td>
                  <td className="p-3 text-right font-mono font-bold text-emerald-400 text-sm">
                    ₹ {parseFloat(r.totalAmount || 0).toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                  </td>
                </tr>
              ))}
              {receipts.length === 0 && !loading && (
                <tr>
                  <td colSpan={5} className="p-8 text-center text-slate-500 text-xs">
                    No financial collection vouchers found in database matching criteria.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
};

export default FinancialReports;
