export async function callPollinationsAI(prompt: string, systemInstruction?: string, model: string = 'openai'): Promise<string> {
  const token = import.meta.env.VITE_GEMINI_API_KEY || 
                import.meta.env.VITE_POLLINATIONS_API_KEY || 
                (typeof process !== 'undefined' ? (process.env.GEMINI_API_KEY || process.env.POLLINATIONS_API_KEY) : '') || 
                '';
  
  const messages: any[] = [];
  if (systemInstruction) {
    messages.push({
      role: 'system',
      content: systemInstruction
    });
  }
  messages.push({
    role: 'user',
    content: prompt
  });

  // Clean surrounding quotes if present (common in dotenv files)
  const cleanToken = token.trim().replace(/^['"]|['"]$/g, '');
  
  const url = `https://gen.pollinations.ai/v1/chat/completions?key=${cleanToken}`;

  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      messages,
      model,
      temperature: 0.75,
      seed: Math.floor(Math.random() * 10000000)
    })
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.error?.message || `API Error: ${response.status}`);
  }

  const data = await response.json();
  return data.choices?.[0]?.message?.content || '';
}
