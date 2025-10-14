'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { 
  MessageCircle, 
  Users, 
  Clock, 
  Star, 
  Search, 
  Filter,
  Phone,
  Mail,
  Calendar,
  TrendingUp,
  AlertCircle,
  CheckCircle,
  Send
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

// Mock data - In a real app, this would come from your API
const mockSessions = [
  {
    id: '1',
    sessionId: 'sess_001',
    customerName: 'John Doe',
    customerEmail: 'john@example.com',
    status: 'active',
    priority: 'high',
    startedAt: new Date(Date.now() - 30 * 60 * 1000),
    lastMessage: 'I need help with my order #12345',
    unreadCount: 3,
    tags: ['order_inquiry', 'urgent'],
    rating: null,
  },
  {
    id: '2',
    sessionId: 'sess_002',
    customerName: 'Jane Smith',
    customerEmail: 'jane@example.com',
    status: 'waiting',
    priority: 'medium',
    startedAt: new Date(Date.now() - 45 * 60 * 1000),
    lastMessage: 'What are your shipping options?',
    unreadCount: 1,
    tags: ['shipping_inquiry'],
    rating: null,
  },
  {
    id: '3',
    sessionId: 'sess_003',
    customerName: 'Bob Johnson',
    customerEmail: 'bob@example.com',
    status: 'closed',
    priority: 'low',
    startedAt: new Date(Date.now() - 2 * 60 * 60 * 1000),
    lastMessage: 'Thank you for your help!',
    unreadCount: 0,
    tags: ['product_question'],
    rating: 5,
  },
];

const mockMessages = [
  {
    id: '1',
    sessionId: 'sess_001',
    senderType: 'user' as const,
    message: 'Hi, I need help with my order #12345',
    sentAt: new Date(Date.now() - 10 * 60 * 1000),
  },
  {
    id: '2',
    sessionId: 'sess_001',
    senderType: 'bot' as const,
    message: 'Hello! I\'d be happy to help you with your order. Let me look that up for you.',
    sentAt: new Date(Date.now() - 9 * 60 * 1000),
  },
  {
    id: '3',
    sessionId: 'sess_001',
    senderType: 'user' as const,
    message: 'It shows as delivered but I haven\'t received it',
    sentAt: new Date(Date.now() - 5 * 60 * 1000),
  },
];

export default function AdminChatDashboard() {
  const [selectedSession, setSelectedSession] = useState(mockSessions[0]);
  const [messages, setMessages] = useState(mockMessages);
  const [newMessage, setNewMessage] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  const formatTime = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', {
      hour: '2-digit',
      minute: '2-digit',
    }).format(date);
  };

  const formatDuration = (date: Date) => {
    const minutes = Math.floor((Date.now() - date.getTime()) / (1000 * 60));
    if (minutes < 60) return `${minutes}m ago`;
    const hours = Math.floor(minutes / 60);
    return `${hours}h ${minutes % 60}m ago`;
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'low': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'waiting': return 'bg-yellow-100 text-yellow-800';
      case 'closed': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const filteredSessions = mockSessions.filter(session => {
    const matchesSearch = session.customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         session.customerEmail.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         session.lastMessage.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'all' || session.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleSendMessage = () => {
    if (!newMessage.trim()) return;
    
    const message = {
      id: Date.now().toString(),
      sessionId: selectedSession.sessionId,
      senderType: 'agent' as const,
      message: newMessage.trim(),
      sentAt: new Date(),
    };
    
    setMessages(prev => [...prev, message]);
    setNewMessage('');
  };

  const stats = {
    totalSessions: mockSessions.length,
    activeSessions: mockSessions.filter(s => s.status === 'active').length,
    waitingSessions: mockSessions.filter(s => s.status === 'waiting').length,
    averageRating: 4.2,
  };

  return (
    <div className="h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto h-full flex flex-col">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Chat Dashboard</h1>
          <p className="text-gray-600">Manage customer support conversations</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Sessions</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.totalSessions}</p>
                </div>
                <MessageCircle className="h-8 w-8 text-blue-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Active Chats</p>
                  <p className="text-2xl font-bold text-green-600">{stats.activeSessions}</p>
                </div>
                <Users className="h-8 w-8 text-green-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">In Queue</p>
                  <p className="text-2xl font-bold text-yellow-600">{stats.waitingSessions}</p>
                </div>
                <Clock className="h-8 w-8 text-yellow-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Avg Rating</p>
                  <p className="text-2xl font-bold text-purple-600">{stats.averageRating}</p>
                </div>
                <Star className="h-8 w-8 text-purple-600" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <div className="flex-1 grid grid-cols-12 gap-6 min-h-0">
          {/* Sessions List */}
          <Card className="col-span-4">
            <CardHeader className="pb-4">
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg">Chat Sessions</CardTitle>
                <div className="flex space-x-2">
                  <Button variant="outline" size="sm">
                    <Filter className="w-4 h-4" />
                  </Button>
                </div>
              </div>
              
              {/* Search and Filters */}
              <div className="space-y-2">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <Input
                    placeholder="Search sessions..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10"
                  />
                </div>
                
                <div className="flex space-x-2">
                  {['all', 'active', 'waiting', 'closed'].map((status) => (
                    <Button
                      key={status}
                      variant={statusFilter === status ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => setStatusFilter(status)}
                      className="capitalize"
                    >
                      {status}
                    </Button>
                  ))}
                </div>
              </div>
            </CardHeader>
            
            <ScrollArea className="flex-1">
              <div className="space-y-2 p-4">
                {filteredSessions.map((session) => (
                  <motion.div
                    key={session.id}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className={`p-3 rounded-lg cursor-pointer border transition-colors ${
                      selectedSession.id === session.id 
                        ? 'bg-blue-50 border-blue-200' 
                        : 'bg-white hover:bg-gray-50 border-gray-200'
                    }`}
                    onClick={() => setSelectedSession(session)}
                  >
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex items-center space-x-3">
                        <Avatar className="w-8 h-8">
                          <AvatarFallback className="text-xs">
                            {session.customerName.split(' ').map(n => n[0]).join('')}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <h4 className="font-medium text-sm text-gray-900">
                            {session.customerName}
                          </h4>
                          <p className="text-xs text-gray-500">{session.customerEmail}</p>
                        </div>
                      </div>
                      
                      <div className="flex flex-col items-end space-y-1">
                        <Badge className={`text-xs ${getStatusColor(session.status)}`}>
                          {session.status}
                        </Badge>
                        {session.unreadCount > 0 && (
                          <Badge className="text-xs bg-red-500 text-white">
                            {session.unreadCount}
                          </Badge>
                        )}
                      </div>
                    </div>
                    
                    <p className="text-xs text-gray-600 line-clamp-2 mb-2">
                      {session.lastMessage}
                    </p>
                    
                    <div className="flex items-center justify-between">
                      <div className="flex space-x-1">
                        {session.tags.map((tag) => (
                          <Badge key={tag} variant="secondary" className="text-xs">
                            {tag.replace('_', ' ')}
                          </Badge>
                        ))}
                      </div>
                      <span className="text-xs text-gray-400">
                        {formatDuration(session.startedAt)}
                      </span>
                    </div>
                  </motion.div>
                ))}
              </div>
            </ScrollArea>
          </Card>

          {/* Chat Area */}
          <Card className="col-span-8 flex flex-col">
            {selectedSession ? (
              <>
                {/* Chat Header */}
                <CardHeader className="border-b">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <Avatar>
                        <AvatarFallback>
                          {selectedSession.customerName.split(' ').map(n => n[0]).join('')}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <h3 className="font-semibold">{selectedSession.customerName}</h3>
                        <div className="flex items-center space-x-4 text-sm text-gray-500">
                          <span className="flex items-center">
                            <Mail className="w-4 h-4 mr-1" />
                            {selectedSession.customerEmail}
                          </span>
                          <span className="flex items-center">
                            <Calendar className="w-4 h-4 mr-1" />
                            Started {formatDuration(selectedSession.startedAt)}
                          </span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <Badge className={getPriorityColor(selectedSession.priority)}>
                        {selectedSession.priority} priority
                      </Badge>
                      <Badge className={getStatusColor(selectedSession.status)}>
                        {selectedSession.status}
                      </Badge>
                    </div>
                  </div>
                </CardHeader>

                {/* Messages */}
                <ScrollArea className="flex-1 p-4">
                  <div className="space-y-4">
                    {messages
                      .filter(m => m.sessionId === selectedSession.sessionId)
                      .map((message) => (
                        <div
                          key={message.id}
                          className={`flex ${
                            message.senderType === 'agent' ? 'justify-end' : 'justify-start'
                          }`}
                        >
                          <div
                            className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                              message.senderType === 'agent'
                                ? 'bg-blue-600 text-white'
                                : message.senderType === 'bot'
                                ? 'bg-gray-100 text-gray-900'
                                : 'bg-gray-200 text-gray-900'
                            }`}
                          >
                            <p className="text-sm">{message.message}</p>
                            <p className={`text-xs mt-1 ${
                              message.senderType === 'agent' ? 'text-blue-100' : 'text-gray-500'
                            }`}>
                              {formatTime(message.sentAt)} • {
                                message.senderType === 'agent' ? 'You' : 
                                message.senderType === 'bot' ? 'AI Assistant' : 
                                selectedSession.customerName
                              }
                            </p>
                          </div>
                        </div>
                      ))}
                  </div>
                </ScrollArea>

                {/* Message Input */}
                <div className="p-4 border-t">
                  <div className="flex space-x-2">
                    <Input
                      placeholder="Type your message..."
                      value={newMessage}
                      onChange={(e) => setNewMessage(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                      className="flex-1"
                    />
                    <Button onClick={handleSendMessage} disabled={!newMessage.trim()}>
                      <Send className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </>
            ) : (
              <div className="flex-1 flex items-center justify-center">
                <div className="text-center text-gray-500">
                  <MessageCircle className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                  <p>Select a chat session to start messaging</p>
                </div>
              </div>
            )}
          </Card>
        </div>
      </div>
    </div>
  );
}