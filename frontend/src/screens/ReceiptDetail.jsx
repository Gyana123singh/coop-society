import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Printer, Share2, Download } from 'lucide-react';

/* ─── tiny crossed-box for empty cells ─── */
const X = () => (
  <svg width="10" height="10" viewBox="0 0 10 10" className="inline-block">
    <rect x="0.5" y="0.5" width="9" height="9" stroke="black" strokeWidth="1" fill="none" />
    <line x1="0.5" y1="0.5" x2="9.5" y2="9.5" stroke="black" strokeWidth="1" />
    <line x1="9.5" y1="0.5" x2="0.5" y2="9.5" stroke="black" strokeWidth="1" />
  </svg>
);

const PARTICULARS = [
  { id: 1, name: "Maintenance Charges",          from: "Apr 2026", to: "Jun 2026", amount: "3500.00" },
  { id: 2, name: "Sinking Fund",                 from: "Apr 2026", to: "Jun 2026", amount: "1200.00" },
  { id: 3, name: "Non Occupancy Charges / Rental", from: "", to: "", amount: "" },
  { id: 4, name: "Parking Charges",              from: "", to: "", amount: "" },
  { id: 5, name: "Transfer Fee",                 from: "", to: "", amount: "" },
  { id: 6, name: "Transfer Premium",             from: "", to: "", amount: "" },
  { id: 7, name: "Entrance Fee",                 from: "", to: "", amount: "" },
  { id: 8, name: "Interest",                     from: "", to: "", amount: "150.00" },
  { id: 9, name: "Arrears",                      from: "", to: "", amount: "" },
  { id: 10,name: "Event / Festival Fund",        from: "", to: "", amount: "" },
  { id: 11,name: "Miscellaneous",                from: "", to: "", amount: "" },
];

const ReceiptDetail = () => {
  const navigate = useNavigate();

  /* ── shared receipt paper (used in both mobile + desktop) ── */
  const ReceiptPaper = () => (
    <div className="bg-white p-[6px] border border-gray-400 shadow-xl w-full">
      <div className="border border-gray-400 p-3 font-sans text-black">

        {/* ── HEADER ── */}
        <div className="flex items-start justify-between mb-3">
          {/* Logo */}
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
          {/* Society name */}
          <div className="text-center flex-1">
            <p className="text-[9px] font-bold leading-tight mb-0.5">Mandovi Nagar Co-Op. Housing Society Ltd.,</p>
            <p className="text-[7px] text-gray-600 leading-tight">Dada Vaidya Road, Panaji - Goa.</p>
            <p className="text-[6px] text-gray-500 leading-tight">Email: secretary@mandovinagar.org | Phone: +91 98221 23456</p>
            <div className="flex justify-between mt-1.5 text-[7px]">
              <span className="font-bold">Reg. No: HSG-(a)-70/GOA</span>
              <span className="font-bold">Date : 14/08/2026</span>
            </div>
          </div>
        </div>

        <hr className="border-gray-400 mb-2" />

        {/* ── No & RECEIPT badge ── */}
        <div className="flex justify-between items-center mb-2">
          <p className="text-[8px] font-bold">No. <span className="text-red-500">1 / 181</span></p>
          <div className="border border-black px-2 py-0.5 text-[7px] font-bold tracking-widest">RECEIPT</div>
        </div>

        {/* ── Payer ── */}
        <div className="space-y-1.5 text-[7px] mb-2">
          <div className="flex items-end">
            <span className="font-bold mr-1 whitespace-nowrap">Received from Mr./Mrs.</span>
            <span className="flex-1 border-b border-black pb-[1px] px-1">Mr. Rahul Sharma</span>
          </div>
          <div className="flex items-start gap-x-2">
            <div className="flex items-end shrink-0">
              <span className="font-bold mr-1 whitespace-nowrap">Flat / Shop No.</span>
              <span className="border-b border-black pb-[1px] px-1 w-14">Flat A-302</span>
            </div>
            <div className="flex items-end flex-1">
              <span className="font-bold mr-1 whitespace-nowrap">Sum of Rupees</span>
              <div className="flex-1">
                <div className="border-b border-black pb-[1px] px-1 leading-tight">Four Thousand Eight Hundred Fifty</div>
                <div className="border-b border-black pb-[1px] px-1 leading-tight">Rupees Only</div>
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
              {PARTICULARS.map((p, i) => (
                <tr key={p.id} className="border-b border-gray-200 last:border-b-0">
                  <td className="py-0.5 px-1 border-r border-gray-200">{i + 1}.</td>
                  <td className={`py-0.5 px-1 border-r border-gray-200 ${p.amount ? 'font-bold' : ''}`}>{p.name}</td>
                  <td className="py-0.5 px-1 text-center border-r border-gray-200">{p.from || <X />}</td>
                  <td className="py-0.5 px-1 text-center border-r border-gray-200">{p.to || <X />}</td>
                  <td className="py-0.5 px-1 text-right">{p.amount || <span className="flex justify-end"><X /></span>}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* ── Payment & Total ── */}
        <div className="flex justify-between items-start gap-3 mb-2">
          <div className="space-y-1.5 text-[7px] flex-1">
            <div className="flex items-end">
              <span className="font-bold mr-1 whitespace-nowrap">Cheque No.:</span>
              <span className="flex-1 border-b border-black pb-[1px] px-1">CHK-492018</span>
            </div>
            <div className="flex items-end">
              <span className="font-bold mr-1 whitespace-nowrap">Drawn on:</span>
              <span className="flex-1 border-b border-black pb-[1px] px-1">State Bank of India</span>
            </div>
            <div className="flex items-end">
              <span className="font-bold mr-1 whitespace-nowrap">Date:</span>
              <span className="w-24 border-b border-black pb-[1px] px-1">14/08/2026</span>
            </div>
          </div>
          <div className="border border-black p-2 text-right shrink-0 min-w-[90px]">
            <p className="text-[6px] text-gray-500">Total Rs.</p>
            <p className="text-[11px] font-bold">Rs. 4850.00</p>
          </div>
        </div>

        {/* ── Signatures ── */}
        <div className="mt-10 flex justify-between items-end">
          <p className="text-[6px] text-gray-400 italic">*Cheque subject to Realisation.</p>
          <div className="text-right text-[7px]">
            <p className="font-bold mb-5">For Mandovi Nagar Co-Op. Housing Society Ltd.,</p>
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
        
        {/* Top bar */}
        <div className="bg-white px-4 py-4 flex justify-between items-center shadow-sm shrink-0">
          <div className="flex items-center space-x-4">
            <button onClick={() => navigate(-1)} className="p-1 -ml-1">
              <ArrowLeft size={22} className="text-gray-800" />
            </button>
            <span className="text-[18px] font-bold text-gray-900">Receipt #181 PDF</span>
          </div>
          <button className="p-1">
            <Printer size={22} className="text-gray-700" />
          </button>
        </div>

        {/* Grey background, non-scrollable receipt area */}
        <div className="flex-1 bg-[#d4d6db] p-4 overflow-hidden flex items-start">
          <ReceiptPaper />
        </div>

        {/* Bottom action bar - solid blue-purple bar */}
        <div className="fixed bottom-0 left-0 right-0 bg-[#4a3aff] flex justify-around items-center py-4 z-50">
          <button className="flex flex-col items-center text-white">
            <Printer size={22} />
          </button>
          <button className="flex flex-col items-center text-white">
            <Share2 size={22} />
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
            <button className="px-4 py-2.5 bg-white border border-gray-300 rounded-xl text-gray-700 font-medium flex items-center hover:bg-gray-50 transition-colors shadow-sm">
              <Printer size={18} className="mr-2" /> Print
            </button>
            <button className="px-4 py-2.5 bg-white border border-gray-300 rounded-xl text-gray-700 font-medium flex items-center hover:bg-gray-50 transition-colors shadow-sm">
              <Download size={18} className="mr-2" /> Download PDF
            </button>
            <button className="px-4 py-2.5 bg-[#5a32fa] text-white rounded-xl font-medium flex items-center hover:bg-[#4826d1] transition-colors shadow-lg shadow-[#5a32fa]/20">
              <Share2 size={18} className="mr-2" /> Share Receipt
            </button>
          </div>
        </div>
        <div className="w-full max-w-4xl px-8">
          {/* Desktop receipt uses bigger fonts via a wrapper override */}
          <div className="[&_td]:!text-xs [&_th]:!text-xs [&_p]:!text-xs [&_span]:!text-xs [&_.society-name]:!text-[22px] bg-white p-2 border border-gray-400 shadow-xl">
            <div className="border border-gray-400 p-10 font-sans text-black">

              {/* Desktop header - full size */}
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
                  <p className="text-[22px] font-bold mb-1">Mandovi Nagar Co-Op. Housing Society Ltd.,</p>
                  <p className="text-sm text-gray-700 mb-0.5">Dada Vaidya Road, Panaji - Goa.</p>
                  <p className="text-xs text-gray-500">Email: secretary@mandovinagar.org | Phone: +91 98221 23456</p>
                  <div className="flex justify-between mt-4 text-sm px-4">
                    <span className="font-bold">Reg. No: HSG-(a)-70/GOA</span>
                    <span className="font-bold">Date : 14/08/2026</span>
                  </div>
                </div>
              </div>
              <hr className="border-gray-400 mb-4" />
              <div className="flex justify-between items-center mb-6 text-lg">
                <p className="font-bold">No. <span className="text-red-500">1 / 181</span></p>
                <div className="border border-black px-6 py-1.5 text-base font-bold tracking-widest">RECEIPT</div>
              </div>
              <div className="space-y-4 text-sm mb-6">
                <div className="flex items-end">
                  <span className="font-bold mr-2">Received from Mr./Mrs.</span>
                  <span className="flex-1 border-b border-black pb-0.5 px-2">Mr. Rahul Sharma</span>
                </div>
                <div className="flex items-end gap-6">
                  <div className="flex items-end">
                    <span className="font-bold mr-2 whitespace-nowrap">Flat / Shop No.</span>
                    <span className="w-28 border-b border-black pb-0.5 px-2">Flat A-302</span>
                  </div>
                  <div className="flex items-end flex-1">
                    <span className="font-bold mr-2 whitespace-nowrap">Sum of Rupees</span>
                    <div className="flex-1">
                      <div className="border-b border-black pb-0.5 px-2">Four Thousand Eight Hundred Fifty</div>
                      <div className="border-b border-black pb-0.5 px-2">Rupees Only</div>
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
                    {PARTICULARS.map((p, i) => (
                      <tr key={p.id} className="border-b border-gray-200 last:border-b-0">
                        <td className="py-2 px-3 border-r border-gray-200">{i + 1}.</td>
                        <td className={`py-2 px-4 border-r border-gray-200 ${p.amount ? 'font-bold' : ''}`}>{p.name}</td>
                        <td className="py-2 px-3 text-center border-r border-gray-200">{p.from || <X />}</td>
                        <td className="py-2 px-3 text-center border-r border-gray-200">{p.to || <X />}</td>
                        <td className="py-2 px-4 text-right">{p.amount || <span className="flex justify-end"><X /></span>}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div className="flex justify-between items-start gap-8 mb-4">
                <div className="space-y-3 text-sm flex-1">
                  <div className="flex items-end"><span className="font-bold mr-2 whitespace-nowrap">Cheque No.:</span><span className="flex-1 border-b border-black pb-0.5 px-2">CHK-492018</span></div>
                  <div className="flex items-end"><span className="font-bold mr-2 whitespace-nowrap">Drawn on:</span><span className="flex-1 border-b border-black pb-0.5 px-2">State Bank of India</span></div>
                  <div className="flex items-end"><span className="font-bold mr-2 whitespace-nowrap">Date:</span><span className="w-32 border-b border-black pb-0.5 px-2">14/08/2026</span></div>
                </div>
                <div className="border border-black p-3 min-w-[160px] shrink-0">
                  <p className="text-xs text-gray-500 mb-1">Total Rs.</p>
                  <p className="text-2xl font-bold">Rs. 4850.00</p>
                </div>
              </div>
              <div className="mt-24 flex justify-between items-end">
                <p className="text-xs text-gray-400 italic">*Cheque subject to Realisation.</p>
                <div className="text-right text-sm">
                  <p className="font-bold mb-12">For Mandovi Nagar Co-Op. Housing Society Ltd.,</p>
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
