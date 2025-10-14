import OpenAI from 'openai';
import { db } from './db';
import { chatMessages, chatSessions, orders, orderItems } from '../db/schema';
import { eq, and, desc } from 'drizzle-orm';

// Initialize OpenAI client
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// Company/product context for the AI
const COMPANY_CONTEXT = `
You are a helpful customer support assistant for Mevi Living, a premium home decor and furniture e-commerce store. 
You help customers with:
- Product inquiries and recommendations
- Order status and tracking
- Returns and exchanges
- Shipping information
- General customer service

Your tone should be friendly, professional, and helpful. Always try to provide accurate information and offer to connect customers with a human agent if needed.

Key information about Mevi Living:
- We offer premium home decor, furniture, and living accessories
- We have collections including dining, living room, bedroom, and gift items
- Standard shipping takes 5-7 business days
- We offer free shipping on orders over $200
- 30-day return policy on most items
- Customer service is available Mon-Fri 9AM-6PM EST

If you cannot answer a question with confidence, offer to connect the customer with a human agent.
`;

export interface ChatContext {
  sessionId: string;
  userId?: string;
  recentMessages: Array<{
    senderType: string;
    message: string;
    sentAt: Date;
  }>;
  customerOrders?: Array<{
    orderNumber: string;
    status: string;
    total: number;
    createdAt: Date;
  }>;
}

export class AIChatService {
  async generateResponse(context: ChatContext): Promise<string> {
    try {
      // Get recent conversation history
      const conversationHistory = context.recentMessages
        .slice(-10) // Last 10 messages for context
        .map(msg => ({
          role: msg.senderType === 'user' ? 'user' : 'assistant',
          content: msg.message,
        }));

      // Add customer order context if available
      let customerContext = '';
      if (context.customerOrders && context.customerOrders.length > 0) {
        customerContext = `\n\nCustomer's recent orders:\n${context.customerOrders
          .slice(0, 3)
          .map(order => 
            `Order ${order.orderNumber}: ${order.status}, $${(order.total / 100).toFixed(2)}, placed on ${order.createdAt.toLocaleDateString()}`
          )
          .join('\n')}`;
      }

      const systemMessage = {
        role: 'system' as const,
        content: COMPANY_CONTEXT + customerContext,
      };

      const response = await openai.chat.completions.create({
        model: 'gpt-3.5-turbo',
        messages: [
          systemMessage,
          ...conversationHistory,
        ],
        max_tokens: 300,
        temperature: 0.7,
        presence_penalty: 0.1,
        frequency_penalty: 0.1,
      });

      const aiResponse = response.choices[0]?.message?.content?.trim();
      
      if (!aiResponse) {
        return "I apologize, but I'm having trouble generating a response right now. Let me connect you with a human agent who can better assist you.";
      }

      return aiResponse;
    } catch (error) {
      console.error('Error generating AI response:', error);
      return "I'm experiencing some technical difficulties. Let me connect you with a human agent who can help you right away.";
    }
  }

  async processUserMessage(sessionId: string, userMessage: string, userId?: string): Promise<string> {
    try {
      // Get recent messages for context
      const recentMessages = await db
        .select({
          senderType: chatMessages.senderType,
          message: chatMessages.message,
          sentAt: chatMessages.sentAt,
        })
        .from(chatMessages)
        .where(eq(chatMessages.sessionId, sessionId))
        .orderBy(desc(chatMessages.sentAt))
        .limit(10);

      // Get customer orders if user is logged in
      let customerOrders;
      if (userId) {
        customerOrders = await db
          .select({
            orderNumber: orders.orderNumber,
            status: orders.status,
            total: orders.total,
            createdAt: orders.createdAt,
          })
          .from(orders)
          .where(eq(orders.userId, userId))
          .orderBy(desc(orders.createdAt))
          .limit(5);
      }

      const context: ChatContext = {
        sessionId,
        userId,
        recentMessages: recentMessages.reverse(), // Reverse to get chronological order
        customerOrders,
      };

      // Generate AI response
      const aiResponse = await this.generateResponse(context);

      // Save AI response to database
      await this.saveAIMessage(sessionId, aiResponse);

      return aiResponse;
    } catch (error) {
      console.error('Error processing user message:', error);
      const fallbackResponse = "I apologize for the inconvenience. Let me connect you with one of our customer service representatives who can assist you better.";
      await this.saveAIMessage(sessionId, fallbackResponse);
      return fallbackResponse;
    }
  }

  async saveAIMessage(sessionId: string, message: string): Promise<void> {
    try {
      await db.insert(chatMessages).values({
        id: this.generateId(),
        sessionId,
        senderId: null, // AI messages don't have a user sender
        senderType: 'bot',
        message,
        messageType: 'text',
        metadata: JSON.stringify({ isAI: true }),
        isRead: false,
      });
    } catch (error) {
      console.error('Error saving AI message:', error);
    }
  }

  private generateId(): string {
    return 'ai_' + Math.random().toString(36).substring(2) + Date.now().toString(36);
  }

  // Intent classification for routing to appropriate agents
  async classifyIntent(message: string): Promise<{
    intent: string;
    confidence: number;
    suggestedAction: 'ai' | 'human' | 'escalate';
  }> {
    try {
      const response = await openai.chat.completions.create({
        model: 'gpt-3.5-turbo',
        messages: [
          {
            role: 'system',
            content: `Classify the customer's intent and determine if they need human assistance. 
            
            Return your response in this JSON format:
            {
              "intent": "order_inquiry|product_question|return_request|complaint|general_inquiry|technical_issue",
              "confidence": 0.8,
              "suggestedAction": "ai|human|escalate",
              "reasoning": "Brief explanation"
            }
            
            Use "human" for complex issues, complaints, or specific order problems.
            Use "escalate" for angry customers or technical issues.
            Use "ai" for general questions, product info, or simple inquiries.`,
          },
          {
            role: 'user',
            content: message,
          },
        ],
        max_tokens: 150,
        temperature: 0.3,
      });

      const result = response.choices[0]?.message?.content;
      if (result) {
        try {
          return JSON.parse(result);
        } catch (parseError) {
          console.error('Error parsing intent classification:', parseError);
        }
      }

      // Fallback classification
      return {
        intent: 'general_inquiry',
        confidence: 0.5,
        suggestedAction: 'ai',
      };
    } catch (error) {
      console.error('Error classifying intent:', error);
      return {
        intent: 'general_inquiry',
        confidence: 0.1,
        suggestedAction: 'ai',
      };
    }
  }

  // Generate quick reply suggestions
  async generateQuickReplies(conversationHistory: string[]): Promise<string[]> {
    try {
      const response = await openai.chat.completions.create({
        model: 'gpt-3.5-turbo',
        messages: [
          {
            role: 'system',
            content: `Based on the conversation, suggest 3 relevant quick reply options the customer might want to ask. 
            Return them as a JSON array of strings, each under 50 characters.
            Example: ["Check my order status", "Return an item", "Product recommendations"]`,
          },
          {
            role: 'user',
            content: `Conversation: ${conversationHistory.slice(-5).join(' | ')}`,
          },
        ],
        max_tokens: 100,
        temperature: 0.5,
      });

      const result = response.choices[0]?.message?.content;
      if (result) {
        try {
          const suggestions = JSON.parse(result);
          return Array.isArray(suggestions) ? suggestions : [];
        } catch (parseError) {
          console.error('Error parsing quick replies:', parseError);
        }
      }

      return [];
    } catch (error) {
      console.error('Error generating quick replies:', error);
      return [];
    }
  }
}