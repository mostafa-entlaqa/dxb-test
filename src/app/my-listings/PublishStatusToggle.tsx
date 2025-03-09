import React, { useState } from 'react';
import { Switch } from "@/components/ui/switch"; // Adjust the import path as necessary
import { getClientSupabase } from '@/lib/supabase/client'

type PublishStatusToggleProps = {
    id: string;
    currentStatus: string;
    onStatusChange: (newStatus: string) => void; // Callback to notify parent of status change
    approve: string | null; // Ensure approve can be null
};

const PublishStatusToggle: React.FC<PublishStatusToggleProps> = ({ id, currentStatus, onStatusChange, approve }) => {
    const [status, setStatus] = useState(currentStatus); // Local state for status

    const togglePublishStatus = async () => {
        const newStatus = status === "draft" ? "published" : "draft"; // Use local state
        const supabase = getClientSupabase();

        // Call the Supabase SDK to update the record
        const { data, error } = await supabase
            .from('businesses')
            .update({ form_status: newStatus })
            .eq('id', id) // Use user_id from props
            .eq('approve_status','approved')

        if (error) {
            console.error('Error updating status:', error);
            // Optionally handle the error (e.g., revert UI changes)
        } else {
            console.log('Status updated successfully:', data);
            setStatus(newStatus); // Update local state
            onStatusChange(newStatus); // Notify parent of the status change
        }
    };

    return (
        <div className="flex items-center space-x-2">
            <Switch
                disabled={approve !== "approved"} // Disable if approve is null
                checked={status === "published"} // Use local state
                onCheckedChange={togglePublishStatus}
            />
            <span>{status === "published" ? 'Published' : "Draft"}</span>
        </div>
    );
};

export default PublishStatusToggle; 