const mongoose = require('mongoose');
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
// @access  Private
const createReceipt = async (req, res, next) => {
  try {
    const {
      bookNo,
      receiptNo,
      date,
      receivedFrom,
      flatShopNo,
      flatNo,
      paymentMode,
      cashChequeNo,
      refNo,
      paymentDate,
      drawnOn,
      items,
      particulars,
      totalAmount,
      sumInWords
    } = req.body;

    const targetReceiptNo = receiptNo || Date.now().toString().slice(-4);
    const targetReceivedFrom = receivedFrom || (req.user ? req.user.name : 'Resident Member');
    const targetFlat = flatShopNo || flatNo || 'Flat A-302';
    const rawItems = (items && items.length > 0) ? items : (particulars || []);

    const formattedItems = rawItems.map(item => ({
      title: item.title || item.name || 'Particular Item',
      fromPeriod: item.fromPeriod || item.from || '',
      toPeriod: item.toPeriod || item.to || '',
      amount: parseFloat(item.amount) || 0
    })).filter(item => item.amount > 0);

    const calculatedTotal = formattedItems.reduce((sum, item) => sum + item.amount, 0);
    const finalTotal = totalAmount !== undefined ? parseFloat(totalAmount) : calculatedTotal;
    const finalSumInWords = sumInWords || convertToWords(finalTotal);

    const vendor = await Vendor.findById(req.vendorId);
    if (!vendor) {
      return errorResponse(res, 404, 'Vendor society not found');
    }

    const receipt = await Receipt.create({
      vendorId: req.vendorId,
      createdBy: req.user ? req.user._id : undefined,
      bookNo: bookNo || vendor.currentBookNo || '1',
      receiptNo: String(targetReceiptNo),
      date: date || new Date().toISOString().split('T')[0],
      receivedFrom: targetReceivedFrom,
      flatShopNo: targetFlat,
      sumInWords: finalSumInWords,
      items: formattedItems,
      paymentMode: paymentMode || 'Cash',
      cashChequeNo: cashChequeNo || refNo || '',
      paymentDate: paymentDate || date || '',
      totalAmount: finalTotal,
      drawnOn: drawnOn || ''
    });

    const numReceiptNo = parseInt(targetReceiptNo, 10);
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
      isDeleted: false 
    };

    if (req.vendorId) {
      query.vendorId = req.vendorId;
    }

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
    let receipt;
    if (req.vendorId) {
      receipt = await Receipt.findOne({
        _id: req.params.id,
        vendorId: req.vendorId,
        isDeleted: false
      });
    }
    
    if (!receipt) {
      receipt = await Receipt.findOne({
        _id: req.params.id,
        isDeleted: false
      });
    }

    if (!receipt) {
      return errorResponse(res, 404, 'Receipt voucher not found');
    }

    const targetVendorId = req.vendorId || receipt.vendorId;
    const vendor = await Vendor.findById(targetVendorId);

    const pdfDoc = generateReceiptPDF(receipt, vendor);

    const filename = `Receipt_${receipt.receiptNo || 'Voucher'}_${(receipt.flatShopNo || 'Society').replace(/\s+/g, '_')}.pdf`;

    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader(
      'Content-Disposition',
      `inline; filename="${filename}"`
    );

    pdfDoc.pipe(res);
  } catch (err) {
    next(err);
  }
};

// @desc    Get Real-Time Financial Collection Analytics
// @route   GET /api/v1/receipts/analytics
// @access  Private
const getCollectionAnalytics = async (req, res, next) => {
  try {
    const { vendorId, paymentMode, startDate, endDate, search } = req.query;
    const targetVendorId = vendorId || req.vendorId;

    const matchQuery = { isDeleted: false };
    if (targetVendorId && typeof targetVendorId === 'string' && targetVendorId.length === 24) {
      matchQuery.vendorId = new mongoose.Types.ObjectId(targetVendorId);
    }
    if (paymentMode && paymentMode !== 'ALL') {
      matchQuery.paymentMode = paymentMode;
    }
    if (startDate || endDate) {
      matchQuery.createdAt = {};
      if (startDate) matchQuery.createdAt.$gte = new Date(startDate);
      if (endDate) matchQuery.createdAt.$lte = new Date(endDate);
    }
    if (search) {
      matchQuery.$or = [
        { receivedFrom: { $regex: search, $options: 'i' } },
        { flatShopNo: { $regex: search, $options: 'i' } },
        { receiptNo: { $regex: search, $options: 'i' } },
        { cashChequeNo: { $regex: search, $options: 'i' } }
      ];
    }

    const receipts = await Receipt.find(matchQuery)
      .populate('createdBy', 'name email role')
      .sort({ createdAt: -1 });

    const totalRevenue = receipts.reduce((sum, r) => sum + (parseFloat(r.totalAmount) || 0), 0);
    const totalCount = receipts.length;
    const avgReceiptAmount = totalCount > 0 ? (totalRevenue / totalCount) : 0;

    // Payment Mode Breakdown
    const paymentModeMap = {};
    receipts.forEach(r => {
      const mode = r.paymentMode || 'Cash';
      if (!paymentModeMap[mode]) paymentModeMap[mode] = { count: 0, amount: 0 };
      paymentModeMap[mode].count += 1;
      paymentModeMap[mode].amount += (parseFloat(r.totalAmount) || 0);
    });

    const paymentModes = Object.keys(paymentModeMap).map(mode => ({
      mode,
      amount: paymentModeMap[mode].amount,
      count: paymentModeMap[mode].count,
      percentage: totalRevenue > 0 ? Math.round((paymentModeMap[mode].amount / totalRevenue) * 100) : 0
    })).sort((a, b) => b.amount - a.amount);

    // Particulars Breakdown
    const categoryMap = {};
    receipts.forEach(r => {
      if (r.items && Array.isArray(r.items) && r.items.length > 0) {
        r.items.forEach(it => {
          const title = it.title || it.name || 'Maintenance Charges';
          const amt = parseFloat(it.amount) || 0;
          categoryMap[title] = (categoryMap[title] || 0) + amt;
        });
      } else {
        categoryMap['Maintenance Charges'] = (categoryMap['Maintenance Charges'] || 0) + (parseFloat(r.totalAmount) || 0);
      }
    });

    const categoryData = Object.keys(categoryMap).map(title => {
      const amt = categoryMap[title];
      const percentage = totalRevenue > 0 ? Math.round((amt / totalRevenue) * 100) : 0;
      return { title, amount: amt, percentage };
    }).sort((a, b) => b.amount - a.amount);

    return successResponse(res, 200, 'Real-time collection analytics retrieved successfully', {
      totalRevenue,
      totalCount,
      avgReceiptAmount,
      paymentModes,
      categoryData,
      receipts
    });
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
  downloadReceiptPDF,
  getCollectionAnalytics
};
