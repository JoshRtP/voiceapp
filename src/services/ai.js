export async function processWithGPT4(text, apiKey) {
  const systemPrompt = `You are an AI assistant that processes meeting transcripts. Create three outputs based on the provided transcript:

1. An executive summary (max 250 words)
2. A bulleted list of actionable items with owners and deadlines
3. A professional email draft including key points and next steps

Return ONLY a JSON object with this exact structure:
{
  "summary": "your executive summary here",
  "actions": "your action items here",
  "email": "your email draft here"
}

IMPORTANT: 
- Ensure all text is properly escaped for JSON
- Do not include any markdown or special formatting
- Use \\n for line breaks
- Keep responses concise and professional`;

  try {
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: 'gpt-4',
        messages: [
          {
            role: 'system',
            content: systemPrompt
          },
          {
            role: 'user',
            content: `Please process this transcript and format the response as specified: ${text}`
          }
        ],
        temperature: 0.7,
        response_format: { type: "json_object" }  // Enforce JSON response
      })
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error?.message || 'Failed to process with GPT-4');
    }

    const data = await response.json();
    const content = data.choices[0].message.content;
    
    // Attempt to parse the JSON response
    try {
      return JSON.parse(content);
    } catch (parseError) {
      console.error('JSON Parse Error:', parseError);
      console.log('Raw GPT-4 Response:', content);
      
      // Fallback: Try to extract content even if JSON is malformed
      return {
        summary: "Error processing summary. Please try again.",
        actions: "Error processing actions. Please try again.",
        email: "Error processing email draft. Please try again."
      };
    }
  } catch (error) {
    console.error('Error in GPT-4 processing:', error);
    throw new Error(`GPT-4 Processing Error: ${error.message}`);
  }
}
