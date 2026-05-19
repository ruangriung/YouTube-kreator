import { YoutubeTranscript } from 'youtube-transcript';

function isLocalRequest(request: any): boolean {
  const url = new URL(request.url);
  return (
    url.hostname === 'localhost' ||
    url.hostname === '127.0.0.1' ||
    url.hostname.startsWith('192.168.') ||
    url.hostname === '0.0.0.0'
  );
}

function extractYoutubeId(url: string): string | null {
  const trimmed = url.trim();
  if (trimmed.length === 11 && !trimmed.includes('/') && !trimmed.includes('.')) {
    return trimmed;
  }
  
  try {
    const urlObj = new URL(trimmed);
    if (urlObj.hostname.includes('youtube.com') || urlObj.hostname.includes('youtu.be')) {
      const v = urlObj.searchParams.get('v');
      if (v && v.length === 11) return v;
      
      const pathSegments = urlObj.pathname.split('/');
      if (urlObj.hostname === 'youtu.be' && pathSegments[1] && pathSegments[1].length === 11) {
        return pathSegments[1];
      }
      
      const shortsIdx = pathSegments.indexOf('shorts');
      if (shortsIdx !== -1 && pathSegments[shortsIdx + 1] && pathSegments[shortsIdx + 1].length === 11) {
        return pathSegments[shortsIdx + 1];
      }
      
      const embedIdx = pathSegments.indexOf('embed');
      if (embedIdx !== -1 && pathSegments[embedIdx + 1] && pathSegments[embedIdx + 1].length === 11) {
        return pathSegments[embedIdx + 1];
      }
    }
  } catch (e) {
    // Ignore URL parse error
  }

  const regex = /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/i;
  const match = trimmed.match(regex);
  if (match && match[1]) {
    return match[1];
  }
  
  return null;
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

    // Ambil transkrip menggunakan youtube-transcript
    const segments = await YoutubeTranscript.fetchTranscript(videoId);
    const concatenatedText = segments.map((s: any) => s.text).join(' ');

    return new Response(JSON.stringify({ 
      success: true,
      transcript: concatenatedText,
      segments
    }), {
      headers: { 'Content-Type': 'application/json' }
    });

  } catch (err: any) {
    return new Response(JSON.stringify({ error: err.message || 'Gagal mengambil transkrip video YouTube. Pastikan video memiliki subtitle/CC aktif.' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}
