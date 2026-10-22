import { NextRequest, NextResponse } from 'next/server';
import { getCurrentUser } from '@/lib/auth/session';
import { createPayUPaymentOrder } from '@/lib/payments/payu';

export async function POST(req: NextRequest) {
  try {
    const current = await getCurrentUser();
    if (!current) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json();
    const { paymentType, itemPlanOrPackId, customerDetails } = body;

    if (!paymentType || !itemPlanOrPackId) {
      return NextResponse.json(
        { error: 'paymentType and itemPlanOrPackId are required.' },
        { status: 400 }
      );
    }

    const billingDetails = {
      name: customerDetails?.name || current.user.displayName,
      email: customerDetails?.email || current.user.email,
      phone: customerDetails?.phone || '9999999999',
      address: customerDetails?.address || '',
      city: customerDetails?.city || '',
      state: customerDetails?.state || 'Delhi',
      pincode: customerDetails?.pincode || '',
      gstin: customerDetails?.gstin || '',
    };

    const orderResult = await createPayUPaymentOrder({
      userId: current.user.id,
      workspaceId: current.workspace.id,
      paymentType,
      itemPlanOrPackId,
      customerDetails: billingDetails,
    });

    return NextResponse.json(orderResult, { status: 201 });
  } catch (err: any) {
    console.error('Error creating PayU payment order:', err);
    return NextResponse.json({ error: err.message || 'Failed to create payment order' }, { status: 500 });
  }
}
