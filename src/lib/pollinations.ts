import { getAccessToken } from './auth';

export async function callPollinationsAI(prompt: string | any[], systemInstruction?: string, model: string = 'openai'): Promise<string> {
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

export async function callPollinationsImage(prompt: string, model: string = 'flux', width?: number, height?: number): Promise<string> {
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
      type: 'image',
      width,
      height
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

export async function callPollinationsVideo(
  prompt: string,
  model: string = 'wan',
  width?: number,
  height?: number,
  duration?: number,
  aspectRatio?: string,
  audio?: boolean
): Promise<string> {
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
      type: 'video',
      width,
      height,
      duration,
      aspectRatio,
      audio
    })
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(errorText || `Video API Error: ${response.status}`);
  }

  const data = await response.json();
  if (!data.videoBase64) {
    throw new Error('Video generation failed');
  }
  return data.videoBase64;
}
