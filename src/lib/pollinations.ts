import { getAccessToken } from './auth';

export async function callPollinationsAI(prompt: string, systemInstruction?: string, model: string = 'openai'): Promise<string> {
  const token = await getAccessToken();
  
  const response = await fetch('/api/generate', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify({
      prompt,
      systemInstruction,
      model
    })
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(errorText || `API Error: ${response.status}`);
  }

  const data = await response.json();
  return data.text || '';
}
