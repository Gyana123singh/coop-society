import React, { useState } from 'react';
import Header from '../components/Header';
import { useApp } from '../context/AppContext';
import { useNavigate } from 'react-router-dom';
import { PlusCircle, RotateCcw, Save, FileText, User, Home, Volume2, Building2 } from 'lucide-react';

const initialParticulars = [
  { id: 1, name: "Maintenance Charges", from: "", to: "", amount: "" },
  { id: 2, name: "Sinking Fund", from: "", to: "", amount: "" },
  { id: 3, name: "Non Occupancy Charges / Rental", from: "", to: "", amount: "" },
  { id: 4, name: "Parking Charges", from: "", to: "", amount: "" },
  { id: 5, name: "Transfer Fee", from: "", to: "", amount: "" },
];

const FormFillUp = () => {
  const { residentDetails, addReceipt } = useApp();
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState({
    bookNo: "1",
    receiptNo: Math.floor(100 + Math.random() * 900).toString(),
    date: new Date().toISOString().split('T')[0],
    receivedFrom: residentDetails.name,
    flatNo: residentDetails.flatNo,
    sumInWords: "",
    paymentMode: "Cash",
    refNo: "",
    paymentDate: new Date().toISOString().split('T')[0],
    drawnOn: "",
  });

  const [particulars, setParticulars] = useState(initialParticulars);

  const handleParticularChange = (id, field, value) => {
    setParticulars(prev => prev.map(p => p.id === id ? { ...p, [field]: value } : p));
  };

  const addParticular = () => {
    const newId = particulars.length > 0 ? Math.max(...particulars.map(p => p.id)) + 1 : 1;
    setParticulars([...particulars, { id: newId, name: "", from: "", to: "", amount: "" }]);
  };

  const totalAmount = particulars.reduce((sum, p) => sum + (parseFloat(p.amount) || 0), 0);

  const handleSave = () => {
    const receiptData = {
      id: Date.now(),
      ...formData,
      particulars: particulars.filter(p => p.amount && parseFloat(p.amount) > 0),
      totalAmount,
    };
    addReceipt(receiptData);
    navigate('/history');
  };

  const handleReset = () => {
    setParticulars(initialParticulars);
    setFormData(prev => ({
      ...prev,
      sumInWords: "",
      refNo: "",
      drawnOn: "",
      paymentMode: "Cash"
    }));
  };

  // Reusable Floating Input Component (Scaled up font sizes)
  const FloatingInput = ({ label, icon: Icon, ...props }) => (
    <div className="relative mt-2.5">
      <label className="absolute -top-2.5 left-3 bg-[#f9fafb] px-1.5 text-xs text-gray-500 font-medium z-10">{label}</label>
      <div className="relative">
        {Icon && (
          <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
            <Icon size={18} className="text-gray-400" />
          </div>
        )}
        <input 
          {...props} 
          className={`w-full bg-transparent border border-gray-300 rounded-lg p-3 text-base focus:border-[#5a32fa] focus:ring-1 focus:ring-[#5a32fa] outline-none transition-all ${Icon ? 'pl-11' : ''}`}
        />
      </div>
    </div>
  );

  return (
    <div className="min-h-full pb-10 bg-[#f9fafb]">
      {/* Mobile Top Header */}
      <div className="w-full md:hidden">
        <Header title="Coop 365" subtitle={residentDetails.societyName} showActions={true} />
      </div>
      
      {/* Desktop Header */}
      <div className="hidden md:flex w-full sticky top-0 z-40 bg-white/80 backdrop-blur-md border-b border-gray-200 p-5 md:px-8 justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Form Fill Up</h1>
          <p className="text-sm text-gray-500">Create new receipt entry</p>
        </div>
      </div>
      
      <div className="px-6 py-6 md:p-8 w-full max-w-5xl mx-auto">
        
        {/* Blue Society Banner */}
        <div className="bg-[#5a32fa] text-white p-5 rounded-2xl mb-8 flex items-start space-x-4 shadow-lg shadow-[#5a32fa]/20">
          <div className="w-14 h-14 rounded-xl bg-white/20 flex items-center justify-center shrink-0">
            <FileText size={28} className="text-white" />
          </div>
          <div>
            <h2 className="text-base md:text-lg font-bold leading-tight mb-1.5">{residentDetails.societyName}</h2>
            <p className="text-xs md:text-sm text-white/90 leading-tight mb-1">{residentDetails.address}</p>
            <p className="text-xs md:text-sm text-white/90 leading-tight">
              ✉ {residentDetails.email} &nbsp; 📞 +91 98221 23456
            </p>
          </div>
        </div>

        <div className="space-y-10">
          
          {/* Row 1: Meta Details & Payment Details (Side by side on Desktop) */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-10">
            
            {/* Meta Details */}
            <div>
              <h2 className="text-sm font-bold text-gray-800 mb-4">Receipt Meta Details</h2>
              <div className="flex space-x-4">
                <div className="flex-1">
                  <FloatingInput label="Book No." value={formData.bookNo} onChange={e => setFormData({...formData, bookNo: e.target.value})} />
                </div>
                <div className="flex-1">
                  <FloatingInput label="Receipt No." value={formData.receiptNo} onChange={e => setFormData({...formData, receiptNo: e.target.value})} />
                </div>
              </div>
              <div className="mt-4">
                <FloatingInput label="Date *" type="date" value={formData.date} onChange={e => setFormData({...formData, date: e.target.value})} />
              </div>
            </div>

            {/* Payment Details */}
            <div>
              <h2 className="text-sm font-bold text-gray-800 mb-4">Payment Details</h2>
              <div className="flex rounded-lg border border-gray-300 overflow-hidden mb-5 bg-transparent">
                {['Cash', 'Cheque', 'NEFT'].map(mode => (
                  <button 
                    key={mode}
                    onClick={() => setFormData({...formData, paymentMode: mode})}
                    className={`flex-1 py-2.5 text-sm font-medium text-center border-r border-gray-300 last:border-r-0 transition-colors ${formData.paymentMode === mode ? 'bg-[#5a32fa]/10 text-[#5a32fa]' : 'text-gray-600'}`}
                  >
                    {formData.paymentMode === mode && <span className="mr-1.5">✓</span>}
                    {mode}
                  </button>
                ))}
              </div>
              
              <div className="flex space-x-4 mb-4">
                <div className="flex-1">
                  <FloatingInput label="Cheque/Ref No." value={formData.refNo} onChange={e => setFormData({...formData, refNo: e.target.value})} placeholder="CHK-492018" />
                </div>
                <div className="flex-1">
                  <FloatingInput label="Payment Date" type="date" value={formData.paymentDate} onChange={e => setFormData({...formData, paymentDate: e.target.value})} />
                </div>
              </div>
              <div>
                <FloatingInput label="Drawn on (Bank / App)" icon={Building2} value={formData.drawnOn} onChange={e => setFormData({...formData, drawnOn: e.target.value})} placeholder="State Bank of India" />
              </div>
            </div>

          </div>

          {/* Row 2: Payer Information (Full Width) */}
          <div>
            <h2 className="text-sm font-bold text-gray-800 mb-4">Payer Information</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="md:col-span-1">
                <FloatingInput label="Received from Mr./Mrs. *" icon={User} value={formData.receivedFrom} onChange={e => setFormData({...formData, receivedFrom: e.target.value})} />
              </div>
              <div className="md:col-span-1">
                <FloatingInput label="Flat / Shop No. *" icon={Home} value={formData.flatNo} onChange={e => setFormData({...formData, flatNo: e.target.value})} />
              </div>
              <div className="md:col-span-2">
                <FloatingInput label="Sum of Rupees (in words)" icon={Volume2} value={formData.sumInWords} onChange={e => setFormData({...formData, sumInWords: e.target.value})} placeholder="Four Thousand Eight Hundred Fifty Rupees" />
              </div>
            </div>
          </div>

          {/* Row 3: Particulars (Full Width) */}
          <div>
            <div className="flex justify-between items-end mb-5">
              <h2 className="text-sm font-bold text-gray-800">Particulars (towards following)</h2>
              <span className="text-xs text-gray-500 font-medium">{particulars.length} Line items</span>
            </div>
            
            <div className="space-y-5 mb-5">
              {particulars.map((item, index) => (
                <div key={item.id} className="bg-[#f0f2fd] p-4 md:p-5 rounded-xl border border-[#e5e7fa]">
                  <div className="flex items-center space-x-3 mb-4">
                    <span className="w-6 h-6 rounded-full bg-[#5a32fa] text-white flex items-center justify-center text-xs font-bold shrink-0">
                      {index + 1}
                    </span>
                    {item.name ? (
                      <span className="text-sm font-bold text-gray-800">{item.name}</span>
                    ) : (
                      <input type="text" placeholder="Particular Name" value={item.name} onChange={e => handleParticularChange(item.id, 'name', e.target.value)} className="flex-1 p-1.5 text-sm border-b border-gray-300 bg-transparent outline-none focus:border-[#5a32fa]" />
                    )}
                  </div>
                  <div className="grid grid-cols-3 gap-3 md:gap-4">
                    <div className="relative">
                      <label className="absolute -top-2.5 left-2 bg-[#f0f2fd] px-1 text-[10px] md:text-xs text-gray-500 font-medium z-10">From</label>
                      <input type="month" value={item.from} onChange={e => handleParticularChange(item.id, 'from', e.target.value)} className="w-full bg-white border border-gray-300 rounded-lg p-2 md:p-2.5 text-sm focus:border-[#5a32fa] outline-none" />
                    </div>
                    <div className="relative">
                      <label className="absolute -top-2.5 left-2 bg-[#f0f2fd] px-1 text-[10px] md:text-xs text-gray-500 font-medium z-10">To</label>
                      <input type="month" value={item.to} onChange={e => handleParticularChange(item.id, 'to', e.target.value)} className="w-full bg-white border border-gray-300 rounded-lg p-2 md:p-2.5 text-sm focus:border-[#5a32fa] outline-none" />
                    </div>
                    <div className="relative">
                      <label className="absolute -top-2.5 left-2 bg-[#f0f2fd] px-1 text-[10px] md:text-xs text-gray-500 font-medium z-10">Amount (₹)</label>
                      <input type="number" placeholder="₹" value={item.amount} onChange={e => handleParticularChange(item.id, 'amount', e.target.value)} className="w-full bg-white border border-gray-300 rounded-lg p-2 md:p-2.5 text-base font-semibold focus:border-[#5a32fa] outline-none" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
            
            <button onClick={addParticular} className="w-full py-3.5 border-2 border-[#5a32fa] border-dashed rounded-xl text-[#5a32fa] hover:bg-[#5a32fa]/5 transition-colors flex items-center justify-center space-x-2">
              <PlusCircle size={20} />
              <span className="text-sm font-semibold">Add Particular</span>
            </button>

          </div>
        </div>

        {/* Total & Action Buttons at Bottom */}
        <div className="mt-10 pt-6">
          <div className="bg-[#121026] text-white p-5 rounded-2xl flex justify-between items-center mb-5">
            <div>
              <p className="text-xs text-gray-400 uppercase font-semibold tracking-wide">Total Receipt Amount</p>
              <p className="text-2xl font-bold">₹ {totalAmount.toFixed(2)}</p>
            </div>
            <button className="bg-[#5a32fa] hover:bg-[#4826d1] text-white px-4 py-2.5 rounded-xl text-sm font-medium flex items-center transition-colors">
              <FileText size={18} className="mr-2" />
              PDF Preview
            </button>
          </div>

          <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-4 pb-24 md:pb-0">
            <button onClick={handleReset} className="w-full sm:w-auto sm:flex-[0.8] py-4 bg-white border border-gray-300 rounded-xl text-gray-600 font-semibold flex items-center justify-center hover:bg-gray-50 transition-colors text-base">
              <RotateCcw size={18} className="mr-2" />
              Reset Form
            </button>
            <button onClick={handleSave} className="w-full sm:w-auto sm:flex-1 py-4 bg-[#5a32fa] text-white rounded-xl font-semibold flex items-center justify-center hover:bg-[#4826d1] transition-colors shadow-lg shadow-[#5a32fa]/30 text-base">
              <Save size={18} className="mr-2" />
              Save & Store Receipt
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};

export default FormFillUp;
