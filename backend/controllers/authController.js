const jwt = require('jsonwebtoken');
const { OAuth2Client } = require('google-auth-library');
const User = require('../models/User');
const Vendor = require('../models/Vendor');
const firebaseAdmin = require('../config/firebaseAdmin');
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
    let vendors = await Vendor.find({ status: { $ne: 'SUSPENDED' } }).sort({ createdAt: -1 });

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

// @desc    Firebase Phone Authentication ID Token Verification & Member Login
// @route   POST /api/v1/auth/firebase-login (or /api/v1/auth/firebase-otp)
// @access  Public
const firebaseLogin = async (req, res, next) => {
  try {
    const { idToken, vendorId, phoneNumber } = req.body;

    if (!idToken) {
      return errorResponse(res, 400, 'Firebase ID token is required.');
    }

    let decodedToken;
    try {
      decodedToken = await firebaseAdmin.auth().verifyIdToken(idToken);
      console.log('[Firebase Auth] ID token verified');
    } catch (authErr) {
      console.error('[Firebase Auth Error] Failed to verify ID token:', authErr.message);
      return errorResponse(res, 401, 'Invalid or expired Firebase authentication token.');
    }

    const rawPhone = decodedToken.phone_number || phoneNumber;
    if (!rawPhone) {
      return errorResponse(res, 400, 'Mobile phone number not found in Firebase token.');
    }

    const normalizedPhone = rawPhone.trim();
    console.log(`[Firebase Auth] Phone number: ${normalizedPhone}`);

    const phoneDigits = extractPhoneDigits(normalizedPhone);

    const searchConditions = [
      { email: normalizedPhone.toLowerCase() },
      { phone: normalizedPhone }
    ];
    if (phoneDigits && phoneDigits.length >= 7) {
      searchConditions.push({ phone: { $regex: phoneDigits + '$' } });
      searchConditions.push({ email: { $regex: phoneDigits + '$' } });
    }

    let registeredUser = await User.findOne({ $or: searchConditions }).populate('vendorId');

    // Auto-map existing user to selected Housing Society if specified
    if (registeredUser) {
      if (vendorId && String(registeredUser.vendorId?._id || registeredUser.vendorId) !== String(vendorId)) {
        registeredUser.vendorId = vendorId;
        await registeredUser.save();
        registeredUser = await User.findById(registeredUser._id).populate('vendorId');
        console.log(`[Firebase Auth] Mapped user ${registeredUser.name} to selected Housing Society: ${registeredUser.vendorId?.name}`);
      }
    } else {
      let activeVendor = null;
      if (vendorId) {
        activeVendor = await Vendor.findById(vendorId);
      }
      if (!activeVendor) {
        activeVendor = await Vendor.findOne({ status: 'ACTIVE' });
      }
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

    console.log(`[Firebase Auth] Member authenticated successfully: ${registeredUser.name}`);

    return successResponse(res, 200, `Firebase Phone Auth Verified. Authenticated into ${society?.name || 'Society'}.`, {
      token,
      user: {
        id: registeredUser._id,
        name: registeredUser.name,
        email: registeredUser.email,
        phone: registeredUser.phone,
        role: registeredUser.role,
        flatNo: registeredUser.flatNo,
        panNo: registeredUser.panNo,
        panDocUrl: registeredUser.panDocUrl,
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
    const { email, password, vendorId } = req.body;

    if (!email || !password) {
      return errorResponse(res, 400, 'Please provide email and password');
    }

    const user = await User.findOne({ email }).select('+password');
    if (!user) {
      return errorResponse(res, 401, 'Invalid credentials');
    }

    if (user.vendorId && vendorId && String(user.vendorId) !== String(vendorId) && user.role !== 'SUPER_ADMIN') {
      user.vendorId = vendorId;
      await user.save();
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

    if (user && vendorId && String(user.vendorId) !== String(vendorId) && user.role !== 'SUPER_ADMIN') {
      user.vendorId = vendorId;
      await user.save();
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

// @desc    Update Current User Profile (Name, Email, Phone, FlatNo, PanNo, PanDocUrl)
// @route   PUT /api/v1/auth/me
// @access  Private
const updateMe = async (req, res, next) => {
  try {
    const { name, email, phone, flatNo, panNo, panDocUrl } = req.body;
    const user = await User.findById(req.user._id);
    if (!user) {
      return errorResponse(res, 404, 'User not found.');
    }

    if (name) user.name = name;
    if (email) user.email = email.toLowerCase().trim();
    if (phone) user.phone = phone.trim();
    if (flatNo) user.flatNo = flatNo;
    if (panNo !== undefined) user.panNo = panNo.toUpperCase().trim();
    if (panDocUrl !== undefined) user.panDocUrl = panDocUrl;

    await user.save();
    const updatedUser = await User.findById(user._id).populate('vendorId');

    return successResponse(res, 200, 'User profile updated successfully', { user: updatedUser });
  } catch (err) {
    next(err);
  }
};

module.exports = {
  getPublicVendors,
  firebaseLogin,
  firebaseOTPLogin: firebaseLogin,
  login,
  googleSignIn,
  getMe,
  updateMe
};
