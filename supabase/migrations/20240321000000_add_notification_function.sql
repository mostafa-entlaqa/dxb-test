-- Enable required extensions
CREATE EXTENSION IF NOT EXISTS pg_cron;
CREATE EXTENSION IF NOT EXISTS pg_notify;

-- Create a function to handle unread message notifications
CREATE OR REPLACE FUNCTION handle_unread_messages()
RETURNS void AS $$
DECLARE
    user_record RECORD;
    unread_count INTEGER;
    five_minutes_ago TIMESTAMP;
    one_hour_ago TIMESTAMP;
BEGIN
    -- Set time thresholds
    five_minutes_ago := NOW() - INTERVAL '5 minutes';
    one_hour_ago := NOW() - INTERVAL '1 hour';

    -- Get users with unread messages that are at least 5 minutes old
    FOR user_record IN 
        SELECT 
            m.receiver_id,
            COUNT(*) as message_count,
            u.email,
            u.full_name
        FROM messages m
        JOIN users u ON u.id = m.receiver_id
        WHERE m.read_at IS NULL
        AND m.created_at < five_minutes_ago
        AND NOT EXISTS (
            -- Check if we've sent a notification in the last hour
            SELECT 1 
            FROM messages m2 
            WHERE m2.receiver_id = m.receiver_id 
            AND m2.read_at IS NULL 
            AND m2.created_at < one_hour_ago
        )
        GROUP BY m.receiver_id, u.email, u.full_name
    LOOP
        -- Send email notification using pg_notify
        -- This will trigger our Edge Function
        PERFORM pg_notify(
            'unread_messages_notification',
            json_build_object(
                'email', user_record.email,
                'full_name', user_record.full_name,
                'message_count', user_record.message_count
            )::text
        );
    END LOOP;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create a cron job to run every 5 minutes
SELECT cron.schedule(
    'send-unread-notifications',
    '*/5 * * * *',  -- Every 5 minutes
    $$
    SELECT handle_unread_messages();
    $$
); 