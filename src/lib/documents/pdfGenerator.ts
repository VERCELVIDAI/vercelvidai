import { PDFDocument, rgb, StandardFonts } from 'pdf-lib';
import { Invoice, PaymentReceipt } from '../types';

/**
 * Helper to format currency in standard Indian Rupee format
 */
export function formatInr(amount: number): string {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);
}

/**
 * Generate a professional, vector-sharp Tax Invoice PDF using pdf-lib
 */
export async function generateInvoicePdf(invoice: Invoice): Promise<Uint8Array> {
  const doc = await PDFDocument.create();
  const page = doc.addPage([595.28, 841.89]); // A4: 595 x 842 points
  const { width, height } = page.getSize();

  const fontRegular = await doc.embedFont(StandardFonts.Helvetica);
  const fontBold = await doc.embedFont(StandardFonts.HelveticaBold);

  // Palette
  const colorDark = rgb(0.04, 0.05, 0.07);
  const colorViolet = rgb(0.43, 0.23, 0.94);
  const colorSlate = rgb(0.3, 0.35, 0.45);
  const colorLightSlate = rgb(0.5, 0.55, 0.65);
  const colorEmerald = rgb(0.06, 0.65, 0.42);
  const colorBorder = rgb(0.85, 0.88, 0.92);
  const colorBgLight = rgb(0.96, 0.97, 0.99);

  let cursorY = height - 40;

  // 1. TOP HEADER BAR
  page.drawRectangle({
    x: 0,
    y: cursorY - 30,
    width,
    height: 70,
    color: colorDark,
  });

  // Brand Name
  page.drawText('FLUVIA FLOW', {
    x: 40,
    y: cursorY,
    size: 20,
    font: fontBold,
    color: rgb(1, 1, 1),
  });

  page.drawText('AI Cinema Studio & Creative Production Platform', {
    x: 40,
    y: cursorY - 14,
    size: 8,
    font: fontRegular,
    color: rgb(0.7, 0.75, 0.85),
  });

  // Invoice Title Right Aligned
  const isGstCompliant = !!invoice.supplier.gstin && invoice.supplier.isGstRegistered;
  const docTitle = isGstCompliant ? 'TAX INVOICE' : 'COMMERCIAL INVOICE';
  const docTitleWidth = fontBold.widthOfTextAtSize(docTitle, 16);

  page.drawText(docTitle, {
    x: width - 40 - docTitleWidth,
    y: cursorY,
    size: 16,
    font: fontBold,
    color: rgb(1, 1, 1),
  });

  const invNumWidth = fontBold.widthOfTextAtSize(invoice.invoiceNumber, 11);
  page.drawText(invoice.invoiceNumber, {
    x: width - 40 - invNumWidth,
    y: cursorY - 14,
    size: 11,
    font: fontBold,
    color: rgb(0.65, 0.85, 1),
  });

  cursorY -= 65;

  // 2. METADATA STRIP
  page.drawRectangle({
    x: 40,
    y: cursorY - 24,
    width: width - 80,
    height: 32,
    color: colorBgLight,
    borderColor: colorBorder,
    borderWidth: 1,
  });

  const issueDateFormatted = new Date(invoice.issueDate).toLocaleDateString('en-IN', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });

  page.drawText('Invoice Date: ', { x: 50, y: cursorY - 14, size: 9, font: fontRegular, color: colorSlate });
  page.drawText(issueDateFormatted, { x: 115, y: cursorY - 14, size: 9, font: fontBold, color: colorDark });

  page.drawText('Transaction ID: ', { x: 220, y: cursorY - 14, size: 9, font: fontRegular, color: colorSlate });
  page.drawText(invoice.txnid, { x: 295, y: cursorY - 14, size: 9, font: fontBold, color: colorDark });

  page.drawText('Status: ', { x: 450, y: cursorY - 14, size: 9, font: fontRegular, color: colorSlate });
  page.drawText(invoice.status.toUpperCase(), { x: 490, y: cursorY - 14, size: 9, font: fontBold, color: colorEmerald });

  cursorY -= 50;

  // 3. SUPPLIER & CUSTOMER COLUMNS
  const colWidth = (width - 100) / 2;

  // Supplier Box (Left)
  page.drawText('ISSUED BY (SUPPLIER)', { x: 40, y: cursorY, size: 9, font: fontBold, color: colorViolet });
  cursorY -= 14;
  page.drawText(invoice.supplier.legalName, { x: 40, y: cursorY, size: 10, font: fontBold, color: colorDark });
  cursorY -= 12;
  page.drawText(invoice.supplier.registeredAddress, { x: 40, y: cursorY, size: 8, font: fontRegular, color: colorSlate });
  cursorY -= 12;
  page.drawText(`State: ${invoice.supplier.state}`, { x: 40, y: cursorY, size: 8, font: fontRegular, color: colorSlate });
  cursorY -= 12;
  if (invoice.supplier.gstin) {
    page.drawText(`GSTIN: ${invoice.supplier.gstin}`, { x: 40, y: cursorY, size: 8, font: fontBold, color: colorDark });
    cursorY -= 12;
  }
  page.drawText(`Email: ${invoice.supplier.supportEmail}`, { x: 40, y: cursorY, size: 8, font: fontRegular, color: colorSlate });

  // Customer Box (Right)
  let custY = cursorY + 62;
  page.drawText('BILLED TO (CUSTOMER)', { x: 40 + colWidth + 20, y: custY, size: 9, font: fontBold, color: colorViolet });
  custY -= 14;
  page.drawText(invoice.customer.name, { x: 40 + colWidth + 20, y: custY, size: 10, font: fontBold, color: colorDark });
  custY -= 12;
  page.drawText(invoice.customer.email, { x: 40 + colWidth + 20, y: custY, size: 8, font: fontRegular, color: colorSlate });
  custY -= 12;
  if (invoice.customer.address) {
    page.drawText(invoice.customer.address, { x: 40 + colWidth + 20, y: custY, size: 8, font: fontRegular, color: colorSlate });
    custY -= 12;
  }
  page.drawText(`Place of Supply: ${invoice.customer.state || invoice.supplier.state}`, {
    x: 40 + colWidth + 20,
    y: custY,
    size: 8,
    font: fontRegular,
    color: colorSlate,
  });
  custY -= 12;
  if (invoice.customer.gstin) {
    page.drawText(`Customer GSTIN: ${invoice.customer.gstin}`, {
      x: 40 + colWidth + 20,
      y: custY,
      size: 8,
      font: fontBold,
      color: colorDark,
    });
  }

  cursorY = Math.min(cursorY, custY) - 30;

  // 4. ITEMS TABLE HEADER
  page.drawRectangle({
    x: 40,
    y: cursorY - 18,
    width: width - 80,
    height: 24,
    color: colorDark,
  });

  page.drawText('ITEM DESCRIPTION', { x: 50, y: cursorY - 12, size: 8, font: fontBold, color: rgb(1, 1, 1) });
  page.drawText('SAC', { x: 260, y: cursorY - 12, size: 8, font: fontBold, color: rgb(1, 1, 1) });
  page.drawText('TAXABLE (INR)', { x: 310, y: cursorY - 12, size: 8, font: fontBold, color: rgb(1, 1, 1) });
  page.drawText('GST RATE', { x: 400, y: cursorY - 12, size: 8, font: fontBold, color: rgb(1, 1, 1) });
  page.drawText('TOTAL (INR)', { x: 470, y: cursorY - 12, size: 8, font: fontBold, color: rgb(1, 1, 1) });

  cursorY -= 26;

  // ITEMS TABLE ROWS
  invoice.items.forEach((item) => {
    page.drawRectangle({
      x: 40,
      y: cursorY - 20,
      width: width - 80,
      height: 26,
      color: rgb(0.99, 0.99, 1),
      borderColor: colorBorder,
      borderWidth: 1,
    });

    page.drawText(item.description.slice(0, 42), { x: 50, y: cursorY - 13, size: 8.5, font: fontBold, color: colorDark });
    page.drawText(item.hsnSacCode || '998314', { x: 260, y: cursorY - 13, size: 8, font: fontRegular, color: colorSlate });
    page.drawText(item.taxableValue.toFixed(2), { x: 310, y: cursorY - 13, size: 8.5, font: fontRegular, color: colorDark });
    page.drawText(`${item.gstRate}%`, { x: 400, y: cursorY - 13, size: 8.5, font: fontRegular, color: colorDark });
    page.drawText(item.totalAmount.toFixed(2), { x: 470, y: cursorY - 13, size: 8.5, font: fontBold, color: colorDark });

    cursorY -= 28;
  });

  cursorY -= 15;

  // 5. TAX BREAKDOWN & GRAND TOTAL BOX (Right Aligned)
  const summaryBoxWidth = 220;
  const hasDiscount = Boolean(invoice.discountAmount && invoice.discountAmount > 0);
  const summaryBoxHeight = hasDiscount ? 135 : 110;
  const summaryBoxX = width - 40 - summaryBoxWidth;

  page.drawRectangle({
    x: summaryBoxX,
    y: cursorY - summaryBoxHeight + 10,
    width: summaryBoxWidth,
    height: summaryBoxHeight,
    color: colorBgLight,
    borderColor: colorBorder,
    borderWidth: 1,
  });

  let sumY = cursorY - 14;

  if (hasDiscount) {
    if (invoice.originalBaseAmount) {
      page.drawText('Original Subtotal:', { x: summaryBoxX + 15, y: sumY, size: 8.5, font: fontRegular, color: colorSlate });
      page.drawText(`INR ${invoice.originalBaseAmount.toFixed(2)}`, { x: summaryBoxX + 130, y: sumY, size: 8.5, font: fontBold, color: colorDark });
      sumY -= 14;
    }
    page.drawText(`Coupon (${invoice.couponCode || 'PROMO'}):`, { x: summaryBoxX + 15, y: sumY, size: 8.5, font: fontRegular, color: colorEmerald });
    page.drawText(`-INR ${invoice.discountAmount!.toFixed(2)}`, { x: summaryBoxX + 130, y: sumY, size: 8.5, font: fontBold, color: colorEmerald });
    sumY -= 14;
  }

  page.drawText('Base Taxable Value:', { x: summaryBoxX + 15, y: sumY, size: 8.5, font: fontRegular, color: colorSlate });
  page.drawText(`INR ${invoice.baseAmount.toFixed(2)}`, { x: summaryBoxX + 130, y: sumY, size: 8.5, font: fontBold, color: colorDark });

  sumY -= 16;
  if (invoice.cgstAmount > 0) {
    page.drawText('CGST @ 9%:', { x: summaryBoxX + 15, y: sumY, size: 8.5, font: fontRegular, color: colorSlate });
    page.drawText(`INR ${invoice.cgstAmount.toFixed(2)}`, { x: summaryBoxX + 130, y: sumY, size: 8.5, font: fontRegular, color: colorDark });
    sumY -= 16;
    page.drawText('SGST @ 9%:', { x: summaryBoxX + 15, y: sumY, size: 8.5, font: fontRegular, color: colorSlate });
    page.drawText(`INR ${invoice.sgstAmount.toFixed(2)}`, { x: summaryBoxX + 130, y: sumY, size: 8.5, font: fontRegular, color: colorDark });
    sumY -= 16;
  } else {
    page.drawText('IGST @ 18%:', { x: summaryBoxX + 15, y: sumY, size: 8.5, font: fontRegular, color: colorSlate });
    page.drawText(`INR ${invoice.igstAmount.toFixed(2)}`, { x: summaryBoxX + 130, y: sumY, size: 8.5, font: fontRegular, color: colorDark });
    sumY -= 16;
  }

  // Divider
  page.drawLine({
    start: { x: summaryBoxX + 10, y: sumY + 4 },
    end: { x: summaryBoxX + summaryBoxWidth - 10, y: sumY + 4 },
    thickness: 1,
    color: colorBorder,
  });

  page.drawText('Grand Total:', { x: summaryBoxX + 15, y: sumY - 10, size: 10, font: fontBold, color: colorDark });
  page.drawText(`INR ${invoice.totalAmount.toFixed(2)}`, { x: summaryBoxX + 120, y: sumY - 10, size: 11, font: fontBold, color: colorViolet });

  // 6. TERMS & FOOTER
  cursorY = 90;

  page.drawLine({
    start: { x: 40, y: cursorY },
    end: { x: width - 40, y: cursorY },
    thickness: 0.5,
    color: colorBorder,
  });

  cursorY -= 16;
  page.drawText('TERMS & CONDITIONS:', { x: 40, y: cursorY, size: 7.5, font: fontBold, color: colorSlate });
  cursorY -= 10;
  page.drawText('1. Creative credits are credited immediately upon verified PayU payment clearance.', {
    x: 40,
    y: cursorY,
    size: 7,
    font: fontRegular,
    color: colorLightSlate,
  });
  cursorY -= 9;
  page.drawText('2. All transactions are governed by the Fluvia Flow Terms of Service and Refund Policy at fluviaflow.ai/terms.', {
    x: 40,
    y: cursorY,
    size: 7,
    font: fontRegular,
    color: colorLightSlate,
  });
  cursorY -= 9;
  page.drawText('3. This is a computer-generated tax invoice and requires no physical signature.', {
    x: 40,
    y: cursorY,
    size: 7,
    font: fontRegular,
    color: colorLightSlate,
  });

  return await doc.save();
}

/**
 * Generate an official, professional Payment Receipt PDF using pdf-lib
 */
export async function generateReceiptPdf(
  receipt: PaymentReceipt,
  invoice?: Invoice
): Promise<Uint8Array> {
  const doc = await PDFDocument.create();
  const page = doc.addPage([595.28, 841.89]); // A4
  const { width, height } = page.getSize();

  const fontRegular = await doc.embedFont(StandardFonts.Helvetica);
  const fontBold = await doc.embedFont(StandardFonts.HelveticaBold);

  const colorDark = rgb(0.04, 0.05, 0.07);
  const colorViolet = rgb(0.43, 0.23, 0.94);
  const colorSlate = rgb(0.3, 0.35, 0.45);
  const colorLightSlate = rgb(0.5, 0.55, 0.65);
  const colorEmerald = rgb(0.06, 0.65, 0.42);
  const colorBorder = rgb(0.85, 0.88, 0.92);
  const colorBgLight = rgb(0.96, 0.97, 0.99);

  let cursorY = height - 40;

  // Header Banner
  page.drawRectangle({
    x: 0,
    y: cursorY - 30,
    width,
    height: 70,
    color: colorDark,
  });

  page.drawText('FLUVIA FLOW', {
    x: 40,
    y: cursorY,
    size: 20,
    font: fontBold,
    color: rgb(1, 1, 1),
  });

  page.drawText('Payment Gateway Integration & Settlement Receipt', {
    x: 40,
    y: cursorY - 14,
    size: 8,
    font: fontRegular,
    color: rgb(0.7, 0.75, 0.85),
  });

  const receiptTitle = 'OFFICIAL PAYMENT RECEIPT';
  const titleWidth = fontBold.widthOfTextAtSize(receiptTitle, 14);
  page.drawText(receiptTitle, {
    x: width - 40 - titleWidth,
    y: cursorY,
    size: 14,
    font: fontBold,
    color: rgb(1, 1, 1),
  });

  const rcpNumWidth = fontBold.widthOfTextAtSize(receipt.receiptNumber, 11);
  page.drawText(receipt.receiptNumber, {
    x: width - 40 - rcpNumWidth,
    y: cursorY - 14,
    size: 11,
    font: fontBold,
    color: colorEmerald,
  });

  cursorY -= 70;

  // Amount Received Big Card
  page.drawRectangle({
    x: 40,
    y: cursorY - 60,
    width: width - 80,
    height: 64,
    color: colorBgLight,
    borderColor: colorBorder,
    borderWidth: 1,
  });

  page.drawText('TOTAL AMOUNT RECEIVED', {
    x: 60,
    y: cursorY - 20,
    size: 9,
    font: fontBold,
    color: colorViolet,
  });

  page.drawText(`INR ${receipt.amountReceived.toFixed(2)}`, {
    x: 60,
    y: cursorY - 48,
    size: 24,
    font: fontBold,
    color: colorDark,
  });

  if (receipt.discountAmount && receipt.discountAmount > 0) {
    page.drawText(`Coupon ${receipt.couponCode || 'PROMO'} Applied (-INR ${receipt.discountAmount.toFixed(2)})`, {
      x: 60,
      y: cursorY - 60,
      size: 7.5,
      font: fontBold,
      color: colorEmerald,
    });
  }

  // Verified Badge
  page.drawRectangle({
    x: width - 200,
    y: cursorY - 45,
    width: 140,
    height: 26,
    color: rgb(0.9, 0.98, 0.94),
    borderColor: colorEmerald,
    borderWidth: 1,
  });

  page.drawText('VERIFIED SUCCESS', {
    x: width - 185,
    y: cursorY - 36,
    size: 9,
    font: fontBold,
    color: colorEmerald,
  });

  cursorY -= 85;

  // Receipt Details Grid
  const details = [
    { label: 'Merchant Transaction ID (txnid):', val: receipt.txnid },
    { label: 'PayU Payment ID (mihpayid):', val: receipt.payuMihpayid || 'N/A' },
    { label: 'Bank Reference Number:', val: receipt.payuBankRefNum || 'N/A' },
    { label: 'Payment Method:', val: receipt.paymentMethod || 'PayU Hosted Checkout' },
    { label: 'Customer Name:', val: receipt.customerName },
    { label: 'Customer Email:', val: receipt.customerEmail },
    { label: 'Product Purchased:', val: receipt.productPurchased },
    {
      label: 'Payment Timestamp:',
      val: new Date(receipt.paymentDate).toLocaleString('en-IN', {
        dateStyle: 'medium',
        timeStyle: 'medium',
      }),
    },
    { label: 'Linked Invoice Number:', val: receipt.invoiceNumber || invoice?.invoiceNumber || 'N/A' },
    { label: 'Cryptographic Reference:', val: receipt.verificationReference },
  ];

  details.forEach((item) => {
    page.drawText(item.label, { x: 50, y: cursorY, size: 8.5, font: fontRegular, color: colorSlate });
    page.drawText(item.val, { x: 230, y: cursorY, size: 9, font: fontBold, color: colorDark });

    page.drawLine({
      start: { x: 40, y: cursorY - 6 },
      end: { x: width - 40, y: cursorY - 6 },
      thickness: 0.5,
      color: colorBorder,
    });

    cursorY -= 24;
  });

  // Footer Notice
  cursorY = 80;
  page.drawLine({
    start: { x: 40, y: cursorY },
    end: { x: width - 40, y: cursorY },
    thickness: 0.5,
    color: colorBorder,
  });

  cursorY -= 18;
  page.drawText('IMPORTANT NOTICE:', { x: 40, y: cursorY, size: 8, font: fontBold, color: colorSlate });
  cursorY -= 12;
  page.drawText(
    receipt.footerNotice ||
      'Computer-generated payment receipt. Payment status is subject to verification against the merchant payment records.',
    {
      x: 40,
      y: cursorY,
      size: 7.5,
      font: fontRegular,
      color: colorLightSlate,
    }
  );
  cursorY -= 10;
  page.drawText('For billing inquiries, reach out to billing@fluviaflow.ai quoting your Merchant Transaction ID.', {
    x: 40,
    y: cursorY,
    size: 7.5,
    font: fontRegular,
    color: colorLightSlate,
  });

  return await doc.save();
}
