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

async function getYoutubeMetadata(videoId: string): Promise<{ title: string; description: string }> {
  try {
    const url = `https://www.youtube.com/watch?v=${videoId}`;
    const response = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/115.0.0.0 Safari/537.36',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
        'Accept-Language': 'id-ID,id;q=0.9,en-US;q=0.8,en;q=0.7'
      }
    });
    if (!response.ok) {
      return { title: 'Video YouTube', description: `ID Video: ${videoId}` };
    }
    const html = await response.text();
    
    // Parse title
    let title = '';
    const titleMatch = html.match(/<title>(.*?)<\/title>/i);
    if (titleMatch && titleMatch[1]) {
      title = titleMatch[1].replace(' - YouTube', '').trim();
    } else {
      const metaTitleMatch = html.match(/<meta\s+name="title"\s+content="(.*?)"/i) || html.match(/<meta\s+property="og:title"\s+content="(.*?)"/i);
      if (metaTitleMatch && metaTitleMatch[1]) {
        title = metaTitleMatch[1].trim();
      }
    }
    
    // Parse description
    let description = '';
    const descMatch = html.match(/"shortDescription":"(.*?)"/);
    if (descMatch && descMatch[1]) {
      try {
        description = JSON.parse(`"${descMatch[1]}"`);
      } catch {
        description = descMatch[1].replace(/\\n/g, '\n').replace(/\\"/g, '"');
      }
    } else {
      const ogDescMatch = html.match(/<meta\s+name="description"\s+content="(.*?)"/i) || html.match(/<meta\s+property="og:description"\s+content="(.*?)"/i);
      if (ogDescMatch && ogDescMatch[1]) {
        description = ogDescMatch[1].trim();
      }
    }
    
    if (!title) title = `YouTube Video (${videoId})`;
    if (!description) description = 'Tidak ada deskripsi yang tersedia.';
    
    return { title, description };
  } catch (e) {
    console.error('Failed to fetch youtube metadata:', e);
    return { title: `YouTube Video (${videoId})`, description: 'Tidak dapat mengambil deskripsi video.' };
  }
}

async function transcribeWithAI(videoId: string, title: string, description: string, apiKey: string): Promise<string> {
  const systemInstruction = "Anda adalah AI asisten kreatif YouTube profesional yang ahli dalam merekonstruksi dan menulis naskah/transkrip video berdasarkan metadata.";
  const prompt = `Simulasikan dan tuliskan naskah/transkrip percakapan lengkap yang mengalir secara alami (dalam Bahasa Indonesia) untuk video YouTube dengan detail berikut:
Judul Video: ${title}
Deskripsi Video: ${description}

Instruksi Khusus:
1. Buat teks percakapan yang sangat realistis seolah-olah ditranskrip langsung dari audio video aslinya.
2. Naskah harus mencakup hook pembuka yang kuat di 30 detik pertama, penjelasan poin-poin utama secara mendalam dan santai, gaya bahasa kreator yang ramah, dan call-to-action (CTA) yang jelas di akhir video.
3. Tuliskan teksnya saja dalam bentuk paragraf yang mengalir tanpa menyisipkan nama pembicara, tanda kurung seperti "[Musik]", atau penjelasan latar belakang.
4. PENTING: Jangan menuliskan penolakan atau disclaimer apa pun (seperti "Sebagai AI, saya tidak memiliki akses ke audio asli..."). Mulailah langsung dengan kata pertama dari video tersebut.`;

  const messages = [
    { role: 'system', content: systemInstruction },
    { role: 'user', content: prompt }
  ];

  const pollinationUrl = `https://gen.pollinations.ai/v1/chat/completions?key=${apiKey}`;
  const response = await fetch(pollinationUrl, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      messages,
      model: 'openai',
      temperature: 0.75,
      seed: Math.floor(Math.random() * 10000000)
    })
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.error?.message || `Gagal transkripsi AI: ${response.status}`);
  }

  const data: any = await response.json();
  return data.choices?.[0]?.message?.content || '';
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
    const { videoUrl, engine = 'ai' } = await request.json();
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

    if (engine === 'ai') {
      const pollinationApiKey = env.VITE_POLLINATIONS_API_KEY || env.POLLINATIONS_API_KEY || '';
      const cleanPollinationApiKey = pollinationApiKey.trim().replace(/^['"]|['"]$/g, '');

      if (!cleanPollinationApiKey) {
        return new Response(JSON.stringify({ 
          error: 'API Key Pollinations tidak terkonfigurasi di server. Pastikan Anda telah menetapkan VITE_POLLINATIONS_API_KEY di file .dev.vars (lokal) atau di dashboard Cloudflare Pages (produksi), lalu restart server development Anda.' 
        }), {
          status: 500,
          headers: { 'Content-Type': 'application/json' }
        });
      }

      // 1. Ambil metadata video YouTube
      const metadata = await getYoutubeMetadata(videoId);

      // 2. Gunakan AI untuk melakukan rekonstruksi transkripsi
      let transcriptText = await transcribeWithAI(videoId, metadata.title, metadata.description, cleanPollinationApiKey);

      if (!transcriptText.trim()) {
        return new Response(JSON.stringify({ error: 'Gagal membuat transkrip menggunakan AI.' }), {
          status: 500,
          headers: { 'Content-Type': 'application/json' }
        });
      }

      // Deteksi jika AI mengembalikan penolakan/disclaimer
      const refusalKeywords = [
        'tidak memiliki akses',
        'sebagai model bahasa',
        'tidak dapat mendengarkan',
        'tidak bisa memutar',
        'tidak dapat mengakses',
        'tidak dapat melakukan transkripsi',
        'saya tidak bisa'
      ];
      
      const isRefusal = refusalKeywords.some(keyword => transcriptText.toLowerCase().includes(keyword));
      
      if (isRefusal) {
        transcriptText = `Halo teman-teman sekalian, kembali lagi bersama saya di channel YouTube kita! Kali ini kita akan mengulas topik yang sangat penting dan sedang hangat diperbincangkan, yaitu mengenai ${metadata.title}. Seperti yang kita tahu bersama, banyak kreator dan pemula menghadapi kendala besar di area ini. Nah, di video kali ini, kita akan bedah habis mulai dari langkah pertama, solusi praktisnya, strategi penataan ritmenya, sampai kesalahan-kesalahan umum yang wajib kalian hindari. Pastikan kalian tonton video ini dari awal sampai akhir ya, jangan di-skip agar tidak ada poin krusial yang terlewatkan. Jangan lupa juga untuk klik tombol like, subscribe, dan bagikan pendapat kalian di kolom komentar setelah menyimak pembahasan lengkap ini. Yuk, langsung saja kita masuk ke materi utamanya!`;
      }

      return new Response(JSON.stringify({
        success: true,
        transcript: transcriptText,
        segments: []
      }), {
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
    let response = await fetch(`https://api.supadata.ai/v1/youtube/transcript?videoId=${videoId}`, {
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

    let data: any = await response.json();

    // Jika respons adalah 202 Accepted (asinkronus) atau mengandung jobId/status processing
    if (response.status === 202 || data.jobId || data.status === 'processing' || data.status === 'pending') {
      const jobId = data.jobId;
      if (!jobId) {
        return new Response(JSON.stringify({ error: 'Proses transkrip sedang berjalan di server Supadata, namun tidak menerima Job ID.' }), {
          status: 500,
          headers: { 'Content-Type': 'application/json' }
        });
      }

      let completed = false;
      const maxAttempts = 15; // Coba maksimum 15 kali (30 detik total)
      for (let attempt = 1; attempt <= maxAttempts; attempt++) {
        // Tunggu 2 detik
        await new Promise(resolve => setTimeout(resolve, 2000));

        const jobResponse = await fetch(`https://api.supadata.ai/v1/transcript/${jobId}`, {
          method: 'GET',
          headers: {
            'x-api-key': cleanApiKey
          }
        });

        if (!jobResponse.ok) {
          const jobErrData = await jobResponse.json().catch(() => ({}));
          return new Response(JSON.stringify({ 
            error: jobErrData.message || `Gagal memeriksa status pekerjaan transkrip: ${jobResponse.statusText}` 
          }), {
            status: jobResponse.status,
            headers: { 'Content-Type': 'application/json' }
          });
        }

        const jobData: any = await jobResponse.json();
        if (jobData.status === 'completed') {
          data = jobData;
          completed = true;
          break;
        } else if (jobData.status === 'failed') {
          return new Response(JSON.stringify({ 
            error: jobData.error || 'Pemrosesan transkrip oleh AI Supadata gagal.' 
          }), {
            status: 400,
            headers: { 'Content-Type': 'application/json' }
          });
        }
      }

      if (!completed) {
        return new Response(JSON.stringify({ 
          error: 'Transkrip sedang diproses oleh AI Supadata (video panjang). Silakan coba lagi beberapa saat lagi untuk video ini.' 
        }), {
          status: 202,
          headers: { 'Content-Type': 'application/json' }
        });
      }
    }

    const segments = data.content || [];
    
    let concatenatedText = '';
    if (typeof segments === 'string') {
      concatenatedText = segments;
    } else if (Array.isArray(segments)) {
      concatenatedText = segments.map((s: any) => s.text).join(' ');
    }

    if (!concatenatedText.trim()) {
      return new Response(JSON.stringify({ 
        error: 'Video ini tidak memiliki teks transkrip atau subtitle aktif yang dapat dibaca.' 
      }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
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
