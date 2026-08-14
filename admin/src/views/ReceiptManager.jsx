import React, { useState } from 'react';
import { FileText, Search, Plus, Filter, Download, Trash2, Eye } from 'lucide-react';

const ReceiptManager = ({ receipts, activeVendor, onOpenPDF, onDeleteReceipt }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [paymentModeFilter, setPaymentModeFilter] = useState('ALL');

  const filteredReceipts = receipts.filter(r => {
    const matchesSearch = 
      r.receivedFrom.toLowerCase().includes(searchTerm.toLowerCase()) ||
      r.flatShopNo.toLowerCase().includes(searchTerm.toLowerCase()) ||
      r.receiptNo.includes(searchTerm);

    const matchesMode = paymentModeFilter === 'ALL' || r.paymentMode === paymentModeFilter;
    return matchesSearch && matchesMode;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-white tracking-tight">
            Receipt Voucher Manager ({activeVendor?.name || 'Society'})
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Audit, issue, and manage official society collection vouchers.
          </p>
        </div>
      </div>

      {/* Filter & Search Bar */}
      <div className="flex flex-col sm:flex-row gap-3 items-center justify-between bg-slate-900 p-3.5 rounded-2xl border border-slate-800">
        <div className="relative flex-1 w-full">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3 pointer-events-none" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search by Payer Name, Flat No (e.g. A-302) or Receipt No..."
            className="w-full pl-10 pr-4 py-2 bg-slate-950 rounded-xl text-xs text-white border border-slate-800 focus:outline-none focus:border-indigo-500"
          />
        </div>

        <div className="flex items-center space-x-2 w-full sm:w-auto">
          <Filter className="w-4 h-4 text-slate-400 shrink-0" />
          <select
            value={paymentModeFilter}
            onChange={(e) => setPaymentModeFilter(e.target.value)}
            className="bg-slate-950 text-white text-xs font-semibold py-2 px-3 rounded-xl border border-slate-800 focus:outline-none"
          >
            <option value="ALL">All Payment Modes</option>
            <option value="Cash">Cash</option>
            <option value="Cheque">Cheque</option>
            <option value="NEFT">NEFT / IMPS</option>
            <option value="UPI">UPI</option>
          </select>
        </div>
      </div>

      {/* Receipts List */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-sm">
        {/* Mobile View: Cards */}
        <div className="md:hidden divide-y divide-slate-800">
          {filteredReceipts.length === 0 ? (
            <div className="p-8 text-center text-slate-500 text-xs font-semibold">No receipt vouchers found.</div>
          ) : (
            filteredReceipts.map((r) => (
              <div key={r._id} className="p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="bg-indigo-500/10 text-indigo-400 px-2 py-0.5 rounded border border-indigo-500/20 font-mono text-xs font-bold">
                    #{r.receiptNo}
                  </span>
                  <span className="text-xs font-black text-emerald-400">
                    ₹ {parseFloat(r.totalAmount || 0).toFixed(2)}
                  </span>
                </div>
                <div>
                  <p className="text-sm font-bold text-white">{r.receivedFrom}</p>
                  <p className="text-xs font-semibold text-indigo-400">{r.flatShopNo}</p>
                  <p className="text-[11px] text-slate-400 mt-0.5">{r.date} · {r.paymentMode} ({r.cashChequeNo || 'N/A'})</p>
                </div>
                <div className="flex items-center justify-end space-x-2 pt-1 border-t border-slate-800/60">
                  <button
                    onClick={() => onOpenPDF(r)}
                    className="px-3 py-1.5 rounded-lg bg-indigo-600/20 text-indigo-400 text-xs font-bold flex items-center space-x-1"
                  >
                    <Eye className="w-3.5 h-3.5 mr-1" />
                    <span>View PDF</span>
                  </button>
                  <button
                    onClick={() => onDeleteReceipt(r._id)}
                    className="px-3 py-1.5 rounded-lg bg-rose-600/20 text-rose-400 text-xs font-bold flex items-center space-x-1"
                  >
                    <Trash2 className="w-3.5 h-3.5 mr-1" />
                    <span>Delete</span>
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Desktop View: Table */}
        <div className="hidden md:block overflow-x-auto">
          <table className="w-full text-xs text-left text-slate-300">
            <thead className="bg-slate-950 text-slate-400 font-bold uppercase tracking-wider text-[10px]">
              <tr>
                <th className="p-3.5">Receipt #</th>
                <th className="p-3.5">Payer Name</th>
                <th className="p-3.5">Flat / Shop No.</th>
                <th className="p-3.5">Date</th>
                <th className="p-3.5">Payment Mode</th>
                <th className="p-3.5 text-right">Total Amount</th>
                <th className="p-3.5 text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800">
              {filteredReceipts.map((r) => (
                <tr key={r._id} className="hover:bg-slate-800/50 transition-all">
                  <td className="p-3.5 font-bold text-white">
                    <span className="bg-indigo-500/10 text-indigo-400 px-2 py-0.5 rounded border border-indigo-500/20 font-mono">
                      #{r.receiptNo}
                    </span>
                  </td>
                  <td className="p-3.5 font-bold text-white">{r.receivedFrom}</td>
                  <td className="p-3.5 font-medium text-slate-300">{r.flatShopNo}</td>
                  <td className="p-3.5 text-slate-400">{r.date}</td>
                  <td className="p-3.5 font-semibold text-slate-300">
                    {r.paymentMode} ({r.cashChequeNo || 'N/A'})
                  </td>
                  <td className="p-3.5 text-right font-extrabold text-emerald-400">
                    ₹ {parseFloat(r.totalAmount).toFixed(2)}
                  </td>
                  <td className="p-3.5 text-center space-x-2">
                    <button
                      onClick={() => onOpenPDF(r)}
                      className="p-1.5 rounded-lg bg-indigo-600/20 text-indigo-400 hover:bg-indigo-600/30 transition-all"
                      title="View PDF Voucher"
                    >
                      <Eye className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => onDeleteReceipt(r._id)}
                      className="p-1.5 rounded-lg bg-rose-600/20 text-rose-400 hover:bg-rose-600/30 transition-all"
                      title="Delete Receipt"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default ReceiptManager;
