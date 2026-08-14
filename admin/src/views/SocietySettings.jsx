import React, { useState, useEffect } from 'react';
import { Building2, Save, FileSpreadsheet, Mail, Phone, MapPin, FileText } from 'lucide-react';

const SocietySettings = ({ activeVendor, onUpdateVendor }) => {
  const [formData, setFormData] = useState({
    name: activeVendor?.name || 'Mandovi Nagar Co-Op. Housing Society Ltd.',
    address: activeVendor?.address || 'Dada Vaidya Road, Panaji - Goa',
    regNo: activeVendor?.regNo || 'HSG-(a)-70/GOA',
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
    onUpdateVendor(activeVendor._id, formData);
    alert(`Society details updated! User side header banner will now render "${formData.name}".`);
  };

  return (
    <div className="space-y-6 max-w-3xl font-sans">
      <div>
        <h2 className="text-xl font-bold text-white tracking-tight flex items-center space-x-2">
          <Building2 className="w-5 h-5 text-indigo-400" />
          <span>Housing Society / Business Settings</span>
        </h2>
        <p className="text-xs text-slate-400 mt-0.5">
          Configure society name, address, email, phone & receipt voucher header details rendered to resident users.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-5 text-xs">
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

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-slate-300 mb-1 font-semibold">Registration No. / Tax ID *</label>
            <input
              type="text"
              required
              value={formData.regNo}
              onChange={e => setFormData({ ...formData, regNo: e.target.value })}
              placeholder="HSG-(a)-70/GOA"
              className="w-full p-2.5 bg-slate-950 rounded-xl border border-slate-800 text-white focus:outline-none focus:border-indigo-500"
            />
          </div>

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

          <div className="sm:col-span-2 md:col-span-1">
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

        <div className="pt-4 border-t border-slate-800/80 space-y-4">
          <h3 className="text-sm font-bold text-white flex items-center space-x-2">
            <FileSpreadsheet className="w-4 h-4 text-indigo-400" />
            <span>Receipt Voucher Sequence & Signature Settings</span>
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

        {/* User Side Banner Preview Box in Admin */}
        <div className="mt-4 pt-4 border-t border-slate-800/80">
          <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2 flex items-center space-x-1.5">
            <FileText className="w-3.5 h-3.5 text-indigo-400" />
            <span>User Portal Banner Preview</span>
          </p>
          <div className="bg-[#5a32fa] text-white p-4 rounded-xl flex items-start space-x-3.5 shadow-md">
            <div className="w-10 h-10 rounded-lg bg-white/20 flex items-center justify-center shrink-0">
              <FileText className="w-5 h-5 text-white" />
            </div>
            <div className="min-w-0">
              <h4 className="text-sm font-bold leading-tight truncate">{formData.name || 'Society Name'}</h4>
              <p className="text-xs text-white/90 leading-tight mt-0.5 truncate">{formData.address || 'Society Address'}</p>
              <p className="text-xs text-white/90 leading-tight mt-1 truncate">
                ✉ {formData.contactEmail || 'member@mandovinagar.org'} &nbsp; 📞 {formData.contactPhone || '+91 98221 23456'}
              </p>
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

