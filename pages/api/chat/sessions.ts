import { NextApiRequest, NextApiResponse } from 'next';
import { db } from '@/lib/db';
import { chatSessions, chatMessages } from '@/db/schema';
import { eq, desc, and } from 'drizzle-orm';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { method } = req;

  switch (method) {
    case 'GET':
      return handleGetSessions(req, res);
    case 'POST':
      return handleCreateSession(req, res);
    case 'PUT':
      return handleUpdateSession(req, res);
    default:
      res.setHeader('Allow', ['GET', 'POST', 'PUT']);
      return res.status(405).json({ error: 'Method not allowed' });
  }
}

async function handleGetSessions(req: NextApiRequest, res: NextApiResponse) {
  try {
    const { userId, status, limit = 50 } = req.query;

    let query = db.select().from(chatSessions);

    // Add filters
    const conditions = [];
    if (userId) {
      conditions.push(eq(chatSessions.userId, userId as string));
    }
    if (status) {
      conditions.push(eq(chatSessions.isActive, status === 'active'));
    }

    if (conditions.length > 0) {
      query = query.where(and(...conditions));
    }

    const sessions = await query
      .orderBy(desc(chatSessions.startedAt))
      .limit(parseInt(limit as string));

    // Get latest message for each session
    const sessionsWithMessages = await Promise.all(
      sessions.map(async (session) => {
        const latestMessage = await db
          .select()
          .from(chatMessages)
          .where(eq(chatMessages.sessionId, session.id))
          .orderBy(desc(chatMessages.sentAt))
          .limit(1);

        const unreadCount = await db
          .select({ count: chatMessages.id })
          .from(chatMessages)
          .where(
            and(
              eq(chatMessages.sessionId, session.id),
              eq(chatMessages.isRead, false),
              // Don't count user's own messages as unread
              // This would need to be adjusted based on your user identification logic
            )
          );

        return {
          ...session,
          latestMessage: latestMessage[0] || null,
          unreadCount: unreadCount.length || 0,
        };
      })
    );

    res.status(200).json({ sessions: sessionsWithMessages });
  } catch (error) {
    console.error('Error fetching chat sessions:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}

async function handleCreateSession(req: NextApiRequest, res: NextApiResponse) {
  try {
    const {
      sessionId,
      userId,
      userAgent,
      ipAddress,
    } = req.body;

    if (!sessionId) {
      return res.status(400).json({ error: 'Session ID is required' });
    }

    // Check if session already exists
    const existingSession = await db
      .select()
      .from(chatSessions)
      .where(eq(chatSessions.sessionId, sessionId))
      .limit(1);

    if (existingSession.length > 0) {
      return res.status(200).json({ session: existingSession[0] });
    }

    // Create new session
    const newSession = {
      id: `chat_session_${Date.now()}_${Math.random().toString(36).substring(2)}`,
      sessionId,
      userId: userId || null,
      isActive: true,
      userAgent: userAgent || null,
      ipAddress: ipAddress || null,
      startedAt: new Date(),
      endedAt: null,
      customerSatisfactionRating: null,
      tags: JSON.stringify([]),
    };

    await db.insert(chatSessions).values(newSession);

    res.status(201).json({ session: newSession });
  } catch (error) {
    console.error('Error creating chat session:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}

async function handleUpdateSession(req: NextApiRequest, res: NextApiResponse) {
  try {
    const {
      sessionId,
      isActive,
      rating,
      tags,
    } = req.body;

    if (!sessionId) {
      return res.status(400).json({ error: 'Session ID is required' });
    }

    const updateData: any = {};

    if (typeof isActive === 'boolean') {
      updateData.isActive = isActive;
      if (!isActive) {
        updateData.endedAt = new Date();
      }
    }

    if (rating) {
      updateData.customerSatisfactionRating = rating;
    }

    if (tags) {
      updateData.tags = JSON.stringify(tags);
    }

    const updatedSession = await db
      .update(chatSessions)
      .set(updateData)
      .where(eq(chatSessions.sessionId, sessionId))
      .returning();

    if (updatedSession.length === 0) {
      return res.status(404).json({ error: 'Session not found' });
    }

    res.status(200).json({ session: updatedSession[0] });
  } catch (error) {
    console.error('Error updating chat session:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}