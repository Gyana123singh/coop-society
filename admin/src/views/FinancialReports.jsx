import React from 'react';
import { PieChart, TrendingUp, CreditCard, DollarSign } from 'lucide-react';

const FinancialReports = ({ activeVendor }) => {
  const categoryData = [
    { title: 'Maintenance Charges', amount: 35000, percentage: 55 },
    { title: 'Sinking Fund', amount: 14000, percentage: 22 },
    { title: 'Interest', amount: 4500, percentage: 7 },
    { title: 'Parking Charges', amount: 6000, percentage: 9 },
    { title: 'Event / Festival Fund', amount: 4000, percentage: 7 }
  ];

  const paymentModes = [
    { mode: 'Cheque', amount: 32000, count: 8 },
    { mode: 'Online / NEFT', amount: 21500, count: 5 },
    { mode: 'Cash', amount: 10000, count: 3 }
  ];

  return (
    <div className="space-y-6">
      {/* Title */}
      <div>
        <h2 className="text-xl font-bold text-white tracking-tight">
          Financial Collection Analytics ({activeVendor?.name || 'Society'})
        </h2>
        <p className="text-xs text-slate-400 mt-0.5">
          Revenue breakdown by particulars category and payment channel.
        </p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4">
          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Total Revenue</span>
          <div className="text-2xl font-black text-emerald-400 mt-1">₹ 63,500.00</div>
          <p className="text-[11px] text-slate-400 mt-1 font-medium">Current Financial Quarter</p>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4">
          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Average Receipt Amount</span>
          <div className="text-2xl font-black text-white mt-1">₹ 3,968.75</div>
          <p className="text-[11px] text-slate-400 mt-1">Across 16 collection vouchers</p>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4">
          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Top Payment Channel</span>
          <div className="text-2xl font-black text-indigo-400 mt-1">Cheque (50.3%)</div>
          <p className="text-[11px] text-slate-400 mt-1">State Bank & HDFC Bank dominant</p>
        </div>
      </div>

      {/* Category Breakdown & Payment Distribution Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Category Particulars Breakdown */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-4">
          <h3 className="text-sm font-bold text-white flex items-center space-x-2">
            <PieChart className="w-4 h-4 text-indigo-400" />
            <span>Category Revenue Breakdown</span>
          </h3>

          <div className="space-y-3">
            {categoryData.map((cat, idx) => (
              <div key={idx} className="space-y-1">
                <div className="flex justify-between text-xs font-semibold">
                  <span className="text-slate-300">{cat.title}</span>
                  <span className="text-white font-bold">₹ {cat.amount.toLocaleString('en-IN')}</span>
                </div>
                <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-indigo-500 rounded-full"
                    style={{ width: `${cat.percentage}%` }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Payment Channel Distribution */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-4">
          <h3 className="text-sm font-bold text-white flex items-center space-x-2">
            <CreditCard className="w-4 h-4 text-emerald-400" />
            <span>Payment Channel Distribution</span>
          </h3>

          <div className="space-y-3">
            {paymentModes.map((pm, idx) => (
              <div key={idx} className="p-3 bg-slate-950 rounded-xl border border-slate-800 flex items-center justify-between">
                <div>
                  <p className="text-xs font-bold text-white">{pm.mode}</p>
                  <p className="text-[10px] text-slate-400">{pm.count} Receipts processed</p>
                </div>
                <span className="text-sm font-black text-emerald-400">
                  ₹ {pm.amount.toLocaleString('en-IN')}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default FinancialReports;
