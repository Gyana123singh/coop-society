const Vendor = require('../models/Vendor');
const User = require('../models/User');
const { successResponse, errorResponse } = require('../utils/apiResponse');

// @desc    Get Current Vendor Society Settings
// @route   GET /api/v1/vendors/profile
// @access  Private (VENDOR_ADMIN, SECRETARY, TREASURER)
const getVendorProfile = async (req, res, next) => {
  try {
    const vendor = await Vendor.findById(req.vendorId);
    if (!vendor) {
      return errorResponse(res, 404, 'Vendor society profile not found');
    }
    return successResponse(res, 200, 'Vendor profile retrieved', { vendor });
  } catch (err) {
    next(err);
  }
};

// @desc    Update Vendor Society Profile & Settings
// @route   PUT /api/v1/vendors/profile
// @access  Private (VENDOR_ADMIN, SECRETARY)
const updateVendorProfile = async (req, res, next) => {
  try {
    const { name, address, regNo, authorisedSignature, logoUrl, currentBookNo } = req.body;
    const vendor = await Vendor.findById(req.vendorId);
    if (!vendor) {
      return errorResponse(res, 404, 'Vendor society profile not found');
    }

    if (name) vendor.name = name;
    if (address) vendor.address = address;
    if (regNo) vendor.regNo = regNo;
    if (authorisedSignature) vendor.authorisedSignature = authorisedSignature;
    if (logoUrl !== undefined) vendor.logoUrl = logoUrl;
    if (currentBookNo) vendor.currentBookNo = currentBookNo;

    await vendor.save();
    return successResponse(res, 200, 'Vendor profile updated successfully', { vendor });
  } catch (err) {
    next(err);
  }
};

// @desc    List Users in Society
// @route   GET /api/v1/vendors/users
// @access  Private (VENDOR_ADMIN, SECRETARY)
const getVendorUsers = async (req, res, next) => {
  try {
    const users = await User.find({ vendorId: req.vendorId }).sort({ createdAt: -1 });
    return successResponse(res, 200, 'Society members retrieved', { users });
  } catch (err) {
    next(err);
  }
};

// @desc    Add New Society Member / Treasurer with Separate Phone & Email
// @route   POST /api/v1/vendors/users
// @access  Private (VENDOR_ADMIN, SECRETARY)
const addVendorUser = async (req, res, next) => {
  try {
    const { name, email, phone, password, role } = req.body;
    if (!name || (!email && !phone)) {
      return errorResponse(res, 400, 'Member name and either phone or email are required');
    }

    const allowedRoles = ['SECRETARY', 'TREASURER', 'MEMBER'];
    const assignedRole = allowedRoles.includes(role) ? role : 'MEMBER';

    const userEmail = email ? email.toLowerCase().trim() : `${phone.replace(/\D/g, '')}@society.org`;
    const userPhone = phone ? phone.trim() : '';

    const existingUser = await User.findOne({ 
      $or: [
        { email: userEmail },
        ...(userPhone ? [{ phone: userPhone }] : [])
      ]
    });

    if (existingUser) {
      return errorResponse(res, 400, 'User with this phone number or email already exists');
    }

    const user = await User.create({
      name,
      email: userEmail,
      phone: userPhone,
      password: password || 'Password123!',
      role: assignedRole,
      vendorId: req.vendorId
    });

    const userObj = user.toObject();
    delete userObj.password;

    return successResponse(res, 201, 'Society member added successfully', { user: userObj });
  } catch (err) {
    next(err);
  }
};

module.exports = {
  getVendorProfile,
  updateVendorProfile,
  getVendorUsers,
  addVendorUser
};
