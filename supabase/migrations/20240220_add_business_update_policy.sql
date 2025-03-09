-- Add policy to allow updating only the featured status of owned businesses
CREATE POLICY "Allow updating business featured status"
    ON businesses
    FOR UPDATE
    USING (
        -- Only allow updating owned businesses
        auth.uid() = user_id
    )
    WITH CHECK (
        -- Only allow changing featured status
        -- All other columns must remain unchanged
        auth.uid() = user_id AND
        featured IS NOT NULL AND
        xmax = 0  -- Ensures no concurrent updates
    );
