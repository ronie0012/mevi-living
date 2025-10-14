import { NextApiRequest, NextApiResponse } from 'next';
import { AIChatService } from '@/lib/ai-chat-service';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { sessionId, userMessage, userId } = req.body;

    if (!sessionId || !userMessage) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const aiService = new AIChatService();
    
    // Process the user message and generate AI response
    const aiResponse = await aiService.processUserMessage(sessionId, userMessage, userId);
    
    // Classify intent for potential escalation
    const intentClassification = await aiService.classifyIntent(userMessage);
    
    res.status(200).json({
      response: aiResponse,
      intent: intentClassification,
      sessionId,
    });

  } catch (error) {
    console.error('Error in AI response handler:', error);
    res.status(500).json({ 
      error: 'Internal server error',
      response: 'I apologize, but I\'m experiencing technical difficulties. Let me connect you with a human agent.',
    });
  }
}