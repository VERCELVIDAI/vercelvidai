import { BRAND } from '@/lib/brand';

export interface EmailTemplateData {
  customerName: string;
  customerEmail: string;
  orderNumber: string;
  txnid: string;
  productName: string;
  amountInr: number;
  invoiceNumber?: string;
  receiptNumber?: string;
  downloadUrl?: string;
  reason?: string;
}

export function generatePaymentSuccessEmail(data: EmailTemplateData): { subject: string; html: string; text: string } {
  const subject = `Payment Confirmed: ${data.productName} — ${BRAND.name}`;
  const text = `Hi ${data.customerName},\n\nYour payment of INR ${data.amountInr.toFixed(2)} for ${data.productName} has been verified and settled successfully.\n\nTransaction ID: ${data.txnid}\nReceipt: ${data.receiptNumber || 'Available in Dashboard'}\nInvoice: ${data.invoiceNumber || 'Available in Dashboard'}\n\nYour creative credits are now available in your ${BRAND.name} workspace.\n\nThank you,\n${BRAND.name} Team`;

  const html = `
    <!DOCTYPE html>
    <html>
      <body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #0b0c11; color: #f1f5f9; padding: 40px 20px;">
        <table align="center" width="100%" max-width="600" style="max-width: 600px; background-color: #12141a; border-radius: 16px; border: 1px solid rgba(255,255,255,0.1); overflow: hidden; padding: 32px;">
          <tr>
            <td>
              <div style="font-size: 22px; font-weight: 800; color: #ffffff; letter-spacing: -0.5px; margin-bottom: 24px;">
                FLUVIA <span style="color: #38bdf8;">FLOW</span>
              </div>
              <div style="background-color: rgba(16, 185, 129, 0.1); border: 1px solid rgba(16, 185, 129, 0.3); border-radius: 12px; padding: 16px; margin-bottom: 24px;">
                <span style="color: #10b981; font-weight: 700; font-size: 14px;">✓ Payment Verified & Settled</span>
              </div>
              <p style="font-size: 15px; line-height: 1.6; color: #cbd5e1;">Hi <strong>${data.customerName}</strong>,</p>
              <p style="font-size: 14px; line-height: 1.6; color: #94a3b8;">
                Your payment via PayU India Hosted Checkout was confirmed. Your creative workspace credits are available immediately.
              </p>
              <table width="100%" style="background-color: rgba(255,255,255,0.03); border-radius: 12px; padding: 16px; margin: 24px 0; border: 1px solid rgba(255,255,255,0.05);">
                <tr>
                  <td style="color: #94a3b8; font-size: 13px; padding: 6px 0;">Item Purchased:</td>
                  <td align="right" style="color: #ffffff; font-weight: 700; font-size: 13px;">${data.productName}</td>
                </tr>
                <tr>
                  <td style="color: #94a3b8; font-size: 13px; padding: 6px 0;">Amount Paid:</td>
                  <td align="right" style="color: #8b5cf6; font-weight: 700; font-size: 15px;">INR ${data.amountInr.toFixed(2)}</td>
                </tr>
                <tr>
                  <td style="color: #94a3b8; font-size: 13px; padding: 6px 0;">PayU Transaction ID:</td>
                  <td align="right" style="color: #cbd5e1; font-family: monospace; font-size: 12px;">${data.txnid}</td>
                </tr>
                ${data.invoiceNumber ? `
                <tr>
                  <td style="color: #94a3b8; font-size: 13px; padding: 6px 0;">GST Tax Invoice:</td>
                  <td align="right" style="color: #38bdf8; font-weight: 600; font-size: 13px;">${data.invoiceNumber}</td>
                </tr>` : ''}
                ${data.receiptNumber ? `
                <tr>
                  <td style="color: #94a3b8; font-size: 13px; padding: 6px 0;">Official Receipt:</td>
                  <td align="right" style="color: #10b981; font-weight: 600; font-size: 13px;">${data.receiptNumber}</td>
                </tr>` : ''}
              </table>
              <div style="text-align: center; margin: 32px 0;">
                <a href="${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/dashboard/billing" style="background: linear-gradient(135deg, #7c3aed, #4f46e5); color: #ffffff; text-decoration: none; padding: 12px 28px; border-radius: 10px; font-weight: 700; font-size: 13px; display: inline-block;">
                  View Invoices & Receipts
                </a>
              </div>
              <p style="font-size: 12px; color: #64748b; text-align: center; border-top: 1px solid rgba(255,255,255,0.08); padding-top: 16px;">
                Computer-generated notification. Payment processed securely by PayU Payments Private Limited.
              </p>
            </td>
          </tr>
        </table>
      </body>
    </html>
  `;

  return { subject, html, text };
}

export function generatePaymentFailedEmail(data: EmailTemplateData): { subject: string; html: string; text: string } {
  const subject = `Payment Unsuccessful: ${data.productName} — ${BRAND.name}`;
  const text = `Hi ${data.customerName},\n\nYour attempt to purchase ${data.productName} for INR ${data.amountInr.toFixed(2)} could not be processed.\nReason: ${data.reason || 'Transaction declined by payment network'}\n\nYou can retry anytime at ${BRAND.siteUrl}/pricing.\n\n${BRAND.name} Team`;

  const html = `
    <!DOCTYPE html>
    <html>
      <body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background-color: #0b0c11; color: #f1f5f9; padding: 40px 20px;">
        <table align="center" width="100%" style="max-width: 600px; background-color: #12141a; border-radius: 16px; border: 1px solid rgba(255,255,255,0.1); padding: 32px;">
          <tr>
            <td>
              <div style="font-size: 20px; font-weight: 800; color: #ffffff; margin-bottom: 20px;">
                FLUVIA <span style="color: #38bdf8;">FLOW</span>
              </div>
              <div style="background-color: rgba(239, 68, 68, 0.1); border: 1px solid rgba(239, 68, 68, 0.3); border-radius: 12px; padding: 16px; margin-bottom: 24px;">
                <span style="color: #ef4444; font-weight: 700; font-size: 14px;">✗ Payment Unsuccessful</span>
              </div>
              <p style="font-size: 14px; line-height: 1.6; color: #94a3b8;">
                We were unable to process your payment for <strong>${data.productName}</strong>.
              </p>
              <p style="font-size: 13px; color: #cbd5e1; background: rgba(255,255,255,0.03); padding: 12px; border-radius: 8px;">
                Notice: ${data.reason || 'Declined by card issuer or payment gateway session timeout.'}
              </p>
              <div style="text-align: center; margin: 28px 0;">
                <a href="${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/pricing" style="background-color: #7c3aed; color: #ffffff; text-decoration: none; padding: 12px 24px; border-radius: 10px; font-weight: 700; font-size: 13px; display: inline-block;">
                  Retry Payment on Pricing Page
                </a>
              </div>
            </td>
          </tr>
        </table>
      </body>
    </html>
  `;

  return { subject, html, text };
}
