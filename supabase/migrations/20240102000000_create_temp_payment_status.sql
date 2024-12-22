-- Create temporary payment status table
CREATE TABLE temp_payment_status (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES auth.users(id) NOT NULL,
    status TEXT NOT NULL,
    session_id TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    -- Auto-delete records after 1 hour
    expires_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() + INTERVAL '1 hour'
);

-- Add RLS policies
ALTER TABLE temp_payment_status ENABLE ROW LEVEL SECURITY;

-- Allow users to view their own payment status
CREATE POLICY "Users can view their own payment status"
    ON temp_payment_status FOR SELECT
    USING (auth.uid() = user_id);

-- Allow system to insert payment status
CREATE POLICY "System can insert payment status"
    ON temp_payment_status FOR INSERT
    WITH CHECK (true);

-- Create index on user_id and session_id for faster lookups
CREATE INDEX idx_temp_payment_status_user_id ON temp_payment_status(user_id);
CREATE INDEX idx_temp_payment_status_session_id ON temp_payment_status(session_id);

-- Create function to clean up expired records
CREATE OR REPLACE FUNCTION cleanup_expired_payment_status()
RETURNS void
LANGUAGE plpgsql
AS $$
BEGIN
    DELETE FROM temp_payment_status
    WHERE expires_at < NOW();
END;
$$;

-- Create a scheduled job to run cleanup every hour
SELECT cron.schedule(
    'cleanup-payment-status',
    '0 * * * *', -- Every hour
    'SELECT cleanup_expired_payment_status();'
);
