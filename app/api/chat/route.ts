import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const { message } = await req.json();

    const response = await fetch("http://127.0.0.1:11434/api/generate", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "deepseek-r1",
        prompt: `I want the response to be in the form of a recipe, only find the recipe and nothing else using ${message}`,
        stream: false,    
      }),
    });

    if (!response.ok) {
      console.error('Ollama API error:', response.status, response.statusText);
      return NextResponse.json(
        { error: 'Failed to get response from Ollama' },
        { status: 500 }
      );
    }

    const responseText = await response.text();
    console.log('Raw Ollama response:', responseText);

    let data;
    try {
      data = JSON.parse(responseText);
    } catch (parseError) {
      console.error('JSON parse error:', parseError);
      console.error('Response text:', responseText);
      return NextResponse.json(
        { error: 'Invalid response format from Ollama' },
        { status: 500 }
      );
    }

    console.log('Parsed Ollama data:', data);

    // Get the raw response
    let rawResponse = data.response || data.output || data.text || 'No response received';
    
    // Filter out <think> tags and content between them
    let cleanResponse = rawResponse;
    
    // Remove everything between <think> and </think> tags (including the tags)
    cleanResponse = cleanResponse.replace(/<think>[\s\S]*?<\/think>/gi, '');
    
    // Clean up any remaining whitespace
    cleanResponse = cleanResponse.trim();
    
    // If the response is empty after filtering, provide a fallback
    if (!cleanResponse) {
      cleanResponse = 'I apologize, but I couldn\'t generate a proper response. Please try again.';
    }

    return NextResponse.json({
      response: cleanResponse,
    });

  } catch (error: any) {
    console.error('API route error:', error);
    
    // Check if it's a connection error
    if (error.code === 'ECONNREFUSED') {
      return NextResponse.json(
        { error: 'Ollama is not running. Please start Ollama first.' },
        { status: 503 }
      );
    }
    
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
