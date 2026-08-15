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
    const { 
      name, address, regNo, authorisedSignature, logoUrl, currentBookNo, lastReceiptNo, contactEmail, contactPhone,
      panNo, panDocUrl, gstNo, bankName, accountName, accountNo, ifscCode, branchName, upiId, qrCodeUrl
    } = req.body;
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
    if (lastReceiptNo !== undefined) vendor.lastReceiptNo = lastReceiptNo;
    if (contactEmail !== undefined) vendor.contactEmail = contactEmail;
    if (contactPhone !== undefined) vendor.contactPhone = contactPhone;
    if (panNo !== undefined) vendor.panNo = panNo;
    if (panDocUrl !== undefined) vendor.panDocUrl = panDocUrl;
    if (gstNo !== undefined) vendor.gstNo = gstNo;
    if (bankName !== undefined) vendor.bankName = bankName;
    if (accountName !== undefined) vendor.accountName = accountName;
    if (accountNo !== undefined) vendor.accountNo = accountNo;
    if (ifscCode !== undefined) vendor.ifscCode = ifscCode;
    if (branchName !== undefined) vendor.branchName = branchName;
    if (upiId !== undefined) vendor.upiId = upiId;
    if (qrCodeUrl !== undefined) vendor.qrCodeUrl = qrCodeUrl;

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
    const targetVendorId = req.query.vendorId || req.vendorId;
    if (!targetVendorId) {
      return errorResponse(res, 400, 'Vendor ID is required');
    }
    const users = await User.find({ vendorId: targetVendorId }).sort({ createdAt: -1 });
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
    const { name, email, phone, password, role, flatNo, vendorId, panNo, panDocUrl } = req.body;
    if (!name || (!email && !phone)) {
      return errorResponse(res, 400, 'Member name and either phone or email are required');
    }

    const targetVendorId = vendorId || req.vendorId;
    if (!targetVendorId) {
      return errorResponse(res, 400, 'Vendor ID is required to register member');
    }

    const allowedRoles = ['SECRETARY', 'TREASURER', 'MEMBER'];
    const assignedRole = allowedRoles.includes(role) ? role : 'MEMBER';

    const userEmail = email ? email.toLowerCase().trim() : `${phone.replace(/\D/g, '')}@society.org`;
    const userPhone = phone ? phone.trim() : '';

    const existingUser = await User.findOne({ 
      vendorId: targetVendorId,
      $or: [
        { email: userEmail },
        ...(userPhone ? [{ phone: userPhone }] : [])
      ]
    });

    if (existingUser) {
      return errorResponse(res, 400, 'User with this phone number or email already exists in this society');
    }

    const user = await User.create({
      name,
      email: userEmail,
      phone: userPhone,
      flatNo: flatNo || 'Flat A-101',
      panNo: panNo ? panNo.toUpperCase().trim() : '',
      panDocUrl: panDocUrl || '',
      password: password || 'Password123!',
      role: assignedRole,
      vendorId: targetVendorId
    });

    const userObj = user.toObject();
    delete userObj.password;

    return successResponse(res, 201, 'Society member added successfully', { user: userObj });
  } catch (err) {
    next(err);
  }
};

// @desc    Update Society Member Details
// @route   PUT /api/v1/vendors/users/:id
// @access  Private (SUPER_ADMIN, VENDOR_ADMIN, SECRETARY)
const updateVendorUser = async (req, res, next) => {
  try {
    const { name, email, phone, role, flatNo, status, panNo, panDocUrl } = req.body;
    const user = await User.findById(req.params.id);

    if (!user) {
      return errorResponse(res, 404, 'Society member not found');
    }

    if (name) user.name = name;
    if (email) user.email = email.toLowerCase().trim();
    if (phone) user.phone = phone.trim();
    if (flatNo) user.flatNo = flatNo;
    if (role) user.role = role;
    if (status) user.status = status;
    if (panNo !== undefined) user.panNo = panNo.toUpperCase().trim();
    if (panDocUrl !== undefined) user.panDocUrl = panDocUrl;

    await user.save();
    return successResponse(res, 200, 'Member details updated successfully', { user });
  } catch (err) {
    next(err);
  }
};

// @desc    Delete Society Member Profile Permanently
// @route   DELETE /api/v1/vendors/users/:id
// @access  Private (SUPER_ADMIN, VENDOR_ADMIN, SECRETARY)
const deleteVendorUser = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      return errorResponse(res, 404, 'Society member not found');
    }

    await User.findByIdAndDelete(req.params.id);
    return successResponse(res, 200, 'Society member deleted successfully from MongoDB database');
  } catch (err) {
    next(err);
  }
};

module.exports = {
  getVendorProfile,
  updateVendorProfile,
  getVendorUsers,
  addVendorUser,
  updateVendorUser,
  deleteVendorUser
};
