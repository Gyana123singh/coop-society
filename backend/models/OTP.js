const mongoose = require('mongoose');

const otpSchema = new mongoose.Schema({
  phoneOrEmail: {
    type: String,
    required: true,
    lowercase: true,
    trim: true
  },
  otpCode: {
    type: String,
    required: true
  },
  vendorId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Vendor',
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now,
    expires: 300 // OTP automatically expires and deletes in 5 minutes (300 seconds)
  }
});

otpSchema.index({ phoneOrEmail: 1, vendorId: 1 });

module.exports = mongoose.model('OTP', otpSchema);
