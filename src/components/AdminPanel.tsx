import React, { useState, useEffect } from 'react';
import { getAccessToken } from '../lib/auth';
import { Users, Trash2, UserPlus, ShieldAlert, Loader2 } from 'lucide-react';

export default function AdminPanel() {
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [newEmail, setNewEmail] = useState('');
  const [newRole, setNewRole] = useState('USER');
  const [errorMsg, setErrorMsg] = useState('');

  const fetchUsers = async () => {
    try {
      const token = await getAccessToken();
      const res = await fetch('/api/users', {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (!res.ok) throw new Error('Akses ditolak');
      setUsers(await res.json());
    } catch (err: any) {
      setErrorMsg(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleAddUser = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newEmail) return;
    try {
      setLoading(true);
      const token = await getAccessToken();
      const res = await fetch('/api/users', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email: newEmail, role: newRole })
      });
      if (!res.ok) throw new Error('Gagal menambah user');
      setNewEmail('');
      await fetchUsers();
    } catch (err: any) {
      setErrorMsg(err.message);
      setLoading(false);
    }
  };

  const handleRemoveUser = async (email: string) => {
    if (!window.confirm(`Hapus ${email} dari sistem?`)) return;
    try {
      setLoading(true);
      const token = await getAccessToken();
      const res = await fetch(`/api/users?email=${encodeURIComponent(email)}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` }
      });
      if (!res.ok) {
        const text = await res.text();
        throw new Error(text || 'Gagal menghapus user');
      }
      await fetchUsers();
    } catch (err: any) {
      setErrorMsg(err.message);
      setLoading(false);
    }
  };

  if (loading && users.length === 0) {
    return <div className="p-8 text-center text-zinc-500"><Loader2 className="w-6 h-6 animate-spin mx-auto" /></div>;
  }

  if (errorMsg) {
    return <div className="p-8 text-center text-red-500 bg-red-500/10 rounded-xl mb-6">{errorMsg}</div>;
  }

  return (
    <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 mb-8 shadow-xl max-w-4xl mx-auto">
      <div className="flex items-center gap-3 mb-6 pb-4 border-b border-zinc-800">
        <div className="w-10 h-10 rounded-xl bg-orange-500/10 flex items-center justify-center">
            <ShieldAlert className="w-5 h-5 text-orange-500" />
        </div>
        <div>
          <h2 className="text-lg font-bold text-white">Admin Panel (User Management)</h2>
          <p className="text-xs text-zinc-400">Atur siapa saja yang bisa mengakses aplikasi ini (Disimpan di Cloudflare D1).</p>
        </div>
      </div>

      <form onSubmit={handleAddUser} className="flex flex-col sm:flex-row gap-3 mb-8 bg-black/30 p-4 rounded-xl border border-zinc-800/50">
        <input 
          type="email" 
          required
          value={newEmail}
          onChange={(e) => setNewEmail(e.target.value)}
          placeholder="Email Google pengguna baru..."
          className="flex-1 bg-zinc-900 border border-zinc-700 text-white text-sm rounded-lg px-4 py-2 focus:ring-1 focus:ring-blue-500 outline-none"
        />
        <select 
          value={newRole}
          onChange={(e) => setNewRole(e.target.value)}
          className="bg-zinc-900 border border-zinc-700 text-white text-sm rounded-lg px-4 py-2 focus:ring-1 focus:ring-blue-500 outline-none"
        >
          <option value="USER">User Biasa</option>
          <option value="ADMIN">Admin</option>
        </select>
        <button 
          type="submit"
          disabled={loading}
          className="bg-zinc-100 hover:bg-white text-black font-bold px-4 py-2 rounded-lg text-sm flex items-center justify-center gap-2 transition-colors disabled:opacity-50"
        >
          <UserPlus className="w-4 h-4" />
          Tambahkan
        </button>
      </form>

      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm text-zinc-300">
          <thead className="text-xs uppercase bg-black/40 text-zinc-500 text-center">
            <tr>
              <th className="px-4 py-3 text-left">Email</th>
              <th className="px-4 py-3">Role</th>
              <th className="px-4 py-3">Didaftarkan Pada</th>
              <th className="px-4 py-3">Aksi</th>
            </tr>
          </thead>
          <tbody>
            {users.map(u => (
              <tr key={u.email} className="border-b border-zinc-800/50 hover:bg-zinc-800/20 text-center">
                <td className="px-4 py-3 text-left font-medium text-white">{u.email}</td>
                <td className="px-4 py-3">
                  <span className={`px-2 py-1 rounded text-xs font-bold ${u.role === 'ADMIN' ? 'bg-orange-500/20 text-orange-400' : 'bg-blue-500/20 text-blue-400'}`}>
                    {u.role}
                  </span>
                </td>
                <td className="px-4 py-3 text-xs text-zinc-500">{new Date(u.created_at).toLocaleString('id-ID')}</td>
                <td className="px-4 py-3">
                  <button 
                    onClick={() => handleRemoveUser(u.email)}
                    className="text-zinc-500 hover:text-red-500 p-1 transition-colors"
                    title="Hapus Pengguna"
                  >
                    <Trash2 className="w-4 h-4 mx-auto" />
                  </button>
                </td>
              </tr>
            ))}
            {users.length === 0 && (
                <tr>
                    <td colSpan={4} className="text-center py-8 text-zinc-500">Belum ada user.</td>
                </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
