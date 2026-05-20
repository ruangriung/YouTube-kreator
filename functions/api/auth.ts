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
  if (request.method !== 'POST') {
    return new Response('Method not allowed', { status: 405 });
  }

  try {
    const { accessToken } = await request.json();
    if (!accessToken) {
      return new Response('Missing access token', { status: 400 });
    }

    // Ambil info user dari Google atau bypass lokal
    let user: any;
    if (accessToken === 'local_dev_token' && isLocalRequest(request)) {
      user = {
        email: 'developer@local.dev',
        name: 'Local Developer',
        picture: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=256&h=256&q=80'
      };
    } else {
      user = await fetch('https://www.googleapis.com/oauth2/v3/userinfo', {
        headers: { Authorization: `Bearer ${accessToken}` }
      }).then(r => r.json());
    }

    if (!user.email) {
      return new Response('Invalid token', { status: 401 });
    }

    const { DB } = env;
    if (!DB) {
      return new Response(JSON.stringify({ 
        error: "Koneksi database (D1) tidak ditemukan. Jika ini adalah lingkungan produksi, pastikan Anda telah membuat D1 database 'creator-db' dan mengikatnya (binding) dengan nama 'DB' di Pengaturan Functions Cloudflare Pages." 
      }), { status: 500, headers: { 'Content-Type': 'application/json' } });
    }

    // Periksa apakah tabel users sudah ada, jika belum, ini adalah setup pertama
    await DB.prepare(`CREATE TABLE IF NOT EXISTS users (
      email TEXT PRIMARY KEY,
      role TEXT NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      expires_at DATETIME
    )`).run();

    // Jalankan migrasi mandiri penambahan kolom expires_at (jika sebelumnya sudah terbuat tanpa kolom ini)
    try {
      await DB.prepare('ALTER TABLE users ADD COLUMN expires_at DATETIME').run();
    } catch (e) {
      // Kolom sudah ada atau tabel baru terbuat dengan skema lengkap
    }

    // Periksa jumlah user. Jika kosong, user pertama otomatis jadi ADMIN.
    const countRes = await DB.prepare('SELECT COUNT(*) as count FROM users').first();
    const count = countRes ? countRes.count : 0;

    let userRec: any = await DB.prepare('SELECT * FROM users WHERE email = ?').bind(user.email).first();

    if (!userRec) {
      if (count === 0) {
        // User pertama (otomatis ADMIN dengan akses Lifetime)
        await DB.prepare("INSERT INTO users (email, role, expires_at) VALUES (?, ?, '9999-12-31 23:59:59')").bind(user.email, 'ADMIN').run();
        userRec = { email: user.email, role: 'ADMIN', expires_at: '9999-12-31 23:59:59' };
      } else {
        return new Response(JSON.stringify({
          error: 'User tidak terdaftar di sistem. Hubungi Admin.',
          email: user.email,
          name: user.name,
          picture: user.picture
        }), { status: 403, headers: { 'Content-Type': 'application/json' } });
      }
    }

    // Pengecekan Masa Aktif Langganan (Hanya berlaku untuk non-ADMIN)
    if (userRec.role !== 'ADMIN' && userRec.expires_at) {
      const now = new Date();
      const expiresAt = new Date(userRec.expires_at);
      if (now > expiresAt) {
        return new Response(JSON.stringify({
          error: `Masa aktif langganan Anda telah berakhir pada ${expiresAt.toLocaleDateString('id-ID', { year: 'numeric', month: 'long', day: 'numeric' })}. Hubungi Admin untuk melakukan perpanjangan.`,
          email: user.email,
          name: user.name,
          picture: user.picture
        }), { status: 403, headers: { 'Content-Type': 'application/json' } });
      }
    }

    return new Response(JSON.stringify({
      user: {
        email: user.email,
        name: user.name,
        picture: user.picture,
        role: userRec.role,
        expires_at: userRec.expires_at
      }
    }), { headers: { 'Content-Type': 'application/json' } });

  } catch (err: any) {
    return new Response(JSON.stringify({ error: err.message }), { status: 500 });
  }
}
