import React, { useState, useEffect } from 'react';
import { getAccessToken } from '../lib/auth';
import { Users, Trash2, UserPlus, ShieldAlert, Loader2 } from 'lucide-react';

export default function AdminPanel() {
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [newEmail, setNewEmail] = useState('');
  const [newRole, setNewRole] = useState('USER');
  const [subType, setSubType] = useState('lifetime'); // 'lifetime', '1_month', '3_months', '1_year', 'custom'
  const [customDate, setCustomDate] = useState('');
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
      setErrorMsg('');

      let expiresAt = '9999-12-31 23:59:59';
      if (newRole === 'USER') {
        if (subType === '1_month') {
          const d = new Date();
          d.setDate(d.getDate() + 30);
          expiresAt = d.toISOString().replace('T', ' ').substring(0, 19);
        } else if (subType === '3_months') {
          const d = new Date();
          d.setDate(d.getDate() + 90);
          expiresAt = d.toISOString().replace('T', ' ').substring(0, 19);
        } else if (subType === '1_year') {
          const d = new Date();
          d.setDate(d.getDate() + 365);
          expiresAt = d.toISOString().replace('T', ' ').substring(0, 19);
        } else if (subType === 'custom' && customDate) {
          expiresAt = `${customDate} 23:59:59`;
        }
      }

      const token = await getAccessToken();
      const res = await fetch('/api/users', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ 
          email: newEmail.trim().toLowerCase(), 
          role: newRole, 
          expires_at: expiresAt 
        })
      });
      if (!res.ok) throw new Error('Gagal menambah/memperbarui user');
      setNewEmail('');
      setCustomDate('');
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

      <form onSubmit={handleAddUser} className="space-y-4 mb-8 bg-black/30 p-5 rounded-2xl border border-zinc-800/50">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-[10px] font-black text-zinc-400 uppercase tracking-widest mb-1.5">Email Google Pengguna:</label>
            <input 
              type="email" 
              required
              value={newEmail}
              onChange={(e) => setNewEmail(e.target.value)}
              placeholder="Email Google pengguna..."
              className="w-full bg-zinc-900 border border-zinc-750 text-white text-sm rounded-xl px-4 py-2.5 focus:ring-1 focus:ring-blue-500 outline-none"
            />
          </div>
          <div>
            <label className="block text-[10px] font-black text-zinc-400 uppercase tracking-widest mb-1.5">Peran / Role:</label>
            <select 
              value={newRole}
              onChange={(e) => setNewRole(e.target.value)}
              className="w-full bg-zinc-900 border border-zinc-750 text-white text-sm rounded-xl px-4 py-2.5 focus:ring-1 focus:ring-blue-500 outline-none cursor-pointer"
            >
              <option value="USER">User Biasa (Akses Terbatas Langganan)</option>
              <option value="ADMIN">Admin (Akses Selamanya & Panel Admin)</option>
            </select>
          </div>
        </div>

        {newRole === 'USER' && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 items-end">
            <div>
              <label className="block text-[10px] font-black text-zinc-400 uppercase tracking-widest mb-1.5">Durasi Langganan / Masa Aktif:</label>
              <select 
                value={subType}
                onChange={(e) => setSubType(e.target.value)}
                className="w-full bg-zinc-900 border border-zinc-750 text-white text-sm rounded-xl px-4 py-2.5 focus:ring-1 focus:ring-blue-500 outline-none cursor-pointer"
              >
                <option value="lifetime">Selamanya (Lifetime / Akses Penuh)</option>
                <option value="1_month">1 Bulan (Uji Coba/Langganan Bulanan)</option>
                <option value="3_months">3 Bulan (Akses Sedang)</option>
                <option value="1_year">1 Tahun (Langganan Tahunan)</option>
                <option value="custom">Pilih Tanggal Kustom...</option>
              </select>
            </div>

            {subType === 'custom' ? (
              <div>
                <label className="block text-[10px] font-black text-zinc-400 uppercase tracking-widest mb-1.5">Hingga Tanggal Berapa:</label>
                <input 
                  type="date" 
                  required
                  value={customDate}
                  onChange={(e) => setCustomDate(e.target.value)}
                  className="w-full bg-zinc-900 border border-zinc-750 text-white text-sm rounded-xl px-4 py-2.5 focus:ring-1 focus:ring-blue-500 outline-none cursor-pointer"
                />
              </div>
            ) : (
              <div className="hidden sm:block"></div>
            )}
          </div>
        )}

        <div className="flex justify-end pt-2">
          <button 
            type="submit"
            disabled={loading}
            className="w-full sm:w-auto bg-zinc-100 hover:bg-white text-black font-extrabold px-6 py-3 rounded-xl text-sm flex items-center justify-center gap-2 transition-all active:scale-95 disabled:opacity-50"
          >
            <UserPlus className="w-4 h-4" />
            Simpan / Perbarui Pengguna
          </button>
        </div>
      </form>

      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm text-zinc-300">
          <thead className="text-xs uppercase bg-black/40 text-zinc-500 text-center">
            <tr>
              <th className="px-4 py-3 text-left">Email</th>
              <th className="px-4 py-3">Role</th>
              <th className="px-4 py-3">Status Langganan</th>
              <th className="px-4 py-3">Didaftarkan Pada</th>
              <th className="px-4 py-3">Aksi</th>
            </tr>
          </thead>
          <tbody>
            {users.map(u => {
              const isExpired = u.role !== 'ADMIN' && u.expires_at && new Date() > new Date(u.expires_at);
              const isLifetime = !u.expires_at || u.expires_at.startsWith('9999');

              return (
                <tr key={u.email} className="border-b border-zinc-800/50 hover:bg-zinc-800/20 text-center">
                  <td className="px-4 py-3 text-left font-medium text-white">{u.email}</td>
                  <td className="px-4 py-3">
                    <span className={`px-2 py-1 rounded text-[10px] font-black uppercase tracking-wider ${u.role === 'ADMIN' ? 'bg-orange-500/20 text-orange-400 border border-orange-500/20' : 'bg-blue-500/20 text-blue-400 border border-blue-500/20'}`}>
                      {u.role}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    {isLifetime ? (
                      <span className="px-2 py-0.5 rounded text-[10px] font-black uppercase tracking-wider bg-purple-500/10 text-purple-400 border border-purple-500/10">
                        Lifetime / Selamanya
                      </span>
                    ) : isExpired ? (
                      <span className="px-2 py-0.5 rounded text-[10px] font-black uppercase tracking-wider bg-red-500/10 text-red-500 border border-red-500/20">
                        EXPIRED ({new Date(u.expires_at).toLocaleDateString('id-ID', { year: 'numeric', month: 'short', day: 'numeric' })})
                      </span>
                    ) : (
                      <span className="px-2 py-0.5 rounded text-[10px] font-black uppercase tracking-wider bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                        AKTIF (s.d. {new Date(u.expires_at).toLocaleDateString('id-ID', { year: 'numeric', month: 'short', day: 'numeric' })})
                      </span>
                    )}
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
              );
            })}
            {users.length === 0 && (
              <tr>
                <td colSpan={5} className="text-center py-8 text-zinc-500">Belum ada user.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
