const express = require('express');
const router = express.Router();
const {
  getNextReceiptNumber,
  createReceipt,
  getReceipts,
  getReceiptById,
  updateReceipt,
  deleteReceipt,
  downloadReceiptPDF,
  getCollectionAnalytics
} = require('../controllers/receiptController');
const { protect } = require('../middlewares/authMiddleware');
const { authorize } = require('../middlewares/roleMiddleware');
const { enforceTenant } = require('../middlewares/tenantMiddleware');

router.use(protect);
router.use(enforceTenant);

router.get('/analytics', getCollectionAnalytics);
router.get('/next-number', getNextReceiptNumber);
router.get('/', getReceipts);
router.post('/', authorize('SUPER_ADMIN', 'VENDOR_ADMIN', 'SECRETARY', 'TREASURER', 'MEMBER'), createReceipt);
router.get('/:id', getReceiptById);
router.put('/:id', authorize('SUPER_ADMIN', 'VENDOR_ADMIN', 'SECRETARY', 'TREASURER', 'MEMBER'), updateReceipt);
router.delete('/:id', authorize('SUPER_ADMIN', 'VENDOR_ADMIN', 'SECRETARY', 'TREASURER'), deleteReceipt);
router.get('/:id/pdf', downloadReceiptPDF);

module.exports = router;
