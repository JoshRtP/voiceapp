const OPENROUTER_API_URL = 'https://openrouter.ai/api/v1/chat/completions';

export async function processWithAI(text, apiKey) {
  try {
    const response = await fetch(OPENROUTER_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
        'HTTP-Referer': window.location.origin,
        'OpenRouter-Referrer': window.location.origin
      },
      body: JSON.stringify({
        model: 'openai/gpt-4',
        messages: [
          {
            role: 'system',
            content: `You are an AI assistant that processes text and provides three outputs:
              1) A concise summary
              2) A list of actionable items
              3) A professional email draft
              Structure your response as a JSON object with three keys: summary, actions, and email.`
          },
          {
            role: 'user',
            content: text
          }
        ]
      })
    });

    if (!response.ok) {
      throw new Error('AI processing failed');
    }

    const data = await response.json();
    let result;
    
    try {
      result = JSON.parse(data.choices[0].message.content);
    } catch (e) {
      // If parsing fails, try to format the response manually
      const content = data.choices[0].message.content;
      result = {
        summary: content.split('Summary:')[1]?.split('Action Items:')[0]?.trim() || content,
        actions: content.split('Action Items:')[1]?.split('Email Draft:')[0]?.trim() || 'No actions specified',
        email: content.split('Email Draft:')[1]?.trim() || 'No email draft generated'
      };
    }

    return result;
  } catch (error) {
    console.error('Error in AI processing:', error);
    return {
      summary: 'Error processing response',
      actions: 'Error processing response',
      email: 'Error processing response'
    };
  }
}
