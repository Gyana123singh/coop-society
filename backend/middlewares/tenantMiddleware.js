const Vendor = require('../models/Vendor');
const { errorResponse } = require('../utils/apiResponse');

const enforceTenant = async (req, res, next) => {
  try {
    let targetVendorId;

    if (req.user.role === 'SUPER_ADMIN') {
      // Super admin can specify target vendorId in query, header, or params
      targetVendorId = req.query.vendorId || req.headers['x-vendor-id'] || req.params.vendorId || req.user.vendorId;
    } else {
      // Non-super admin is strictly bound to their assigned vendorId
      targetVendorId = req.user.vendorId;

      // CROSS-TENANT SECURITY GUARD: Prevent tampering or requesting another business's tenant ID
      const requestedHeaderVendor = req.headers['x-vendor-id'] || req.query.vendorId || req.params.vendorId;
      if (requestedHeaderVendor && requestedHeaderVendor.toString() !== req.user.vendorId.toString()) {
        console.warn(`[Security Alert] Cross-Tenant Access Attempt Blocked! User: ${req.user._id} (Vendor: ${req.user.vendorId}) tried to access Vendor: ${requestedHeaderVendor}`);
        return errorResponse(
          res, 
          403, 
          'Security Violation: Cross-Tenant Data Access Prohibited. Access denied.'
        );
      }
    }

    if (!targetVendorId && req.user.role !== 'SUPER_ADMIN') {
      return errorResponse(res, 400, 'Vendor/Tenant context missing for user profile.');
    }

    if (targetVendorId) {
      const vendor = await Vendor.findById(targetVendorId);
      if (!vendor) {
        return errorResponse(res, 404, 'Associated housing society / vendor not found.');
      }
      if (vendor.status !== 'ACTIVE' && req.user.role !== 'SUPER_ADMIN') {
        return errorResponse(res, 403, `Vendor account is currently ${vendor.status.toLowerCase()}. Access restricted.`);
      }
      req.vendor = vendor;
      req.vendorId = vendor._id;
    }

    next();
  } catch (err) {
    return errorResponse(res, 500, `Tenant verification error: ${err.message}`);
  }
};

module.exports = { enforceTenant };
