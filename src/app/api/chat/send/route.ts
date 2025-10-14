import { NextRequest, NextResponse } from 'next/server';
import { v4 as uuidv4 } from 'uuid';

export async function POST(request: NextRequest) {
  try {
    const { message, sessionId } = await request.json();

    if (!message || !sessionId) {
      return NextResponse.json(
        { error: 'Message and sessionId are required' },
        { status: 400 }
      );
    }

    // Generate AI response
    const aiResponse = await generateAIResponse(message);

    const response = {
      id: uuidv4(),
      sessionId,
      senderType: 'bot',
      message: aiResponse,
      messageType: 'text',
      isRead: false,
      sentAt: new Date().toISOString()
    };

    return NextResponse.json({ response });
  } catch (error) {
    console.error('Chat API error:', error);
    return NextResponse.json(
      { error: 'Failed to process message' },
      { status: 500 }
    );
  }
}

async function generateAIResponse(userMessage: string): Promise<string> {
  // First, try to provide intelligent responses based on the message content
  const lowerMessage = userMessage.toLowerCase();
  
  // Handle order number patterns (like #ORD-949651-EDPB)
  if (lowerMessage.includes('#ord-') || lowerMessage.includes('ord-') || /\b[a-z]{3,4}-\d{6}-[a-z]{4}\b/i.test(userMessage)) {
    const orderMatch = userMessage.match(/#?([A-Z]{3,4}-\d{6}-[A-Z]{4})/i);
    const orderNumber = orderMatch ? orderMatch[1] : 'your order';
    
    return `Thank you for providing order number **${orderNumber}**! 📦

Here's what I can help you with:

🔍 **Order Status**: Your order is currently being processed. You should receive a tracking number within 24 hours via email.

📧 **Tracking Updates**: Check your email (including spam folder) for shipping notifications

📞 **Need immediate help?** Our customer service team can provide detailed tracking info at 9 AM - 6 PM EST, Monday-Friday

⏰ **Typical Timeline**: 
- Processing: 1-2 business days
- Shipping: 5-7 business days
- Total delivery time: 6-9 business days

Is there anything specific about your order you'd like to know?`;
  }

  // Handle follow-up questions like "yes", "tell me more", "details"
  if (lowerMessage.includes('yes') || lowerMessage.includes('tell me more') || lowerMessage.includes('details') || lowerMessage.includes('more info')) {
    return `I'd love to provide more details! Here's additional information about our serveware collection:

🌸 **Windsor Bloom Soiree Plates** (₹1,799)
- Set of 6 elegant ceramic plates
- Intricate Windsor bloom pattern design
- Perfect for dinner parties and special occasions
- Dishwasher safe for easy cleaning

🍃 **Windsor Bloom Soiree Canapes** (₹1,799) 
- Set of 6 delicate canape plates
- Matching Windsor bloom design
- Ideal for appetizers and small bites
- Food-safe ceramic construction

🎨 **Alba Trayette** (₹1,599)
- Refined minimalist serving tray
- Multi-purpose design for serving and display
- Durable construction with elegant finish
- Easy to clean and maintain

Which piece interests you most? I can provide specific care instructions or styling tips!`;
  }

  // Product recommendations for serveware
  if (lowerMessage.includes('serveware') || lowerMessage.includes('recommend') || lowerMessage.includes('best') || lowerMessage.includes('product')) {
    return `I'd be happy to recommend some of our beautiful serveware pieces! Here are our top picks:

🌸 **Windsor Bloom Soiree Plates** (₹1,799) - Elegant ceramic plates with intricate Windsor bloom pattern, perfect for special occasions
🍃 **Windsor Bloom Soiree Canapes** (₹1,799) - Delicate canape plates ideal for appetizers and small bites
🎨 **Alba Trayette** (₹1,599) - Refined minimalist serving tray with elegant finish
🥗 **Ligne Bowl** (₹799) - Modern minimalist bowl perfect for serving or decoration

All items come with free shipping on orders over ₹100! Would you like more details about any of these pieces?`;
  }

  // Order tracking
  if (lowerMessage.includes('order') || lowerMessage.includes('track') || lowerMessage.includes('where is')) {
    return `I'd be happy to help you track your order! To locate your order status, I'll need your order number or the email address used for the purchase. 

You can also:
📧 Check your email for order confirmation and tracking details
🔍 Log into your account to view order history
📞 Call our customer service at 9 AM - 6 PM EST, Monday-Friday

What's your order number or email address?`;
  }

  // Specific product inquiries
  if (lowerMessage.includes('windsor') || lowerMessage.includes('bloom')) {
    return `The **Windsor Bloom Collection** is one of our most popular! ✨

🌸 **Windsor Bloom Soiree Plates** (₹1,799)
- Elegant ceramic dinner plates
- Intricate floral pattern design
- Set of 6 plates
- Perfect for entertaining

🍃 **Windsor Bloom Soiree Canapes** (₹1,799)
- Matching canape plates
- Ideal for appetizers
- Set of 6 small plates
- Complements the dinner plates beautifully

Both pieces feature the same exquisite Windsor bloom pattern and are dishwasher safe. Would you like to know about styling tips or care instructions?`;
  }

  if (lowerMessage.includes('alba') || lowerMessage.includes('tray')) {
    return `The **Alba Trayette** is a beautiful choice! 🎨

✨ **Features:**
- Refined minimalist design
- Multi-purpose serving tray
- Perfect for entertaining or display
- Durable construction with elegant finish
- Price: ₹1,599

**Perfect for:**
- Serving drinks and appetizers
- Displaying decorative items
- Breakfast in bed
- Coffee table styling

The Alba Trayette pairs beautifully with our Windsor Bloom pieces. Would you like styling suggestions or information about our other serving pieces?`;
  }

  if (lowerMessage.includes('ligne') || lowerMessage.includes('bowl')) {
    return `The **Ligne Bowl** is perfect for modern homes! 🥗

✨ **Features:**
- Modern minimalist design with clean lines
- Versatile ceramic bowl
- Great for serving or decoration
- Microwave and dishwasher safe
- Price: ₹799 (most affordable in our collection!)

**Perfect for:**
- Serving salads and fruits
- Decorative centerpiece
- Everyday dining
- Gift giving

At ₹799, it's a great way to start your Mevi Living collection! Would you like to know about coordinating pieces?`;
  }

  // Shipping information
  if (lowerMessage.includes('shipping') || lowerMessage.includes('delivery')) {
    return `Here's our shipping information:

🚚 **Free shipping** on all orders over ₹100
📦 Standard delivery: 5-7 business days
🏠 White-glove delivery available for furniture items
📍 We deliver across India

For serveware items, we use secure packaging to ensure your pieces arrive safely. Would you like to know about delivery options for a specific product?`;
  }

  // Returns and refunds
  if (lowerMessage.includes('return') || lowerMessage.includes('refund') || lowerMessage.includes('exchange')) {
    return `Our return policy is designed to ensure your satisfaction:

✅ **30-day return policy** for most items
📦 Items must be in original condition with packaging
🔄 Easy return process - we can arrange pickup for larger items
💰 Full refund processed within 5-7 business days

Need to return something? I can help you start the return process. What item would you like to return?`;
  }

  // General greetings
  if (lowerMessage.includes('hello') || lowerMessage.includes('hi') || lowerMessage.includes('hey')) {
    return `Hello! Welcome to Mevi Living! 👋

I'm here to help you with:
🛍️ Product recommendations and details
📦 Order tracking and shipping info
🔄 Returns and exchanges
💡 Any questions about our home decor collection

What can I assist you with today?`;
  }

  // Handle pricing questions
  if (lowerMessage.includes('price') || lowerMessage.includes('cost') || lowerMessage.includes('how much')) {
    return `Here are our current serveware prices:

💰 **Pricing:**
🥗 **Ligne Bowl** - ₹799 (Best value!)
🎨 **Alba Trayette** - ₹1,599
🌸 **Heritage Floral Trayette** - ₹1,599
🌸 **Windsor Bloom Soiree Plates** - ₹1,799
🍃 **Windsor Bloom Soiree Canapes** - ₹1,799

✨ **Special Offers:**
- Free shipping on orders over ₹100
- Bundle discounts available for multiple items
- Seasonal sales throughout the year

Which piece are you most interested in? I can suggest complementary items for a complete set!`;
  }

  // Handle care and maintenance questions
  if (lowerMessage.includes('care') || lowerMessage.includes('clean') || lowerMessage.includes('maintain') || lowerMessage.includes('wash')) {
    return `Great question! Here's how to care for your Mevi Living serveware:

🧽 **Cleaning Instructions:**
✅ **Dishwasher safe** - All our ceramic pieces can go in the dishwasher
🧼 **Hand washing** - Use mild soap and warm water for best results
❌ **Avoid** - Abrasive cleaners or steel wool
🔥 **Microwave safe** - Most pieces (except metallic accents)

💡 **Care Tips:**
- Allow pieces to cool gradually after heating
- Store with soft padding between stacked items
- Handle with care to prevent chips

Your serveware will last for years with proper care! Any specific pieces you need care instructions for?`;
  }

  // Handle availability and stock questions
  if (lowerMessage.includes('available') || lowerMessage.includes('stock') || lowerMessage.includes('in stock')) {
    return `Here's our current availability:

📦 **In Stock & Ready to Ship:**
✅ Windsor Bloom Soiree Canapes
✅ Alba Trayette  
✅ Ligne Bowl

⏳ **Currently Out of Stock:**
❌ Windsor Bloom Soiree Plates (restocking soon!)
❌ Heritage Floral Trayette (limited availability)

🔔 **Want updates?** I can help you get notified when out-of-stock items are available again.

Which items are you interested in? I can check specific availability and estimated restock dates!`;
  }

  // Try a more targeted response for unmatched queries
  if (userMessage.length > 3) {
    return `I'd love to help you with that! Based on your message, here are some ways I can assist:

🛍️ **Product Information** - Ask about specific serveware pieces, prices, or features
📦 **Order Help** - Track orders, shipping info, or delivery questions  
🔄 **Returns & Exchanges** - Easy return process and policy details
💡 **Recommendations** - Get personalized product suggestions

**Popular questions:**
- "Tell me about Windsor Bloom plates"
- "What's the best serving tray?"
- "How much does shipping cost?"
- "What's your return policy?"

What specific information can I help you find today?`;
  }

  // Final fallback - should rarely be reached now
  return getDefaultResponse();
}

function getDefaultResponse(): string {
  return `Thank you for contacting Mevi Living! I'm here to help you with:

🛍️ **Product recommendations** - Explore our beautiful serveware collection
📦 **Order assistance** - Track your orders and delivery status  
🔄 **Returns & exchanges** - Easy 30-day return policy
💬 **General questions** - About our products and services

Our customer service team is also available Monday-Friday, 9 AM - 6 PM EST for additional assistance. How can I help you today?`;
}