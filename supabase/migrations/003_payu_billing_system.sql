-- ==============================================================================
-- VERCEL VIDAI - PAYU INDIA BILLING, INVOICE & RECEIPT SCHEMA (MIGRATION 003)
-- ==============================================================================

-- 1. BILLING SETTINGS (Organization / Supplier Legal Config)
CREATE TABLE IF NOT EXISTS billing_settings (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    legal_name TEXT NOT NULL DEFAULT 'Vercel Vidai Technologies Private Limited',
    trade_name TEXT NOT NULL DEFAULT 'Vercel Vidai',
    registered_address TEXT NOT NULL DEFAULT 'Level 4, Innov8 Coworking, Connaught Place, New Delhi 110001',
    state TEXT NOT NULL DEFAULT 'Delhi',
    gstin TEXT DEFAULT '07AAAAA0000A1Z5',
    pan TEXT DEFAULT 'AAAAA0000A',
    support_email TEXT NOT NULL DEFAULT 'billing@vidai.io',
    website TEXT NOT NULL DEFAULT 'https://vidai.io',
    is_gst_registered BOOLEAN NOT NULL DEFAULT true,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 2. PAYU PAYMENT ORDERS
CREATE TABLE IF NOT EXISTS payu_payment_orders (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    txnid TEXT UNIQUE NOT NULL, -- Merchant transaction ID sent to PayU
    user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    workspace_id UUID NOT NULL REFERENCES workspaces(id) ON DELETE CASCADE,
    payment_type TEXT NOT NULL, -- 'subscription' | 'credit_pack'
    item_plan_or_pack_id TEXT NOT NULL,
    product_info TEXT NOT NULL,
    currency TEXT NOT NULL DEFAULT 'INR',
    base_amount NUMERIC(10, 2) NOT NULL,
    tax_amount NUMERIC(10, 2) NOT NULL DEFAULT 0,
    total_amount NUMERIC(10, 2) NOT NULL,
    amount_paise INTEGER NOT NULL,
    tax_breakdown_json JSONB NOT NULL DEFAULT '{}'::jsonb,
    customer_details_json JSONB NOT NULL DEFAULT '{}'::jsonb,
    status TEXT NOT NULL DEFAULT 'created', -- 'created' | 'pending' | 'success' | 'failed' | 'cancelled' | 'refunded'
    payu_mihpayid TEXT,
    payu_bank_ref_num TEXT,
    payu_payment_mode TEXT,
    payu_response_hash TEXT,
    payu_error TEXT,
    idempotency_key TEXT UNIQUE NOT NULL,
    invoice_id UUID,
    invoice_number TEXT,
    receipt_id UUID,
    receipt_number TEXT,
    verified_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 3. INVOICES
CREATE TABLE IF NOT EXISTS invoices (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    invoice_number TEXT UNIQUE NOT NULL, -- e.g. INV-2026-0001
    order_id UUID REFERENCES payu_payment_orders(id) ON DELETE SET NULL,
    txnid TEXT NOT NULL,
    user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    workspace_id UUID NOT NULL REFERENCES workspaces(id) ON DELETE CASCADE,
    supplier_snapshot_json JSONB NOT NULL,
    customer_snapshot_json JSONB NOT NULL,
    items_json JSONB NOT NULL DEFAULT '[]'::jsonb,
    base_amount NUMERIC(10, 2) NOT NULL,
    tax_amount NUMERIC(10, 2) NOT NULL DEFAULT 0,
    cgst_amount NUMERIC(10, 2) NOT NULL DEFAULT 0,
    sgst_amount NUMERIC(10, 2) NOT NULL DEFAULT 0,
    igst_amount NUMERIC(10, 2) NOT NULL DEFAULT 0,
    total_amount NUMERIC(10, 2) NOT NULL,
    currency TEXT NOT NULL DEFAULT 'INR',
    status TEXT NOT NULL DEFAULT 'paid', -- 'paid' | 'pending' | 'cancelled' | 'refunded'
    issue_date TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    due_date TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    payment_date TIMESTAMPTZ,
    payu_payment_id TEXT,
    terms TEXT,
    notes TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 4. PAYMENT RECEIPTS
CREATE TABLE IF NOT EXISTS payment_receipts (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    receipt_number TEXT UNIQUE NOT NULL, -- e.g. RCP-2026-0001
    order_id UUID REFERENCES payu_payment_orders(id) ON DELETE SET NULL,
    txnid TEXT NOT NULL,
    invoice_id UUID REFERENCES invoices(id) ON DELETE SET NULL,
    invoice_number TEXT,
    user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    workspace_id UUID NOT NULL REFERENCES workspaces(id) ON DELETE CASCADE,
    customer_name TEXT NOT NULL,
    customer_email TEXT NOT NULL,
    amount_received NUMERIC(10, 2) NOT NULL,
    currency TEXT NOT NULL DEFAULT 'INR',
    payment_method TEXT NOT NULL DEFAULT 'PayU Hosted Checkout',
    payu_mihpayid TEXT,
    payu_bank_ref_num TEXT,
    product_purchased TEXT NOT NULL,
    payment_date TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    payment_status TEXT NOT NULL DEFAULT 'verified_success',
    verification_reference TEXT NOT NULL,
    footer_notice TEXT NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 5. CREDIT NOTES
CREATE TABLE IF NOT EXISTS credit_notes (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    credit_note_number TEXT UNIQUE NOT NULL, -- e.g. CN-2026-0001
    invoice_id UUID REFERENCES invoices(id) ON DELETE CASCADE,
    invoice_number TEXT NOT NULL,
    user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    workspace_id UUID NOT NULL REFERENCES workspaces(id) ON DELETE CASCADE,
    order_id UUID REFERENCES payu_payment_orders(id) ON DELETE SET NULL,
    txnid TEXT NOT NULL,
    reason TEXT NOT NULL,
    adjustment_amount NUMERIC(10, 2) NOT NULL,
    tax_adjustment NUMERIC(10, 2) NOT NULL DEFAULT 0,
    total_adjustment NUMERIC(10, 2) NOT NULL,
    status TEXT NOT NULL DEFAULT 'issued', -- 'issued' | 'applied'
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ==============================================================================
-- INDEXES FOR FINANCIAL AUDIT & SEARCH
-- ==============================================================================
CREATE INDEX IF NOT EXISTS idx_payu_orders_txnid ON payu_payment_orders(txnid);
CREATE INDEX IF NOT EXISTS idx_payu_orders_user ON payu_payment_orders(user_id);
CREATE INDEX IF NOT EXISTS idx_payu_orders_status ON payu_payment_orders(status);
CREATE INDEX IF NOT EXISTS idx_payu_orders_idempotency ON payu_payment_orders(idempotency_key);

CREATE INDEX IF NOT EXISTS idx_invoices_number ON invoices(invoice_number);
CREATE INDEX IF NOT EXISTS idx_invoices_user ON invoices(user_id);
CREATE INDEX IF NOT EXISTS idx_invoices_order ON invoices(order_id);
CREATE INDEX IF NOT EXISTS idx_invoices_status ON invoices(status);

CREATE INDEX IF NOT EXISTS idx_receipts_number ON payment_receipts(receipt_number);
CREATE INDEX IF NOT EXISTS idx_receipts_user ON payment_receipts(user_id);
CREATE INDEX IF NOT EXISTS idx_receipts_order ON payment_receipts(order_id);

CREATE INDEX IF NOT EXISTS idx_credit_notes_number ON credit_notes(credit_note_number);
CREATE INDEX IF NOT EXISTS idx_credit_notes_invoice ON credit_notes(invoice_id);

-- ==============================================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ==============================================================================
ALTER TABLE payu_payment_orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE invoices ENABLE ROW LEVEL SECURITY;
ALTER TABLE payment_receipts ENABLE ROW LEVEL SECURITY;
ALTER TABLE credit_notes ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own payment orders"
    ON payu_payment_orders FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Users can view their own invoices"
    ON invoices FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Users can view their own payment receipts"
    ON payment_receipts FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Users can view their own credit notes"
    ON credit_notes FOR SELECT
    USING (auth.uid() = user_id);
