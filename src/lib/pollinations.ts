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
      model,
      type: 'text'
    })
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(errorText || `API Error: ${response.status}`);
  }

  const data = await response.json();
  return data.text || '';
}

export async function callPollinationsImage(prompt: string, model: string = 'flux'): Promise<string> {
  const token = await getAccessToken();
  
  const response = await fetch('/api/generate', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify({
      prompt,
      model,
      type: 'image'
    })
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(errorText || `Image API Error: ${response.status}`);
  }

  const data = await response.json();
  if (!data.imageBase64) {
    throw new Error('Image generation failed');
  }
  return data.imageBase64;
}
