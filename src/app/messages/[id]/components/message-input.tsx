'use client';

import { useState, useRef } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Loader2, Image as ImageIcon, Paperclip, X } from "lucide-react";
import { BuyerTag } from "./buyer-tag";
import { getClientSupabase } from '@/lib/supabase/client';
import { toast } from 'sonner';


interface MessageInputType {
    onSend: (newMessage: any, attachments: string[]) => void
    businessId: string,
    currentUserId: string | undefined,
    isBusinessOwner: boolean,
    buyerId: string | null
}

interface AttachmentPreview {
    url: string;
    type: 'image' | 'file';
    name: string;
}

export default function MessageInput({
    onSend,
    businessId,
    currentUserId,
    isBusinessOwner,
    buyerId
}: MessageInputType) {
    const [newMessage, setNewMessage] = useState('');
    const [attachmentPreviews, setAttachmentPreviews] = useState<AttachmentPreview[]>([]); const [uploading, setUploading] = useState(false);
    const [sending, setSending] = useState(false);
    const imageInputRef = useRef<HTMLInputElement | null>(null);
    const fileInputRef = useRef<HTMLInputElement | null>(null);

    // Handle file upload to Supabase storage
    const handleFileUpload = async (file: any) => {
        if (!currentUserId || !file) return;

        try {
            setUploading(true);
            const supabase = getClientSupabase();
            const maxSize = 5 * 1024 * 1024; // 5MB
            if (file.size > maxSize) {
                toast.error('File size must be less than 5MB');
                return;
            }

            const fileExt = file.name.split('.').pop();
            const fileName = `${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`;
            const filePath = `${businessId}/${currentUserId}/${fileName}`;

            const { error } = await supabase.storage
                .from('message-attachments')
                .upload(filePath, file, { cacheControl: '3600', upsert: false });

            if (error) throw error;

            const { data: { publicUrl } } = supabase.storage
                .from('message-attachments')
                .getPublicUrl(filePath);

            const isImage = file.type.startsWith('image/');
            setAttachmentPreviews(prev => [...prev, { url: publicUrl, type: isImage ? 'image' : 'file', name: file.name }]);
            toast.success('File uploaded successfully');
        } catch (error) {
            console.error('Error uploading file:', error);
            toast.error('Failed to upload file');
        } finally {
            setUploading(false);
        }
    };

    // Remove an attachment preview
    const removeAttachment = (index: number) => {
        setAttachmentPreviews(prev => prev.filter((_, i) => i !== index));
    };

    // Handle form submission
    const handleSendMessage = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if ((!newMessage.trim() && attachmentPreviews.length === 0) || sending || uploading) return;

        setSending(true);
        try {
            const attachments = attachmentPreviews.map(preview => preview.url);
            console.log('Sending message:', { newMessage, attachments });
            await onSend(newMessage, attachments);
            setNewMessage('');
            setAttachmentPreviews([]);
        } catch (error) {
            console.error('Error sending message:', error);
            toast.error('Failed to send message');
        } finally {
            setSending(false);
        }
    };

    return (
        <form onSubmit={handleSendMessage} className="p-4">
            {isBusinessOwner && (
                <BuyerTag businessId={businessId} buyerId={buyerId || ''} isLoading={false} />
            )}

            {/* Upload buttons */}
            <div className="flex items-center gap-2 mb-2">
                <Button
                    variant="outline"
                    type="button"
                    onClick={() => imageInputRef.current?.click()}
                    className="p-2 w-14 hover:bg-muted rounded-md"
                    disabled={sending || uploading}
                >
                    <ImageIcon className="h-5 w-5 text-muted-foreground" />
                </Button>
                <Button
                    variant="outline"
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="p-2 w-14 hover:bg-muted rounded-md"
                    disabled={sending || uploading}
                >
                    <Paperclip className="h-5 w-5 text-muted-foreground" />
                </Button>
                {uploading && <Loader2 className="h-4 w-4 animate-spin" />}
            </div>

            {/* Attachment previews */}
            {attachmentPreviews.length > 0 && (
                <div className="flex flex-wrap gap-2 mb-2">
                    {attachmentPreviews.map((preview, index) => (
                        <div key={index} className="relative group">
                            {preview.type === 'image' ? (
                                <div className="relative">
                                    <img
                                        src={preview.url}
                                        alt="Preview"
                                        className="w-20 h-20 object-cover rounded-md"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => removeAttachment(index)}
                                        className="absolute -top-2 -right-2 bg-destructive text-destructive-foreground rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                                    >
                                        <X className="h-3 w-3" />
                                    </button>
                                </div>
                            ) : (
                                <div className="relative bg-muted p-2 rounded-md">
                                    <Paperclip className="h-4 w-4 mb-1" />
                                    <div className="text-xs truncate max-w-[72px]">{preview.name}</div>
                                    <button
                                        type="button"
                                        onClick={() => removeAttachment(index)}
                                        className="absolute -top-2 -right-2 bg-destructive text-destructive-foreground rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                                    >
                                        <X className="h-3 w-3" />
                                    </button>
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            )}

            {/* Message input */}
            <div className="flex">
                <Input
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    placeholder="Type your message..."
                    className="flex-1 mr-2"
                    disabled={sending || uploading}
                />
                <Button
                    type="submit"
                    disabled={sending || uploading || (!newMessage.trim() && attachmentPreviews.length === 0)}
                >
                    {sending || uploading ? (
                        <>
                            <Loader2 className="h-4 w-4 animate-spin mr-2" />
                            {uploading ? 'Uploading...' : 'Sending...'}
                        </>
                    ) : (
                        'Send'
                    )}
                </Button>
            </div>

            {/* Hidden file inputs */}
            <input
                type="file"
                ref={imageInputRef}
                accept="image/*"
                className="hidden"
                onChange={async (e) => {
                    const file = e.target.files?.[0];
                    if (file) await handleFileUpload(file);
                    e.target.value = '';
                }}
            />
            <input
                type="file"
                ref={fileInputRef}
                className="hidden"
                onChange={async (e) => {
                    const file = e.target.files?.[0];
                    if (file) await handleFileUpload(file);
                    e.target.value = '';
                }}
            />
        </form>
    );
}