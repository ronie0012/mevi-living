'use client';

import React from 'react';
import { formatDistanceToNow } from 'date-fns';
import { Bot, User, Headphones } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '../avatar';
import { Badge } from '../badge';
import { ChatMessage as ChatMessageType } from '@/contexts/ChatContext';

interface ChatMessageProps {
  message: ChatMessageType;
}

export const ChatMessage: React.FC<ChatMessageProps> = ({ message }) => {
  const isUser = message.senderType === 'user';
  const isBot = message.senderType === 'bot';
  const isAgent = message.senderType === 'agent';

  const formatTime = (timestamp: string | Date) => {
    try {
      const date = typeof timestamp === 'string' ? new Date(timestamp) : timestamp;
      return formatDistanceToNow(date, { addSuffix: true });
    } catch {
      return 'now';
    }
  };

  const getMessageMetadata = () => {
    try {
      return message.metadata ? JSON.parse(message.metadata) : {};
    } catch {
      return {};
    }
  };

  const metadata = getMessageMetadata();
  const isAI = metadata.isAI || false;

  if (isUser) {
    return (
      <div className="flex justify-end items-start space-x-2">
        <div className="flex-1 flex flex-col items-end max-w-xs">
          <div className="bg-blue-600 text-white rounded-lg px-3 py-2 text-sm break-words">
            {message.message}
          </div>
          <span className="text-xs text-gray-400 mt-1">
            {formatTime(message.sentAt)}
          </span>
        </div>
        <Avatar className="w-6 h-6 mt-1">
          <AvatarFallback className="bg-blue-100 text-blue-600 text-xs">
            <User className="w-3 h-3" />
          </AvatarFallback>
        </Avatar>
      </div>
    );
  }

  return (
    <div className="flex items-start space-x-2">
      <Avatar className="w-6 h-6 mt-1">
        {isBot ? (
          <AvatarFallback className={`${isAI ? 'bg-purple-100 text-purple-600' : 'bg-blue-100 text-blue-600'} text-xs`}>
            <Bot className="w-3 h-3" />
          </AvatarFallback>
        ) : (
          <AvatarFallback className="bg-green-100 text-green-600 text-xs">
            <Headphones className="w-3 h-3" />
          </AvatarFallback>
        )}
      </Avatar>
      
      <div className="flex-1 max-w-xs">
        <div className="flex items-center space-x-2 mb-1">
          <span className="text-xs font-medium text-gray-600">
            {isBot ? (isAI ? 'AI Assistant' : 'Bot') : 'Support Agent'}
          </span>
          {isAI && (
            <Badge variant="secondary" className="text-xs px-1 py-0 h-4">
              AI
            </Badge>
          )}
        </div>
        
        <div className="bg-gray-100 dark:bg-gray-700 rounded-lg px-3 py-2 text-sm break-words">
          {message.message}
        </div>
        
        <div className="flex items-center justify-between mt-1">
          <span className="text-xs text-gray-400">
            {formatTime(message.sentAt)}
          </span>
          
          {metadata.intent && (
            <Badge 
              variant="outline" 
              className={`text-xs px-1 py-0 h-4 ml-2 ${
                metadata.intent.suggestedAction === 'escalate' 
                  ? 'border-red-200 text-red-600'
                  : metadata.intent.suggestedAction === 'human'
                  ? 'border-yellow-200 text-yellow-600'
                  : 'border-green-200 text-green-600'
              }`}
            >
              {metadata.intent.intent?.replace('_', ' ')}
            </Badge>
          )}
        </div>
        
        {metadata.error && (
          <div className="text-xs text-red-500 mt-1 italic">
            ⚠️ There was an issue processing this message
          </div>
        )}
      </div>
    </div>
  );
};