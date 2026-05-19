function isLocalRequest(request: any): boolean {
  const url = new URL(request.url);
  return (
    url.hostname === 'localhost' ||
    url.hostname === '127.0.0.1' ||
    url.hostname.startsWith('192.168.') ||
    url.hostname === '0.0.0.0'
  );
}

export async function onRequest(context: any) {
  const { request, env } = context;
  const { DB } = env;

  if (request.method !== 'POST') {
    return new Response('Method not allowed', { status: 405 });
  }

  // Get Auth Header
  const authHeader = request.headers.get('Authorization');
  if (!authHeader) {
    return new Response('Unauthorized: Missing token', { status: 401 });
  }
  const token = authHeader.split(' ')[1];

  // 1. Verify User Session
  let user: any;
  if (token === 'local_dev_token' && isLocalRequest(request)) {
    user = {
      email: 'developer@local.dev',
      name: 'Local Developer'
    };
  } else {
    try {
      user = await fetch('https://www.googleapis.com/oauth2/v3/userinfo', {
        headers: { Authorization: `Bearer ${token}` }
      }).then(r => r.json());
    } catch (err) {
      return new Response('Unauthorized: Google token verification failed', { status: 401 });
    }
  }

  if (!user || !user.email) {
    return new Response('Unauthorized: Invalid token', { status: 401 });
  }

  // 2. Check if user is registered in the allowlist database
  if (user.email !== 'developer@local.dev') {
    const userRec = await DB.prepare('SELECT * FROM users WHERE email = ?').bind(user.email).first();
    if (!userRec) {
      return new Response('Forbidden: User not in allowlist', { status: 403 });
    }
  }

  // 3. Parse input params for AI call
  try {
    const { prompt, systemInstruction, model = 'openai', type = 'text' } = await request.json();
    if (!prompt) {
      return new Response('Missing prompt', { status: 400 });
    }

    // 4. Securely read API Key purely on backend
    const apiKey = env.VITE_POLLINATIONS_API_KEY || '';
    const cleanApiKey = apiKey.trim().replace(/^['"]|['"]$/g, '');

    if (type === 'image') {
      const encodedPrompt = encodeURIComponent(prompt);
      const imageUrl = `https://gen.pollinations.ai/image/${encodedPrompt}?model=${encodeURIComponent(model)}`;
      const aiResponse = await fetch(imageUrl, {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${cleanApiKey}`
        }
      });

      if (!aiResponse.ok) {
        const errorData = await aiResponse.text().catch(() => '');
        return new Response(
          JSON.stringify({ error: errorData || `Image API Error: ${aiResponse.status}` }),
          { status: 500, headers: { 'Content-Type': 'application/json' } }
        );
      }

      const contentType = aiResponse.headers.get('Content-Type') || 'image/png';
      const buffer = await aiResponse.arrayBuffer();
      const bytes = new Uint8Array(buffer);
      let binary = '';
      for (let i = 0; i < bytes.length; i += 1) {
        binary += String.fromCharCode(bytes[i]);
      }
      const base64 = btoa(binary);
      return new Response(JSON.stringify({ imageBase64: `data:${contentType};base64,${base64}` }), {
        headers: { 'Content-Type': 'application/json' }
      });
    }

    const messages: any[] = [];
    if (systemInstruction) {
      messages.push({ role: 'system', content: systemInstruction });
    }
    messages.push({ role: 'user', content: prompt });

    const pollinationUrl = `https://gen.pollinations.ai/v1/chat/completions?key=${cleanApiKey}`;
    const aiResponse = await fetch(pollinationUrl, {
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

    if (!aiResponse.ok) {
      const errorData = await aiResponse.json().catch(() => ({}));
      return new Response(
        JSON.stringify({ error: errorData.error?.message || `API Error: ${aiResponse.status}` }),
        { status: 500, headers: { 'Content-Type': 'application/json' } }
      );
    }

    const data: any = await aiResponse.json();
    const resultText = data.choices?.[0]?.message?.content || '';

    return new Response(JSON.stringify({ text: resultText }), {
      headers: { 'Content-Type': 'application/json' }
    });

  } catch (err: any) {
    return new Response(JSON.stringify({ error: err.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}
