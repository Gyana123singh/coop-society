const mongoose = require('mongoose');

const lineItemSchema = new mongoose.Schema({
  title: { type: String, required: true, trim: true },
  fromPeriod: { type: String, default: '' }, // e.g. "Apr 2026"
  toPeriod: { type: String, default: '' },   // e.g. "Jun 2026"
  amount: { type: Number, required: true, default: 0.0 },
  isCustom: { type: Boolean, default: false }
}, { _id: true });

const receiptSchema = new mongoose.Schema({
  vendorId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Vendor', 
    required: [true, 'Vendor ID is required for tenant isolation'],
    index: true
  },
  createdBy: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User' 
  },
  bookNo: { 
    type: String, 
    required: true, 
    default: '1' 
  },
  receiptNo: { 
    type: String, 
    required: [true, 'Receipt number is required'] 
  },
  date: { 
    type: String, 
    required: [true, 'Receipt date is required'] // e.g. "13/08/2026"
  },
  receivedFrom: { 
    type: String, 
    required: [true, 'Received from name is required'],
    trim: true 
  },
  flatShopNo: { 
    type: String, 
    required: [true, 'Flat / Shop number is required'],
    trim: true 
  },
  sumInWords: { 
    type: String, 
    required: true 
  },
  items: {
    type: [lineItemSchema],
    validate: [array => array.length > 0, 'Receipt must contain at least one line item']
  },
  paymentMode: { 
    type: String, 
    enum: ['Cash', 'Cheque', 'Online', 'UPI', 'NEFT'], 
    default: 'Cheque' 
  },
  cashChequeNo: { type: String, default: '', trim: true },
  paymentDate: { type: String, default: '', trim: true },
  totalAmount: { type: Number, required: true },
  drawnOn: { type: String, default: '', trim: true }, // Bank Name
  pdfUrl: { type: String, default: '' },
  isDeleted: { type: Boolean, default: false, index: true }
}, { timestamps: true });

// Compound unique index: receiptNo must be unique PER VENDOR
receiptSchema.index({ vendorId: 1, receiptNo: 1, isDeleted: 1 }, { unique: true });
receiptSchema.index({ vendorId: 1, flatShopNo: 1 });
receiptSchema.index({ vendorId: 1, createdAt: -1 });
receiptSchema.index({ receivedFrom: 'text', flatShopNo: 'text' });

module.exports = mongoose.model('Receipt', receiptSchema);
