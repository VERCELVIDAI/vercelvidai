import fs from 'fs';
import path from 'path';
import { generateInvoicePdf, generateReceiptPdf, formatInr } from '../src/lib/documents/pdfGenerator';
import { Invoice, PaymentReceipt } from '../src/lib/types';

async function verifyPdfGeneration() {
  console.log('================================================================');
  console.log('  FLUVIA FLOW — PREMIUM PDF INVOICE & RECEIPT VERIFICATION');
  console.log('================================================================\n');

  let passed = 0;
  let failed = 0;

  function assert(condition: boolean, testName: string) {
    if (condition) {
      console.log(`  ✓ [PASS] ${testName}`);
      passed++;
    } else {
      console.error(`  ✗ [FAIL] ${testName}`);
      failed++;
    }
  }

  // 1. Currency Formatting
  console.log('--- 1. Currency Formatting ---');
  const formatted500 = formatInr(500);
  assert(formatted500.includes('500.00'), `formatInr formats 500 correctly: ${formatted500}`);
  const formatted1250 = formatInr(1250.5);
  assert(formatted1250.includes('1,250.50'), `formatInr formats 1250.50 with commas: ${formatted1250}`);

  // 2. Generate Sample Invoice PDF
  console.log('\n--- 2. Generate Tax Invoice PDF ---');
  const sampleInvoice: Invoice = {
    id: 'inv_test_12345',
    invoiceNumber: 'INV-2026-00892',
    orderId: 'ord_sample_987',
    txnid: 'FF_TXN_9988776655',
    userId: 'usr_sample_creator',
    workspaceId: 'ws_sample_studio',
    supplier: {
      legalName: 'Fluvia Flow Technologies Private Limited',
      tradeName: 'Fluvia Flow',
      registeredAddress: 'Level 4, Horizon Creative Hub, Connaught Place, New Delhi 110001',
      state: 'Delhi',
      gstin: '07AAAAA0000A1Z5',
      pan: 'AAAAA0000A',
      supportEmail: 'billing@fluviaflow.ai',
      website: 'https://fluviaflow.ai',
      isGstRegistered: true,
    },
    customer: {
      name: 'Aarav Sharma',
      email: 'aarav@creativeagency.in',
      address: '74 Cyber City, DLF Phase 2, Gurugram, Haryana 122002',
      state: 'Haryana',
      gstin: '06BBBBB1111B1Z2',
    },
    items: [
      {
        id: 'item_1',
        description: 'Fluvia Flow Studio Pack (1,000 Generation Credits)',
        hsnSacCode: '998314',
        quantity: 1,
        unitPrice: 999,
        taxableValue: 799.2,
        gstRate: 18,
        cgstAmount: 0,
        sgstAmount: 0,
        igstAmount: 143.86,
        totalAmount: 943.06,
      },
    ],
    couponId: 'cpn_save20',
    couponCode: 'SAVE20',
    discountAmount: 199.8,
    originalBaseAmount: 999,
    baseAmount: 799.2,
    taxAmount: 143.86,
    cgstAmount: 0,
    sgstAmount: 0,
    igstAmount: 143.86,
    totalAmount: 943.06,
    currency: 'INR',
    status: 'paid',
    issueDate: '2026-10-23T10:00:00.000Z',
    dueDate: '2026-10-23T10:00:00.000Z',
    paymentDate: '2026-10-23T10:02:15.000Z',
    payuPaymentId: 'mih_987654321',
    terms: 'Payment due on receipt',
    notes: 'Thank you for choosing Fluvia Flow',
    createdAt: '2026-10-23T10:00:00.000Z',
    updatedAt: '2026-10-23T10:02:15.000Z',
  };

  const invoiceBytes = await generateInvoicePdf(sampleInvoice);
  assert(Boolean(invoiceBytes && invoiceBytes.length > 1000), `Invoice PDF generated with ${invoiceBytes.length} bytes`);
  assert(invoiceBytes[0] === 0x25 && invoiceBytes[1] === 0x50 && invoiceBytes[2] === 0x44 && invoiceBytes[3] === 0x46, 'Invoice PDF starts with %PDF magic bytes');

  // 3. Generate Sample Payment Receipt PDF
  console.log('\n--- 3. Generate Official Payment Receipt PDF ---');
  const sampleReceipt: PaymentReceipt = {
    id: 'rcp_test_54321',
    receiptNumber: 'RCP-2026-00892',
    orderId: 'ord_sample_987',
    txnid: 'FF_TXN_9988776655',
    invoiceId: sampleInvoice.id,
    invoiceNumber: sampleInvoice.invoiceNumber,
    userId: sampleInvoice.userId,
    workspaceId: sampleInvoice.workspaceId,
    customerName: 'Aarav Sharma',
    customerEmail: 'aarav@creativeagency.in',
    couponCode: 'SAVE20',
    discountAmount: 199.8,
    originalAmount: 1178.82,
    amountReceived: 943.06,
    currency: 'INR',
    paymentMethod: 'UPI / Google Pay (PayU)',
    payuMihpayid: 'mih_987654321',
    payuBankRefNum: 'UTR_BANK_202610239988',
    productPurchased: 'Fluvia Flow Studio Pack (1,000 Generation Credits)',
    paymentDate: '2026-10-23T10:02:15.000Z',
    paymentStatus: 'verified_success',
    verificationReference: 'FF-PAYU-SHA512-VERIFIED-9988776655',
    footerNotice: 'Computer-generated payment settlement receipt from Fluvia Flow.',
    createdAt: '2026-10-23T10:02:15.000Z',
  };

  const receiptBytes = await generateReceiptPdf(sampleReceipt, sampleInvoice);
  assert(Boolean(receiptBytes && receiptBytes.length > 1000), `Receipt PDF generated with ${receiptBytes.length} bytes`);
  assert(receiptBytes[0] === 0x25 && receiptBytes[1] === 0x50 && receiptBytes[2] === 0x44 && receiptBytes[3] === 0x46, 'Receipt PDF starts with %PDF magic bytes');

  console.log(`\n================================================================`);
  console.log(`  PDF VERIFICATION COMPLETE: ${passed} PASSED, ${failed} FAILED`);
  console.log(`================================================================`);

  if (failed > 0) process.exit(1);
}

verifyPdfGeneration().catch((err) => {
  console.error('Fatal PDF Test Error:', err);
  process.exit(1);
});
