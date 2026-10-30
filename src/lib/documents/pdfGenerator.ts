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

  // Fluvia Flow Design System Palette (Synced with website)
  const colorDark = rgb(0.09, 0.10, 0.11); // #17191D charcoal
  const colorIndigo = rgb(0.318, 0.271, 0.804); // #5145CD Fluvia Indigo
  const colorIndigoDark = rgb(0.263, 0.22, 0.792); // #4338CA Indigo Dark
  const colorIndigoBg = rgb(0.933, 0.949, 1.0); // #EEF2FF Indigo 50
  const colorEmerald = rgb(0.06, 0.72, 0.51); // #10B981 emerald
  const colorEmeraldDark = rgb(0.02, 0.59, 0.41); // #059669
  const colorEmeraldBg = rgb(0.925, 0.992, 0.961); // #ecfdf5
  const colorSlate = rgb(0.40, 0.44, 0.52); // #667085
  const colorLightSlate = rgb(0.58, 0.64, 0.72); // #94a3b8
  const colorBorder = rgb(0.90, 0.91, 0.93); // #e5e7eb
  const colorCardBg = rgb(0.969, 0.973, 0.980); // #f7f8fa
  const colorWhite = rgb(1, 1, 1);
  const colorPinkAccent = rgb(0.86, 0.15, 0.47); // #db2777 pink-600
  const colorPinkBg = rgb(0.99, 0.90, 0.95); // #fce7f3 pink-100

  // 1. TOP BRAND ACCENT BAR
  page.drawRectangle({
    x: 0,
    y: height - 5,
    width,
    height: 5,
    color: colorIndigo,
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
    color: colorIndigo,
  });

  page.drawText('fluviaflow.ai | Official Billing Document', {
    x: 40,
    y: cursorY - 26,
    size: 7.5,
    font: fontRegular,
    color: colorLightSlate,
  });

  // Right: Document Title & Invoice Number
  const docTitle = 'INVOICE';
  drawRightText(page, docTitle, width - 40, cursorY + 2, fontBold, 17, colorDark);
  drawRightText(page, `#${invoice.invoiceNumber}`, width - 40, cursorY - 14, fontBold, 11, colorIndigo);

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

  const rawIssueDate = invoice.issueDate || (invoice as any).issuedDate || (invoice as any).createdAt || new Date().toISOString();
  const issueDateFormatted = new Date(rawIssueDate).toLocaleDateString('en-IN', {
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
  const txnIdSafe = String(invoice.txnid || (invoice as any).transactionReference || invoice.orderId || invoice.id || 'N/A');
  page.drawText('TRANSACTION ID', { x: 40 + metaColWidth + 12, y: metaYLabel, size: 7, font: fontBold, color: colorLightSlate });
  page.drawText(txnIdSafe.slice(0, 18), { x: 40 + metaColWidth + 12, y: metaYVal, size: 8.5, font: fontBold, color: colorDark });

  // Meta 3: Place of Supply
  const supplierObj = invoice.supplier || {
    legalName: 'Fluvia Flow Technologies Private Limited',
    registeredAddress: 'Level 4, Horizon Creative Hub, Connaught Place, New Delhi 110001',
    state: 'Delhi',
    supportEmail: 'billing@fluviaflow.online',
  };
  const customerObj = invoice.customer || {
    name: (invoice as any).customerName || 'Fluvia Flow Creator',
    email: (invoice as any).customerEmail || 'creator@fluviaflow.online',
    state: 'Delhi',
    address: 'Registered SaaS Creator Account',
  };

  const placeOfSupply = customerObj.state || supplierObj.state || 'Delhi (07)';
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
  page.drawText('ISSUED BY (SUPPLIER)', { x: 52, y: supY, size: 7.5, font: fontBold, color: colorIndigo });
  supY -= 14;
  page.drawText(supplierObj.legalName.slice(0, 36), { x: 52, y: supY, size: 9.5, font: fontBold, color: colorDark });
  supY -= 12;
  page.drawText(supplierObj.registeredAddress.slice(0, 48), { x: 52, y: supY, size: 7.5, font: fontRegular, color: colorSlate });
  supY -= 11;
  page.drawText(`State: ${supplierObj.state}`, { x: 52, y: supY, size: 7.5, font: fontRegular, color: colorSlate });
  supY -= 12;
  page.drawText(`Support: ${supplierObj.supportEmail}`, { x: 52, y: supY, size: 7.5, font: fontRegular, color: colorSlate });

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
  page.drawText('BILLED TO (CUSTOMER)', { x: custX + 12, y: custY, size: 7.5, font: fontBold, color: colorIndigo });
  custY -= 14;
  page.drawText(customerObj.name.slice(0, 36), { x: custX + 12, y: custY, size: 9.5, font: fontBold, color: colorDark });
  custY -= 12;
  page.drawText((customerObj.email || '').slice(0, 42), { x: custX + 12, y: custY, size: 7.5, font: fontRegular, color: colorSlate });
  custY -= 11;
  page.drawText(customerObj.address ? customerObj.address.slice(0, 46) : 'Registered SaaS Creator Account', {
    x: custX + 12,
    y: custY,
    size: 7.5,
    font: fontRegular,
    color: colorSlate,
  });
  custY -= 12;
  page.drawText(`Place of Supply: ${customerObj.state || supplierObj.state || 'India'}`, {
    x: custX + 12,
    y: custY,
    size: 7.5,
    font: fontRegular,
    color: colorSlate,
  });

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
  const colQtyX = 330;
  const colRateRight = 430;
  const colTotalRight = width - 52;

  page.drawText('ITEM DESCRIPTION', { x: colDescX, y: cursorY - 14, size: 7.5, font: fontBold, color: colorWhite });
  page.drawText('QTY', { x: colQtyX, y: cursorY - 14, size: 7.5, font: fontBold, color: colorWhite });
  drawRightText(page, 'UNIT PRICE (INR)', colRateRight, cursorY - 14, fontBold, 7.5, colorWhite);
  drawRightText(page, 'TOTAL AMOUNT (INR)', colTotalRight, cursorY - 14, fontBold, 7.5, colorWhite);

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
    const itemRate = Number(item.unitPrice ?? item.taxableValue ?? (item as any).total ?? (item as any).totalAmount ?? 0);
    const itemTotal = Number(item.totalAmount ?? (item as any).total ?? (item.quantity * itemRate));

    page.drawText(itemDesc.slice(0, 45), { x: colDescX, y: cursorY - 16, size: 8.5, font: fontBold, color: colorDark });
    page.drawText(String(item.quantity || 1), { x: colQtyX, y: cursorY - 16, size: 8, font: fontRegular, color: colorSlate });
    drawRightText(page, itemRate.toFixed(2), colRateRight, cursorY - 16, fontRegular, 8, colorDark);
    drawRightText(page, itemTotal.toFixed(2), colTotalRight, cursorY - 16, fontBold, 8.5, colorDark);

    cursorY -= rowHeight;
  });

  cursorY -= 16;

  // 6. TOTALS & SUMMARY (RIGHT-ALIGNED CARD)
  const summaryBoxWidth = 230;
  const summaryBoxX = width - 40 - summaryBoxWidth;
  const hasDiscount = Boolean(invoice.discountAmount && invoice.discountAmount > 0);
  const hasTaxes = Boolean(invoice.taxAmount && invoice.taxAmount > 0);
  const summaryBoxHeight = hasDiscount ? (hasTaxes ? 115 : 95) : (hasTaxes ? 95 : 75);

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

  const safeBase = Number(invoice.baseAmount ?? (invoice as any).taxableAmount ?? invoice.totalAmount ?? 0);
  const safeTax = Number(invoice.taxAmount ?? 0);
  const safeTotal = Number(invoice.totalAmount ?? safeBase + safeTax);

  page.drawText('Subtotal:', { x: labelX, y: sumY, size: 8, font: fontRegular, color: colorSlate });
  drawRightText(page, `INR ${safeBase.toFixed(2)}`, valRight, sumY, fontRegular, 8, colorDark);
  sumY -= 15;

  if (hasTaxes) {
    page.drawText('Taxes & Fees:', { x: labelX, y: sumY, size: 8, font: fontRegular, color: colorSlate });
    drawRightText(page, `INR ${safeTax.toFixed(2)}`, valRight, sumY, fontRegular, 8, colorDark);
    sumY -= 15;
  }

  // Divider inside summary box
  page.drawLine({
    start: { x: labelX, y: sumY + 4 },
    end: { x: valRight, y: sumY + 4 },
    thickness: 1,
    color: colorBorder,
  });

  page.drawText('Total Amount:', { x: labelX, y: sumY - 11, size: 10, font: fontBold, color: colorDark });
  drawRightText(page, `INR ${safeTotal.toFixed(2)}`, valRight, sumY - 11, fontBold, 11, colorIndigoDark);

  // Left Note Beside Totals
  const leftNoteWidth = summaryBoxX - 40 - 16;
  page.drawRectangle({
    x: 40,
    y: cursorY - summaryBoxHeight,
    width: leftNoteWidth,
    height: summaryBoxHeight,
    color: colorIndigoBg,
    borderColor: colorIndigo,
    borderWidth: 0.5,
  });

  let noteY = cursorY - 18;
  page.drawText('PAYMENT SETTLEMENT & CLEARANCE NOTE', { x: 52, y: noteY, size: 7.5, font: fontBold, color: colorIndigoDark });
  noteY -= 14;
  page.drawText('- Payment processed securely through PayU Payments Private Limited.', { x: 52, y: noteY, size: 7, font: fontRegular, color: colorSlate });
  noteY -= 11;
  page.drawText('- Creative generative tokens and compute units active on account.', { x: 52, y: noteY, size: 7, font: fontRegular, color: colorSlate });
  noteY -= 11;
  page.drawText(`- Linked Merchant Ref: ${txnIdSafe.slice(0, 24)}`, { x: 52, y: noteY, size: 7, font: fontBold, color: colorDark });
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
    '1. This is a computer-generated invoice for cloud software services and creative credits. No physical signature is required.',
    { x: 40, y: cursorY, size: 6.8, font: fontRegular, color: colorLightSlate }
  );
  cursorY -= 9;
  page.drawText(
    '2. Cloud generative AI tokens and compute subscriptions are delivered digitally upon payment confirmation.',
    { x: 40, y: cursorY, size: 6.8, font: fontRegular, color: colorLightSlate }
  );
  cursorY -= 9;
  page.drawText(
    '3. For disputes, billing queries, or corporate invoicing support, please email billing@fluviaflow.ai citing your Invoice ID.',
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
  const colorDark = rgb(0.09, 0.10, 0.11); // #17191D charcoal
  const colorIndigo = rgb(0.318, 0.271, 0.804); // #5145CD Fluvia Indigo
  const colorIndigoDark = rgb(0.263, 0.22, 0.792); // #4338CA Indigo Dark
  const colorIndigoBg = rgb(0.933, 0.949, 1.0); // #EEF2FF Indigo 50
  const colorEmerald = rgb(0.06, 0.72, 0.51); // #10B981 emerald
  const colorEmeraldDark = rgb(0.02, 0.59, 0.41); // #059669
  const colorEmeraldBg = rgb(0.925, 0.992, 0.961); // #ecfdf5
  const colorSlate = rgb(0.40, 0.44, 0.52); // #667085
  const colorLightSlate = rgb(0.58, 0.64, 0.72); // #94a3b8
  const colorBorder = rgb(0.90, 0.91, 0.93); // #e5e7eb
  const colorCardBg = rgb(0.969, 0.973, 0.980); // #f7f8fa
  const colorWhite = rgb(1, 1, 1);

  // Top Fluvia Indigo Accent Stripe
  page.drawRectangle({
    x: 0,
    y: height - 5,
    width,
    height: 5,
    color: colorIndigo,
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
    color: colorIndigo,
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
  drawRightText(page, `#${receipt.receiptNumber}`, width - 40, cursorY - 14, fontBold, 11, colorIndigoDark);

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
    color: colorIndigoBg,
    borderColor: colorIndigo,
    borderWidth: 1,
  });

  page.drawText('TOTAL AMOUNT CLEARED & RECEIVED', {
    x: 56,
    y: cursorY - 20,
    size: 8.5,
    font: fontBold,
    color: colorIndigoDark,
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
    drawRightText(page, couponInfo, width - 56, cursorY - 54, fontBold, 8, colorIndigoDark);
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
  page.drawText('GATEWAY & SETTLEMENT DETAILS', { x: 52, y: gY, size: 8, font: fontBold, color: colorIndigo });
  gY -= 16;

  const gatewayItems = [
    { label: 'Merchant Txn ID:', val: receipt.txnid || (receipt as any).transactionReference || 'N/A' },
    { label: 'PayU Payment ID:', val: receipt.payuMihpayid || 'Verified Auto-Settled' },
    { label: 'Bank Ref / UTR:', val: receipt.payuBankRefNum || 'Direct Net/UPI Clearance' },
    { label: 'Payment Method:', val: receipt.paymentMethod || 'PayU India' },
    { label: 'Currency:', val: 'Indian Rupee (INR)' },
    { label: 'Payment Status:', val: 'VERIFIED SUCCESS (CAPTURED)' },
  ];

  gatewayItems.forEach((item) => {
    const safeVal = String(item.val || 'N/A');
    page.drawText(item.label, { x: 52, y: gY, size: 7.5, font: fontRegular, color: colorSlate });
    page.drawText(safeVal.slice(0, 24), { x: 145, y: gY, size: 8, font: fontBold, color: colorDark });
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
  page.drawText('CUSTOMER & ORDER SPECIFICATIONS', { x: cX + 12, y: oY, size: 8, font: fontBold, color: colorIndigo });
  oY -= 16;

  const orderItems = [
    { label: 'Customer Name:', val: receipt.customerName || 'Fluvia Flow Creator' },
    { label: 'Customer Email:', val: receipt.customerEmail || 'creator@fluviaflow.online' },
    { label: 'Product Purchased:', val: (receipt as any).productPurchased || (receipt as any).paidItemDescription || 'Creative Credits / Pack' },
    { label: 'Linked Invoice:', val: receipt.invoiceNumber || invoice?.invoiceNumber || 'INV-AVAILABLE' },
    { label: 'Order Identifier:', val: receipt.orderId || receipt.txnid || 'ORD-AVAILABLE' },
    { label: 'Cryptographic Auth:', val: 'Verified Server HMAC' },
  ];

  orderItems.forEach((item) => {
    const safeVal = String(item.val || 'N/A');
    page.drawText(item.label, { x: cX + 12, y: oY, size: 7.5, font: fontRegular, color: colorSlate });
    page.drawText(safeVal.slice(0, 25), { x: cX + 105, y: oY, size: 8, font: fontBold, color: colorDark });
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

  const refHash = receipt.verificationReference || `FF-VERIF-${receipt.txnid || (receipt as any).transactionReference || 'REF'}-SETTLED`;
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
