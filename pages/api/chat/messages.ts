import { NextApiRequest, NextApiResponse } from 'next';
import { db } from '@/lib/db';
import { chatMessages, chatSessions } from '@/db/schema';
import { eq, desc, and, asc } from 'drizzle-orm';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { method } = req;

  switch (method) {
    case 'GET':
      return handleGetMessages(req, res);
    case 'POST':
      return handleCreateMessage(req, res);
    case 'PUT':
      return handleUpdateMessage(req, res);
    default:
      res.setHeader('Allow', ['GET', 'POST', 'PUT']);
      return res.status(405).json({ error: 'Method not allowed' });
  }
}

async function handleGetMessages(req: NextApiRequest, res: NextApiResponse) {
  try {
    const { sessionId, limit = 100, offset = 0, order = 'asc' } = req.query;

    if (!sessionId) {
      return res.status(400).json({ error: 'Session ID is required' });
    }

    // Verify session exists
    const session = await db
      .select()
      .from(chatSessions)
      .where(eq(chatSessions.sessionId, sessionId as string))
      .limit(1);

    if (session.length === 0) {
      return res.status(404).json({ error: 'Session not found' });
    }

    // Get messages for the session
    const orderBy = order === 'desc' ? desc(chatMessages.sentAt) : asc(chatMessages.sentAt);
    
    const messages = await db
      .select()
      .from(chatMessages)
      .where(eq(chatMessages.sessionId, session[0].id))
      .orderBy(orderBy)
      .limit(parseInt(limit as string))
      .offset(parseInt(offset as string));

    // If we got messages in desc order, reverse them for chronological display
    if (order === 'desc') {
      messages.reverse();
    }

    res.status(200).json({ messages });
  } catch (error) {
    console.error('Error fetching messages:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}

async function handleCreateMessage(req: NextApiRequest, res: NextApiResponse) {
  try {
    const {
      sessionId,
      senderId,
      senderType,
      message,
      messageType = 'text',
      metadata,
    } = req.body;

    if (!sessionId || !message || !senderType) {
      return res.status(400).json({ 
        error: 'Session ID, message, and sender type are required' 
      });
    }

    // Verify session exists
    const session = await db
      .select()
      .from(chatSessions)
      .where(eq(chatSessions.sessionId, sessionId))
      .limit(1);

    if (session.length === 0) {
      return res.status(404).json({ error: 'Session not found' });
    }

    // Create new message
    const newMessage = {
      id: `msg_${Date.now()}_${Math.random().toString(36).substring(2)}`,
      sessionId: session[0].id,
      senderId: senderId || null,
      senderType,
      message,
      messageType,
      metadata: metadata ? JSON.stringify(metadata) : null,
      isRead: false,
      sentAt: new Date(),
    };

    await db.insert(chatMessages).values(newMessage);

    res.status(201).json({ message: newMessage });
  } catch (error) {
    console.error('Error creating message:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}

async function handleUpdateMessage(req: NextApiRequest, res: NextApiResponse) {
  try {
    const { messageId, isRead, metadata } = req.body;

    if (!messageId) {
      return res.status(400).json({ error: 'Message ID is required' });
    }

    const updateData: any = {};

    if (typeof isRead === 'boolean') {
      updateData.isRead = isRead;
    }

    if (metadata) {
      updateData.metadata = JSON.stringify(metadata);
    }

    const updatedMessage = await db
      .update(chatMessages)
      .set(updateData)
      .where(eq(chatMessages.id, messageId))
      .returning();

    if (updatedMessage.length === 0) {
      return res.status(404).json({ error: 'Message not found' });
    }

    res.status(200).json({ message: updatedMessage[0] });
  } catch (error) {
    console.error('Error updating message:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}

// Mark all messages in a session as read
export async function markMessagesAsRead(sessionId: string, userId?: string) {
  try {
    const session = await db
      .select()
      .from(chatSessions)
      .where(eq(chatSessions.sessionId, sessionId))
      .limit(1);

    if (session.length === 0) {
      throw new Error('Session not found');
    }

    // Mark messages as read (excluding user's own messages if userId provided)
    const conditions = [eq(chatMessages.sessionId, session[0].id)];
    if (userId) {
      // Don't mark user's own messages as read
      // conditions.push(ne(chatMessages.senderId, userId));
    }

    await db
      .update(chatMessages)
      .set({ isRead: true })
      .where(and(...conditions));

    return { success: true };
  } catch (error) {
    console.error('Error marking messages as read:', error);
    throw error;
  }
}