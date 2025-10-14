'use client';

import React, { createContext, useContext, useEffect, useState, useRef } from 'react';
import { v4 as uuidv4 } from 'uuid';

export interface ChatMessage {
  id: string;
  sessionId: string;
  senderId?: string | null;
  senderType: 'user' | 'agent' | 'bot';
  message: string;
  messageType: string;
  metadata?: any;
  isRead: boolean;
  sentAt: string | Date;
}

export interface ChatSession {
  id: string;
  sessionId: string;
  userId?: string;
  isActive: boolean;
  startedAt: string | Date;
  endedAt?: string | Date;
}

interface ChatContextType {
  // Connection status
  isConnected: boolean;
  isConnecting: boolean;
  
  // Current session
  currentSession: ChatSession | null;
  messages: ChatMessage[];
  
  // UI state
  isChatOpen: boolean;
  isTyping: boolean;
  isAgentTyping: boolean;
  isAIThinking: boolean;
  
  // Actions
  openChat: () => void;
  closeChat: () => void;
  sendMessage: (message: string, messageType?: string) => void;
  startTyping: () => void;
  stopTyping: () => void;
  endChat: (rating?: number) => void;
  
  // Session management
  sessionId?: string;
  userId?: string;
  setUserId: (userId: string) => void;
}

const ChatContext = createContext<ChatContextType | undefined>(undefined);

export const useChatContext = () => {
  const context = useContext(ChatContext);
  if (!context) {
    throw new Error('useChatContext must be used within a ChatProvider');
  }
  return context;
};

interface ChatProviderProps {
  children: React.ReactNode;
}

export const ChatProvider: React.FC<ChatProviderProps> = ({ children }) => {
  // Connection state
  const [isConnected] = useState(true); // Always connected for HTTP-based chat
  const [isConnecting] = useState(false);
  
  // Session state
  const [currentSession, setCurrentSession] = useState<ChatSession | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [sessionId, setSessionId] = useState<string>();
  const [userId, setUserId] = useState<string>();
  
  // UI state
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [isAgentTyping] = useState(false);
  const [isAIThinking, setIsAIThinking] = useState(false);
  
  // Typing timeout ref
  const typingTimeoutRef = useRef<NodeJS.Timeout | undefined>(undefined);

  // Initialize session
  const initializeSession = () => {
    if (!sessionId) {
      const newSessionId = uuidv4();
      setSessionId(newSessionId);
      
      // Create session
      const session: ChatSession = {
        id: newSessionId,
        sessionId: newSessionId,
        userId,
        isActive: true,
        startedAt: new Date().toISOString()
      };
      
      setCurrentSession(session);
      
      // Add welcome message
      setTimeout(() => {
        const welcomeMessage: ChatMessage = {
          id: uuidv4(),
          sessionId: newSessionId,
          senderType: 'bot',
          message: 'Hello! Welcome to Mevi Living support. How can I help you today?',
          messageType: 'text',
          isRead: false,
          sentAt: new Date().toISOString()
        };
        
        setMessages([welcomeMessage]);
      }, 500);
    }
  };

  const openChat = () => {
    setIsChatOpen(true);
    initializeSession();
  };

  const closeChat = () => {
    setIsChatOpen(false);
  };

  const sendMessage = async (message: string, messageType: string = 'text') => {
    if (!sessionId) return;

    // Add user message immediately
    const userMessage: ChatMessage = {
      id: uuidv4(),
      sessionId,
      senderType: 'user',
      message,
      messageType,
      isRead: true,
      sentAt: new Date().toISOString()
    };

    setMessages(prev => [...prev, userMessage]);

    // Show AI thinking
    setIsAIThinking(true);

    // Stop typing indicator
    setIsTyping(false);
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }

    try {
      // Send to API
      const response = await fetch('/api/chat/send', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message,
          sessionId,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to send message');
      }

      const data = await response.json();
      
      // Add AI response
      setMessages(prev => [...prev, data.response]);
    } catch (error) {
      console.error('Error sending message:', error);
      
      // Add error message
      const errorMessage: ChatMessage = {
        id: uuidv4(),
        sessionId,
        senderType: 'bot',
        message: 'I apologize, but I\'m having trouble responding right now. Please try again or contact our support team directly.',
        messageType: 'text',
        isRead: false,
        sentAt: new Date().toISOString()
      };
      
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsAIThinking(false);
    }
  };

  const startTyping = () => {
    if (!sessionId || isTyping) return;
    
    setIsTyping(true);

    // Clear existing timeout
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }

    // Set timeout to stop typing
    typingTimeoutRef.current = setTimeout(() => {
      stopTyping();
    }, 3000);
  };

  const stopTyping = () => {
    if (!sessionId) return;
    
    setIsTyping(false);

    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }
  };

  const endChat = (_rating?: number) => {
    if (!sessionId) return;

    // Update session
    if (currentSession) {
      setCurrentSession({
        ...currentSession,
        isActive: false,
        endedAt: new Date().toISOString()
      });
    }

    // Clear messages and close chat
    setMessages([]);
    setSessionId(undefined);
    setIsChatOpen(false);
  };

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
      }
    };
  }, []);

  const value: ChatContextType = {
    // Connection status
    isConnected,
    isConnecting,
    
    // Current session
    currentSession,
    messages,
    
    // UI state
    isChatOpen,
    isTyping,
    isAgentTyping,
    isAIThinking,
    
    // Actions
    openChat,
    closeChat,
    sendMessage,
    startTyping,
    stopTyping,
    endChat,
    
    // Session management
    sessionId,
    userId,
    setUserId,
  };

  return <ChatContext.Provider value={value}>{children}</ChatContext.Provider>;
};