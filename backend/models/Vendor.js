const mongoose = require('mongoose');

const vendorSchema = new mongoose.Schema({
  name: { 
    type: String, 
    required: [true, 'Vendor / Society name is required'],
    trim: true
  },
  address: { 
    type: String, 
    required: [true, 'Address is required'],
    trim: true
  },
  regNo: { 
    type: String, 
    required: [true, 'Registration number is required'],
    trim: true
  },
  businessType: {
    type: String,
    trim: true,
    default: 'Housing Cooperative Society'
  },
  panNo: {
    type: String,
    trim: true,
    default: 'AAAAA0000A'
  },
  panDocUrl: {
    type: String,
    default: ''
  },
  gstNo: {
    type: String,
    trim: true,
    default: '30AAAAA0000A1Z5'
  },
  bankName: {
    type: String,
    trim: true,
    default: 'State Bank of India'
  },
  accountName: {
    type: String,
    trim: true,
    default: 'Mandovi Nagar Co-Op. Housing Society Ltd.'
  },
  accountNo: {
    type: String,
    trim: true,
    default: '38492019482'
  },
  ifscCode: {
    type: String,
    trim: true,
    default: 'SBIN0001234'
  },
  branchName: {
    type: String,
    trim: true,
    default: 'Panaji Branch'
  },
  upiId: {
    type: String,
    trim: true,
    default: 'mandovi.society@sbi'
  },
  qrCodeUrl: {
    type: String,
    default: ''
  },
  authorisedSignature: { 
    type: String, 
    default: 'For Housing Society Ltd.,' 
  },
  logoUrl: {
    type: String,
    default: ''
  },
  contactEmail: {
    type: String,
    trim: true,
    lowercase: true
  },
  contactPhone: {
    type: String,
    trim: true
  },
  currentBookNo: { 
    type: String, 
    default: '1' 
  },
  lastReceiptNo: { 
    type: Number, 
    default: 0 
  },
  status: {
    type: String,
    enum: ['ACTIVE', 'INACTIVE', 'SUSPENDED'],
    default: 'ACTIVE'
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }
}, { timestamps: true });

vendorSchema.index({ name: 1 });
vendorSchema.index({ status: 1 });

module.exports = mongoose.model('Vendor', vendorSchema);
