import React, { useState } from 'react';
import { Building2, Save, FileSpreadsheet } from 'lucide-react';

const SocietySettings = ({ activeVendor, onUpdateVendor }) => {
  const [formData, setFormData] = useState({
    name: activeVendor?.name || 'Mandovi Nagar Co-Op. Housing Society Ltd.,',
    address: activeVendor?.address || 'Dada Vaidya Road, Panaji - Goa.',
    regNo: activeVendor?.regNo || 'HSG-(a)-70/GOA',
    authorisedSignature: activeVendor?.authorisedSignature || 'For Mandovi Nagar Co-Op. Housing Society Ltd.,',
    currentBookNo: activeVendor?.currentBookNo || '1',
    lastReceiptNo: activeVendor?.lastReceiptNo || 180,
    contactEmail: activeVendor?.contactEmail || 'secretary@mandovinagar.org',
    contactPhone: activeVendor?.contactPhone || '+91 98221 23456'
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    onUpdateVendor(activeVendor._id, formData);
    alert('Society Settings & Authorised Signatures updated!');
  };

  return (
    <div className="space-y-6 max-w-3xl">
      <div>
        <h2 className="text-xl font-bold text-white tracking-tight">
          Housing Society / Business Settings
        </h2>
        <p className="text-xs text-slate-400 mt-0.5">
          Configure default receipt headers, authorised signature blocks, and book counters.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4 text-xs">
        <div>
          <label className="block text-slate-400 mb-1 font-semibold">Society / Business Legal Name *</label>
          <input
            type="text"
            required
            value={formData.name}
            onChange={e => setFormData({ ...formData, name: e.target.value })}
            className="w-full p-2.5 bg-slate-950 rounded-xl border border-slate-800 text-white font-bold focus:outline-none focus:border-indigo-500"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-slate-400 mb-1 font-semibold">Registration No. / Tax ID *</label>
            <input
              type="text"
              required
              value={formData.regNo}
              onChange={e => setFormData({ ...formData, regNo: e.target.value })}
              className="w-full p-2.5 bg-slate-950 rounded-xl border border-slate-800 text-white focus:outline-none focus:border-indigo-500"
            />
          </div>

          <div>
            <label className="block text-slate-400 mb-1 font-semibold">Official Contact Email</label>
            <input
              type="email"
              value={formData.contactEmail}
              onChange={e => setFormData({ ...formData, contactEmail: e.target.value })}
              className="w-full p-2.5 bg-slate-950 rounded-xl border border-slate-800 text-white focus:outline-none focus:border-indigo-500"
            />
          </div>
        </div>

        <div>
          <label className="block text-slate-400 mb-1 font-semibold">Address *</label>
          <input
            type="text"
            required
            value={formData.address}
            onChange={e => setFormData({ ...formData, address: e.target.value })}
            className="w-full p-2.5 bg-slate-950 rounded-xl border border-slate-800 text-white focus:outline-none focus:border-indigo-500"
          />
        </div>

        <div className="pt-3 border-t border-slate-800 space-y-4">
          <h3 className="text-sm font-bold text-white flex items-center space-x-2">
            <FileSpreadsheet className="w-4 h-4 text-indigo-400" />
            <span>Receipt Voucher Sequence Settings</span>
          </h3>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-slate-400 mb-1 font-semibold">Current Book No.</label>
              <input
                type="text"
                value={formData.currentBookNo}
                onChange={e => setFormData({ ...formData, currentBookNo: e.target.value })}
                className="w-full p-2.5 bg-slate-950 rounded-xl border border-slate-800 text-white font-bold focus:outline-none focus:border-indigo-500"
              />
            </div>

            <div>
              <label className="block text-slate-400 mb-1 font-semibold">Last Receipt No. Counter</label>
              <input
                type="number"
                value={formData.lastReceiptNo}
                onChange={e => setFormData({ ...formData, lastReceiptNo: parseInt(e.target.value, 10) })}
                className="w-full p-2.5 bg-slate-950 rounded-xl border border-slate-800 text-white font-bold focus:outline-none focus:border-indigo-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-slate-400 mb-1 font-semibold">Authorised Signature Block Text *</label>
            <input
              type="text"
              required
              value={formData.authorisedSignature}
              onChange={e => setFormData({ ...formData, authorisedSignature: e.target.value })}
              className="w-full p-2.5 bg-slate-950 rounded-xl border border-slate-800 text-white focus:outline-none focus:border-indigo-500"
            />
          </div>
        </div>

        <div className="pt-3 flex justify-end">
          <button
            type="submit"
            className="py-2.5 px-6 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs shadow-lg shadow-indigo-600/30 flex items-center space-x-2 transition-all"
          >
            <Save className="w-4 h-4" />
            <span>Save Settings</span>
          </button>
        </div>
      </form>
    </div>
  );
};

export default SocietySettings;
