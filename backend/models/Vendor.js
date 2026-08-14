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
