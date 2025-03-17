-- Enable required extensions
CREATE EXTENSION IF NOT EXISTS pg_cron;
CREATE EXTENSION IF NOT EXISTS pg_net;

-- Create a function to send email using Resend API
CREATE OR REPLACE FUNCTION send_email_notification(
    p_email TEXT,
    p_full_name TEXT,
    p_message_count INTEGER
)
RETURNS void AS $$
DECLARE
    v_resend_api_key TEXT;
    v_app_url TEXT;
    v_response JSONB;
BEGIN
    -- Get environment variables
    v_resend_api_key := current_setting('app.settings.resend_api_key', true);
    v_app_url := current_setting('app.settings.app_url', true);

    -- Make HTTP request to Resend API
    SELECT content::jsonb INTO v_response
    FROM net.http_post(
        url := 'https://api.resend.com/emails',
        headers := jsonb_build_object(
            'Authorization', 'Bearer ' || v_resend_api_key,
            'Content-Type', 'application/json'
        ),
        body := jsonb_build_object(
            'from', 'onboarding@resend.dev',
            'to', p_email,
            'subject', 'You have unread messages',
            'html', format(
                '<div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                    <h2>Hello %s!</h2>
                    <p>You have %s unread message%s.</p>
                    <p>Please log in to your account to view them.</p>
                    <a href="%s/messages" 
                       style="display: inline-block; padding: 10px 20px; background-color: #007bff; color: white; text-decoration: none; border-radius: 5px;">
                        View Messages
                    </a>
                </div>',
                COALESCE(p_full_name, 'there'),
                p_message_count,
                CASE WHEN p_message_count > 1 THEN 's' ELSE '' END,
                v_app_url
            )
        )::text
    );

    -- Log the response for debugging
    RAISE NOTICE 'Email sent to %: %', p_email, v_response;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create a function to handle unread message notifications
CREATE OR REPLACE FUNCTION handle_unread_messages()
RETURNS void AS $$
DECLARE
    user_record RECORD;
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
        -- Send email notification directly
        PERFORM send_email_notification(
            user_record.email,
            user_record.full_name,
            user_record.message_count
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

-- Set up the environment variables
ALTER DATABASE postgres SET app.settings.resend_api_key = 're_heQ3i4XC_9hpYnYMZSnCjz2SF2KQyD4eE';
ALTER DATABASE postgres SET app.settings.app_url = 'http://localhost:3000'; 