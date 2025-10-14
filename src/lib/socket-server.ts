import { Server as NetServer } from 'http';
import { NextApiRequest, NextApiResponse } from 'next';
import { Server as ServerIO } from 'socket.io';
import { v4 as uuidv4 } from 'uuid';
import { db } from './db';
import { chatSessions, chatMessages, chatAgents, chatSessionAssignments } from '../db/schema';
import { eq, and, desc } from 'drizzle-orm';

export type NextApiResponseServerIo = NextApiResponse & {
  socket: {
    server: NetServer & {
      io: ServerIO;
    };
  };
};

// Store active sessions and their socket connections
const activeSessions = new Map<string, {
  socketId: string;
  userId?: string;
  sessionId: string;
  isAgent: boolean;
}>();

export const config = {
  api: {
    bodyParser: false,
  },
};

export default async function SocketHandler(req: NextApiRequest, res: NextApiResponseServerIo) {
  if (res.socket.server.io) {
    console.log('Socket is already running');
  } else {
    console.log('Socket is initializing');
    const io = new ServerIO(res.socket.server);
    res.socket.server.io = io;

    io.on('connection', (socket) => {
      console.log(`Socket ${socket.id} connected`);

      // Join chat session
      socket.on('join-chat', async (data: { 
        sessionId?: string; 
        userId?: string; 
        userAgent?: string; 
        ipAddress?: string;
        isAgent?: boolean;
      }) => {
        try {
          let sessionId = data.sessionId;

          // If no sessionId provided, create a new session
          if (!sessionId) {
            sessionId = uuidv4();
            
            // Create new chat session in database
            await db.insert(chatSessions).values({
              id: uuidv4(),
              userId: data.userId || null,
              sessionId,
              userAgent: data.userAgent,
              ipAddress: data.ipAddress,
              isActive: true,
            });
          }

          // Store session info
          activeSessions.set(socket.id, {
            socketId: socket.id,
            userId: data.userId,
            sessionId,
            isAgent: data.isAgent || false,
          });

          // Join the session room
          socket.join(sessionId);
          
          // If agent is joining, update their status
          if (data.isAgent && data.userId) {
            await updateAgentStatus(data.userId, true, socket.id);
          }

          // Send existing messages for this session
          const existingMessages = await db
            .select()
            .from(chatMessages)
            .where(eq(chatMessages.sessionId, sessionId))
            .orderBy(chatMessages.sentAt);

          socket.emit('chat-history', existingMessages);
          socket.emit('joined-chat', { sessionId });

          console.log(`Socket ${socket.id} joined chat session ${sessionId}`);
        } catch (error) {
          console.error('Error joining chat:', error);
          socket.emit('error', { message: 'Failed to join chat' });
        }
      });

      // Send message
      socket.on('send-message', async (data: {
        sessionId: string;
        message: string;
        senderType: 'user' | 'agent' | 'bot';
        messageType?: string;
        metadata?: any;
      }) => {
        try {
          const session = activeSessions.get(socket.id);
          if (!session) {
            socket.emit('error', { message: 'Not in a chat session' });
            return;
          }

          // Save message to database
          const messageId = uuidv4();
          const newMessage = {
            id: messageId,
            sessionId: data.sessionId,
            senderId: session.userId || null,
            senderType: data.senderType,
            message: data.message,
            messageType: data.messageType || 'text',
            metadata: data.metadata ? JSON.stringify(data.metadata) : null,
            isRead: false,
          };

          await db.insert(chatMessages).values(newMessage);

          // Broadcast message to all users in the session
          io.to(data.sessionId).emit('new-message', {
            ...newMessage,
            sentAt: new Date().toISOString(),
          });

          // If this is a user message, get AI response
          if (data.senderType === 'user') {
            socket.emit('ai-thinking', { sessionId: data.sessionId });
            
            // Get AI response - call the service directly
            try {
              const { AIChatService } = await import('./ai-chat-service');
              const aiService = new AIChatService();
              
              const aiResponse = await aiService.processUserMessage(
                data.sessionId, 
                data.message, 
                session.userId
              );
              
              const intentClassification = await aiService.classifyIntent(data.message);
              
              const aiData = {
                response: aiResponse,
                intent: intentClassification,
                sessionId: data.sessionId,
              };
              
              // Send AI response to the session
              if (aiData.response) {
                io.to(data.sessionId).emit('new-message', {
                  id: 'ai_' + Date.now(),
                  sessionId: data.sessionId,
                  senderId: null,
                  senderType: 'bot',
                  message: aiData.response,
                  messageType: 'text',
                  metadata: JSON.stringify({ 
                    isAI: true, 
                    intent: aiData.intent 
                  }),
                  isRead: false,
                  sentAt: new Date().toISOString(),
                });
                
                // If intent suggests human escalation, notify agents
                if (aiData.intent?.suggestedAction === 'human' || aiData.intent?.suggestedAction === 'escalate') {
                  socket.emit('escalation-suggested', {
                    sessionId: data.sessionId,
                    intent: aiData.intent,
                    userMessage: data.message,
                  });
                }
              }
            } catch (error) {
              console.error('Error getting AI response:', error);
              // Send fallback message
              io.to(data.sessionId).emit('new-message', {
                id: 'ai_error_' + Date.now(),
                sessionId: data.sessionId,
                senderId: null,
                senderType: 'bot',
                message: "I'm having trouble processing your request. Let me connect you with a human agent.",
                messageType: 'text',
                metadata: JSON.stringify({ isAI: true, error: true }),
                isRead: false,
                sentAt: new Date().toISOString(),
              });
            }
          }

        } catch (error) {
          console.error('Error sending message:', error);
          socket.emit('error', { message: 'Failed to send message' });
        }
      });

      // Agent typing indicator
      socket.on('typing', (data: { sessionId: string; isTyping: boolean }) => {
        const session = activeSessions.get(socket.id);
        if (session && session.isAgent) {
          socket.to(data.sessionId).emit('agent-typing', {
            isTyping: data.isTyping,
            agentId: session.userId,
          });
        }
      });

      // User typing indicator
      socket.on('user-typing', (data: { sessionId: string; isTyping: boolean }) => {
        const session = activeSessions.get(socket.id);
        if (session && !session.isAgent) {
          socket.to(data.sessionId).emit('user-typing', {
            isTyping: data.isTyping,
            userId: session.userId,
          });
        }
      });

      // End chat session
      socket.on('end-chat', async (data: { sessionId: string; rating?: number }) => {
        try {
          const session = activeSessions.get(socket.id);
          if (!session) return;

          // Update session as inactive
          await db
            .update(chatSessions)
            .set({
              isActive: false,
              endedAt: new Date(),
              customerSatisfactionRating: data.rating || null,
            })
            .where(eq(chatSessions.sessionId, data.sessionId));

          // Notify all participants
          io.to(data.sessionId).emit('chat-ended', { sessionId: data.sessionId });

          // Leave the room
          socket.leave(data.sessionId);
          activeSessions.delete(socket.id);

        } catch (error) {
          console.error('Error ending chat:', error);
        }
      });

      // Handle disconnect
      socket.on('disconnect', async () => {
        console.log(`Socket ${socket.id} disconnected`);
        const session = activeSessions.get(socket.id);
        
        if (session) {
          // If agent disconnects, update their status
          if (session.isAgent && session.userId) {
            await updateAgentStatus(session.userId, false);
          }

          // Remove from active sessions
          activeSessions.delete(socket.id);
        }
      });
    });
  }

  res.end();
}

// Helper function to update agent online status
async function updateAgentStatus(userId: string, isOnline: boolean, socketId?: string) {
  try {
    const agent = await db
      .select()
      .from(chatAgents)
      .where(eq(chatAgents.userId, userId))
      .limit(1);

    if (agent.length > 0) {
      await db
        .update(chatAgents)
        .set({
          isOnline,
          lastActiveAt: new Date(),
        })
        .where(eq(chatAgents.userId, userId));
    } else {
      // Create agent record if doesn't exist
      await db.insert(chatAgents).values({
        id: uuidv4(),
        userId,
        isOnline,
        currentSessions: 0,
        maxSessions: 5,
        specialties: JSON.stringify([]),
      });
    }
  } catch (error) {
    console.error('Error updating agent status:', error);
  }
}

// Function to find available agents
export async function findAvailableAgent() {
  try {
    const availableAgents = await db
      .select()
      .from(chatAgents)
      .where(
        and(
          eq(chatAgents.isOnline, true),
          // Add condition to check if agent has capacity
        )
      )
      .limit(1);

    return availableAgents.length > 0 ? availableAgents[0] : null;
  } catch (error) {
    console.error('Error finding available agent:', error);
    return null;
  }
}