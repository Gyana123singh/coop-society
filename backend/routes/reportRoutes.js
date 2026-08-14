const express = require('express');
const router = express.Router();
const { getCollectionSummary } = require('../controllers/reportController');
const { protect } = require('../middlewares/authMiddleware');
const { authorize } = require('../middlewares/roleMiddleware');
const { enforceTenant } = require('../middlewares/tenantMiddleware');

router.use(protect);
router.use(enforceTenant);

router.get(
  '/summary', 
  authorize('SUPER_ADMIN', 'VENDOR_ADMIN', 'SECRETARY', 'TREASURER'), 
  getCollectionSummary
);

module.exports = router;
