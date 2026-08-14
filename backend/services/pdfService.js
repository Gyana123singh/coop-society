const PDFDocument = require('pdfkit');

/**
 * PDF Service for generating Housing Society Receipt Voucher
 * @param {Object} receipt - Receipt document
 * @param {Object} vendor - Vendor/Society document
 * @returns {PDFDocument} pdf stream
 */
const generateReceiptPDF = (receipt, vendor) => {
  const doc = new PDFDocument({ size: 'A4', margin: 40 });

  const societyName = vendor?.name || 'Mandovi Nagar Co-Op. Housing Society Ltd.,';
  const societyAddress = vendor?.address || 'Dada Vaidya Road, Panaji - Goa.';
  const regNo = vendor?.regNo || 'HSG-(a)-70/GOA';
  const signatureText = vendor?.authorisedSignature || `For ${societyName}`;

  // Border Around Receipt
  doc.rect(20, 20, 555, 780).stroke('#333333');
  doc.rect(24, 24, 547, 772).stroke('#666666');

  // Header Title
  doc
    .fillColor('#1A365D')
    .fontSize(16)
    .font('Helvetica-Bold')
    .text(societyName.toUpperCase(), { align: 'center' });

  doc
    .fontSize(10)
    .font('Helvetica')
    .fillColor('#4A5568')
    .text(societyAddress, { align: 'center' })
    .text(`Reg. No: ${regNo}`, { align: 'center' });

  doc.moveDown(0.5);

  // Voucher Badge
  doc
    .fillColor('#2B6CB0')
    .fontSize(12)
    .font('Helvetica-Bold')
    .text('RECEIPT VOUCHER', { align: 'center', underline: true });

  doc.moveDown(1);

  // Top Info Table (Book No, Receipt No, Date)
  const startY = 135;
  doc
    .fontSize(10)
    .font('Helvetica-Bold')
    .fillColor('#000000')
    .text(`Book No: `, 40, startY)
    .font('Helvetica')
    .text(receipt.bookNo || '1', 95, startY);

  doc
    .font('Helvetica-Bold')
    .text(`Receipt No: `, 220, startY)
    .font('Helvetica')
    .text(receipt.receiptNo, 290, startY);

  doc
    .font('Helvetica-Bold')
    .text(`Date: `, 430, startY)
    .font('Helvetica')
    .text(receipt.date, 470, startY);

  doc
    .moveTo(40, startY + 18)
    .lineTo(550, startY + 18)
    .stroke('#CBD5E0');

  // Received From & Flat Info
  const detailY = startY + 28;
  doc
    .font('Helvetica-Bold')
    .text(`Received with thanks from: `, 40, detailY)
    .font('Helvetica')
    .fontSize(11)
    .text(receipt.receivedFrom, 190, detailY);

  doc
    .font('Helvetica-Bold')
    .fontSize(10)
    .text(`Flat / Shop No: `, 40, detailY + 20)
    .font('Helvetica')
    .fontSize(11)
    .text(receipt.flatShopNo, 130, detailY + 20);

  // Items Table Header
  const tableTop = detailY + 45;
  doc.rect(40, tableTop, 510, 22).fill('#EDF2F7');

  doc
    .fillColor('#2D3748')
    .font('Helvetica-Bold')
    .fontSize(10)
    .text('Sr.', 45, tableTop + 6)
    .text('Particulars / Line Items', 80, tableTop + 6)
    .text('Period', 330, tableTop + 6)
    .text('Amount (Rs.)', 460, tableTop + 6, { align: 'right' });

  // Items Rows
  let y = tableTop + 28;
  if (receipt.items && receipt.items.length > 0) {
    receipt.items.forEach((item, index) => {
      let period = '';
      if (item.fromPeriod || item.toPeriod) {
        period = `${item.fromPeriod || ''} - ${item.toPeriod || ''}`.trim();
      }

      doc
        .fillColor('#1A202C')
        .font('Helvetica')
        .fontSize(9)
        .text(`${index + 1}.`, 45, y)
        .text(item.title, 80, y, { width: 240 })
        .text(period || '-', 330, y, { width: 120 })
        .text(`Rs. ${parseFloat(item.amount).toFixed(2)}`, 460, y, { align: 'right' });

      y += 22;
    });
  }

  // Divider before Total
  doc.moveTo(40, y + 5).lineTo(550, y + 5).stroke('#CBD5E0');

  // Total Amount Row
  y += 12;
  doc
    .font('Helvetica-Bold')
    .fontSize(11)
    .fillColor('#000000')
    .text('TOTAL AMOUNT RECEIVED:', 240, y)
    .text(`Rs. ${parseFloat(receipt.totalAmount).toFixed(2)}`, 460, y, { align: 'right' });

  y += 25;

  // Sum in Words
  doc.rect(40, y, 510, 30).fill('#F7FAFC').stroke('#E2E8F0');
  doc
    .fillColor('#1A202C')
    .font('Helvetica-Bold')
    .fontSize(9)
    .text('Rupees in Words: ', 45, y + 9)
    .font('Helvetica')
    .text(receipt.sumInWords, 140, y + 9, { width: 400 });

  y += 45;

  // Payment Details Section
  doc
    .font('Helvetica-Bold')
    .fontSize(10)
    .text('Payment Details:', 40, y);

  y += 18;
  doc
    .font('Helvetica')
    .fontSize(9)
    .text(`Payment Mode: ${receipt.paymentMode}`, 40, y)
    .text(`Cheque / Ref No: ${receipt.cashChequeNo || 'N/A'}`, 200, y)
    .text(`Drawn On: ${receipt.drawnOn || 'N/A'}`, 380, y);

  y += 60;

  // Footer & Authorised Signature
  doc
    .font('Helvetica')
    .fontSize(9)
    .fillColor('#718096')
    .text('Subject to realization of Cheque / Online Transfer.', 40, y + 15);

  doc
    .font('Helvetica-Bold')
    .fontSize(10)
    .fillColor('#000000')
    .text(signatureText, 320, y, { align: 'right', width: 230 });

  doc
    .font('Helvetica')
    .fontSize(9)
    .text('Authorised Signatory / Treasurer', 320, y + 35, { align: 'right', width: 230 });

  doc.end();
  return doc;
};

module.exports = { generateReceiptPDF };
