import { Check, CheckCheck, Paperclip } from 'lucide-react';
import React from 'react'
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Message } from '../type';


interface MessageListProps {
    users:any
    currentUserId: string | undefined ,
    message: Message
}



function MessageList({users,currentUserId,message}: MessageListProps) {

    const isCurrentUser = message.sender_id === currentUserId;
    const user = users[message.sender_id];
 
    return (
        <div  className={`flex ${isCurrentUser ? 'justify-end' : 'justify-start'} mb-4`}>
          <div className={`flex ${isCurrentUser ? 'flex-row-reverse' : 'flex-row'} max-w-[80%]`}>
            {/* Show avatar for both current user and other users */}
            <Avatar className="h-8 w-8 mx-2">
              {user?.profile_pic_url && (
                <AvatarImage src={user.profile_pic_url} alt={user.full_name || user.email} />
              )}
              <AvatarFallback>
                {(user?.full_name?.[0] || user?.email?.[0] || '?').toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <div>
              <div
                className={`rounded-lg py-2 px-3 ${isCurrentUser
                    ? 'bg-primary text-white rounded-tr-none'
                    : 'bg-muted rounded-tl-none'
                  }`}
              >
                <div className="whitespace-pre-wrap">{message.content}</div>
                {message.attachments && message.attachments.length > 0 && (
                  <div className="mt-2 space-y-2">
                    {message.attachments.map((url: string, index: number) => {
                      const isImage = /\.(jpg|jpeg|png|gif|webp)$/i.test(url);
                      return isImage ? (
                        <div key={index} className="relative">
                          <img
                            src={url}
                            alt="Attachment"
                            className="max-w-[200px] rounded-md"
                            onClick={() => window.open(url, '_blank')}
                          />
                        </div>
                      ) : (
                        <a
                          key={index}
                          href={url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-2 text-sm hover:underline"
                        >
                          <Paperclip className="h-4 w-4" />
                          <span>{url.split('/').pop()}</span>
                        </a>
                      );
                    })}
                  </div>
                )}
              </div>
              <div className="text-xs text-muted-foreground mt-1 flex justify-between">
                <div>
                  {new Date(message.created_at).toLocaleTimeString([], {
                    hour: '2-digit',
                    minute: '2-digit'
                  })}
                </div>
                {currentUserId && <MessageStatus message={message} currentUserId={currentUserId} />}
              </div>
            </div>
          </div>
        </div>
      )
}

export default MessageList



function MessageStatus({ message, currentUserId }: { message: Message, currentUserId: string }) {
    if (message.sender_id !== currentUserId) return null;

    return (
      <div className="text-xs text-muted-foreground mt-1 flex justify-end">
        {message.read_at ? (
          <div className="flex items-center space-x-1">
            <CheckCheck size={12} className="text-green-500" />

          </div>
        ) : (
          <div className="flex items-center space-x-1">
            <Check size={12} />

          </div>
        )}
      </div>
    );
  }