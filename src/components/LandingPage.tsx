import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Sparkles, BrainCircuit, Rocket, Play, ChevronRight, Loader2, Target, Tv, Heart } from 'lucide-react';
import { useGoogleLogin } from '@react-oauth/google';
import { verifyAccount, verifyLocalDevAccount } from '../lib/auth';

export default function LandingPage({ onLoginSuccess }: { onLoginSuccess: () => void }) {
  const [errorMsg, setErrorMsg] = useState('');
  const [loading, setLoading] = useState(false);
  const [regUser, setRegUser] = useState<{ email: string; name: string; picture: string } | null>(null);
  const [regName, setRegName] = useState('');
  const [regEmail, setRegEmail] = useState('');

  const login = useGoogleLogin({
    onSuccess: async (tokenResponse) => {
      setLoading(true);
      setErrorMsg('');
      try {
        await verifyAccount(tokenResponse.access_token);
        onLoginSuccess();
      } catch (err: any) {
        console.error(err);
        if (err.email) {
          setRegUser({
            email: err.email,
            name: err.name || '',
            picture: err.picture || ''
          });
          setRegName(err.name || '');
          setRegEmail(err.email || '');
          setErrorMsg('');
        } else {
          setErrorMsg(err.message || 'Gagal login. Hubungi Admin.');
        }
      } finally {
        setLoading(false);
      }
    },
    onError: () => {
      setErrorMsg('Login digagalkan');
      setLoading(false);
    }
  });

  return (
    <div className="min-h-screen bg-black text-zinc-100 flex flex-col font-sans selection:bg-red-500/30">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-zinc-900 via-black to-black -z-10"></div>
      
      {/* Navbar Minimalis */}
      <nav className="w-full max-w-6xl mx-auto px-6 py-6 flex justify-between items-center z-10">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-red-600 rounded-lg flex items-center justify-center shadow-lg shadow-red-600/20">
            <Play className="w-4 h-4 text-white fill-current" />
          </div>
          <span className="font-black text-xl tracking-tight bg-gradient-to-r from-white to-zinc-400 bg-clip-text text-transparent">
            Autopilot AI Commander
          </span>
        </div>
        <button 
          onClick={() => login()}
          disabled={loading}
          className="text-sm font-semibold text-zinc-300 hover:text-white transition-colors"
        >
          Masuk
        </button>
      </nav>

      {/* Hero Section */}
      <main className="flex-1 flex flex-col items-center justify-center text-center px-6 pt-16 pb-24 z-10 max-w-5xl mx-auto">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-zinc-900 border border-zinc-800 text-xs font-semibold text-red-400 mb-8 lowercase tracking-wide">
          <Sparkles className="w-3.5 h-3.5" />
          <span>didukung oleh sistem ai autopilot tingkat lanjut</span>
        </div>
        
        <h1 className="text-5xl md:text-7xl font-black tracking-tighter leading-[1.1] mb-6">
          Sistem Autopilot untuk <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-500 to-red-800">
             Autopilot AI Commander
          </span>
        </h1>
        
        <p className="text-zinc-400 text-lg md:text-xl max-w-2xl font-light mb-10 leading-relaxed">
          Ubah ide acak menjadi rencana konten taktis secara instan. Riset niche mendalam, formula hook viral, storyboard visual, hingga draf skrip video siap pakai—semuanya digenerate AI secara autopilot.
        </p>

        {errorMsg && (
            <div className="mb-4 bg-red-500/10 border border-red-500/50 text-red-400 px-4 py-2 rounded-lg text-sm font-semibold">
                {errorMsg}
            </div>
        )}

        <button 
          onClick={() => {
            setLoading(true);
            login();
          }}
          disabled={loading}
          className="group flex items-center gap-3 bg-white text-black px-8 py-4 rounded-2xl font-bold text-lg hover:bg-zinc-200 transition-all shadow-[0_0_40px_-10px_rgba(255,255,255,0.3)] hover:scale-105 active:scale-95 disabled:opacity-70 disabled:hover:scale-100 mb-4"
        >
          {loading ? (
             <Loader2 className="w-6 h-6 animate-spin text-black" />
          ) : (
            <svg className="w-6 h-6" viewBox="0 0 48 48" fill="none"><path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"></path><path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"></path><path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"></path><path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"></path></svg>
          )}
          {loading ? 'Menghubungkan...' : 'Masuk / Daftar App'}
          {!loading && <ChevronRight className="w-5 h-5 text-zinc-500 group-hover:text-black transition-colors" />}
        </button>

        <p className="mt-4 text-xs text-zinc-600 mb-4">Akses hanya untuk pengguna terdaftar (Cloudflare D1 Allowlist)</p>
        
        {(typeof window !== 'undefined' && (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1' || window.location.hostname.startsWith('192.168.'))) && (
          <button
            onClick={async () => {
              setLoading(true);
              setErrorMsg('');
              try {
                await verifyLocalDevAccount();
                onLoginSuccess();
              } catch (err: any) {
                setErrorMsg(err.message);
                setLoading(false);
              }
            }}
            disabled={loading}
            className="flex items-center justify-center gap-2 bg-zinc-900/80 hover:bg-zinc-800 border border-zinc-850 text-zinc-400 hover:text-white px-6 py-3.5 rounded-2xl font-bold text-sm transition-all active:scale-95 disabled:opacity-70 shadow-lg"
          >
            <Sparkles className="w-4 h-4 text-yellow-500 animate-pulse" />
            Bypass & Masuk Mode Pengembang (Local)
          </button>
        )}
      </main>

      {/* Feature & Benefits Section */}
      <section className="border-t border-zinc-900 bg-black/50 backdrop-blur-3xl z-10">
        <div className="max-w-6xl mx-auto px-6 py-20">
          <div className="text-center mb-16">
             <h2 className="text-3xl md:text-5xl font-black tracking-tight mb-4">6 Benefit Utama Autopilot AI</h2>
             <p className="text-zinc-500 text-sm md:text-base max-w-xl mx-auto font-light leading-relaxed">
               Dapatkan seluruh alur kerja profesional kreator konten YouTube kelas dunia yang digenerate otomatis dalam satu dashboard terintegrasi.
             </p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="p-8 rounded-3xl bg-zinc-900/40 border border-zinc-800/60 hover:bg-zinc-900/60 transition-colors">
              <div className="w-12 h-12 bg-red-500/10 rounded-xl flex items-center justify-center mb-6">
                <BrainCircuit className="w-6 h-6 text-red-500" />
              </div>
              <h3 className="text-xl font-bold mb-3">1. Riset Mikro-Niche Taktis</h3>
              <p className="text-zinc-400 leading-relaxed text-xs sm:text-sm">
                Temukan target audiens ideal dan sub-niche tersegmentasi yang konsisten agar terhindar dari burnout dan mempercepat monetisasi.
              </p>
            </div>
            
            <div className="p-8 rounded-3xl bg-zinc-900/40 border border-zinc-800/60 hover:bg-zinc-900/60 transition-colors">
              <div className="w-12 h-12 bg-blue-500/10 rounded-xl flex items-center justify-center mb-6">
                <Sparkles className="w-6 h-6 text-blue-500" />
              </div>
              <h3 className="text-xl font-bold mb-3">2. Analisis Konten Pesaing Viral</h3>
              <p className="text-zinc-400 leading-relaxed text-xs sm:text-sm">
                Bongkar psikologi audiens, bedah 50 pola video viral di niche Anda, dan pelajari emosi pemicu interaksi komentar yang tinggi.
              </p>
            </div>
            
            <div className="p-8 rounded-3xl bg-zinc-900/40 border border-zinc-800/60 hover:bg-zinc-900/60 transition-colors">
              <div className="w-12 h-12 bg-green-500/10 rounded-xl flex items-center justify-center mb-6">
                <Rocket className="w-6 h-6 text-green-500" />
              </div>
              <h3 className="text-xl font-bold mb-3">3. Formula Hooks Adiktif</h3>
              <p className="text-zinc-400 leading-relaxed text-xs sm:text-sm">
                Miliki formula teks kalimat pancingan (hooks) 3 detik pertama dengan intonasi vokal dramatis agar penonton tidak skip video Anda.
              </p>
            </div>

            <div className="p-8 rounded-3xl bg-zinc-900/40 border border-zinc-800/60 hover:bg-zinc-900/60 transition-colors">
              <div className="w-12 h-12 bg-amber-500/10 rounded-xl flex items-center justify-center mb-6">
                <Target className="w-6 h-6 text-amber-500" />
              </div>
              <h3 className="text-xl font-bold mb-3">4. Storyboard Visual Canggih</h3>
              <p className="text-zinc-400 leading-relaxed text-xs sm:text-sm">
                Rancang storyboard visual detik-demi-detik lengkap dengan montase B-roll, transisi musik latar, pergerakan kamera, dan SFX.
              </p>
            </div>

            <div className="p-8 rounded-3xl bg-zinc-900/40 border border-zinc-800/60 hover:bg-zinc-900/60 transition-colors">
              <div className="w-12 h-12 bg-purple-500/10 rounded-xl flex items-center justify-center mb-6">
                <Tv className="w-6 h-6 text-purple-500" />
              </div>
              <h3 className="text-xl font-bold mb-3">5. Draf Skrip Video Siap Pakai</h3>
              <p className="text-zinc-400 leading-relaxed text-xs sm:text-sm">
                Hasilkan naskah video utuh siap baca dengan pilihan gaya bahasa yang dinamis, intonasi berbicara, hingga petunjuk visual lengkap.
              </p>
            </div>

            <div className="p-8 rounded-3xl bg-zinc-900/40 border border-zinc-800/60 hover:bg-zinc-900/60 transition-colors">
              <div className="w-12 h-12 bg-red-500/10 rounded-xl flex items-center justify-center mb-6">
                <Heart className="w-6 h-6 text-red-500" />
              </div>
              <h3 className="text-xl font-bold mb-3">6. Desain Thumbnail CTR Tinggi</h3>
              <p className="text-zinc-400 leading-relaxed text-xs sm:text-sm">
                Strategi menyusun tata letak warna kontras, ekspresi karakter penarik klik, dan pesan tulisan pendek pemicu rasa penasaran.
              </p>
            </div>
          </div>
        </div>
      </section>



      {/* Footer */}
      <footer className="w-full py-8 border-t border-zinc-900 z-10">
        <div className="max-w-7xl mx-auto px-6 text-center space-y-4">
          <div className="text-zinc-500 text-xs flex items-center justify-center gap-4">
            <Link to="/about" className="hover:text-red-500 transition-colors">About Us</Link>
            <span>&bull;</span>
            <Link to="/privacy-policy" className="hover:text-red-500 transition-colors">Privacy Policy</Link>
            <span>&bull;</span>
            <Link to="/terms-of-service" className="hover:text-red-500 transition-colors">Terms of Service</Link>
          </div>
          <p className="text-zinc-600 text-xs">&copy; {new Date().getFullYear()} Auto Pilot AI Commander. Didesain oleh Arek Gresik.</p>
        </div>
      </footer>

      {/* Modal Pendaftaran QRIS */}
      {regUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md transition-all duration-300">
          <div className="relative w-full max-w-lg bg-zinc-950/90 border border-zinc-800/80 rounded-3xl p-6 sm:p-8 shadow-[0_0_50px_-5px_rgba(239,68,68,0.15)] flex flex-col items-center">
            {/* Header */}
            <div className="w-12 h-12 bg-red-500/10 border border-red-500/30 rounded-2xl flex items-center justify-center mb-4">
              <Sparkles className="w-6 h-6 text-red-500 animate-pulse" />
            </div>
            
            <h3 className="text-xl sm:text-2xl font-black text-white text-center tracking-tight mb-2">
              Pendaftaran Autopilot AI Commander
            </h3>
            
            <p className="text-xs sm:text-sm text-zinc-400 text-center font-light mb-6 leading-relaxed max-w-md">
              Email Google Anda belum terdaftar di sistem kami. Dapatkan akses <span className="text-red-400 font-bold">Lifetime</span> ke seluruh 10+ alat AI taktis, riset mikro-niche, draf skrip, dan mode autopilot seharga <span className="text-white font-bold bg-zinc-900 px-2 py-0.5 rounded border border-zinc-800">Rp 69.000</span> sekali bayar.
            </p>

            {/* Form */}
            <div className="w-full space-y-4 mb-6 text-left">
              <div>
                <label className="block text-[10px] font-bold text-zinc-500 uppercase tracking-widest mb-1.5">Nama Lengkap (Sesuai Akun):</label>
                <input 
                  type="text" 
                  value={regName} 
                  onChange={e => setRegName(e.target.value)} 
                  className="w-full bg-zinc-900/80 border border-zinc-800 text-sm text-white rounded-xl px-3.5 py-2.5 focus:ring-1 focus:ring-red-500 focus:border-red-500 outline-none transition-all placeholder:text-zinc-600"
                  placeholder="Nama Lengkap Anda"
                />
              </div>
              
              <div>
                <label className="block text-[10px] font-bold text-zinc-500 uppercase tracking-widest mb-1.5">Email yang Didaftarkan:</label>
                <input 
                  type="email" 
                  value={regEmail} 
                  onChange={e => setRegEmail(e.target.value)} 
                  className="w-full bg-zinc-900/80 border border-zinc-800 text-sm text-white rounded-xl px-3.5 py-2.5 focus:ring-1 focus:ring-red-500 focus:border-red-500 outline-none transition-all placeholder:text-zinc-650"
                  placeholder="name@email.com"
                />
              </div>
            </div>

            {/* QRIS Code Box */}
            <div className="relative group bg-zinc-900/50 border border-zinc-800/80 p-4 rounded-2xl flex flex-col items-center mb-6 shadow-inner w-full max-w-[280px]">
              <div className="absolute inset-0 bg-gradient-to-tr from-red-500/5 to-transparent rounded-2xl -z-10 group-hover:opacity-100 transition-opacity"></div>
              
              <div className="bg-white p-2.5 rounded-xl shadow-lg border border-zinc-200">
                <img 
                  src="/qris.png" 
                  alt="QRIS Pembayaran 69K" 
                  className="w-48 h-48 sm:w-52 sm:h-52 object-contain rounded"
                  onError={(e) => {
                    e.currentTarget.src = "https://placehold.co/200x200?text=QRIS+69K";
                  }}
                />
              </div>

              <a 
                href="/qris.png" 
                download="QRIS_Autopilot_AI_Commander.png"
                className="mt-3 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-zinc-850 hover:bg-zinc-800 border border-zinc-800 text-[10px] font-bold text-zinc-300 transition-all uppercase tracking-wider active:scale-95"
              >
                <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                </svg>
                Unduh QRIS
              </a>
              
              <span className="text-[9px] font-bold text-zinc-500 uppercase tracking-wider mt-2.5">
                Pindai dengan Aplikasi M-Banking / E-Wallet
              </span>
            </div>

            {/* Action Buttons */}
            <div className="w-full grid grid-cols-2 gap-3">
              <button
                onClick={() => setRegUser(null)}
                className="w-full bg-zinc-900 border border-zinc-800 hover:bg-zinc-800 text-zinc-300 font-bold py-3 px-4 rounded-xl text-sm transition-all active:scale-95"
              >
                Batal
              </button>
              
              <button
                onClick={() => {
                  const msg = `Halo Admin, saya ingin mendaftar Autopilot AI Commander dengan detail berikut:\n\n*Nama:* ${regName}\n*Email:* ${regEmail}\n*Biaya:* Rp69.000 (Lifetime)\n\nBerikut saya lampirkan bukti pembayaran QRIS saya. Tolong segera aktifkan akun saya ya, terima kasih!`;
                  const encodedMsg = encodeURIComponent(msg);
                  window.open(`https://wa.me/6281234567890?text=${encodedMsg}`, '_blank');
                }}
                disabled={!regName || !regEmail}
                className="w-full bg-red-600 hover:bg-red-500 text-white font-bold py-3 px-4 rounded-xl text-sm shadow-lg shadow-red-600/20 transition-all active:scale-95 disabled:opacity-50 disabled:active:scale-100"
              >
                Konfirmasi WA
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
