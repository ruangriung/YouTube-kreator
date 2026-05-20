function isLocalRequest(request: any): boolean {
  const url = new URL(request.url);
  const hostname = url.hostname;
  return (
    hostname === 'localhost' ||
    hostname === '127.0.0.1' ||
    hostname === '::1' ||
    hostname === '[::1]' ||
    hostname === '0.0.0.0' ||
    hostname.endsWith('.local') ||
    hostname.startsWith('192.168.') ||
    hostname.startsWith('10.') ||
    /^172\.(1[6-9]|2[0-9]|3[0-1])\./.test(hostname)
  );
}

export async function onRequest(context: any) {
  const { request, env } = context;
  const { DB } = env;

  if (!DB) {
    return new Response(JSON.stringify({ 
      error: "Koneksi database (D1) tidak ditemukan. Jika ini adalah lingkungan produksi, pastikan Anda telah membuat D1 database 'creator-db' dan mengikatnya (binding) dengan nama 'DB' di Pengaturan Functions Cloudflare Pages." 
    }), { status: 500, headers: { 'Content-Type': 'application/json' } });
  }

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
    const { prompt, systemInstruction, model = 'openai', type = 'text', width, height, duration, aspectRatio, audio } = await request.json();
    if (!prompt) {
      return new Response('Missing prompt', { status: 400 });
    }

    // 4. Securely read API Key purely on backend
    const apiKey = env.VITE_POLLINATIONS_API_KEY || '';
    const cleanApiKey = apiKey.trim().replace(/^['"]|['"]$/g, '');

    if (type === 'image') {
      const encodedPrompt = encodeURIComponent(prompt);
      let imageUrl = `https://gen.pollinations.ai/image/${encodedPrompt}?model=${encodeURIComponent(model)}`;
      if (width) imageUrl += `&width=${width}`;
      if (height) imageUrl += `&height=${height}`;
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
      const len = bytes.byteLength;
      for (let i = 0; i < len; i += 8192) {
        // Use subarray to safely process chunks of 8192 bytes
        binary += String.fromCharCode.apply(null, bytes.subarray(i, i + 8192));
      }
      const base64 = btoa(binary);
      return new Response(JSON.stringify({ imageBase64: `data:${contentType};base64,${base64}` }), {
        headers: { 'Content-Type': 'application/json' }
      });
    }

    if (type === 'video') {
      const encodedPrompt = encodeURIComponent(prompt);
      let videoUrl = `https://gen.pollinations.ai/video/${encodedPrompt}?model=${encodeURIComponent(model)}`;
      if (width) videoUrl += `&width=${width}`;
      if (height) videoUrl += `&height=${height}`;
      if (duration) videoUrl += `&duration=${duration}`;
      if (aspectRatio) videoUrl += `&aspectRatio=${aspectRatio}`;
      if (audio !== undefined) videoUrl += `&audio=${audio}`;

      const aiResponse = await fetch(videoUrl, {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${cleanApiKey}`
        }
      });

      if (!aiResponse.ok) {
        const errorData = await aiResponse.text().catch(() => '');
        return new Response(
          JSON.stringify({ error: errorData || `Video API Error: ${aiResponse.status}` }),
          { status: 500, headers: { 'Content-Type': 'application/json' } }
        );
      }

      const contentType = aiResponse.headers.get('Content-Type') || 'video/mp4';
      const buffer = await aiResponse.arrayBuffer();
      const bytes = new Uint8Array(buffer);
      let binary = '';
      const len = bytes.byteLength;
      for (let i = 0; i < len; i += 8192) {
        binary += String.fromCharCode.apply(null, bytes.subarray(i, i + 8192));
      }
      const base64 = btoa(binary);
      return new Response(JSON.stringify({ videoBase64: `data:${contentType};base64,${base64}` }), {
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
