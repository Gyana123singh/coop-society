const express = require('express');
const router = express.Router();
const {
  createVendor,
  getVendors,
  getVendorById,
  updateVendor,
  deleteVendor,
  getSuperAdminDashboard
} = require('../controllers/superAdminController');
const { protect } = require('../middlewares/authMiddleware');
const { authorize } = require('../middlewares/roleMiddleware');

// All super-admin routes require authentication and SUPER_ADMIN role
router.use(protect);
router.use(authorize('SUPER_ADMIN'));

router.post('/vendors', createVendor);
router.get('/vendors', getVendors);
router.get('/vendors/:id', getVendorById);
router.put('/vendors/:id', updateVendor);
router.delete('/vendors/:id', deleteVendor);
router.get('/dashboard', getSuperAdminDashboard);

module.exports = router;
