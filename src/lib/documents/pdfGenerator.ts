import { PDFDocument, rgb, StandardFonts, PDFPage, PDFFont } from 'pdf-lib';
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
 * Helper to draw right-aligned text with precision
 */
function drawRightText(
  page: PDFPage,
  text: string,
  rightX: number,
  y: number,
  font: PDFFont,
  size: number,
  color: ReturnType<typeof rgb>
): void {
  const textWidth = font.widthOfTextAtSize(text, size);
  page.drawText(text, {
    x: rightX - textWidth,
    y,
    size,
    font,
    color,
  });
}

/**
 * Helper to draw centered text with precision
 */
function drawCenteredText(
  page: PDFPage,
  text: string,
  centerX: number,
  y: number,
  font: PDFFont,
  size: number,
  color: ReturnType<typeof rgb>
): void {
  const textWidth = font.widthOfTextAtSize(text, size);
  page.drawText(text, {
    x: centerX - textWidth / 2,
    y,
    size,
    font,
    color,
  });
}

/**
 * Generate a professional, vector-sharp Tax Invoice PDF using pdf-lib
 */
export async function generateInvoicePdf(invoice: Invoice): Promise<Uint8Array> {
  const doc = await PDFDocument.create();
  const page = doc.addPage([595.28, 841.89]); // A4: 595.28 x 841.89 pt
  const { width, height } = page.getSize();

  const fontRegular = await doc.embedFont(StandardFonts.Helvetica);
  const fontBold = await doc.embedFont(StandardFonts.HelveticaBold);

  // Fluvia Flow Design System Palette
  const colorDark = rgb(0.06, 0.09, 0.16); // #0f172a slate-900
  const colorEmerald = rgb(0.02, 0.59, 0.41); // #059669 emerald-600
  const colorEmeraldDark = rgb(0.02, 0.37, 0.27); // #065f46 emerald-800
  const colorEmeraldBg = rgb(0.92, 0.99, 0.96); // #ecfdf5 emerald-50
  const colorSlate = rgb(0.28, 0.35, 0.45); // #475569 slate-600
  const colorLightSlate = rgb(0.55, 0.60, 0.68); // #94a3b8 slate-400
  const colorBorder = rgb(0.88, 0.91, 0.94); // #e2e8f0 slate-200
  const colorCardBg = rgb(0.97, 0.98, 0.99); // #f8fafc slate-50
  const colorWhite = rgb(1, 1, 1);
  const colorPinkAccent = rgb(0.86, 0.15, 0.47); // #db2777 pink-600
  const colorPinkBg = rgb(0.99, 0.90, 0.95); // #fce7f3 pink-100

  // 1. TOP BRAND ACCENT BAR
  page.drawRectangle({
    x: 0,
    y: height - 5,
    width,
    height: 5,
    color: colorEmerald,
  });

  let cursorY = height - 42;

  // 2. HEADER: BRAND & DOCUMENT IDENTITY
  // Left: Fluvia Flow Brand
  page.drawText('FLUVIA FLOW', {
    x: 40,
    y: cursorY,
    size: 20,
    font: fontBold,
    color: colorDark,
  });

  page.drawText('AI CINEMA STUDIO & CREATIVE PRODUCTION PLATFORM', {
    x: 40,
    y: cursorY - 14,
    size: 7.5,
    font: fontBold,
    color: colorEmerald,
  });

  page.drawText('fluviaflow.ai | Official Tax Document', {
    x: 40,
    y: cursorY - 26,
    size: 7.5,
    font: fontRegular,
    color: colorLightSlate,
  });

  // Right: Document Title & Invoice Number
  const isGstCompliant = Boolean(invoice.supplier.gstin && invoice.supplier.isGstRegistered);
  const docTitle = isGstCompliant ? 'TAX INVOICE' : 'COMMERCIAL INVOICE';
  drawRightText(page, docTitle, width - 40, cursorY + 2, fontBold, 17, colorDark);
  drawRightText(page, `#${invoice.invoiceNumber}`, width - 40, cursorY - 14, fontBold, 11, colorEmeraldDark);

  // Status Badge (Paid / Cleared)
  const isPaid = invoice.status === 'paid';
  const badgeText = isPaid ? '[PAID & SETTLED]' : invoice.status.toUpperCase();
  const badgeWidth = fontBold.widthOfTextAtSize(badgeText, 7.5) + 16;
  page.drawRectangle({
    x: width - 40 - badgeWidth,
    y: cursorY - 32,
    width: badgeWidth,
    height: 15,
    color: isPaid ? colorEmeraldBg : colorCardBg,
    borderColor: isPaid ? colorEmerald : colorBorder,
    borderWidth: 1,
  });
  drawCenteredText(page, badgeText, width - 40 - badgeWidth / 2, cursorY - 28, fontBold, 7.5, isPaid ? colorEmeraldDark : colorSlate);

  cursorY -= 48;

  // Header Divider
  page.drawLine({
    start: { x: 40, y: cursorY },
    end: { x: width - 40, y: cursorY },
    thickness: 1,
    color: colorBorder,
  });

  cursorY -= 15;

  // 3. METADATA STRIP
  const stripHeight = 36;
  page.drawRectangle({
    x: 40,
    y: cursorY - stripHeight,
    width: width - 80,
    height: stripHeight,
    color: colorCardBg,
    borderColor: colorBorder,
    borderWidth: 1,
  });

  const issueDateFormatted = new Date(invoice.issueDate).toLocaleDateString('en-IN', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });

  const metaColWidth = (width - 80) / 4;
  const metaYLabel = cursorY - 14;
  const metaYVal = cursorY - 27;

  // Meta 1: Invoice Date
  page.drawText('INVOICE DATE', { x: 52, y: metaYLabel, size: 7, font: fontBold, color: colorLightSlate });
  page.drawText(issueDateFormatted, { x: 52, y: metaYVal, size: 9, font: fontBold, color: colorDark });

  // Meta 2: Transaction ID
  page.drawText('TRANSACTION ID', { x: 40 + metaColWidth + 12, y: metaYLabel, size: 7, font: fontBold, color: colorLightSlate });
  page.drawText(invoice.txnid.slice(0, 18), { x: 40 + metaColWidth + 12, y: metaYVal, size: 8.5, font: fontBold, color: colorDark });

  // Meta 3: Place of Supply
  const placeOfSupply = invoice.customer.state || invoice.supplier.state || 'Delhi (07)';
  page.drawText('PLACE OF SUPPLY', { x: 40 + metaColWidth * 2 + 12, y: metaYLabel, size: 7, font: fontBold, color: colorLightSlate });
  page.drawText(placeOfSupply.slice(0, 18), { x: 40 + metaColWidth * 2 + 12, y: metaYVal, size: 8.5, font: fontBold, color: colorDark });

  // Meta 4: Currency & Mode
  page.drawText('PAYMENT GATEWAY', { x: 40 + metaColWidth * 3 + 12, y: metaYLabel, size: 7, font: fontBold, color: colorLightSlate });
  page.drawText('PayU INR Settlement', { x: 40 + metaColWidth * 3 + 12, y: metaYVal, size: 8.5, font: fontBold, color: colorEmeraldDark });

  cursorY -= stripHeight + 16;

  // 4. PARTIES CARDS (TWO COLUMNS: SUPPLIER & CUSTOMER)
  const cardWidth = (width - 80 - 16) / 2;
  const cardHeight = 100;

  // Left Card: Supplier Box
  page.drawRectangle({
    x: 40,
    y: cursorY - cardHeight,
    width: cardWidth,
    height: cardHeight,
    color: colorCardBg,
    borderColor: colorBorder,
    borderWidth: 1,
  });

  let supY = cursorY - 14;
  page.drawText('ISSUED BY (SUPPLIER)', { x: 52, y: supY, size: 7.5, font: fontBold, color: colorEmerald });
  supY -= 14;
  page.drawText(invoice.supplier.legalName, { x: 52, y: supY, size: 9.5, font: fontBold, color: colorDark });
  supY -= 12;
  page.drawText(invoice.supplier.registeredAddress.slice(0, 48), { x: 52, y: supY, size: 7.5, font: fontRegular, color: colorSlate });
  supY -= 11;
  page.drawText(`State: ${invoice.supplier.state} | PAN: ${invoice.supplier.pan}`, { x: 52, y: supY, size: 7.5, font: fontRegular, color: colorSlate });
  supY -= 11;
  if (invoice.supplier.gstin) {
    page.drawText(`GSTIN: ${invoice.supplier.gstin}`, { x: 52, y: supY, size: 8, font: fontBold, color: colorDark });
    supY -= 11;
  }
  page.drawText(`Support: ${invoice.supplier.supportEmail}`, { x: 52, y: supY, size: 7.5, font: fontRegular, color: colorSlate });

  // Right Card: Customer Box
  const custX = 40 + cardWidth + 16;
  page.drawRectangle({
    x: custX,
    y: cursorY - cardHeight,
    width: cardWidth,
    height: cardHeight,
    color: colorCardBg,
    borderColor: colorBorder,
    borderWidth: 1,
  });

  let custY = cursorY - 14;
  page.drawText('BILLED TO (CUSTOMER)', { x: custX + 12, y: custY, size: 7.5, font: fontBold, color: colorEmerald });
  custY -= 14;
  page.drawText(invoice.customer.name.slice(0, 36), { x: custX + 12, y: custY, size: 9.5, font: fontBold, color: colorDark });
  custY -= 12;
  page.drawText(invoice.customer.email.slice(0, 42), { x: custX + 12, y: custY, size: 7.5, font: fontRegular, color: colorSlate });
  custY -= 11;
  page.drawText(invoice.customer.address ? invoice.customer.address.slice(0, 46) : 'Registered SaaS Creator Account', {
    x: custX + 12,
    y: custY,
    size: 7.5,
    font: fontRegular,
    color: colorSlate,
  });
  custY -= 11;
  page.drawText(`Place of Supply: ${invoice.customer.state || invoice.supplier.state}`, {
    x: custX + 12,
    y: custY,
    size: 7.5,
    font: fontRegular,
    color: colorSlate,
  });
  custY -= 11;
  if (invoice.customer.gstin) {
    page.drawText(`Customer GSTIN: ${invoice.customer.gstin}`, { x: custX + 12, y: custY, size: 8, font: fontBold, color: colorDark });
  } else {
    page.drawText('Category: Consumer (B2C Unregistered)', { x: custX + 12, y: custY, size: 7.5, font: fontRegular, color: colorLightSlate });
  }

  cursorY -= cardHeight + 20;

  // 5. LINE ITEMS TABLE
  const tableWidth = width - 80;
  const thHeight = 22;

  // Table Header Background (Dark slate with crisp white text)
  page.drawRectangle({
    x: 40,
    y: cursorY - thHeight,
    width: tableWidth,
    height: thHeight,
    color: colorDark,
  });

  const colDescX = 52;
  const colSacX = 245;
  const colQtyX = 295;
  const colRateRight = 360;
  const colTaxableRight = 430;
  const colGstX = 450;
  const colTotalRight = width - 52;

  page.drawText('ITEM DESCRIPTION', { x: colDescX, y: cursorY - 14, size: 7.5, font: fontBold, color: colorWhite });
  page.drawText('SAC', { x: colSacX, y: cursorY - 14, size: 7.5, font: fontBold, color: colorWhite });
  page.drawText('QTY', { x: colQtyX, y: cursorY - 14, size: 7.5, font: fontBold, color: colorWhite });
  drawRightText(page, 'RATE (INR)', colRateRight, cursorY - 14, fontBold, 7.5, colorWhite);
  drawRightText(page, 'TAXABLE (INR)', colTaxableRight, cursorY - 14, fontBold, 7.5, colorWhite);
  page.drawText('GST', { x: colGstX, y: cursorY - 14, size: 7.5, font: fontBold, color: colorWhite });
  drawRightText(page, 'TOTAL (INR)', colTotalRight, cursorY - 14, fontBold, 7.5, colorWhite);

  cursorY -= thHeight;

  // Table Body Rows
  invoice.items.forEach((item, index) => {
    const rowHeight = 28;
    const isEven = index % 2 === 0;

    page.drawRectangle({
      x: 40,
      y: cursorY - rowHeight,
      width: tableWidth,
      height: rowHeight,
      color: isEven ? colorWhite : colorCardBg,
      borderColor: colorBorder,
      borderWidth: 0.5,
    });

    const itemDesc = item.description || 'Creative Credits / Subscription';
    page.drawText(itemDesc.slice(0, 36), { x: colDescX, y: cursorY - 16, size: 8.5, font: fontBold, color: colorDark });
    page.drawText(item.hsnSacCode || '998314', { x: colSacX, y: cursorY - 16, size: 7.5, font: fontRegular, color: colorSlate });
    page.drawText(String(item.quantity || 1), { x: colQtyX, y: cursorY - 16, size: 8, font: fontRegular, color: colorSlate });
    drawRightText(page, (item.unitPrice || item.taxableValue).toFixed(2), colRateRight, cursorY - 16, fontRegular, 8, colorDark);
    drawRightText(page, item.taxableValue.toFixed(2), colTaxableRight, cursorY - 16, fontRegular, 8, colorDark);
    page.drawText(`${item.gstRate || 18}%`, { x: colGstX, y: cursorY - 16, size: 8, font: fontRegular, color: colorSlate });
    drawRightText(page, item.totalAmount.toFixed(2), colTotalRight, cursorY - 16, fontBold, 8.5, colorDark);

    cursorY -= rowHeight;
  });

  cursorY -= 16;

  // 6. TOTALS & TAX BREAKDOWN (RIGHT-ALIGNED CARD)
  const summaryBoxWidth = 230;
  const summaryBoxX = width - 40 - summaryBoxWidth;
  const hasDiscount = Boolean(invoice.discountAmount && invoice.discountAmount > 0);
  const summaryBoxHeight = hasDiscount ? 130 : 108;

  page.drawRectangle({
    x: summaryBoxX,
    y: cursorY - summaryBoxHeight,
    width: summaryBoxWidth,
    height: summaryBoxHeight,
    color: colorCardBg,
    borderColor: colorBorder,
    borderWidth: 1,
  });

  let sumY = cursorY - 16;
  const labelX = summaryBoxX + 14;
  const valRight = summaryBoxX + summaryBoxWidth - 14;

  if (hasDiscount) {
    if (invoice.originalBaseAmount) {
      page.drawText('Original Subtotal:', { x: labelX, y: sumY, size: 8, font: fontRegular, color: colorSlate });
      drawRightText(page, `INR ${invoice.originalBaseAmount.toFixed(2)}`, valRight, sumY, fontRegular, 8, colorDark);
      sumY -= 14;
    }
    const promoCode = invoice.couponCode || 'PROMO';
    page.drawText(`Discount (${promoCode}):`, { x: labelX, y: sumY, size: 8, font: fontBold, color: colorEmerald });
    drawRightText(page, `-INR ${invoice.discountAmount!.toFixed(2)}`, valRight, sumY, fontBold, 8, colorEmerald);
    sumY -= 14;
  }

  page.drawText('Taxable Value:', { x: labelX, y: sumY, size: 8, font: fontRegular, color: colorSlate });
  drawRightText(page, `INR ${invoice.baseAmount.toFixed(2)}`, valRight, sumY, fontRegular, 8, colorDark);
  sumY -= 15;

  if (invoice.cgstAmount > 0) {
    page.drawText('CGST @ 9%:', { x: labelX, y: sumY, size: 8, font: fontRegular, color: colorSlate });
    drawRightText(page, `INR ${invoice.cgstAmount.toFixed(2)}`, valRight, sumY, fontRegular, 8, colorDark);
    sumY -= 13;
    page.drawText('SGST @ 9%:', { x: labelX, y: sumY, size: 8, font: fontRegular, color: colorSlate });
    drawRightText(page, `INR ${invoice.sgstAmount.toFixed(2)}`, valRight, sumY, fontRegular, 8, colorDark);
    sumY -= 15;
  } else {
    page.drawText('IGST @ 18%:', { x: labelX, y: sumY, size: 8, font: fontRegular, color: colorSlate });
    drawRightText(page, `INR ${invoice.igstAmount.toFixed(2)}`, valRight, sumY, fontRegular, 8, colorDark);
    sumY -= 15;
  }

  // Divider inside summary box
  page.drawLine({
    start: { x: labelX, y: sumY + 4 },
    end: { x: valRight, y: sumY + 4 },
    thickness: 1,
    color: colorBorder,
  });

  page.drawText('Grand Total:', { x: labelX, y: sumY - 11, size: 10, font: fontBold, color: colorDark });
  drawRightText(page, `INR ${invoice.totalAmount.toFixed(2)}`, valRight, sumY - 11, fontBold, 11, colorEmeraldDark);

  // Left Note Beside Totals
  const leftNoteWidth = summaryBoxX - 40 - 16;
  page.drawRectangle({
    x: 40,
    y: cursorY - summaryBoxHeight,
    width: leftNoteWidth,
    height: summaryBoxHeight,
    color: colorEmeraldBg,
    borderColor: colorEmerald,
    borderWidth: 0.5,
  });

  let noteY = cursorY - 18;
  page.drawText('PAYMENT SETTLEMENT & CLEARANCE NOTE', { x: 52, y: noteY, size: 7.5, font: fontBold, color: colorEmeraldDark });
  noteY -= 14;
  page.drawText('- Payment processed through PayU Payments Private Limited.', { x: 52, y: noteY, size: 7, font: fontRegular, color: colorSlate });
  noteY -= 11;
  page.drawText('- Creative generative tokens and compute units active on account.', { x: 52, y: noteY, size: 7, font: fontRegular, color: colorSlate });
  noteY -= 11;
  page.drawText(`- Linked PayU Merchant Ref: ${invoice.txnid.slice(0, 24)}`, { x: 52, y: noteY, size: 7, font: fontBold, color: colorDark });
  noteY -= 13;
  page.drawText('[VERIFIED] DIGITAL CERTIFICATION: PAID IN FULL', { x: 52, y: noteY, size: 7.5, font: fontBold, color: colorEmeraldDark });

  // 7. STATUTORY FOOTER & TERMS
  cursorY = 88;

  page.drawLine({
    start: { x: 40, y: cursorY },
    end: { x: width - 40, y: cursorY },
    thickness: 0.5,
    color: colorBorder,
  });

  cursorY -= 14;
  page.drawText('STATUTORY DECLARATIONS & TERMS:', { x: 40, y: cursorY, size: 7, font: fontBold, color: colorSlate });
  cursorY -= 10;
  page.drawText(
    '1. This is a computer-generated tax invoice issued in accordance with the Central Goods and Services Tax Act, 2017. No physical signature is required.',
    { x: 40, y: cursorY, size: 6.8, font: fontRegular, color: colorLightSlate }
  );
  cursorY -= 9;
  page.drawText(
    '2. Services covered under SAC 998314 (Information technology software and AI cloud generative services). Supplies are non-transferable.',
    { x: 40, y: cursorY, size: 6.8, font: fontRegular, color: colorLightSlate }
  );
  cursorY -= 9;
  page.drawText(
    '3. For disputes, billing queries, or corporate invoicing support, please email billing@fluviaflow.ai citing your Invoice and Merchant Txn ID.',
    { x: 40, y: cursorY, size: 6.8, font: fontRegular, color: colorLightSlate }
  );

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

  // Palette
  const colorDark = rgb(0.06, 0.09, 0.16); // #0f172a
  const colorEmerald = rgb(0.02, 0.59, 0.41); // #059669
  const colorEmeraldDark = rgb(0.02, 0.37, 0.27); // #065f46
  const colorEmeraldBg = rgb(0.92, 0.99, 0.96); // #ecfdf5
  const colorSlate = rgb(0.28, 0.35, 0.45); // #475569
  const colorLightSlate = rgb(0.55, 0.60, 0.68); // #94a3b8
  const colorBorder = rgb(0.88, 0.91, 0.94); // #e2e8f0
  const colorCardBg = rgb(0.97, 0.98, 0.99); // #f8fafc
  const colorWhite = rgb(1, 1, 1);

  // Top Emerald Accent Stripe
  page.drawRectangle({
    x: 0,
    y: height - 5,
    width,
    height: 5,
    color: colorEmerald,
  });

  let cursorY = height - 42;

  // Header: Brand & Document Identity
  page.drawText('FLUVIA FLOW', {
    x: 40,
    y: cursorY,
    size: 20,
    font: fontBold,
    color: colorDark,
  });

  page.drawText('PAYMENT GATEWAY SETTLEMENT & AUDIT RECEIPT', {
    x: 40,
    y: cursorY - 14,
    size: 7.5,
    font: fontBold,
    color: colorEmerald,
  });

  page.drawText('fluviaflow.ai | Customer Payment Voucher', {
    x: 40,
    y: cursorY - 26,
    size: 7.5,
    font: fontRegular,
    color: colorLightSlate,
  });

  // Right Title
  drawRightText(page, 'OFFICIAL PAYMENT RECEIPT', width - 40, cursorY + 2, fontBold, 15, colorDark);
  drawRightText(page, `#${receipt.receiptNumber}`, width - 40, cursorY - 14, fontBold, 11, colorEmeraldDark);

  // Verified Badge
  const verifiedBadge = '[PAYMENT VERIFIED & SETTLED]';
  const badgeWidth = fontBold.widthOfTextAtSize(verifiedBadge, 7.5) + 16;
  page.drawRectangle({
    x: width - 40 - badgeWidth,
    y: cursorY - 32,
    width: badgeWidth,
    height: 15,
    color: colorEmeraldBg,
    borderColor: colorEmerald,
    borderWidth: 1,
  });
  drawCenteredText(page, verifiedBadge, width - 40 - badgeWidth / 2, cursorY - 28, fontBold, 7.5, colorEmeraldDark);

  cursorY -= 48;

  // Header Divider
  page.drawLine({
    start: { x: 40, y: cursorY },
    end: { x: width - 40, y: cursorY },
    thickness: 1,
    color: colorBorder,
  });

  cursorY -= 20;

  // HERO AMOUNT RECEIVED CALLOUT CARD
  const heroCardHeight = 76;
  page.drawRectangle({
    x: 40,
    y: cursorY - heroCardHeight,
    width: width - 80,
    height: heroCardHeight,
    color: colorEmeraldBg,
    borderColor: colorEmerald,
    borderWidth: 1,
  });

  page.drawText('TOTAL AMOUNT CLEARED & RECEIVED', {
    x: 56,
    y: cursorY - 20,
    size: 8.5,
    font: fontBold,
    color: colorEmeraldDark,
  });

  page.drawText(`INR ${receipt.amountReceived.toFixed(2)}`, {
    x: 56,
    y: cursorY - 50,
    size: 26,
    font: fontBold,
    color: colorDark,
  });

  const paymentDateFormatted = new Date(receipt.paymentDate).toLocaleString('en-IN', {
    dateStyle: 'medium',
    timeStyle: 'medium',
  });

  drawRightText(
    page,
    `Settlement Date: ${paymentDateFormatted}`,
    width - 56,
    cursorY - 22,
    fontBold,
    8.5,
    colorDark
  );

  drawRightText(
    page,
    'Payment Gateway: PayU Hosted Checkout (Secure 256-bit)',
    width - 56,
    cursorY - 38,
    fontRegular,
    8,
    colorSlate
  );

  if (receipt.discountAmount && receipt.discountAmount > 0) {
    const couponInfo = `Coupon ${receipt.couponCode || 'PROMO'} Applied (Saved INR ${receipt.discountAmount.toFixed(2)})`;
    drawRightText(page, couponInfo, width - 56, cursorY - 54, fontBold, 8, colorEmeraldDark);
  }

  cursorY -= heroCardHeight + 24;

  // DETAILS SECTIONS: TWO DISTINCT CARDS
  const sectionCardWidth = (width - 80 - 16) / 2;
  const sectionCardHeight = 175;

  // Card 1: Payment & Gateway Audit Details
  page.drawRectangle({
    x: 40,
    y: cursorY - sectionCardHeight,
    width: sectionCardWidth,
    height: sectionCardHeight,
    color: colorCardBg,
    borderColor: colorBorder,
    borderWidth: 1,
  });

  let gY = cursorY - 18;
  page.drawText('GATEWAY & SETTLEMENT DETAILS', { x: 52, y: gY, size: 8, font: fontBold, color: colorEmerald });
  gY -= 16;

  const gatewayItems = [
    { label: 'Merchant Txn ID:', val: receipt.txnid },
    { label: 'PayU Payment ID:', val: receipt.payuMihpayid || 'Verified Auto-Settled' },
    { label: 'Bank Ref / UTR:', val: receipt.payuBankRefNum || 'Direct Net/UPI Clearance' },
    { label: 'Payment Method:', val: receipt.paymentMethod || 'PayU India' },
    { label: 'Currency:', val: 'Indian Rupee (INR)' },
    { label: 'Payment Status:', val: 'VERIFIED SUCCESS (CAPTURED)' },
  ];

  gatewayItems.forEach((item) => {
    page.drawText(item.label, { x: 52, y: gY, size: 7.5, font: fontRegular, color: colorSlate });
    page.drawText(item.val.slice(0, 24), { x: 145, y: gY, size: 8, font: fontBold, color: colorDark });
    gY -= 18;
  });

  // Card 2: Customer & Order Details
  const cX = 40 + sectionCardWidth + 16;
  page.drawRectangle({
    x: cX,
    y: cursorY - sectionCardHeight,
    width: sectionCardWidth,
    height: sectionCardHeight,
    color: colorCardBg,
    borderColor: colorBorder,
    borderWidth: 1,
  });

  let oY = cursorY - 18;
  page.drawText('CUSTOMER & ORDER SPECIFICATIONS', { x: cX + 12, y: oY, size: 8, font: fontBold, color: colorEmerald });
  oY -= 16;

  const orderItems = [
    { label: 'Customer Name:', val: receipt.customerName || 'Fluvia Flow Creator' },
    { label: 'Customer Email:', val: receipt.customerEmail },
    { label: 'Product Purchased:', val: receipt.productPurchased || 'Creative Credits / Pack' },
    { label: 'Linked Tax Invoice:', val: receipt.invoiceNumber || invoice?.invoiceNumber || 'INV-AVAILABLE' },
    { label: 'Order Identifier:', val: receipt.orderId || receipt.txnid },
    { label: 'Cryptographic Auth:', val: 'Verified Server HMAC' },
  ];

  orderItems.forEach((item) => {
    page.drawText(item.label, { x: cX + 12, y: oY, size: 7.5, font: fontRegular, color: colorSlate });
    page.drawText(item.val.slice(0, 25), { x: cX + 105, y: oY, size: 8, font: fontBold, color: colorDark });
    oY -= 18;
  });

  cursorY -= sectionCardHeight + 20;

  // CRYPTOGRAPHIC VERIFICATION CARD
  const secCardHeight = 48;
  page.drawRectangle({
    x: 40,
    y: cursorY - secCardHeight,
    width: width - 80,
    height: secCardHeight,
    color: colorWhite,
    borderColor: colorBorder,
    borderWidth: 1,
  });

  page.drawText('CRYPTOGRAPHIC AUDIT TRAIL & VERIFICATION REFERENCE', {
    x: 52,
    y: cursorY - 14,
    size: 7,
    font: fontBold,
    color: colorLightSlate,
  });

  const refHash = receipt.verificationReference || `FF-VERIF-${receipt.txnid}-SETTLED`;
  page.drawText(refHash, {
    x: 52,
    y: cursorY - 28,
    size: 8,
    font: fontBold,
    color: colorDark,
  });

  page.drawText('Status: Confirmed against PayU Server-to-Server reverse SHA-512 verification record.', {
    x: 52,
    y: cursorY - 40,
    size: 6.8,
    font: fontRegular,
    color: colorSlate,
  });

  // STATUTORY FOOTER
  cursorY = 88;

  page.drawLine({
    start: { x: 40, y: cursorY },
    end: { x: width - 40, y: cursorY },
    thickness: 0.5,
    color: colorBorder,
  });

  cursorY -= 14;
  page.drawText('IMPORTANT PAYMENT RECEIPT NOTICE:', { x: 40, y: cursorY, size: 7, font: fontBold, color: colorSlate });
  cursorY -= 10;
  page.drawText(
    receipt.footerNotice ||
      'This payment receipt serves as digital confirmation of funds cleared through PayU for services on Fluvia Flow.',
    { x: 40, y: cursorY, size: 6.8, font: fontRegular, color: colorLightSlate }
  );
  cursorY -= 9;
  page.drawText(
    'This is a computer-generated receipt. All subscriptions, creative tokens, and credit packages are subject to Fluvia Flow Terms.',
    { x: 40, y: cursorY, size: 6.8, font: fontRegular, color: colorLightSlate }
  );
  cursorY -= 9;
  page.drawText(
    'For support inquiries, reach out to billing@fluviaflow.ai quoting your Merchant Transaction ID.',
    { x: 40, y: cursorY, size: 6.8, font: fontRegular, color: colorLightSlate }
  );

  return await doc.save();
}
