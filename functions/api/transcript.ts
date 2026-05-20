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

function extractYoutubeId(url: string): string | null {
  const trimmed = url.trim();
  if (trimmed.length === 11 && !trimmed.includes('/') && !trimmed.includes('.')) {
    return trimmed;
  }
  
  try {
    const urlObj = new URL(trimmed);
    const v = urlObj.searchParams.get('v');
    if (v && v.length === 11) return v;
    
    const pathSegments = urlObj.pathname.split('/').filter(Boolean);
    
    if (urlObj.hostname === 'youtu.be' && pathSegments[0] && pathSegments[0].length === 11) {
      return pathSegments[0];
    }
    
    const specialPaths = ['shorts', 'live', 'embed', 'v'];
    for (const path of specialPaths) {
      const idx = pathSegments.indexOf(path);
      if (idx !== -1 && pathSegments[idx + 1] && pathSegments[idx + 1].length === 11) {
        return pathSegments[idx + 1];
      }
    }
    
    for (const segment of pathSegments) {
      if (segment.length === 11) {
        return segment;
      }
    }
  } catch (e) {
    // Ignore URL parse error
  }

  const regex = /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?|shorts|live)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/i;
  const match = trimmed.match(regex);
  if (match && match[1]) {
    return match[1];
  }
  
  return null;
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
    return new Response(JSON.stringify({ error: 'Unauthorized: Missing token' }), { 
      status: 401,
      headers: { 'Content-Type': 'application/json' }
    });
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
      return new Response(JSON.stringify({ error: 'Unauthorized: Google token verification failed' }), { 
        status: 401,
        headers: { 'Content-Type': 'application/json' }
      });
    }
  }

  if (!user || !user.email) {
    return new Response(JSON.stringify({ error: 'Unauthorized: Invalid token' }), { 
      status: 401,
      headers: { 'Content-Type': 'application/json' }
    });
  }

  // 2. Check if user is registered in the allowlist database (jika bukan developer lokal)
  if (user.email !== 'developer@local.dev') {
    try {
      const userRec = await DB.prepare('SELECT * FROM users WHERE email = ?').bind(user.email).first();
      if (!userRec) {
        return new Response(JSON.stringify({ error: 'Forbidden: User not in allowlist' }), { 
          status: 403,
          headers: { 'Content-Type': 'application/json' }
        });
      }
      // Pengecekan Kedaluwarsa
      if (userRec.role !== 'ADMIN' && userRec.expires_at) {
        const now = new Date();
        const expiry = new Date(userRec.expires_at);
        if (now > expiry) {
          return new Response(JSON.stringify({ error: 'Forbidden: Subscription expired' }), { 
            status: 403,
            headers: { 'Content-Type': 'application/json' }
          });
        }
      }
    } catch (dbErr) {
      // Jika tabel belum dibentuk sama sekali, lewati karena inisialisasi otomatis
    }
  }

  // 3. Parse input
  try {
    const { videoUrl } = await request.json();
    if (!videoUrl) {
      return new Response(JSON.stringify({ error: 'Missing videoUrl' }), { 
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    const videoId = extractYoutubeId(videoUrl);
    if (!videoId) {
      return new Response(JSON.stringify({ error: 'ID video YouTube tidak valid. Pastikan Anda memasukkan URL video YouTube yang benar.' }), { 
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // Ambil API Key Supadata
    const apiKey = env.VITE_SUPADATA_API_KEY || env.SUPADATA_API_KEY || '';
    const cleanApiKey = apiKey.trim().replace(/^['"]|['"]$/g, '');

    if (!cleanApiKey) {
      return new Response(JSON.stringify({ 
        error: 'Konfigurasi VITE_SUPADATA_API_KEY tidak ditemukan. Pastikan Anda telah menambahkannya di file .dev.vars (untuk lokal) atau Environment Variables di Dashboard Cloudflare Pages (untuk produksi).' 
      }), { 
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // Panggil Supadata API
    const response = await fetch(`https://api.supadata.ai/v1/youtube/transcript?videoId=${videoId}`, {
      method: 'GET',
      headers: {
        'x-api-key': cleanApiKey
      }
    });

    if (!response.ok) {
      const errData = await response.json().catch(() => ({}));
      return new Response(JSON.stringify({ 
        error: errData.message || `Gagal mengambil transkrip via Supadata API: ${response.statusText}` 
      }), {
        status: response.status,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    const data: any = await response.json();
    const segments = data.content || [];
    
    let concatenatedText = '';
    if (typeof segments === 'string') {
      concatenatedText = segments;
    } else if (Array.isArray(segments)) {
      concatenatedText = segments.map((s: any) => s.text).join(' ');
    }

    return new Response(JSON.stringify({ 
      success: true,
      transcript: concatenatedText,
      segments: Array.isArray(segments) ? segments : []
    }), {
      headers: { 'Content-Type': 'application/json' }
    });

  } catch (err: any) {
    return new Response(JSON.stringify({ error: err.message || 'Gagal mengambil transkrip video YouTube. Silakan coba lagi.' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}
