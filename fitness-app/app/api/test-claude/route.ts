import Anthropic from '@anthropic-ai/sdk';

export async function GET() {
  try {
    console.log('=== TESTING CLAUDE CONNECTION ===');
    console.log('API Key exists:', !!process.env.ANTHROPIC_API_KEY);
    console.log('API Key length:', process.env.ANTHROPIC_API_KEY?.length);
    
    const anthropic = new Anthropic({
      apiKey: process.env.ANTHROPIC_API_KEY,
    });

    const message = await anthropic.messages.create({
      model: 'claude-3-5-sonnet-20241022',
      max_tokens: 100,
      messages: [
        {
          role: 'user',
          content: 'Hello! Just say "Hello back!" to test the connection.'
        }
      ]
    });

    return Response.json({
      success: true,
      response: message.content[0]?.type === 'text' ? message.content[0].text : 'No text response',
      usage: message.usage
    });

  } catch (error) {
    console.error('=== CLAUDE TEST ERROR ===');
    console.error('Error:', error);
    
    return Response.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
      details: error
    }, { status: 500 });
  }
} 