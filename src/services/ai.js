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
}`;

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
            content: `Please process this transcript and format the response as specified:\n\n${text}`
          }
        ],
        temperature: 0.7
      })
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error?.message || 'Failed to process with GPT-4');
    }

    const data = await response.json();
    const content = data.choices[0].message.content;
    
    try {
      return JSON.parse(content);
    } catch (parseError) {
      console.error('JSON Parse Error:', parseError);
      console.log('Raw GPT-4 Response:', content);
      
      // If JSON parsing fails, try to extract content manually
      const summaryMatch = content.match(/\"summary\":\s*\"(.*?)\"/s);
      const actionsMatch = content.match(/\"actions\":\s*\"(.*?)\"/s);
      const emailMatch = content.match(/\"email\":\s*\"(.*?)\"/s);

      return {
        summary: summaryMatch ? summaryMatch[1] : "Error processing summary",
        actions: actionsMatch ? actionsMatch[1] : "Error processing actions",
        email: emailMatch ? emailMatch[1] : "Error processing email"
      };
    }
  } catch (error) {
    console.error('Error in GPT-4 processing:', error);
    throw new Error(`GPT-4 Processing Error: ${error.message}`);
  }
}
