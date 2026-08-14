const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  name: { 
    type: String, 
    required: [true, 'User name is required'],
    trim: true
  },
  email: { 
    type: String, 
    required: [true, 'Email address is required'], 
    unique: true,
    lowercase: true,
    trim: true
  },
  phone: {
    type: String,
    trim: true,
    default: ''
  },
  password: { 
    type: String,
    select: false
  },
  googleId: { 
    type: String 
  },
  role: { 
    type: String, 
    enum: ['SUPER_ADMIN', 'VENDOR_ADMIN', 'SECRETARY', 'TREASURER', 'MEMBER'], 
    default: 'SECRETARY' 
  },
  vendorId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Vendor',
    required: function() {
      return this.role !== 'SUPER_ADMIN';
    }
  },
  status: {
    type: String,
    enum: ['ACTIVE', 'INACTIVE', 'BLOCKED'],
    default: 'ACTIVE'
  },
  avatarUrl: { 
    type: String,
    default: '' 
  }
}, { timestamps: true });

// Hash password before saving if modified
userSchema.pre('save', async function(next) {
  if (!this.isModified('password') || !this.password) {
    return next();
  }
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// Compare input password with hashed password in database
userSchema.methods.matchPassword = async function(enteredPassword) {
  if (!this.password) return false;
  return await bcrypt.compare(enteredPassword, this.password);
};

userSchema.index({ phone: 1 });
userSchema.index({ vendorId: 1 });

module.exports = mongoose.model('User', userSchema);
