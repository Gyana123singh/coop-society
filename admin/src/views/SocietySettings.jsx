import React, { useState, useEffect } from 'react';
import { Building2, Save, FileSpreadsheet, Mail, Phone, MapPin, FileText, CreditCard, QrCode, ShieldCheck, Upload } from 'lucide-react';

const SocietySettings = ({ activeVendor, onUpdateVendor }) => {
  const [formData, setFormData] = useState({
    name: activeVendor?.name || 'Mandovi Nagar Co-Op. Housing Society Ltd.',
    address: activeVendor?.address || 'Dada Vaidya Road, Panaji - Goa',
    regNo: activeVendor?.regNo || 'HSG-(a)-70/GOA',
    panNo: activeVendor?.panNo || 'AAAAA0000A',
    gstNo: activeVendor?.gstNo || '30AAAAA0000A1Z5',
    bankName: activeVendor?.bankName || 'State Bank of India',
    accountName: activeVendor?.accountName || 'Mandovi Nagar Co-Op. Housing Society Ltd.',
    accountNo: activeVendor?.accountNo || '38492019482',
    ifscCode: activeVendor?.ifscCode || 'SBIN0001234',
    branchName: activeVendor?.branchName || 'Panaji Branch',
    upiId: activeVendor?.upiId || 'mandovi.society@sbi',
    qrCodeUrl: activeVendor?.qrCodeUrl || '',
    authorisedSignature: activeVendor?.authorisedSignature || 'For Mandovi Nagar Co-Op. Housing Society Ltd.,',
    currentBookNo: activeVendor?.currentBookNo || '1',
    lastReceiptNo: activeVendor?.lastReceiptNo || 180,
    contactEmail: activeVendor?.contactEmail || 'member@mandovinagar.org',
    contactPhone: activeVendor?.contactPhone || '+91 98221 23456'
  });

  useEffect(() => {
    if (activeVendor) {
      setFormData({
        name: activeVendor.name || '',
        address: activeVendor.address || '',
        regNo: activeVendor.regNo || '',
        panNo: activeVendor.panNo || '',
        gstNo: activeVendor.gstNo || '',
        bankName: activeVendor.bankName || '',
        accountName: activeVendor.accountName || '',
        accountNo: activeVendor.accountNo || '',
        ifscCode: activeVendor.ifscCode || '',
        branchName: activeVendor.branchName || '',
        upiId: activeVendor.upiId || '',
        qrCodeUrl: activeVendor.qrCodeUrl || '',
        authorisedSignature: activeVendor.authorisedSignature || `For ${activeVendor.name || 'Housing Society'}`,
        currentBookNo: activeVendor.currentBookNo || '1',
        lastReceiptNo: activeVendor.lastReceiptNo || 0,
        contactEmail: activeVendor.contactEmail || '',
        contactPhone: activeVendor.contactPhone || ''
      });
    }
  }, [activeVendor]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!activeVendor?._id) {
      alert('No active society selected to update.');
      return;
    }
    const generatedQr = `https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=${encodeURIComponent(`upi://pay?pa=${formData.upiId || 'mandovi.society@sbi'}&pn=${encodeURIComponent(formData.name || 'Society')}&cu=INR`)}`;
    const payloadToSave = {
      ...formData,
      qrCodeUrl: formData.qrCodeUrl || generatedQr
    };
    onUpdateVendor(activeVendor._id, payloadToSave);
    alert(`Society details & UPI Payment QR Code saved successfully!`);
  };

  const previewQrUrl = formData.qrCodeUrl || `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(`upi://pay?pa=${formData.upiId || 'mandovi.society@sbi'}&pn=${encodeURIComponent(formData.name || 'Society')}&cu=INR`)}`;

  return (
    <div className="space-y-6 max-w-4xl font-sans">
      <div>
        <h2 className="text-xl font-bold text-white tracking-tight flex items-center space-x-2">
          <Building2 className="w-5 h-5 text-indigo-400" />
          <span>Housing Society / Business Settings</span>
        </h2>
        <p className="text-xs text-slate-400 mt-0.5">
          Configure legal name, PAN/GST slots, official contact details, bank remittance accounts & QR code for resident users.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-6 text-xs">
        
        {/* Basic & Address Details */}
        <div className="space-y-4">
          <h3 className="text-sm font-bold text-white flex items-center space-x-2 border-b border-slate-800 pb-2">
            <Building2 className="w-4 h-4 text-indigo-400" />
            <span>Society Legal Profile & Contact</span>
          </h3>

          <div>
            <label className="block text-slate-300 mb-1 font-semibold">Society / Business Legal Name *</label>
            <input
              type="text"
              required
              value={formData.name}
              onChange={e => setFormData({ ...formData, name: e.target.value })}
              placeholder="e.g. Mandovi Nagar Co-Op. Housing Society Ltd."
              className="w-full p-3 bg-slate-950 rounded-xl border border-slate-800 text-white font-bold focus:outline-none focus:border-indigo-500 transition-all text-sm"
            />
          </div>

          <div>
            <label className="block text-slate-300 mb-1 font-semibold flex items-center space-x-1">
              <MapPin className="w-3.5 h-3.5 text-indigo-400" />
              <span>Full Address *</span>
            </label>
            <input
              type="text"
              required
              value={formData.address}
              onChange={e => setFormData({ ...formData, address: e.target.value })}
              placeholder="e.g. Dada Vaidya Road, Panaji - Goa"
              className="w-full p-3 bg-slate-950 rounded-xl border border-slate-800 text-white focus:outline-none focus:border-indigo-500 transition-all"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-slate-300 mb-1 font-semibold flex items-center space-x-1">
                <Mail className="w-3.5 h-3.5 text-indigo-400" />
                <span>Official Contact Email</span>
              </label>
              <input
                type="email"
                value={formData.contactEmail}
                onChange={e => setFormData({ ...formData, contactEmail: e.target.value })}
                placeholder="member@mandovinagar.org"
                className="w-full p-2.5 bg-slate-950 rounded-xl border border-slate-800 text-white focus:outline-none focus:border-indigo-500"
              />
            </div>

            <div>
              <label className="block text-slate-300 mb-1 font-semibold flex items-center space-x-1">
                <Phone className="w-3.5 h-3.5 text-indigo-400" />
                <span>Official Contact Phone</span>
              </label>
              <input
                type="text"
                value={formData.contactPhone}
                onChange={e => setFormData({ ...formData, contactPhone: e.target.value })}
                placeholder="+91 98221 23456"
                className="w-full p-2.5 bg-slate-950 rounded-xl border border-slate-800 text-white focus:outline-none focus:border-indigo-500"
              />
            </div>
          </div>
        </div>

        {/* Tax & Registration Slots (Reg No & GSTIN) */}
        <div className="pt-2 space-y-4">
          <h3 className="text-sm font-bold text-white flex items-center space-x-2 border-b border-slate-800 pb-2">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>Tax & Legal Registration Slots (Reg. No. & GSTIN)</span>
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-slate-300 mb-1 font-semibold">Society Reg. No. *</label>
              <input
                type="text"
                required
                value={formData.regNo}
                onChange={e => setFormData({ ...formData, regNo: e.target.value })}
                placeholder="HSG-(a)-70/GOA"
                className="w-full p-2.5 bg-slate-950 rounded-xl border border-slate-800 text-white focus:outline-none focus:border-indigo-500 font-mono"
              />
            </div>

            <div>
              <label className="block text-slate-300 mb-1 font-semibold">GST Registration No. (GSTIN) *</label>
              <input
                type="text"
                required
                value={formData.gstNo}
                onChange={e => setFormData({ ...formData, gstNo: e.target.value.toUpperCase() })}
                placeholder="30AAAAA0000A1Z5"
                className="w-full p-2.5 bg-slate-950 rounded-xl border border-slate-800 text-white focus:outline-none focus:border-indigo-500 font-mono uppercase"
              />
            </div>
          </div>
        </div>

        {/* Bank & QR Details */}
        <div className="pt-2 space-y-4">
          <h3 className="text-sm font-bold text-white flex items-center space-x-2 border-b border-slate-800 pb-2">
            <CreditCard className="w-4 h-4 text-indigo-400" />
            <span>Bank Account & QR Code Settings (User Side Bottom Section)</span>
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-slate-300 mb-1 font-semibold">Account Holder Name</label>
              <input
                type="text"
                value={formData.accountName}
                onChange={e => setFormData({ ...formData, accountName: e.target.value })}
                placeholder="e.g. Mandovi Nagar Co-Op. Housing Society Ltd."
                className="w-full p-2.5 bg-slate-950 rounded-xl border border-slate-800 text-white focus:outline-none focus:border-indigo-500"
              />
            </div>

            <div>
              <label className="block text-slate-300 mb-1 font-semibold">Bank Name & Branch</label>
              <input
                type="text"
                value={formData.bankName}
                onChange={e => setFormData({ ...formData, bankName: e.target.value })}
                placeholder="e.g. State Bank of India"
                className="w-full p-2.5 bg-slate-950 rounded-xl border border-slate-800 text-white focus:outline-none focus:border-indigo-500"
              />
            </div>

            <div>
              <label className="block text-slate-300 mb-1 font-semibold">Bank Account Number</label>
              <input
                type="text"
                value={formData.accountNo}
                onChange={e => setFormData({ ...formData, accountNo: e.target.value })}
                placeholder="e.g. 38492019482"
                className="w-full p-2.5 bg-slate-950 rounded-xl border border-slate-800 text-white focus:outline-none focus:border-indigo-500 font-mono"
              />
            </div>

            <div>
              <label className="block text-slate-300 mb-1 font-semibold">IFSC Code</label>
              <input
                type="text"
                value={formData.ifscCode}
                onChange={e => setFormData({ ...formData, ifscCode: e.target.value.toUpperCase() })}
                placeholder="e.g. SBIN0001234"
                className="w-full p-2.5 bg-slate-950 rounded-xl border border-slate-800 text-white focus:outline-none focus:border-indigo-500 font-mono uppercase"
              />
            </div>

            <div>
              <label className="block text-slate-300 mb-1 font-semibold flex items-center space-x-1">
                <QrCode className="w-3.5 h-3.5 text-indigo-400" />
                <span>UPI VPA / UPI ID (For Mobile QR Payment) *</span>
              </label>
              <input
                type="text"
                value={formData.upiId}
                onChange={e => {
                  const newUpi = e.target.value;
                  setFormData(prev => {
                    // Only auto-generate QR if custom uploaded image is not set or is an api.qrserver URL
                    const isAuto = !prev.qrCodeUrl || prev.qrCodeUrl.includes('api.qrserver.com');
                    const autoQr = `https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=${encodeURIComponent(`upi://pay?pa=${newUpi}&pn=${encodeURIComponent(prev.name || 'Society')}&cu=INR`)}`;
                    return {
                      ...prev,
                      upiId: newUpi,
                      qrCodeUrl: isAuto ? autoQr : prev.qrCodeUrl
                    };
                  });
                }}
                placeholder="e.g. mandovi.society@sbi"
                className="w-full p-2.5 bg-slate-950 rounded-xl border border-slate-800 text-white focus:outline-none focus:border-indigo-500 font-mono text-sm"
              />
            </div>

            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="block text-slate-300 font-semibold">Custom QR Code Image (Upload File or URL)</label>
                {formData.qrCodeUrl && !formData.qrCodeUrl.includes('api.qrserver.com') && (
                  <button
                    type="button"
                    onClick={() => {
                      const autoQr = `https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=${encodeURIComponent(`upi://pay?pa=${formData.upiId || 'mandovi.society@sbi'}&pn=${encodeURIComponent(formData.name || 'Society')}&cu=INR`)}`;
                      setFormData(prev => ({ ...prev, qrCodeUrl: autoQr }));
                    }}
                    className="text-[10px] text-amber-400 hover:underline font-bold"
                  >
                    Reset to Auto UPI QR
                  </button>
                )}
              </div>
              <div className="flex space-x-2">
                <input
                  type="text"
                  value={formData.qrCodeUrl}
                  onChange={e => setFormData(prev => ({ ...prev, qrCodeUrl: e.target.value }))}
                  placeholder="Paste Image URL or click Upload button ->"
                  className="flex-1 p-2.5 bg-slate-950 rounded-xl border border-slate-800 text-white focus:outline-none focus:border-indigo-500 text-xs font-mono"
                />
                <label className="px-3.5 py-2.5 bg-indigo-600/30 hover:bg-indigo-600/50 active:scale-95 text-indigo-300 rounded-xl border border-indigo-500/30 font-bold text-xs cursor-pointer flex items-center shrink-0 space-x-1.5 transition-all shadow-sm">
                  <Upload className="w-3.5 h-3.5" />
                  <span>{formData.qrCodeUrl && !formData.qrCodeUrl.includes('api.qrserver.com') ? 'Custom QR Active ✓' : 'Upload Custom QR'}</span>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) {
                        const reader = new FileReader();
                        reader.onload = (event) => {
                          const img = new Image();
                          img.onload = () => {
                            const canvas = document.createElement('canvas');
                            let width = img.width;
                            let height = img.height;
                            const maxDim = 400;
                            if (width > maxDim || height > maxDim) {
                              if (width > height) {
                                height = Math.round((height * maxDim) / width);
                                width = maxDim;
                              } else {
                                width = Math.round((width * maxDim) / height);
                                height = maxDim;
                              }
                            }
                            canvas.width = width;
                            canvas.height = height;
                            const ctx = canvas.getContext('2d');
                            ctx.drawImage(img, 0, 0, width, height);
                            const compressedDataUrl = canvas.toDataURL('image/png', 0.85);
                            setFormData(prev => ({ ...prev, qrCodeUrl: compressedDataUrl }));
                            alert(`Custom QR Code image "${file.name}" uploaded and compressed successfully!`);
                          };
                          img.src = event.target.result;
                        };
                        reader.readAsDataURL(file);
                      }
                    }}
                    className="hidden"
                  />
                </label>
              </div>
            </div>
          </div>

          {/* Active Payment QR Code Live Card */}
          <div className="bg-slate-950 border border-slate-800 p-4 rounded-xl flex items-center justify-between gap-4">
            <div className="space-y-1">
              <span className="text-[10px] font-bold text-indigo-400 uppercase tracking-wider flex items-center space-x-1">
                <QrCode className="w-3.5 h-3.5" />
                <span>Active Payment QR Code Preview ({formData.qrCodeUrl && !formData.qrCodeUrl.includes('api.qrserver.com') ? 'Custom Uploaded' : 'Auto UPI'})</span>
              </span>
              <p className="text-xs font-bold text-white">
                UPI ID: <span className="font-mono text-indigo-300">{formData.upiId || 'mandovi.society@sbi'}</span>
              </p>
              <p className="text-[11px] text-slate-400">
                This QR Code will be rendered on all receipt vouchers and on the resident user profile & form fill up screens.
              </p>
            </div>
            <div className="shrink-0 text-center bg-white p-1.5 rounded-xl border border-slate-700 shadow-md">
              <img src={previewQrUrl} alt="Active Payment QR Code" className="w-20 h-20 object-contain" />
            </div>
          </div>
        </div>

        {/* Voucher Sequence & Signature */}
        <div className="pt-2 space-y-4 border-t border-slate-800/80">
          <h3 className="text-sm font-bold text-white flex items-center space-x-2">
            <FileSpreadsheet className="w-4 h-4 text-indigo-400" />
            <span>Receipt Voucher Sequence & Signature</span>
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-slate-300 mb-1 font-semibold">Current Book No.</label>
              <input
                type="text"
                value={formData.currentBookNo}
                onChange={e => setFormData({ ...formData, currentBookNo: e.target.value })}
                className="w-full p-2.5 bg-slate-950 rounded-xl border border-slate-800 text-white font-bold focus:outline-none focus:border-indigo-500"
              />
            </div>

            <div>
              <label className="block text-slate-300 mb-1 font-semibold">Last Receipt No. Counter</label>
              <input
                type="number"
                value={formData.lastReceiptNo}
                onChange={e => setFormData({ ...formData, lastReceiptNo: parseInt(e.target.value, 10) || 0 })}
                className="w-full p-2.5 bg-slate-950 rounded-xl border border-slate-800 text-white font-bold focus:outline-none focus:border-indigo-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-slate-300 mb-1 font-semibold">Authorised Signature Block Text *</label>
            <input
              type="text"
              required
              value={formData.authorisedSignature}
              onChange={e => setFormData({ ...formData, authorisedSignature: e.target.value })}
              className="w-full p-2.5 bg-slate-950 rounded-xl border border-slate-800 text-white focus:outline-none focus:border-indigo-500"
            />
          </div>
        </div>

        {/* User Side Banner & Bottom Preview Box in Admin */}
        <div className="mt-4 pt-4 border-t border-slate-800/80 space-y-3">
          <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider flex items-center space-x-1.5">
            <FileText className="w-3.5 h-3.5 text-indigo-400" />
            <span>Live User Portal Banner & Bottom Preview</span>
          </p>

          {/* 1st Image Top Purple Banner Preview */}
          <div className="bg-[#5a32fa] text-white p-4 rounded-xl flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-md">
            <div className="flex items-start space-x-3">
              <div className="w-10 h-10 rounded-lg bg-white/20 flex items-center justify-center shrink-0">
                <FileText className="w-5 h-5 text-white" />
              </div>
              <div className="min-w-0">
                <h4 className="text-sm font-bold leading-tight truncate">{formData.name || 'Society Name'}</h4>
                <p className="text-xs text-white/90 leading-tight mt-0.5 truncate">{formData.address || 'Society Address'}</p>
                <p className="text-[11px] text-white/90 leading-tight mt-1 truncate">
                  ✉ {formData.contactEmail || 'member@mandovinagar.org'} &nbsp; 📞 {formData.contactPhone || '+91 98221 23456'}
                </p>
              </div>
            </div>

            <div className="flex sm:flex-col gap-1.5 shrink-0 pt-1 sm:pt-0 border-t sm:border-t-0 border-white/20">
              <div className="bg-white/15 px-2.5 py-1 rounded-lg border border-white/20 text-[11px] flex items-center space-x-1.5">
                <span className="bg-white text-[#5a32fa] font-black px-1 rounded text-[9px]">REG</span>
                <span className="font-mono font-bold">{formData.regNo || 'HSG-(a)-70/GOA'}</span>
              </div>
              <div className="bg-white/15 px-2.5 py-1 rounded-lg border border-white/20 text-[11px] flex items-center space-x-1.5">
                <span className="bg-emerald-400 text-slate-950 font-black px-1 rounded text-[9px]">GSTIN</span>
                <span className="font-mono font-bold">{formData.gstNo || '30AAAAA0000A1Z5'}</span>
              </div>
            </div>
          </div>

          {/* User Side Bottom Bank & QR Code Preview */}
          <div className="bg-slate-950 border border-slate-800 p-3.5 rounded-xl flex items-center justify-between gap-3 text-slate-300">
            <div className="space-y-0.5 text-xs">
              <p className="font-bold text-indigo-400 uppercase text-[10px] tracking-wider">Bank & QR Details (Shown at Bottom):</p>
              <p className="text-white font-semibold">{formData.accountName || formData.name}</p>
              <p className="text-[11px] text-slate-400">{formData.bankName || 'State Bank of India'} | A/C: <span className="font-mono text-white">{formData.accountNo || '38492019482'}</span> | IFSC: <span className="font-mono text-white">{formData.ifscCode || 'SBIN0001234'}</span></p>
              <p className="text-[11px] font-mono text-indigo-300">UPI: {formData.upiId || 'mandovi.society@sbi'}</p>
            </div>
            <div className="shrink-0 text-center">
              <img src={previewQrUrl} alt="QR Code Preview" className="w-12 h-12 bg-white p-0.5 rounded border border-slate-700" />
            </div>
          </div>

        </div>

        <div className="pt-3 flex justify-end">
          <button
            type="submit"
            className="w-full sm:w-auto py-3 px-6 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs shadow-lg shadow-indigo-600/30 flex items-center justify-center space-x-2 transition-all"
          >
            <Save className="w-4 h-4" />
            <span>Save Society Settings & Update User Side</span>
          </button>
        </div>
      </form>
    </div>
  );
};

export default SocietySettings;

