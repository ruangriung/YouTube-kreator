export async function onRequest(context: any) {
  const { request, env } = context;
  const { DB } = env;

  const authHeader = request.headers.get('Authorization');
  if (!authHeader) return new Response('Unauthorized', { status: 401 });
  const token = authHeader.split(' ')[1];

  // Verifikasi via Google atau bypass lokal
  let user: any;
  if (token === 'local_dev_token') {
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

  // POST: Add new user
  if (request.method === 'POST') {
    const { email, role } = await request.json();
    await DB.prepare('INSERT INTO users (email, role) VALUES (?, ?)').bind(email, role || 'USER').run();
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
