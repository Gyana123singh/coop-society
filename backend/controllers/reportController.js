const mongoose = require('mongoose');
const Receipt = require('../models/Receipt');
const { successResponse, errorResponse } = require('../utils/apiResponse');

// @desc    Get Financial Collection Summary & Analytics Breakdown for Vendor
// @route   GET /api/v1/reports/summary
// @access  Private (VENDOR_ADMIN, SECRETARY, TREASURER, SUPER_ADMIN)
const getCollectionSummary = async (req, res, next) => {
  try {
    const { startDate, endDate } = req.query;

    const vendorObjectId = new mongoose.Types.ObjectId(req.vendorId);
    const matchQuery = {
      vendorId: vendorObjectId,
      isDeleted: false
    };

    if (startDate || endDate) {
      matchQuery.createdAt = {};
      if (startDate) matchQuery.createdAt.$gte = new Date(startDate);
      if (endDate) matchQuery.createdAt.$lte = new Date(endDate);
    }

    // 1. Total Collection & Receipt Count Aggregation
    const totalAggregation = await Receipt.aggregate([
      { $match: matchQuery },
      {
        $group: {
          _id: null,
          totalCollection: { $sum: '$totalAmount' },
          receiptCount: { $sum: 1 }
        }
      }
    ]);

    const totalCollection = totalAggregation[0]?.totalCollection || 0;
    const receiptCount = totalAggregation[0]?.receiptCount || 0;

    // 2. Payment Mode Breakdown (Cheque vs Online vs Cash vs UPI vs NEFT)
    const paymentModeDistribution = await Receipt.aggregate([
      { $match: matchQuery },
      {
        $group: {
          _id: '$paymentMode',
          count: { $sum: 1 },
          totalAmount: { $sum: '$totalAmount' }
        }
      },
      { $sort: { totalAmount: -1 } }
    ]);

    // 3. Category / Line Item Title Breakdown
    const categoryBreakdown = await Receipt.aggregate([
      { $match: matchQuery },
      { $unwind: '$items' },
      {
        $group: {
          _id: '$items.title',
          itemCount: { $sum: 1 },
          totalAmount: { $sum: '$items.amount' }
        }
      },
      { $sort: { totalAmount: -1 } }
    ]);

    return successResponse(res, 200, 'Financial collection summary retrieved', {
      summary: {
        totalCollection,
        receiptCount,
        averageReceiptAmount: receiptCount > 0 ? (totalCollection / receiptCount).toFixed(2) : 0
      },
      paymentModeDistribution,
      categoryBreakdown
    });
  } catch (err) {
    next(err);
  }
};

module.exports = {
  getCollectionSummary
};
