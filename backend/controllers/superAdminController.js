const Vendor = require('../models/Vendor');
const User = require('../models/User');
const Receipt = require('../models/Receipt');
const { successResponse, errorResponse } = require('../utils/apiResponse');

// @desc    Add New Housing Society / Vendor & Initial Vendor Admin
// @route   POST /api/v1/super-admin/vendors
// @access  Private (SUPER_ADMIN)
const createVendor = async (req, res, next) => {
  try {
    const {
      name,
      address,
      regNo,
      authorisedSignature,
      contactEmail,
      contactPhone,
      adminName,
      adminEmail,
      adminPassword
    } = req.body;

    if (!name || !address || !regNo) {
      return errorResponse(res, 400, 'Vendor name, address, and registration number are required.');
    }

    if (!adminEmail || !adminPassword) {
      return errorResponse(res, 400, 'Initial Vendor Admin email and password are required.');
    }

    // Check if user email already exists
    const existingUser = await User.findOne({ email: adminEmail });
    if (existingUser) {
      return errorResponse(res, 400, 'User with this admin email already exists.');
    }

    // Create Vendor in MongoDB
    const vendor = await Vendor.create({
      name,
      address,
      regNo,
      authorisedSignature: authorisedSignature || `For ${name}`,
      contactEmail: contactEmail || adminEmail,
      contactPhone: contactPhone || '',
      createdBy: req.user ? req.user._id : undefined
    });

    // Create Initial Vendor Admin / Secretary User in MongoDB
    const adminUser = await User.create({
      name: adminName || `${name} Admin`,
      email: adminEmail.toLowerCase().trim(),
      password: adminPassword,
      role: 'VENDOR_ADMIN',
      vendorId: vendor._id
    });

    console.log(`[SuperAdmin] Successfully provisioned new tenant vendor in MongoDB: ${vendor.name} (Admin: ${adminUser.email})`);

    return successResponse(res, 201, 'Vendor & Vendor Admin created successfully in database', {
      vendor,
      adminUser: {
        id: adminUser._id,
        name: adminUser.name,
        email: adminUser.email,
        role: adminUser.role,
        vendorId: adminUser.vendorId
      }
    });
  } catch (err) {
    next(err);
  }
};

// @desc    List All Vendors
// @route   GET /api/v1/super-admin/vendors
// @access  Private (SUPER_ADMIN)
const getVendors = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 50;
    const skip = (page - 1) * limit;
    const { search, status } = req.query;

    const query = {};
    if (status) query.status = status;
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { regNo: { $regex: search, $options: 'i' } },
        { contactEmail: { $regex: search, $options: 'i' } }
      ];
    }

    const total = await Vendor.countDocuments(query);
    const vendors = await Vendor.find(query)
      .populate('createdBy', 'name email')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    return successResponse(res, 200, 'Vendors retrieved', {
      total,
      page,
      pages: Math.ceil(total / limit),
      vendors
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Get Single Vendor Details & Analytics
// @route   GET /api/v1/super-admin/vendors/:id
// @access  Private (SUPER_ADMIN)
const getVendorById = async (req, res, next) => {
  try {
    const vendor = await Vendor.findById(req.params.id);
    if (!vendor) {
      return errorResponse(res, 404, 'Vendor not found');
    }

    const totalUsers = await User.countDocuments({ vendorId: vendor._id });
    const totalReceipts = await Receipt.countDocuments({ vendorId: vendor._id, isDeleted: false });
    
    const collectionAggregation = await Receipt.aggregate([
      { $match: { vendorId: vendor._id, isDeleted: false } },
      { $group: { _id: null, totalCollection: { $sum: '$totalAmount' } } }
    ]);
    const totalCollection = collectionAggregation[0]?.totalCollection || 0;

    return successResponse(res, 200, 'Vendor details retrieved', {
      vendor,
      stats: {
        totalUsers,
        totalReceipts,
        totalCollection
      }
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Update Vendor Details or Status
// @route   PUT /api/v1/super-admin/vendors/:id
// @access  Private (SUPER_ADMIN)
const updateVendor = async (req, res, next) => {
  try {
    const { 
      name, address, regNo, authorisedSignature, contactEmail, contactPhone, currentBookNo, lastReceiptNo, logoUrl, status,
      panNo, gstNo, bankName, accountName, accountNo, ifscCode, branchName, upiId, qrCodeUrl
    } = req.body;

    const vendor = await Vendor.findById(req.params.id);
    if (!vendor) {
      return errorResponse(res, 404, 'Vendor not found');
    }

    if (name) vendor.name = name;
    if (address) vendor.address = address;
    if (regNo) vendor.regNo = regNo;
    if (authorisedSignature) vendor.authorisedSignature = authorisedSignature;
    if (contactEmail !== undefined) vendor.contactEmail = contactEmail;
    if (contactPhone !== undefined) vendor.contactPhone = contactPhone;
    if (currentBookNo !== undefined) vendor.currentBookNo = currentBookNo;
    if (lastReceiptNo !== undefined) vendor.lastReceiptNo = lastReceiptNo;
    if (logoUrl !== undefined) vendor.logoUrl = logoUrl;
    if (status) vendor.status = status;
    if (panNo !== undefined) vendor.panNo = panNo;
    if (gstNo !== undefined) vendor.gstNo = gstNo;
    if (bankName !== undefined) vendor.bankName = bankName;
    if (accountName !== undefined) vendor.accountName = accountName;
    if (accountNo !== undefined) vendor.accountNo = accountNo;
    if (ifscCode !== undefined) vendor.ifscCode = ifscCode;
    if (branchName !== undefined) vendor.branchName = branchName;
    if (upiId !== undefined) vendor.upiId = upiId;
    if (qrCodeUrl !== undefined) vendor.qrCodeUrl = qrCodeUrl;

    await vendor.save();

    return successResponse(res, 200, 'Vendor updated successfully', { vendor });
  } catch (err) {
    next(err);
  }
};

// @desc    Delete Housing Society / Vendor & Remove Associated Accounts
// @route   DELETE /api/v1/super-admin/vendors/:id
// @access  Private (SUPER_ADMIN)
const deleteVendor = async (req, res, next) => {
  try {
    const vendor = await Vendor.findById(req.params.id);
    if (!vendor) {
      return errorResponse(res, 404, 'Housing society / vendor not found');
    }

    // Delete associated users and vendor
    await User.deleteMany({ vendorId: vendor._id });
    await Vendor.deleteOne({ _id: vendor._id });

    console.log(`[SuperAdmin] Successfully deleted housing society from MongoDB: ${vendor.name}`);

    return successResponse(res, 200, `Housing Society '${vendor.name}' deleted successfully.`);
  } catch (err) {
    next(err);
  }
};

// @desc    Super Admin Platform Global Dashboard Summary
// @route   GET /api/v1/super-admin/dashboard
// @access  Private (SUPER_ADMIN)
const getSuperAdminDashboard = async (req, res, next) => {
  try {
    const totalVendors = await Vendor.countDocuments();
    const activeVendors = await Vendor.countDocuments({ status: 'ACTIVE' });
    const totalUsers = await User.countDocuments();
    const totalReceipts = await Receipt.countDocuments({ isDeleted: false });

    const totalCollectionResult = await Receipt.aggregate([
      { $match: { isDeleted: false } },
      { $group: { _id: null, grandTotal: { $sum: '$totalAmount' } } }
    ]);
    const grandTotalCollection = totalCollectionResult[0]?.grandTotal || 0;

    return successResponse(res, 200, 'Global dashboard analytics', {
      totalVendors,
      activeVendors,
      totalUsers,
      totalReceipts,
      grandTotalCollection
    });
  } catch (err) {
    next(err);
  }
};

module.exports = {
  createVendor,
  getVendors,
  getVendorById,
  updateVendor,
  deleteVendor,
  getSuperAdminDashboard
};
