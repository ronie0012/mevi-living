import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const apiKey = process.env.OPENAI_API_KEY;
    
    if (!apiKey) {
      return NextResponse.json(
        { 
          error: 'OpenAI API key not configured',
          envCheck: 'OPENAI_API_KEY environment variable is missing'
        },
        { status: 500 }
      );
    }

    // Check if the API key format looks correct
    if (!apiKey.startsWith('sk-')) {
      return NextResponse.json(
        { 
          error: 'Invalid API key format',
          details: 'OpenAI API keys should start with "sk-"',
          keyPrefix: apiKey.substring(0, 10) + '...'
        },
        { status: 500 }
      );
    }

    // Test with a simple chat completion instead of models endpoint
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-3.5-turbo',
        messages: [
          {
            role: 'user',
            content: 'Hello, this is a test message.'
          }
        ],
        max_tokens: 10,
      }),
    });

    if (!response.ok) {
      const errorData = await response.text();
      return NextResponse.json(
        { 
          error: 'OpenAI API request failed',
          status: response.status,
          details: errorData,
          keyPrefix: apiKey.substring(0, 15) + '...'
        },
        { status: 500 }
      );
    }

    const data = await response.json();
    
    return NextResponse.json({ 
      success: true, 
      message: 'OpenAI API key is valid and working',
      keyPrefix: apiKey.substring(0, 15) + '...',
      testResponse: data.choices[0]?.message?.content || 'No response content'
    });
  } catch (error) {
    console.error('API test error:', error);
    return NextResponse.json(
      { 
        error: 'Failed to test API key',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}