-- Create invoices table
CREATE TABLE invoices (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES auth.users(id) NOT NULL,
    business_id BIGINT REFERENCES businesses(id), -- Made nullable
    amount DECIMAL(10,2) NOT NULL,
    currency TEXT NOT NULL DEFAULT 'AED',
    status TEXT NOT NULL DEFAULT 'pending',
    stripe_payment_intent_id TEXT,
    stripe_invoice_id TEXT,
    payment_date TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Add RLS policies
ALTER TABLE invoices ENABLE ROW LEVEL SECURITY;

-- Allow users to view their own invoices
CREATE POLICY "Users can view their own invoices"
    ON invoices FOR SELECT
    USING (auth.uid() = user_id);

-- Allow authenticated users to create invoices
CREATE POLICY "Users can create invoices"
    ON invoices FOR INSERT
    WITH CHECK (auth.uid() = user_id);

-- Allow system to update invoice status
CREATE POLICY "System can update invoice status"
    ON invoices FOR UPDATE
    USING (true)
    WITH CHECK (true);

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create trigger to automatically update updated_at
CREATE TRIGGER update_invoices_updated_at
    BEFORE UPDATE ON invoices
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();
