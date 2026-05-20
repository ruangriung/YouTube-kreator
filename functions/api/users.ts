function isLocalRequest(request: any): boolean {
  const url = new URL(request.url);
  const hostname = url.hostname;
  return (
    hostname === 'localhost' ||
    hostname === '127.0.0.1' ||
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

  const authHeader = request.headers.get('Authorization');
  if (!authHeader) return new Response('Unauthorized', { status: 401 });
  const token = authHeader.split(' ')[1];

  // Verifikasi via Google atau bypass lokal
  let user: any;
  if (token === 'local_dev_token' && isLocalRequest(request)) {
    user = {
      email: 'developer@local.dev',
      name: 'Local Developer',
      picture: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=256&h=256&q=80'
    };
  } else {
    user = await fetch('https://www.googleapis.com/oauth2/v3/userinfo', {
      headers: { Authorization: `Bearer ${token}` }
    }).then(r => r.json());
  }

  if (!user.email) return new Response('Invalid token', { status: 401 });

  // Pengecekan Admin
  let caller: any;
  if (user.email === 'developer@local.dev') {
    caller = { email: 'developer@local.dev', role: 'ADMIN' };
  } else {
    caller = await DB.prepare('SELECT * FROM users WHERE email = ?').bind(user.email).first();
  }
  
  if (!caller || caller.role !== 'ADMIN') {
    return new Response('Forbidden', { status: 403 });
  }

  // GET: List users
  if (request.method === 'GET') {
    const { results } = await DB.prepare('SELECT * FROM users ORDER BY created_at DESC').all();
    return new Response(JSON.stringify(results), { headers: { 'Content-Type': 'application/json' } });
  }

  // POST: Add or Update user (Mendukung Perpanjangan Langganan)
  if (request.method === 'POST') {
    const { email, role, expires_at } = await request.json();
    await DB.prepare(`
      INSERT INTO users (email, role, expires_at) 
      VALUES (?, ?, ?)
      ON CONFLICT(email) DO UPDATE SET 
        role = excluded.role,
        expires_at = excluded.expires_at
    `).bind(email, role || 'USER', expires_at || '9999-12-31 23:59:59').run();
    return new Response(JSON.stringify({ success: true }));
  }

  // DELETE: Remove user
  if (request.method === 'DELETE') {
    const url = new URL(request.url);
    const email = url.searchParams.get('email');
    if (email === user.email) return new Response('Cannot delete yourself', { status: 400 });
    
    await DB.prepare('DELETE FROM users WHERE email = ?').bind(email).run();
    return new Response(JSON.stringify({ success: true }));
  }

  return new Response('Method not allowed', { status: 405 });
}
