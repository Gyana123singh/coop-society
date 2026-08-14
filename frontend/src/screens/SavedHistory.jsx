import React from 'react';
import { useApp } from '../context/AppContext';
import { useNavigate } from 'react-router-dom';
import { FileText, ChevronRight, Calendar, CreditCard } from 'lucide-react';

const SavedHistory = () => {
  const { receipts } = useApp();
  const navigate = useNavigate();

  return (
    <div className="min-h-full pb-8">
      <div className="sticky top-0 z-40 bg-white/80 backdrop-blur-md border-b border-gray-200 p-4 md:px-8 flex justify-between items-center">
        <div>
          <h1 className="text-xl md:text-2xl font-bold text-gray-900">Receipt History</h1>
          <p className="text-xs md:text-sm text-gray-500">View and manage past transactions</p>
        </div>
      </div>
      
      <div className="p-4 md:p-8">
        {receipts.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-32 bg-white rounded-3xl border border-dashed border-gray-300">
            <div className="w-20 h-20 rounded-full bg-gray-50 flex items-center justify-center mb-6">
              <FileText className="h-10 w-10 text-gray-300" />
            </div>
            <h2 className="text-xl font-bold text-gray-700">No Receipts Found</h2>
            <p className="text-gray-500 mt-2 max-w-sm text-center">You haven't saved any receipts yet. Go to the Form Fill Up tab to create your first receipt.</p>
            <button onClick={() => navigate('/form')} className="mt-8 px-6 py-3 bg-[#5a32fa] text-white rounded-xl font-semibold shadow-lg shadow-[#5a32fa]/20 hover:bg-[#4826d1] transition-colors">
              Create Receipt
            </button>
          </div>
        ) : (
          <>
            {/* Mobile: Row list */}
            <div className="md:hidden divide-y divide-gray-100 bg-white rounded-2xl overflow-hidden border border-gray-100 shadow-sm">
              {receipts.map((receipt) => (
                <div
                  key={receipt.id}
                  onClick={() => navigate(`/history/${receipt.id}`)}
                  className="flex items-center px-4 py-4 cursor-pointer hover:bg-gray-50 active:bg-gray-100 transition-colors"
                >
                  {/* Icon */}
                  <div className="w-10 h-10 rounded-xl bg-[#f4f2ff] flex items-center justify-center text-[#5a32fa] shrink-0 mr-4">
                    <FileText size={20} strokeWidth={1.5} />
                  </div>

                  {/* Middle content */}
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-bold text-gray-900 truncate">Receipt #{receipt.receiptNo}</p>
                    <div className="flex items-center gap-3 mt-0.5">
                      <span className="text-xs text-gray-500 flex items-center">
                        <Calendar size={11} className="mr-1 text-gray-400" />
                        {new Date(receipt.date).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                      </span>
                      <span className="text-xs text-gray-400">·</span>
                      <span className="text-xs text-gray-500 flex items-center">
                        <CreditCard size={11} className="mr-1 text-gray-400" />
                        {receipt.paymentMode}
                      </span>
                    </div>
                  </div>

                  {/* Amount + chevron */}
                  <div className="flex items-center gap-2 ml-3 shrink-0">
                    <span className="text-sm font-black text-gray-900">
                      ₹{receipt.totalAmount.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                    </span>
                    <ChevronRight size={16} className="text-gray-400" />
                  </div>
                </div>
              ))}
            </div>

            {/* Desktop: Card grid */}
            <div className="hidden md:grid md:grid-cols-2 xl:grid-cols-3 gap-6">
              {receipts.map((receipt) => (
                <div
                  key={receipt.id}
                  onClick={() => navigate(`/history/${receipt.id}`)}
                  className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 cursor-pointer hover:shadow-xl hover:shadow-[#5a32fa]/5 hover:border-[#5a32fa]/20 transition-all duration-300 group relative overflow-hidden"
                >
                  <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-bl from-[#5a32fa]/5 to-transparent rounded-bl-full pointer-events-none transition-transform group-hover:scale-110"></div>

                  <div className="flex items-start justify-between mb-6">
                    <div className="w-12 h-12 rounded-xl bg-[#f4f2ff] flex items-center justify-center text-[#5a32fa] group-hover:scale-110 transition-transform">
                      <FileText size={24} strokeWidth={1.5} />
                    </div>
                    <span className="inline-block px-3 py-1 bg-green-50 text-green-600 text-[10px] font-bold uppercase tracking-wider rounded-full">Completed</span>
                  </div>

                  <div className="space-y-1 mb-6">
                    <h3 className="text-lg font-bold text-gray-900">Receipt #{receipt.receiptNo}</h3>
                    <p className="text-sm font-medium text-gray-500">{receipt.receivedFrom}</p>
                  </div>

                  <div className="grid grid-cols-2 gap-4 mb-6">
                    <div className="flex items-center text-xs text-gray-500">
                      <Calendar size={14} className="mr-2 text-gray-400" />
                      {new Date(receipt.date).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                    </div>
                    <div className="flex items-center text-xs text-gray-500">
                      <CreditCard size={14} className="mr-2 text-gray-400" />
                      {receipt.paymentMode}
                    </div>
                  </div>

                  <div className="pt-4 border-t border-gray-100 flex items-center justify-between">
                    <div className="text-2xl font-black text-gray-900">
                      ₹{receipt.totalAmount.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                    </div>
                    <div className="w-8 h-8 rounded-full bg-gray-50 flex items-center justify-center text-gray-400 group-hover:bg-[#5a32fa] group-hover:text-white transition-colors">
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
