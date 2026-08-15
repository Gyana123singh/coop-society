const express = require('express');
const router = express.Router();
const {
  getVendorProfile,
  updateVendorProfile,
  getVendorUsers,
  addVendorUser,
  updateVendorUser,
  deleteVendorUser
} = require('../controllers/vendorController');
const { protect } = require('../middlewares/authMiddleware');
const { authorize } = require('../middlewares/roleMiddleware');
const { enforceTenant } = require('../middlewares/tenantMiddleware');

router.use(protect);
router.use(enforceTenant);

router.get('/profile', getVendorProfile);
router.put('/profile', authorize('SUPER_ADMIN', 'VENDOR_ADMIN', 'SECRETARY'), updateVendorProfile);
router.get('/users', authorize('SUPER_ADMIN', 'VENDOR_ADMIN', 'SECRETARY'), getVendorUsers);
router.post('/users', authorize('SUPER_ADMIN', 'VENDOR_ADMIN', 'SECRETARY'), addVendorUser);
router.put('/users/:id', authorize('SUPER_ADMIN', 'VENDOR_ADMIN', 'SECRETARY'), updateVendorUser);
router.delete('/users/:id', authorize('SUPER_ADMIN', 'VENDOR_ADMIN', 'SECRETARY'), deleteVendorUser);

module.exports = router;
