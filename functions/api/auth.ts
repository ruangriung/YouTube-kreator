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

    // Ambil info user dari Google
    const user = await fetch('https://www.googleapis.com/oauth2/v3/userinfo', {
      headers: { Authorization: `Bearer ${accessToken}` }
    }).then(r => r.json());

    if (!user.email) {
      return new Response('Invalid token', { status: 401 });
    }

    const { DB } = env;

    // Periksa apakah tabel users sudah ada, jika belum, ini adalah setup pertama
    // Untuk safety, sebaiknya setup tabel dilakukan manual via Wrangler atau di sini kita coba buat:
    await DB.prepare(`CREATE TABLE IF NOT EXISTS users (
      email TEXT PRIMARY KEY,
      role TEXT NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )`).run();

    // Periksa jumlah user. Jika kosong, user pertama otomatis jadi ADMIN.
    const countRes = await DB.prepare('SELECT COUNT(*) as count FROM users').first();
    const count = countRes ? countRes.count : 0;

    let userRec = await DB.prepare('SELECT * FROM users WHERE email = ?').bind(user.email).first();

    if (!userRec) {
      if (count === 0) {
        // User pertama
        await DB.prepare('INSERT INTO users (email, role) VALUES (?, ?)').bind(user.email, 'ADMIN').run();
        userRec = { email: user.email, role: 'ADMIN' };
      } else {
        return new Response(JSON.stringify({ error: 'User tidak terdaftar di sistem. Hubungi Admin.' }), { status: 403, headers: { 'Content-Type': 'application/json' } });
      }
    }

    return new Response(JSON.stringify({
      user: {
        email: user.email,
        name: user.name,
        picture: user.picture,
        role: userRec.role
      }
    }), { headers: { 'Content-Type': 'application/json' } });

  } catch (err: any) {
    return new Response(JSON.stringify({ error: err.message }), { status: 500 });
  }
}
