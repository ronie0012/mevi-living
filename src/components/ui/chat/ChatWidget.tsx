'use client';

import React, { useState, useRef, useEffect } from 'react';
import { MessageCircle, X, Send, Star } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useChatContext } from '@/contexts/ChatContext';
import { Button } from '../button';
import { Input } from '../input';
import { Card } from '../card';
import { Badge } from '../badge';
import { Avatar, AvatarFallback, AvatarImage } from '../avatar';
import { ScrollArea } from '../scroll-area';
import { ChatMessage } from './ChatMessage';
// CSS styles moved to globals.css

interface ChatWidgetProps {
  position?: 'bottom-right' | 'bottom-left';
  theme?: 'light' | 'dark';
}

export const ChatWidget: React.FC<ChatWidgetProps> = ({ 
  position = 'bottom-right',
  theme = 'light' 
}) => {
  const {
    isChatOpen,
    isConnected,
    isConnecting,
    messages,
    isAIThinking,
    isAgentTyping,
    openChat,
    closeChat,
    sendMessage,
    startTyping,
    stopTyping,
    endChat,
  } = useChatContext();

  const [inputMessage, setInputMessage] = useState('');
  const [showRating, setShowRating] = useState(false);
  const [rating, setRating] = useState(0);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const positionClasses = position === 'bottom-right' 
    ? 'bottom-4 right-4' 
    : 'bottom-4 left-4';

  // Auto scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isAIThinking]);

  // Focus input when chat opens
  useEffect(() => {
    if (isChatOpen && inputRef.current) {
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [isChatOpen]);

  const handleSendMessage = () => {
    if (!inputMessage.trim()) return;
    
    sendMessage(inputMessage.trim());
    setInputMessage('');
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputMessage(e.target.value);
    if (e.target.value.length > 0) {
      startTyping();
    } else {
      stopTyping();
    }
  };

  const handleEndChat = () => {
    setShowRating(true);
  };

  const handleRatingSubmit = () => {
    endChat(rating);
    setShowRating(false);
    setRating(0);
    closeChat();
  };

  const getConnectionStatus = () => {
    if (isConnecting) return { text: 'Connecting...', color: 'bg-yellow-500' };
    if (isConnected) return { text: 'Online', color: 'bg-green-500' };
    return { text: 'Offline', color: 'bg-red-500' };
  };

  const connectionStatus = getConnectionStatus();

  return (
    <div 
      className={`fixed ${positionClasses} mevi-living-chat-widget`} 
      style={{ 
        zIndex: 999999,
        isolation: 'isolate',
        pointerEvents: 'auto'
      }}
      data-chat-widget="mevi-living"
    >
      <AnimatePresence>
        {isChatOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 20 }}
            transition={{ duration: 0.2 }}
            className="mb-4"
            style={{ zIndex: 999998, isolation: 'isolate' }}
          >
            <div 
              className="w-80 h-[500px] bg-white dark:bg-gray-900 rounded-lg shadow-2xl border flex flex-col overflow-hidden"
              data-chat-modal="true"
            >
              {/* Header */}
              <div className="flex items-center justify-between p-4 border-b bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-t-lg flex-shrink-0">
                <div className="flex items-center space-x-3">
                  <div className="relative">
                    <Avatar className="w-8 h-8">
                      <AvatarImage src="/api/placeholder/32/32" alt="Support" />
                      <AvatarFallback className="bg-white text-blue-600 text-xs">
                        CS
                      </AvatarFallback>
                    </Avatar>
                    <div className={`absolute -bottom-1 -right-1 w-3 h-3 rounded-full ${connectionStatus.color} border-2 border-white`} />
                  </div>
                  <div>
                    <h3 className="font-semibold text-sm">Customer Support</h3>
                    <p className="text-xs opacity-90">{connectionStatus.text}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-white hover:bg-white/20 h-8 w-8 p-0 flex items-center justify-center"
                    onClick={closeChat}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              {/* Messages */}
              <div className="flex-1 overflow-y-auto p-4 min-h-0">
                <div className="space-y-4">
                  {messages.length === 0 && (
                    <div className="text-center text-gray-500 text-sm py-8">
                      <MessageCircle className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                      <p className="mb-2">Welcome to Mevi Living Support!</p>
                      <p className="text-xs">
                        How can we help you today? Ask about our products, orders, or anything else!
                      </p>
                    </div>
                  )}
                  
                  {messages.map((message) => (
                    <ChatMessage key={message.id} message={message} />
                  ))}
                  
                  {isAIThinking && (
                    <div className="flex items-start space-x-2">
                      <Avatar className="w-6 h-6 mt-1">
                        <AvatarFallback className="bg-blue-100 text-blue-600 text-xs">
                          AI
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1 bg-gray-100 rounded-lg p-3 max-w-xs">
                        <div className="flex space-x-1">
                          <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" />
                          <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }} />
                          <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }} />
                        </div>
                      </div>
                    </div>
                  )}
                  
                  {isAgentTyping && (
                    <div className="flex items-center space-x-2 text-sm text-gray-500">
                      <Avatar className="w-5 h-5">
                        <AvatarFallback className="bg-green-100 text-green-600 text-xs">
                          A
                        </AvatarFallback>
                      </Avatar>
                      <span>Agent is typing...</span>
                    </div>
                  )}
                </div>
                <div ref={messagesEndRef} />
              </div>

              {/* Rating Modal */}
              {showRating && (
                <div className="absolute inset-0 bg-white dark:bg-gray-900 flex items-center justify-center rounded-lg">
                  <div className="text-center p-6">
                    <h3 className="text-lg font-semibold mb-4">Rate Your Experience</h3>
                    <div className="flex justify-center space-x-2 mb-6">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <button
                          key={star}
                          onClick={() => setRating(star)}
                          className={`p-1 transition-colors ${
                            star <= rating ? 'text-yellow-500' : 'text-gray-300'
                          }`}
                        >
                          <Star className="w-6 h-6 fill-current" />
                        </button>
                      ))}
                    </div>
                    <div className="flex space-x-2">
                      <Button variant="outline" size="sm" onClick={() => setShowRating(false)}>
                        Skip
                      </Button>
                      <Button size="sm" onClick={handleRatingSubmit}>
                        Submit
                      </Button>
                    </div>
                  </div>
                </div>
              )}

              {/* Input */}
              <div className="flex-shrink-0 p-4 border-t bg-white dark:bg-gray-900">
                <div className="flex space-x-2">
                  <Input
                    ref={inputRef}
                    placeholder="Type your message..."
                    value={inputMessage}
                    onChange={handleInputChange}
                    onKeyPress={handleKeyPress}
                    disabled={!isConnected}
                    className="flex-1 text-sm h-10"
                  />
                  <Button
                    onClick={handleSendMessage}
                    disabled={!inputMessage.trim() || !isConnected}
                    size="sm"
                    className="px-3 h-10"
                  >
                    <Send className="w-4 h-4" />
                  </Button>
                </div>
                {!isConnected && (
                  <p className="text-xs text-red-500 mt-2">
                    Connecting to support...
                  </p>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Chat Button */}
      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={isChatOpen ? closeChat : openChat}
        className="w-14 h-14 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-full shadow-lg hover:shadow-xl transition-shadow flex items-center justify-center relative"
        style={{ zIndex: 999997 }}
        data-chat-button="true"
      >
        <AnimatePresence mode="wait">
          {isChatOpen ? (
            <motion.div
              key="close"
              initial={{ rotate: -90, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              exit={{ rotate: 90, opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              <X className="w-6 h-6" />
            </motion.div>
          ) : (
            <motion.div
              key="open"
              initial={{ rotate: -90, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              exit={{ rotate: 90, opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              <MessageCircle className="w-6 h-6" />
            </motion.div>
          )}
        </AnimatePresence>

        {/* Unread messages indicator */}
        {!isChatOpen && messages.length > 0 && (
          <Badge className="absolute -top-2 -right-2 w-5 h-5 p-0 flex items-center justify-center text-xs bg-red-500 hover:bg-red-600">
            {messages.filter(m => !m.isRead && m.senderType !== 'user').length}
          </Badge>
        )}
      </motion.button>
    </div>
  );
};