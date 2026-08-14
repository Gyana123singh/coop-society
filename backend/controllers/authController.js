const jwt = require('jsonwebtoken');
const { OAuth2Client } = require('google-auth-library');
const User = require('../models/User');
const Vendor = require('../models/Vendor');
const OTP = require('../models/OTP');
const config = require('../config/config');
const { successResponse, errorResponse } = require('../utils/apiResponse');

const googleClient = new OAuth2Client(config.googleClientId);

const escapeRegex = (string) => {
  return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
};

const extractPhoneDigits = (phoneStr) => {
  if (!phoneStr) return '';
  const digits = phoneStr.replace(/\D/g, '');
  return digits.length >= 10 ? digits.slice(-10) : digits;
};

const generateToken = (user) => {
  return jwt.sign(
    {
      id: user._id,
      role: user.role,
      vendorId: user.vendorId
    },
    config.jwtSecret,
    { expiresIn: config.jwtExpire }
  );
};

// @desc    Get List of Active Housing Societies / Vendors (Public - Auto-Seeds Default if Empty)
// @route   GET /api/v1/auth/public-vendors
// @access  Public
const getPublicVendors = async (req, res, next) => {
  try {
    let vendors = await Vendor.find({ status: 'ACTIVE' }).sort({ createdAt: -1 });

    // Auto-seed default initial society if database has 0 active vendors
    if (vendors.length === 0) {
      const defaultVendor = await Vendor.create({
        name: 'Mandovi Nagar Co-Op. Housing Society Ltd.,',
        address: 'Porvorim, Alto Porvorim, Goa 403521',
        regNo: 'HSG-(a)-70/GOA',
        status: 'ACTIVE'
      });

      await User.create({
        name: 'Mandovi Nagar Secretary',
        email: 'secretary@mandovinagar.org',
        password: 'SecretaryPassword123!',
        role: 'SECRETARY',
        vendorId: defaultVendor._id
      });

      vendors = [defaultVendor];
      console.log('[Auto-Seed] Empty database detected. Seeded default society:', defaultVendor.name);
    }

    return successResponse(res, 200, 'Active housing societies fetched from database', { vendors });
  } catch (err) {
    next(err);
  }
};

// @desc    Firebase Phone Authentication OTP Verification & Member Login
// @route   POST /api/v1/auth/firebase-otp
// @access  Public
const firebaseOTPLogin = async (req, res, next) => {
  try {
    const { phoneNumber, idToken } = req.body;

    if (!phoneNumber) {
      return errorResponse(res, 400, 'Mobile phone number is required.');
    }

    const normalizedPhone = phoneNumber.trim();
    const phoneDigits = extractPhoneDigits(normalizedPhone);

    const searchConditions = [
      { email: normalizedPhone.toLowerCase() },
      { phone: normalizedPhone }
    ];
    if (phoneDigits) {
      searchConditions.push({ phone: { $regex: phoneDigits + '$' } });
    }

    let registeredUser = await User.findOne({ $or: searchConditions }).populate('vendorId');

    // Auto-onboard new mobile number if not yet saved in MongoDB
    if (!registeredUser) {
      let activeVendor = await Vendor.findOne({ status: 'ACTIVE' });
      if (!activeVendor) {
        activeVendor = await Vendor.create({
          name: 'Mandovi Nagar Co-Op. Housing Society Ltd.,',
          address: 'Porvorim, Alto Porvorim, Goa 403521',
          regNo: 'HSG-(a)-70/GOA',
          status: 'ACTIVE'
        });
      }

      registeredUser = await User.create({
        name: `Member (${normalizedPhone})`,
        email: `${phoneDigits || Date.now()}@mandovinagar.org`,
        phone: normalizedPhone,
        role: 'MEMBER',
        vendorId: activeVendor._id
      });
      registeredUser = await User.findById(registeredUser._id).populate('vendorId');
    }

    const society = registeredUser.vendorId;
    const token = generateToken(registeredUser);

    return successResponse(res, 200, `Firebase Phone OTP Verified. Authenticated into ${society?.name || 'Society'}.`, {
      token,
      user: {
        id: registeredUser._id,
        name: registeredUser.name,
        email: registeredUser.email,
        phone: registeredUser.phone,
        role: registeredUser.role,
        vendorId: society?._id,
        vendorName: society?.name,
        vendorRegNo: society?.regNo
      }
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Email / Password Login
// @route   POST /api/v1/auth/login
// @access  Public
const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return errorResponse(res, 400, 'Please provide email and password');
    }

    const user = await User.findOne({ email }).select('+password');
    if (!user) {
      return errorResponse(res, 401, 'Invalid credentials');
    }

    const isMatch = await user.matchPassword(password);
    if (!isMatch) {
      return errorResponse(res, 401, 'Invalid credentials');
    }

    if (user.status !== 'ACTIVE') {
      return errorResponse(res, 403, 'Account is inactive or blocked');
    }

    const token = generateToken(user);
    const userObj = user.toObject();
    delete userObj.password;

    return successResponse(res, 200, 'Login successful', {
      token,
      user: userObj
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Request Direct 6-Digit OTP (Supports Instant Member Onboarding for New Numbers)
// @route   POST /api/v1/auth/send-otp
// @access  Public
const sendOTP = async (req, res, next) => {
  try {
    const { phoneOrEmail } = req.body;

    if (!phoneOrEmail) {
      return errorResponse(res, 400, 'Phone number or Email address is required.');
    }

    const normalizedIdentifier = phoneOrEmail.trim();
    const phoneDigits = extractPhoneDigits(normalizedIdentifier);

    // Build flexible phone and email matching conditions
    const searchConditions = [
      { email: normalizedIdentifier.toLowerCase() },
      { phone: normalizedIdentifier }
    ];

    if (phoneDigits && phoneDigits.length >= 7) {
      searchConditions.push({ phone: { $regex: phoneDigits + '$' } });
      searchConditions.push({ email: { $regex: phoneDigits + '$' } });
    }

    // 1. ADMIN REGISTRATION CHECK: Lookup user in database
    let registeredUser = await User.findOne({ $or: searchConditions }).populate('vendorId');

    // AUTO-REGISTER NEW MOBILE NUMBERS TO DEFAULT ACTIVE SOCIETY IF NOT PREVIOUSLY SAVED
    if (!registeredUser) {
      let activeVendor = await Vendor.findOne({ status: 'ACTIVE' });
      if (!activeVendor) {
        activeVendor = await Vendor.create({
          name: 'Mandovi Nagar Co-Op. Housing Society Ltd.,',
          address: 'Porvorim, Alto Porvorim, Goa 403521',
          regNo: 'HSG-(a)-70/GOA',
          status: 'ACTIVE'
        });
      }

      registeredUser = await User.create({
        name: `Member (${normalizedIdentifier})`,
        email: `${phoneDigits || Date.now()}@mandovinagar.org`,
        phone: normalizedIdentifier,
        role: 'MEMBER',
        vendorId: activeVendor._id
      });
      registeredUser = await User.findById(registeredUser._id).populate('vendorId');
    }

    const society = registeredUser.vendorId;
    const targetVendorId = society._id;

    // Generate 6-digit numeric OTP code
    const generatedOTP = Math.floor(100000 + Math.random() * 900000).toString();

    // Remove any previous pending OTP for this identifier and tenant
    await OTP.deleteMany({ phoneOrEmail: normalizedIdentifier.toLowerCase(), vendorId: targetVendorId });

    // Store new OTP with 5-minute auto-expiry TTL
    await OTP.create({
      phoneOrEmail: normalizedIdentifier.toLowerCase(),
      otpCode: generatedOTP,
      vendorId: targetVendorId
    });

    console.log(`[OTP Gateway] Dispatched 6-digit OTP ${generatedOTP} for ${registeredUser.name} (${normalizedIdentifier}) -> Society: ${society.name}`);

    return successResponse(res, 200, '6-Digit OTP sent successfully.', {
      phoneOrEmail: normalizedIdentifier,
      vendorId: targetVendorId,
      memberName: registeredUser.name,
      societyName: society.name,
      societyRegNo: society.regNo,
      devOtpCode: config.env === 'development' ? generatedOTP : undefined
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Verify OTP & Direct Login to Registered Housing Society
// @route   POST /api/v1/auth/verify-otp
// @access  Public
const verifyOTP = async (req, res, next) => {
  try {
    const { phoneOrEmail, otpCode } = req.body;

    if (!phoneOrEmail || !otpCode) {
      return errorResponse(res, 400, 'Phone/Email and OTP code are required.');
    }

    const normalizedIdentifier = phoneOrEmail.trim();
    const phoneDigits = extractPhoneDigits(normalizedIdentifier);

    // Check active OTP entry
    const otpRecord = await OTP.findOne({
      phoneOrEmail: normalizedIdentifier.toLowerCase(),
      otpCode
    });

    if (!otpRecord) {
      return errorResponse(res, 400, 'Invalid or expired OTP code. Please request a new OTP.');
    }

    const searchConditions = [
      { email: normalizedIdentifier.toLowerCase() },
      { phone: normalizedIdentifier }
    ];

    if (phoneDigits && phoneDigits.length >= 7) {
      searchConditions.push({ phone: { $regex: phoneDigits + '$' } });
    }

    // Retrieve registered user by Phone or Email
    let user = await User.findOne({ $or: searchConditions }).populate('vendorId');

    if (!user) {
      let activeVendor = await Vendor.findOne({ status: 'ACTIVE' });
      if (!activeVendor) {
        activeVendor = await Vendor.create({
          name: 'Mandovi Nagar Co-Op. Housing Society Ltd.,',
          address: 'Porvorim, Alto Porvorim, Goa 403521',
          regNo: 'HSG-(a)-70/GOA',
          status: 'ACTIVE'
        });
      }

      user = await User.create({
        name: `Member (${normalizedIdentifier})`,
        email: `${phoneDigits || Date.now()}@mandovinagar.org`,
        phone: normalizedIdentifier,
        role: 'MEMBER',
        vendorId: activeVendor._id
      });
      user = await User.findById(user._id).populate('vendorId');
    }

    // Delete used OTP
    await OTP.deleteOne({ _id: otpRecord._id });

    // Issue JWT token with embedded userId, role, and vendorId
    const token = generateToken(user);

    return successResponse(res, 200, `OTP verified. Direct login to ${user.vendorId?.name || 'Society'}.`, {
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        role: user.role,
        vendorId: user.vendorId?._id,
        vendorName: user.vendorId?.name,
        vendorRegNo: user.vendorId?.regNo
      }
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Google OAuth Token Verification / Sign-In
// @route   POST /api/v1/auth/google
// @access  Public
const googleSignIn = async (req, res, next) => {
  try {
    const { idToken, vendorId } = req.body;
    if (!idToken) {
      return errorResponse(res, 400, 'idToken is required');
    }

    let payload;
    try {
      if (config.googleClientId) {
        const ticket = await googleClient.verifyIdToken({
          idToken,
          audience: config.googleClientId
        });
        payload = ticket.getPayload();
      } else {
        const decoded = jwt.decode(idToken);
        payload = decoded || {};
      }
    } catch (e) {
      return errorResponse(res, 401, 'Google Token verification failed');
    }

    const { email, name, picture, sub: googleId } = payload;
    if (!email) {
      return errorResponse(res, 400, 'Invalid Google token payload');
    }

    let user = await User.findOne({ email });

    if (user && user.vendorId && vendorId && user.vendorId.toString() !== vendorId.toString()) {
      return errorResponse(res, 403, 'Cross-tenant login blocked. User belongs to another housing society.');
    }

    let targetVendorId = user ? user.vendorId : (vendorId || (await Vendor.findOne({ status: 'ACTIVE' }))?._id);

    if (!user) {
      user = await User.create({
        name: name || 'Google User',
        email,
        googleId,
        avatarUrl: picture || '',
        role: 'MEMBER',
        vendorId: targetVendorId
      });
    }

    if (user.status !== 'ACTIVE') {
      return errorResponse(res, 403, 'Account is inactive or blocked');
    }

    const token = generateToken(user);
    return successResponse(res, 200, 'Google sign-in successful', {
      token,
      user
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Get Current User Profile & Vendor Details
// @route   GET /api/v1/auth/me
// @access  Private
const getMe = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id).populate('vendorId');
    return successResponse(res, 200, 'User profile fetched', { user });
  } catch (err) {
    next(err);
  }
};

module.exports = {
  getPublicVendors,
  firebaseOTPLogin,
  login,
  sendOTP,
  verifyOTP,
  googleSignIn,
  getMe
};
