export async function processWithGPT4(text, apiKey) {
  const systemPrompt = `You are an AI assistant that processes meeting transcripts. Given a transcript, create three outputs:
1. An executive summary (max 250 words)
2. A bulleted list of actionable items with owners (use [OWNER] placeholder) and deadlines
3. A professional email draft including key points and next steps

Format your response as a JSON object with keys: summary, actions, and email.`;

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
            content: text
          }
        ],
        temperature: 0.7
      })
    });

    if (!response.ok) {
      throw new Error('Failed to process with GPT-4');
    }

    const data = await response.json();
    return JSON.parse(data.choices[0].message.content);
  } catch (error) {
    console.error('Error in GPT-4 processing:', error);
    throw error;
  }
}
