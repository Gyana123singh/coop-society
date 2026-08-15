const Vendor = require('../models/Vendor');
const { errorResponse } = require('../utils/apiResponse');

const enforceTenant = async (req, res, next) => {
  try {
    let targetVendorId;

    const isAdmin = ['SUPER_ADMIN', 'VENDOR_ADMIN', 'SECRETARY'].includes(req.user?.role);

    if (isAdmin) {
      // Admin role can specify target vendorId in query, header, or params to manage selected Housing Society
      targetVendorId = req.query.vendorId || req.headers['x-vendor-id'] || req.params.vendorId || req.user?.vendorId;
    } else {
      // Resident member is scoped to their assigned vendorId
      targetVendorId = req.user?.vendorId;
    }

    if (targetVendorId) {
      const vendor = await Vendor.findById(targetVendorId);
      if (vendor) {
        req.vendor = vendor;
        req.vendorId = vendor._id;
      }
    }

    next();
  } catch (err) {
    return errorResponse(res, 500, `Tenant verification error: ${err.message}`);
  }
};

module.exports = { enforceTenant };
