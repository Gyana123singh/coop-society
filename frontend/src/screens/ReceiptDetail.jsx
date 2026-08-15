import React, { useState, useEffect } from 'react';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import { ArrowLeft, Printer, Share2, Download, Loader2 } from 'lucide-react';
import { useApp } from '../context/AppContext';
import axios from 'axios';

/* ─── tiny crossed-box for empty cells ─── */
const X = () => (
  <svg width="10" height="10" viewBox="0 0 10 10" className="inline-block">
    <rect x="0.5" y="0.5" width="9" height="9" stroke="black" strokeWidth="1" fill="none" />
    <line x1="0.5" y1="0.5" x2="9.5" y2="9.5" stroke="black" strokeWidth="1" />
    <line x1="9.5" y1="0.5" x2="0.5" y2="9.5" stroke="black" strokeWidth="1" />
  </svg>
);

const DEFAULT_PARTICULARS = [
  { id: 1, name: "Maintenance Charges", from: "Apr 2026", to: "Jun 2026", amount: "3500.00" },
  { id: 2, name: "Sinking Fund", from: "Apr 2026", to: "Jun 2026", amount: "1200.00" },
  { id: 3, name: "Non Occupancy Charges / Rental", from: "", to: "", amount: "" },
  { id: 4, name: "Parking Charges", from: "", to: "", amount: "" },
  { id: 5, name: "Transfer Fee", from: "", to: "", amount: "" },
  { id: 6, name: "Interest", from: "", to: "", amount: "150.00" }
];

const ReceiptDetail = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const location = useLocation();
  const { residentDetails, receipts } = useApp();

  const [receiptData, setReceiptData] = useState(location.state?.receipt || null);
  const [loading, setLoading] = useState(false);

  // Fetch receipt details from backend API if not passed in location state
  useEffect(() => {
    if (receiptData) return;

    const foundInContext = receipts.find(r => String(r.id) === String(id) || String(r._id) === String(id));
    if (foundInContext) {
      setReceiptData(foundInContext);
      return;
    }

    const fetchReceiptApi = async () => {
      setLoading(true);
      try {
        const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';
        const token = localStorage.getItem('coop365_token');
        const headers = token ? { Authorization: `Bearer ${token}` } : {};

        const res = await axios.get(`${API_URL}/api/v1/receipts/${id}`, { headers });
        if (res.data?.success && res.data.data?.receipt) {
          const r = res.data.data.receipt;
          setReceiptData({
            id: r._id,
            _id: r._id,
            receiptNo: r.receiptNo,
            bookNo: r.bookNo,
            date: r.date,
            receivedFrom: r.receivedFrom,
            flatNo: r.flatShopNo,
            flatShopNo: r.flatShopNo,
            paymentMode: r.paymentMode,
            refNo: r.cashChequeNo,
            cashChequeNo: r.cashChequeNo,
            paymentDate: r.paymentDate,
            drawnOn: r.drawnOn,
            totalAmount: r.totalAmount,
            sumInWords: r.sumInWords,
            particulars: r.items ? r.items.map((it, idx) => ({
              id: idx + 1,
              name: it.title,
              from: it.fromPeriod,
              to: it.toPeriod,
              amount: String(it.amount)
            })) : []
          });
        }
      } catch (err) {
        console.warn('API fetch single receipt notice:', err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchReceiptApi();
  }, [id, receipts]);

  const targetReceipt = receiptData || {
    bookNo: '1',
    receiptNo: '181',
    date: new Date().toISOString().split('T')[0],
    receivedFrom: residentDetails.name,
    flatShopNo: residentDetails.flatNo || 'Flat A-302',
    paymentMode: 'Cash',
    refNo: 'CHK-492018',
    drawnOn: 'State Bank of India',
    totalAmount: 4850,
    sumInWords: 'Four Thousand Eight Hundred Fifty Rupees Only',
    particulars: DEFAULT_PARTICULARS
  };

  const lineItems = (targetReceipt.particulars && targetReceipt.particulars.length > 0)
    ? targetReceipt.particulars
    : (targetReceipt.items ? targetReceipt.items.map((it, idx) => ({
        id: idx + 1,
        name: it.title,
        from: it.fromPeriod,
        to: it.toPeriod,
        amount: String(it.amount)
      })) : DEFAULT_PARTICULARS);

  // PDF Streaming Handler
  const handleDownloadPDF = () => {
    const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';
    const token = localStorage.getItem('coop365_token');
    const targetId = targetReceipt._id || targetReceipt.id || id;

    if (targetId && typeof targetId === 'string' && targetId.length > 10 && !targetId.startsWith('rcpt_')) {
      window.open(`${API_URL}/api/v1/receipts/${targetId}/pdf?token=${token}`, '_blank');
    } else {
      window.print();
    }
  };

  const handlePrint = () => {
    window.print();
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: `Receipt #${targetReceipt.receiptNo}`,
          text: `Coop 365 Payment Receipt Voucher #${targetReceipt.receiptNo} for ${targetReceipt.receivedFrom}`,
          url: window.location.href,
        });
      } catch (err) {}
    } else {
      navigator.clipboard.writeText(window.location.href);
      alert('Receipt link copied to clipboard!');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#e5e7eb] flex items-center justify-center">
        <div className="bg-white p-8 rounded-2xl shadow-md flex items-center space-x-3">
          <Loader2 className="w-6 h-6 text-[#5a32fa] animate-spin" />
          <span className="text-sm font-bold text-gray-700">Loading Receipt Voucher from database...</span>
        </div>
      </div>
    );
  }

  /* ── shared receipt paper (used in both mobile + desktop) ── */
  const ReceiptPaper = () => (
    <div className="bg-white p-[6px] border border-gray-400 shadow-xl w-full">
      <div className="border border-gray-400 p-3 font-sans text-black">

        {/* ── HEADER ── */}
        <div className="flex items-start justify-between mb-3">
          <div className="flex flex-col items-center shrink-0 w-[40px] mr-2">
            <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-blue-500 via-green-400 to-yellow-400 p-[2px]">
              <div className="w-full h-full bg-white rounded-full flex items-center justify-center">
                <div className="w-5 h-5 rounded-full bg-gradient-to-br from-red-500 to-blue-600 flex items-center justify-center text-white font-bold" style={{fontSize:'5px'}}>
                  365
                </div>
              </div>
            </div>
            <p className="text-[5px] font-bold text-blue-800 text-center leading-tight mt-0.5">COOP365<br/>APP</p>
          </div>
          <div className="text-center flex-1">
            <p className="text-[9px] font-bold leading-tight mb-0.5">{residentDetails.societyName}</p>
            <p className="text-[7px] text-gray-600 leading-tight">{residentDetails.address}</p>
            <p className="text-[6px] text-gray-500 leading-tight">Email: {residentDetails.email} | Phone: {residentDetails.phone || '+91 98221 23456'}</p>
            <div className="flex flex-wrap justify-between mt-1 text-[6.5px]">
              <span className="font-bold">Reg. No: {residentDetails.registrationNo}</span>
              <span className="font-bold">PAN: {residentDetails.panNo || 'AAAAA0000A'}</span>
              <span className="font-bold">GSTIN: {residentDetails.gstNo || '30AAAAA0000A1Z5'}</span>
              <span className="font-bold">Date : {targetReceipt.date}</span>
            </div>
          </div>
        </div>

        <hr className="border-gray-400 mb-2" />

        {/* ── No & RECEIPT badge ── */}
        <div className="flex justify-between items-center mb-2">
          <p className="text-[8px] font-bold">No. <span className="text-red-500">{targetReceipt.bookNo || '1'} / {targetReceipt.receiptNo}</span></p>
          <div className="border border-black px-2 py-0.5 text-[7px] font-bold tracking-widest">RECEIPT</div>
        </div>

        {/* ── Payer ── */}
        <div className="space-y-1.5 text-[7px] mb-2">
          <div className="flex items-end">
            <span className="font-bold mr-1 whitespace-nowrap">Received from Mr./Mrs.</span>
            <span className="flex-1 border-b border-black pb-[1px] px-1 font-bold">{targetReceipt.receivedFrom}</span>
          </div>
          <div className="flex items-start gap-x-2">
            <div className="flex items-end shrink-0">
              <span className="font-bold mr-1 whitespace-nowrap">Flat / Shop No.</span>
              <span className="border-b border-black pb-[1px] px-1 w-16 font-bold">{targetReceipt.flatNo || targetReceipt.flatShopNo}</span>
            </div>
            <div className="flex items-end flex-1">
              <span className="font-bold mr-1 whitespace-nowrap">Sum of Rupees</span>
              <div className="flex-1">
                <div className="border-b border-black pb-[1px] px-1 leading-tight font-semibold">{targetReceipt.sumInWords}</div>
              </div>
            </div>
          </div>
          <p className="italic text-[7px]">towards following.</p>
        </div>

        {/* ── Particulars Table ── */}
        <div className="border border-gray-400 mb-2">
          <table className="w-full border-collapse text-[7px]">
            <thead className="bg-gray-100 border-b border-gray-400">
              <tr>
                <th className="py-1 px-1 text-left font-bold border-r border-gray-300 w-4">#</th>
                <th className="py-1 px-1 text-left font-bold border-r border-gray-300">Particulars</th>
                <th className="py-1 px-1 text-center font-bold border-r border-gray-300 w-12">From</th>
                <th className="py-1 px-1 text-center font-bold border-r border-gray-300 w-12">To</th>
                <th className="py-1 px-1 text-right font-bold w-14">Amount (Rs.)</th>
              </tr>
            </thead>
            <tbody>
              {lineItems.map((p, i) => (
                <tr key={p.id || i} className="border-b border-gray-200 last:border-b-0">
                  <td className="py-0.5 px-1 border-r border-gray-200">{i + 1}.</td>
                  <td className={`py-0.5 px-1 border-r border-gray-200 ${p.amount ? 'font-bold' : ''}`}>{p.name || p.title}</td>
                  <td className="py-0.5 px-1 text-center border-r border-gray-200">{p.from || p.fromPeriod || <X />}</td>
                  <td className="py-0.5 px-1 text-center border-r border-gray-200">{p.to || p.toPeriod || <X />}</td>
                  <td className="py-0.5 px-1 text-right">{p.amount ? parseFloat(p.amount).toFixed(2) : <span className="flex justify-end"><X /></span>}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* ── Payment & Total ── */}
        <div className="flex justify-between items-start gap-3 mb-2">
          <div className="space-y-1 text-[7px] flex-1">
            <div className="flex items-end">
              <span className="font-bold mr-1 whitespace-nowrap">Mode / Ref No.:</span>
              <span className="flex-1 border-b border-black pb-[1px] px-1">{targetReceipt.paymentMode} ({targetReceipt.refNo || targetReceipt.cashChequeNo || 'N/A'})</span>
            </div>
            <div className="flex items-end">
              <span className="font-bold mr-1 whitespace-nowrap">Drawn on:</span>
              <span className="flex-1 border-b border-black pb-[1px] px-1">{targetReceipt.drawnOn || 'Bank / App'}</span>
            </div>
            <div className="flex items-end">
              <span className="font-bold mr-1 whitespace-nowrap">Date:</span>
              <span className="w-24 border-b border-black pb-[1px] px-1">{targetReceipt.paymentDate || targetReceipt.date}</span>
            </div>
          </div>
          <div className="border border-black p-1.5 text-right shrink-0 min-w-[85px]">
            <p className="text-[5.5px] text-gray-500">Total Rs.</p>
            <p className="text-[10px] font-bold">Rs. {parseFloat(targetReceipt.totalAmount || 0).toFixed(2)}</p>
          </div>
        </div>

        {/* ── Bank Details & QR Code Box (Mobile Paper) ── */}
        <div className="border border-gray-300 bg-gray-50 p-2 rounded mb-2 flex items-center justify-between gap-2">
          <div className="text-[6px] space-y-0.5 flex-1">
            <p className="font-bold text-[#5a32fa] uppercase">Society Bank & UPI Details:</p>
            <p><span className="font-semibold">Bank:</span> {residentDetails.bankName || 'State Bank of India'} ({residentDetails.branchName || 'Panaji'})</p>
            <p><span className="font-semibold">A/C No:</span> {residentDetails.accountNo || '38492019482'} | <span className="font-semibold">IFSC:</span> {residentDetails.ifscCode || 'SBIN0001234'}</p>
            <p className="font-semibold text-indigo-700">UPI ID: {residentDetails.upiId || 'mandovi.society@sbi'}</p>
          </div>
          <div className="shrink-0 text-center">
            <img 
              src={residentDetails.qrCodeUrl || `https://api.qrserver.com/v1/create-qr-code/?size=100x100&data=${encodeURIComponent(`upi://pay?pa=${residentDetails.upiId || 'mandovi.society@sbi'}&pn=${encodeURIComponent(residentDetails.societyName)}&cu=INR`)}`}
              alt="UPI QR"
              className="w-12 h-12 object-contain border border-gray-300 bg-white p-0.5 rounded"
            />
            <p className="text-[5px] font-bold text-gray-600 mt-0.5">Scan to Pay</p>
          </div>
        </div>

        {/* ── Signatures ── */}
        <div className="mt-4 flex justify-between items-end">
          <p className="text-[6px] text-gray-400 italic">*Cheque subject to Realisation.</p>
          <div className="text-right text-[7px]">
            <p className="font-bold mb-4">{residentDetails.authorisedSignature || `For ${residentDetails.societyName}`}</p>
            <div className="border-t border-black w-28 ml-auto mb-0.5"></div>
            <p className="font-bold">Authorised Signature</p>
          </div>
        </div>

      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#e5e7eb] flex flex-col">

      {/* ── MOBILE LAYOUT ── */}
      <div className="md:hidden flex flex-col h-screen overflow-hidden">
        <div className="bg-white px-4 py-4 flex justify-between items-center shadow-sm shrink-0">
          <div className="flex items-center space-x-4">
            <button onClick={() => navigate(-1)} className="p-1 -ml-1">
              <ArrowLeft size={22} className="text-gray-800" />
            </button>
            <span className="text-[18px] font-bold text-gray-900">Receipt #{targetReceipt.receiptNo}</span>
          </div>
          <button onClick={handlePrint} className="p-1 text-gray-700 hover:text-black">
            <Printer size={22} />
          </button>
        </div>

        <div className="flex-1 bg-[#d4d6db] p-4 overflow-y-auto flex items-start">
          <ReceiptPaper />
        </div>

        <div className="fixed bottom-0 left-0 right-0 bg-[#4a3aff] flex justify-around items-center py-3.5 z-50">
          <button onClick={handlePrint} className="flex flex-col items-center text-white text-xs font-semibold">
            <Printer size={20} className="mb-0.5" />
            <span>Print</span>
          </button>
          <button onClick={handleDownloadPDF} className="flex flex-col items-center text-white text-xs font-semibold">
            <Download size={20} className="mb-0.5" />
            <span>PDF</span>
          </button>
          <button onClick={handleShare} className="flex flex-col items-center text-white text-xs font-semibold">
            <Share2 size={20} className="mb-0.5" />
            <span>Share</span>
          </button>
        </div>
      </div>

      {/* ── DESKTOP LAYOUT ── */}
      <div className="hidden md:flex flex-col items-center pb-12">
        <div className="w-full max-w-5xl flex justify-between items-center px-8 py-6">
          <button onClick={() => navigate(-1)} className="flex items-center text-gray-500 hover:text-gray-900 font-semibold transition-colors">
            <ArrowLeft size={20} className="mr-2" /> Back to History
          </button>
          <div className="flex space-x-3">
            <button onClick={handlePrint} className="px-4 py-2.5 bg-white border border-gray-300 rounded-xl text-gray-700 font-semibold flex items-center hover:bg-gray-50 transition-all shadow-sm">
              <Printer size={18} className="mr-2" /> Print
            </button>
            <button onClick={handleDownloadPDF} className="px-4 py-2.5 bg-white border border-gray-300 rounded-xl text-gray-700 font-semibold flex items-center hover:bg-gray-50 transition-all shadow-sm">
              <Download size={18} className="mr-2" /> Download PDF
            </button>
            <button onClick={handleShare} className="px-4 py-2.5 bg-[#5a32fa] text-white rounded-xl font-semibold flex items-center hover:bg-[#4826d1] transition-all shadow-lg shadow-[#5a32fa]/20">
              <Share2 size={18} className="mr-2" /> Share Receipt
            </button>
          </div>
        </div>

        <div className="w-full max-w-4xl px-8">
          <div className="[&_td]:!text-xs [&_th]:!text-xs [&_p]:!text-xs [&_span]:!text-xs [&_.society-name]:!text-[22px] bg-white p-2 border border-gray-400 shadow-xl">
            <div className="border border-gray-400 p-10 font-sans text-black">

              {/* Desktop header */}
              <div className="flex items-start justify-between mb-6">
                <div className="flex flex-col items-center shrink-0 w-24 mr-4">
                  <div className="w-16 h-16 rounded-full bg-gradient-to-tr from-blue-500 via-green-400 to-yellow-400 p-1">
                    <div className="w-full h-full bg-white rounded-full flex items-center justify-center">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-red-500 to-blue-600 flex items-center justify-center text-white text-[10px] font-bold">365</div>
                    </div>
                  </div>
                  <p className="text-[9px] font-bold text-blue-800 text-center leading-tight mt-1">COOP 365<br/>APP</p>
                </div>
                <div className="text-center flex-1">
                  <p className="text-[22px] font-bold mb-1">{residentDetails.societyName}</p>
                  <p className="text-sm text-gray-700 mb-0.5">{residentDetails.address}</p>
                  <p className="text-xs text-gray-500">Email: {residentDetails.email} | Phone: {residentDetails.phone || '+91 98221 23456'}</p>
                  <div className="flex justify-between items-center mt-4 text-xs font-bold px-2">
                    <span>Reg. No: {residentDetails.registrationNo}</span>
                    <span>PAN: {residentDetails.panNo || 'AAAAA0000A'}</span>
                    <span>GSTIN: {residentDetails.gstNo || '30AAAAA0000A1Z5'}</span>
                    <span>Date: {targetReceipt.date}</span>
                  </div>
                </div>
              </div>
              <hr className="border-gray-400 mb-4" />
              <div className="flex justify-between items-center mb-6 text-lg">
                <p className="font-bold">No. <span className="text-red-500">{targetReceipt.bookNo || '1'} / {targetReceipt.receiptNo}</span></p>
                <div className="border border-black px-6 py-1.5 text-base font-bold tracking-widest">RECEIPT</div>
              </div>
              <div className="space-y-4 text-sm mb-6">
                <div className="flex items-end">
                  <span className="font-bold mr-2">Received from Mr./Mrs.</span>
                  <span className="flex-1 border-b border-black pb-0.5 px-2 font-bold">{targetReceipt.receivedFrom}</span>
                </div>
                <div className="flex items-end gap-6">
                  <div className="flex items-end">
                    <span className="font-bold mr-2 whitespace-nowrap">Flat / Shop No.</span>
                    <span className="w-32 border-b border-black pb-0.5 px-2 font-bold">{targetReceipt.flatNo || targetReceipt.flatShopNo}</span>
                  </div>
                  <div className="flex items-end flex-1">
                    <span className="font-bold mr-2 whitespace-nowrap">Sum of Rupees</span>
                    <div className="flex-1">
                      <div className="border-b border-black pb-0.5 px-2 font-semibold">{targetReceipt.sumInWords}</div>
                    </div>
                  </div>
                </div>
                <p className="italic">towards following.</p>
              </div>
              <div className="border border-gray-400 mb-6">
                <table className="w-full border-collapse text-sm">
                  <thead className="bg-gray-100 border-b border-gray-400">
                    <tr>
                      <th className="py-2 px-3 text-left font-bold border-r border-gray-300 w-10">#</th>
                      <th className="py-2 px-4 text-left font-bold border-r border-gray-300">Particulars</th>
                      <th className="py-2 px-3 text-center font-bold border-r border-gray-300 w-28">From</th>
                      <th className="py-2 px-3 text-center font-bold border-r border-gray-300 w-28">To</th>
                      <th className="py-2 px-4 text-right font-bold w-32">Amount (Rs.)</th>
                    </tr>
                  </thead>
                  <tbody>
                    {lineItems.map((p, i) => (
                      <tr key={p.id || i} className="border-b border-gray-200 last:border-b-0">
                        <td className="py-2 px-3 border-r border-gray-200">{i + 1}.</td>
                        <td className={`py-2 px-4 border-r border-gray-200 ${p.amount ? 'font-bold' : ''}`}>{p.name || p.title}</td>
                        <td className="py-2 px-3 text-center border-r border-gray-200">{p.from || p.fromPeriod || <X />}</td>
                        <td className="py-2 px-3 text-center border-r border-gray-200">{p.to || p.toPeriod || <X />}</td>
                        <td className="py-2 px-4 text-right">{p.amount ? parseFloat(p.amount).toFixed(2) : <span className="flex justify-end"><X /></span>}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div className="flex justify-between items-start gap-8 mb-4">
                <div className="space-y-3 text-sm flex-1">
                  <div className="flex items-end"><span className="font-bold mr-2 whitespace-nowrap">Mode / Ref No.:</span><span className="flex-1 border-b border-black pb-0.5 px-2">{targetReceipt.paymentMode} ({targetReceipt.refNo || targetReceipt.cashChequeNo || 'N/A'})</span></div>
                  <div className="flex items-end"><span className="font-bold mr-2 whitespace-nowrap">Drawn on:</span><span className="flex-1 border-b border-black pb-0.5 px-2">{targetReceipt.drawnOn || 'Bank / App'}</span></div>
                  <div className="flex items-end"><span className="font-bold mr-2 whitespace-nowrap">Date:</span><span className="w-32 border-b border-black pb-0.5 px-2">{targetReceipt.paymentDate || targetReceipt.date}</span></div>
                </div>
                <div className="border border-black p-3 min-w-[160px] shrink-0">
                  <p className="text-xs text-gray-500 mb-1">Total Rs.</p>
                  <p className="text-2xl font-bold">Rs. {parseFloat(targetReceipt.totalAmount || 0).toFixed(2)}</p>
                </div>
              </div>

              {/* Desktop Bank Details & QR Code Block */}
              <div className="border border-gray-300 bg-gray-50 p-4 rounded-xl mb-6 flex items-center justify-between gap-4">
                <div className="space-y-1 text-xs flex-1">
                  <p className="font-bold text-[#5a32fa] uppercase text-xs">Society Bank & UPI Remittance Details:</p>
                  <p><span className="font-semibold text-gray-700">Account Holder:</span> {residentDetails.accountName || residentDetails.societyName}</p>
                  <p><span className="font-semibold text-gray-700">Bank & Branch:</span> {residentDetails.bankName || 'State Bank of India'} ({residentDetails.branchName || 'Panaji Branch'})</p>
                  <p><span className="font-semibold text-gray-700">Account No:</span> <span className="font-mono font-bold text-gray-900">{residentDetails.accountNo || '38492019482'}</span> | <span className="font-semibold text-gray-700">IFSC Code:</span> <span className="font-mono font-bold text-gray-900">{residentDetails.ifscCode || 'SBIN0001234'}</span></p>
                  <p><span className="font-semibold text-gray-700">Official UPI ID:</span> <span className="font-mono font-bold text-indigo-700">{residentDetails.upiId || 'mandovi.society@sbi'}</span></p>
                </div>
                <div className="shrink-0 text-center">
                  <img 
                    src={residentDetails.qrCodeUrl || `https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${encodeURIComponent(`upi://pay?pa=${residentDetails.upiId || 'mandovi.society@sbi'}&pn=${encodeURIComponent(residentDetails.societyName)}&cu=INR`)}`}
                    alt="UPI Payment QR Code"
                    className="w-20 h-20 object-contain border border-gray-300 bg-white p-1 rounded-lg shadow-sm"
                  />
                  <p className="text-[10px] font-bold text-gray-600 mt-1">Scan to Pay via UPI</p>
                </div>
              </div>

              <div className="mt-12 flex justify-between items-end">
                <p className="text-xs text-gray-400 italic">*Cheque subject to Realisation.</p>
                <div className="text-right text-sm">
                  <p className="font-bold mb-12">{residentDetails.authorisedSignature || `For ${residentDetails.societyName}`}</p>
                  <div className="border-t border-black w-48 ml-auto mb-1"></div>
                  <p className="font-bold">Authorised Signature</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

    </div>
  );
};

export default ReceiptDetail;
