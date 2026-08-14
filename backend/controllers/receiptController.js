const Receipt = require('../models/Receipt');
const Vendor = require('../models/Vendor');
const convertToWords = require('../utils/numberToWords');
const { generateReceiptPDF } = require('../services/pdfService');
const { uploadPDFToCloud } = require('../services/storageService');
const { successResponse, errorResponse } = require('../utils/apiResponse');

// @desc    Get Next Available Receipt Number for Current Vendor
// @route   GET /api/v1/receipts/next-number
// @access  Private
const getNextReceiptNumber = async (req, res, next) => {
  try {
    const vendor = await Vendor.findById(req.vendorId);
    if (!vendor) {
      return errorResponse(res, 404, 'Vendor society not found');
    }

    // Query highest receipt number in database to prevent collisions
    const latestReceipt = await Receipt.findOne({ 
      vendorId: req.vendorId 
    }).sort({ createdAt: -1 });

    let nextNumber = (vendor.lastReceiptNo || 0) + 1;
    if (latestReceipt && !isNaN(parseInt(latestReceipt.receiptNo, 10))) {
      const highestInDb = parseInt(latestReceipt.receiptNo, 10);
      if (highestInDb >= nextNumber) {
        nextNumber = highestInDb + 1;
      }
    }

    return successResponse(res, 200, 'Next receipt number retrieved', {
      bookNo: vendor.currentBookNo || '1',
      nextReceiptNo: String(nextNumber)
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Create New Receipt Voucher
// @route   POST /api/v1/receipts
// @access  Private (SECRETARY, TREASURER, VENDOR_ADMIN, SUPER_ADMIN)
const createReceipt = async (req, res, next) => {
  try {
    const {
      bookNo,
      receiptNo,
      date,
      receivedFrom,
      flatShopNo,
      paymentMode,
      cashChequeNo,
      paymentDate,
      drawnOn,
      items,
      totalAmount,
      sumInWords
    } = req.body;

    if (!receiptNo || !date || !receivedFrom || !flatShopNo || !items || items.length === 0) {
      return errorResponse(res, 400, 'Required receipt fields are missing (receiptNo, date, receivedFrom, flatShopNo, items).');
    }

    // Calculate total from line items
    const calculatedTotal = items.reduce((sum, item) => sum + (parseFloat(item.amount) || 0), 0);
    const finalTotal = totalAmount !== undefined ? parseFloat(totalAmount) : calculatedTotal;

    // Generate sum in words if not provided or mismatch
    const finalSumInWords = sumInWords || convertToWords(finalTotal);

    const vendor = await Vendor.findById(req.vendorId);
    if (!vendor) {
      return errorResponse(res, 404, 'Vendor society not found');
    }

    // Check duplicate receipt number per vendor
    const existingReceipt = await Receipt.findOne({
      vendorId: req.vendorId,
      receiptNo: String(receiptNo),
      isDeleted: false
    });

    if (existingReceipt) {
      return errorResponse(res, 400, `Receipt No. ${receiptNo} already exists for this society.`);
    }

    const receipt = await Receipt.create({
      vendorId: req.vendorId,
      createdBy: req.user._id,
      bookNo: bookNo || vendor.currentBookNo || '1',
      receiptNo: String(receiptNo),
      date,
      receivedFrom,
      flatShopNo,
      sumInWords: finalSumInWords,
      items,
      paymentMode: paymentMode || 'Cheque',
      cashChequeNo: cashChequeNo || '',
      paymentDate: paymentDate || '',
      totalAmount: finalTotal,
      drawnOn: drawnOn || ''
    });

    // Update vendor lastReceiptNo counter if numeric and higher
    const numReceiptNo = parseInt(receiptNo, 10);
    if (!isNaN(numReceiptNo) && numReceiptNo > (vendor.lastReceiptNo || 0)) {
      vendor.lastReceiptNo = numReceiptNo;
      await vendor.save();
    }

    return successResponse(res, 201, 'Receipt created successfully', { receipt });
  } catch (err) {
    next(err);
  }
};

// @desc    Fetch All Receipts with Pagination, Filter & Search
// @route   GET /api/v1/receipts
// @access  Private
const getReceipts = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 20;
    const skip = (page - 1) * limit;
    const { search, startDate, endDate, flatShopNo, paymentMode } = req.query;

    const query = { 
      vendorId: req.vendorId,
      isDeleted: false 
    };

    if (flatShopNo) {
      query.flatShopNo = { $regex: flatShopNo, $options: 'i' };
    }

    if (paymentMode) {
      query.paymentMode = paymentMode;
    }

    if (startDate || endDate) {
      query.createdAt = {};
      if (startDate) query.createdAt.$gte = new Date(startDate);
      if (endDate) query.createdAt.$lte = new Date(endDate);
    }

    if (search) {
      query.$or = [
        { receivedFrom: { $regex: search, $options: 'i' } },
        { flatShopNo: { $regex: search, $options: 'i' } },
        { receiptNo: { $regex: search, $options: 'i' } },
        { cashChequeNo: { $regex: search, $options: 'i' } }
      ];
    }

    const total = await Receipt.countDocuments(query);
    const receipts = await Receipt.find(query)
      .populate('createdBy', 'name email role')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    return successResponse(res, 200, 'Receipts fetched successfully', {
      total,
      page,
      pages: Math.ceil(total / limit),
      receipts
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Get Single Receipt Details
// @route   GET /api/v1/receipts/:id
// @access  Private
const getReceiptById = async (req, res, next) => {
  try {
    const receipt = await Receipt.findOne({
      _id: req.params.id,
      vendorId: req.vendorId,
      isDeleted: false
    }).populate('createdBy', 'name email role');

    if (!receipt) {
      return errorResponse(res, 404, 'Receipt not found');
    }

    return successResponse(res, 200, 'Receipt details retrieved', { receipt });
  } catch (err) {
    next(err);
  }
};

// @desc    Update Receipt
// @route   PUT /api/v1/receipts/:id
// @access  Private (SECRETARY, TREASURER, VENDOR_ADMIN, SUPER_ADMIN)
const updateReceipt = async (req, res, next) => {
  try {
    const receipt = await Receipt.findOne({
      _id: req.params.id,
      vendorId: req.vendorId,
      isDeleted: false
    });

    if (!receipt) {
      return errorResponse(res, 404, 'Receipt not found');
    }

    const {
      bookNo,
      date,
      receivedFrom,
      flatShopNo,
      paymentMode,
      cashChequeNo,
      paymentDate,
      drawnOn,
      items,
      totalAmount,
      sumInWords
    } = req.body;

    if (bookNo) receipt.bookNo = bookNo;
    if (date) receipt.date = date;
    if (receivedFrom) receipt.receivedFrom = receivedFrom;
    if (flatShopNo) receipt.flatShopNo = flatShopNo;
    if (paymentMode) receipt.paymentMode = paymentMode;
    if (cashChequeNo !== undefined) receipt.cashChequeNo = cashChequeNo;
    if (paymentDate !== undefined) receipt.paymentDate = paymentDate;
    if (drawnOn !== undefined) receipt.drawnOn = drawnOn;

    if (items && Array.isArray(items)) {
      receipt.items = items;
      const calculatedTotal = items.reduce((sum, item) => sum + (parseFloat(item.amount) || 0), 0);
      receipt.totalAmount = totalAmount !== undefined ? parseFloat(totalAmount) : calculatedTotal;
      receipt.sumInWords = sumInWords || convertToWords(receipt.totalAmount);
    } else if (totalAmount !== undefined) {
      receipt.totalAmount = parseFloat(totalAmount);
      receipt.sumInWords = sumInWords || convertToWords(receipt.totalAmount);
    }

    await receipt.save();

    return successResponse(res, 200, 'Receipt updated successfully', { receipt });
  } catch (err) {
    next(err);
  }
};

// @desc    Soft Delete Receipt
// @route   DELETE /api/v1/receipts/:id
// @access  Private (SECRETARY, TREASURER, VENDOR_ADMIN, SUPER_ADMIN)
const deleteReceipt = async (req, res, next) => {
  try {
    const receipt = await Receipt.findOne({
      _id: req.params.id,
      vendorId: req.vendorId,
      isDeleted: false
    });

    if (!receipt) {
      return errorResponse(res, 404, 'Receipt not found');
    }

    receipt.isDeleted = true;
    await receipt.save();

    return successResponse(res, 200, 'Receipt deleted successfully');
  } catch (err) {
    next(err);
  }
};

// @desc    Download / Stream PDF Voucher
// @route   GET /api/v1/receipts/:id/pdf
// @access  Private
const downloadReceiptPDF = async (req, res, next) => {
  try {
    const receipt = await Receipt.findOne({
      _id: req.params.id,
      vendorId: req.vendorId,
      isDeleted: false
    });

    if (!receipt) {
      return errorResponse(res, 404, 'Receipt not found');
    }

    const vendor = await Vendor.findById(req.vendorId);

    const pdfDoc = generateReceiptPDF(receipt, vendor);

    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader(
      'Content-Disposition',
      `inline; filename=Receipt_${receipt.receiptNo}_${receipt.flatShopNo.replace(/\s+/g, '_')}.pdf`
    );

    pdfDoc.pipe(res);
  } catch (err) {
    next(err);
  }
};

module.exports = {
  getNextReceiptNumber,
  createReceipt,
  getReceipts,
  getReceiptById,
  updateReceipt,
  deleteReceipt,
  downloadReceiptPDF
};
