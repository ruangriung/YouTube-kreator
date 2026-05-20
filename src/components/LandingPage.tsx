import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Sparkles, BrainCircuit, Rocket, Play, ChevronRight, Loader2, Target, Tv, Heart, Copy, Eye, Download, Calendar, Layers, Shield } from 'lucide-react';
import { useGoogleLogin } from '@react-oauth/google';
import { verifyAccount, verifyLocalDevAccount } from '../lib/auth';

export default function LandingPage({ onLoginSuccess }: { onLoginSuccess: () => void }) {
  const [errorMsg, setErrorMsg] = useState('');
  const [loading, setLoading] = useState(false);
  const [regUser, setRegUser] = useState<{ email: string; name: string; picture: string } | null>(null);
  const [regName, setRegName] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regMethod, setRegMethod] = useState('');
  const [regPlan, setRegPlan] = useState<'lifetime' | 'daily' | 'monthly' | 'yearly'>('lifetime');
  const [showQRIS, setShowQRIS] = useState(false);
  const [selectedMode, setSelectedMode] = useState<'kreator' | 'riset' | 'skrip'>('kreator');

  const modeContent = {
    kreator: {
      tag: "didukung oleh sistem ai autopilot tingkat lanjut",
      headline: "Konten Kreator",
      gradient: "from-red-500 to-red-800",
      description: "Ubah ide acak menjadi rencana konten taktis secara instan. Riset niche mendalam, formula hook viral, storyboard visual, hingga draf skrip video siap pakai—semuanya digenerate AI secara autopilot.",
      border: "border-red-500/20 text-red-400 bg-red-500/5",
    },
    riset: {
      tag: "mode riset niche & pembongkar kompetitor",
      headline: "Riset Niche AI",
      gradient: "from-purple-500 to-indigo-600",
      description: "Temukan segmen audiens mikro yang paling menguntungkan, bedah performa video kompetitor teratas secara detail, serta identifikasi celah tren pasar yang belum tersentuh secara otomatis.",
      border: "border-purple-500/20 text-purple-400 bg-purple-500/5",
    },
    skrip: {
      tag: "mode formula hook & storyboard visual",
      headline: "Skrip & Hook AI",
      gradient: "from-amber-500 to-orange-600",
      description: "Susun kalimat pancingan 3 detik pertama yang adiktif dengan gaya natural human speaking, lengkap dengan adegan visual detik demi detik serta transisi musik pembangun emosi.",
      border: "border-amber-500/20 text-amber-400 bg-amber-500/5",
    }
  };


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
    },
    prompt: 'select_account'
  });

  return (
    <div className="min-h-screen bg-black text-zinc-100 flex flex-col font-sans selection:bg-red-500/30">
      <div className="fixed inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-zinc-900 via-black to-black -z-10 pointer-events-none"></div>

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
      <main className="flex-1 flex flex-col items-center justify-start text-center px-6 pt-6 md:pt-10 pb-24 z-10 max-w-5xl mx-auto">
        {/* Interactive Mode Selectors */}
        <div className="flex flex-wrap items-center justify-center gap-1.5 p-1 rounded-2xl bg-zinc-900/60 border border-zinc-800/80 mb-8 max-w-md w-full">
          <button
            onClick={() => setSelectedMode('kreator')}
            className={`flex-1 min-w-[110px] px-3.5 py-2 text-[10px] font-extrabold uppercase tracking-wider rounded-xl transition-all active:scale-95 ${selectedMode === 'kreator'
              ? 'bg-red-600 text-white shadow-[0_0_15px_-3px_rgba(239,68,68,0.4)]'
              : 'text-zinc-500 hover:text-zinc-300 hover:bg-zinc-850/40'
              }`}
          >
            Kreator Mode
          </button>

          <button
            onClick={() => setSelectedMode('riset')}
            className={`flex-1 min-w-[110px] px-3.5 py-2 text-[10px] font-extrabold uppercase tracking-wider rounded-xl transition-all active:scale-95 ${selectedMode === 'riset'
              ? 'bg-purple-600 text-white shadow-[0_0_15px_-3px_rgba(147,51,234,0.4)]'
              : 'text-zinc-500 hover:text-zinc-300 hover:bg-zinc-850/40'
              }`}
          >
            Riset Niche
          </button>

          <button
            onClick={() => setSelectedMode('skrip')}
            className={`flex-1 min-w-[110px] px-3.5 py-2 text-[10px] font-extrabold uppercase tracking-wider rounded-xl transition-all active:scale-95 ${selectedMode === 'skrip'
              ? 'bg-amber-600 text-white shadow-[0_0_15px_-3px_rgba(217,119,6,0.4)]'
              : 'text-zinc-500 hover:text-zinc-300 hover:bg-zinc-850/40'
              }`}
          >
            Hook & Skrip
          </button>
        </div>

        <div className={`inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border text-[10px] font-bold uppercase tracking-wider mb-6 transition-all duration-300 ${modeContent[selectedMode].border}`}>
          <Sparkles className="w-3.5 h-3.5 animate-pulse" />
          <span>{modeContent[selectedMode].tag}</span>
        </div>

        <h1 className="text-5xl md:text-7xl font-black tracking-tighter leading-[1.1] mb-6">
          Sistem Autopilot untuk <br />
          <span className={`text-transparent bg-clip-text bg-gradient-to-r ${modeContent[selectedMode].gradient} transition-all duration-500`}>
            {modeContent[selectedMode].headline}
          </span>
        </h1>

        <p className="text-zinc-400 text-base md:text-lg max-w-2xl font-light mb-10 leading-relaxed min-h-[70px] transition-all duration-300">
          {modeContent[selectedMode].description}
        </p>

        {errorMsg && (
          <div className="mb-4 bg-red-500/10 border border-red-500/50 text-red-400 px-4 py-2 rounded-lg text-sm font-semibold">
            {errorMsg}
          </div>
        )}

        <div className="flex flex-col items-center relative mt-6 mb-4 w-full">
          {/* Main CTA Button */}
          <button
            onClick={() => {
              setLoading(true);
              login();
            }}
            disabled={loading}
            className="relative group flex items-center justify-center gap-3 bg-white text-zinc-800 px-8 sm:px-10 py-4 sm:py-5 rounded-2xl font-black text-base sm:text-lg md:text-xl transition-all shadow-[0_0_40px_-10px_rgba(255,255,255,0.3)] hover:shadow-[0_0_60px_-10px_rgba(255,255,255,0.5)] hover:scale-105 active:scale-95 disabled:opacity-70 disabled:hover:scale-100 w-full sm:w-auto z-10 border border-zinc-200"
          >
            {loading ? (
              <Loader2 className="w-6 h-6 animate-spin text-zinc-800" />
            ) : (
              <svg className="w-6 h-6 sm:w-7 sm:h-7" viewBox="0 0 48 48" fill="none"><path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"></path><path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"></path><path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"></path><path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"></path></svg>
            )}
            {loading ? 'MENYIAPKAN WORKSPACE...' : 'LOGIN DENGAN GOOGLE'}
            {!loading && <ChevronRight className="w-5 h-5 text-zinc-400 group-hover:text-zinc-600 group-hover:translate-x-1 transition-transform" />}
          </button>

          {/* Social Proof */}
          <div className="flex flex-col sm:flex-row items-center gap-3 mt-6 mb-3">
            <div className="flex -space-x-3">
              <img src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=64&auto=format&fit=crop" alt="Kreator 1" className="w-8 h-8 rounded-full border-2 border-black object-cover shadow-sm" />
              <img src="https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?q=80&w=64&auto=format&fit=crop" alt="Kreator 2" className="w-8 h-8 rounded-full border-2 border-black object-cover shadow-sm" />
              <img src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=64&auto=format&fit=crop" alt="Kreator 3" className="w-8 h-8 rounded-full border-2 border-black object-cover shadow-sm" />
              <img src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=64&auto=format&fit=crop" alt="Kreator 4" className="w-8 h-8 rounded-full border-2 border-black object-cover shadow-sm" />
              <div className="w-8 h-8 rounded-full border-2 border-black bg-zinc-800 flex items-center justify-center text-[9px] font-bold text-white shadow-sm z-10">
                +1.4k
              </div>
            </div>
            <span className="text-xs text-zinc-400 font-medium">🌟 Bergabung dengan <strong className="text-white">1,420+</strong> kreator cerdas lainnya.</span>
          </div>

          {/* Scarcity & Risk Reversal */}
          <div className="flex flex-col items-center gap-2 mt-2">
            <div className="bg-red-600 text-white text-[9px] sm:text-[10px] font-black uppercase tracking-wider px-3 py-1 rounded-full shadow-[0_0_15px_-3px_rgba(239,68,68,0.5)] flex items-center gap-1.5 border border-red-500/50">
              <span className="animate-pulse">🔥</span> Akses Beta Tertutup: Sisa 14 Slot Hari Ini!
            </div>
            <div className="flex items-center justify-center gap-1.5 text-[11px] text-zinc-600">
              <Shield className="w-3.5 h-3.5" />
              <span>100% Gratis selama masa Beta. Tidak butuh Kartu Kredit.</span>
            </div>
          </div>
        </div>

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

      {/* Brand Logos / Global Partners */}
      <section className="border-t border-zinc-900 bg-black z-10 py-12">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center space-y-2 mb-10">
            <p className="text-[10px] font-black uppercase tracking-[0.5em] opacity-30 text-white">Global Partners & Tech Support</p>
            <p className="text-[9px] font-bold uppercase tracking-[0.2em] opacity-20 text-white">Didukung oleh ekosistem teknologi AI terbaik di dunia</p>
          </div>
          <div className="flex flex-wrap justify-center items-center gap-x-12 gap-y-10 grayscale opacity-40 hover:grayscale-0 hover:opacity-100 transition-all duration-700">
            <div title="YouTube" className="flex items-center gap-2"><img src="https://cdn.simpleicons.org/youtube/FF0000" className="h-5" alt="YouTube" /><span className="font-bold text-[10px] text-white">YouTube</span></div>
            <div title="Google AdSense" className="flex items-center gap-2"><img src="https://cdn.simpleicons.org/googleadsense/4285F4" className="h-5" alt="Google AdSense" /><span className="font-bold text-[10px] text-white">AdSense</span></div>
            <div title="Meta" className="flex items-center gap-2"><img src="https://cdn.simpleicons.org/meta/0668E1" className="h-4" alt="Meta" /><span className="font-bold text-[10px] text-white">Meta</span></div>
            <div title="Cloudflare" className="flex items-center"><img src="/logo-cloudflare-dark.svg" className="h-4" alt="Cloudflare" /></div>
            <div title="Google" className="flex items-center gap-2"><img src="/google-icon.svg" className="h-4" alt="Google" /><span className="font-bold text-[10px] text-white">Google</span></div>
            <div title="GitHub" className="flex items-center gap-2"><img src="/github.svg" className="h-5 invert" alt="GitHub" /><span className="font-bold text-[10px] text-white">GitHub</span></div>
            <div title="Antigravity" className="flex items-center gap-2"><img src="/antigravity.svg" className="h-6" alt="Antigravity" /><span className="font-bold text-[10px] text-white">Antigravity</span></div>
            <div title="DeepSeek" className="flex items-center"><img src="/deepseek.svg" className="h-6" alt="DeepSeek" /></div>
            <div title="Gemini" className="flex items-center gap-2"><img src="/gemini.svg" className="h-6" alt="Gemini" /><span className="font-bold text-[10px] text-white">Gemini</span></div>
            <div title="OpenAI" className="flex items-center"><img src="/openai.svg" className="h-6 invert" alt="OpenAI" /></div>
            <div title="Grok" className="flex items-center"><img src="/grok.svg" className="h-5 invert" alt="Grok" /></div>
            <div title="Pollinations AI" className="flex items-center gap-2"><img src="/pollinations.svg" className="h-6" alt="Pollinations" /><span className="font-bold text-[10px] text-white">Pollinations</span></div>
            <div title="Node.js" className="flex items-center"><img src="/nodejs.svg" className="h-5" alt="Node.js" /></div>
          </div>
        </div>
      </section>

      {/* Feature & Benefits Section */}
      <section className="border-t border-zinc-900 bg-zinc-950/90 z-10">
        <div className="max-w-6xl mx-auto px-6 py-20">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-black tracking-tight mb-4">6 Fitur & Benefit Utama Dashboard</h2>
            <p className="text-zinc-500 text-sm md:text-base max-w-xl mx-auto font-light leading-relaxed">
              Semua alat tempur taktis kreator profesional kini menyatu dalam satu sistem terintegrasi. Tidak perlu berlangganan 5 tool terpisah lagi.
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="p-8 rounded-3xl bg-zinc-900/40 border border-zinc-800/60 hover:border-red-500/20 transition-all hover:bg-zinc-900/60 group">
              <div className="w-12 h-12 bg-red-500/10 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <BrainCircuit className="w-6 h-6 text-red-500" />
              </div>
              <h3 className="text-lg font-extrabold mb-3 text-white">1. Riset Niche & Mikro-Niche</h3>
              <p className="text-zinc-400 leading-relaxed text-xs sm:text-sm">
                Temukan target audiens ideal, sub-niche tersegmentasi, serta ribuan ide konten kreatif yang orisinal disesuaikan dengan niche channel YouTube Anda.
              </p>
            </div>

            <div className="p-8 rounded-3xl bg-zinc-900/40 border border-zinc-800/60 hover:border-purple-500/20 transition-all hover:bg-zinc-900/60 group">
              <div className="w-12 h-12 bg-purple-500/10 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <Layers className="w-6 h-6 text-purple-500" />
              </div>
              <h3 className="text-lg font-extrabold mb-3 text-white">2. Bedah Video Kompetitor AI</h3>
              <p className="text-zinc-400 leading-relaxed text-xs sm:text-sm">
                Tarik transkrip video pesaing secara instan dari URL YouTube dan jalankan audit retensi AI untuk membongkar taktik hook mereka (laporan dapat diunduh sebagai file .md).
              </p>
            </div>

            <div className="p-8 rounded-3xl bg-zinc-900/40 border border-zinc-800/60 hover:border-blue-500/20 transition-all hover:bg-zinc-900/60 group">
              <div className="w-12 h-12 bg-blue-500/10 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <Target className="w-6 h-6 text-blue-500" />
              </div>
              <h3 className="text-lg font-extrabold mb-3 text-white">3. Title & CTR A/B Test Simulator</h3>
              <p className="text-zinc-400 leading-relaxed text-xs sm:text-sm">
                Uji dan simulasikan tampilan visual judul dan thumbnail Anda di feed HP & Desktop sebelum upload, lengkap dengan analisis psikologis emosi penonton.
              </p>
            </div>

            <div className="p-8 rounded-3xl bg-zinc-900/40 border border-zinc-800/60 hover:border-amber-500/20 transition-all hover:bg-zinc-900/60 group">
              <div className="w-12 h-12 bg-amber-500/10 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <Tv className="w-6 h-6 text-amber-500" />
              </div>
              <h3 className="text-lg font-extrabold mb-3 text-white">4. AI Image & Video B-Roll Creator</h3>
              <p className="text-zinc-400 leading-relaxed text-xs sm:text-sm">
                Generate gambar thumbnail premium dan klip video B-Roll asinkron berdurasi hingga 8 detik dengan pilihan rasio media (Portrait, Landscape, Square) dan download instan.
              </p>
            </div>

            <div className="p-8 rounded-3xl bg-zinc-900/40 border border-zinc-800/60 hover:border-emerald-500/20 transition-all hover:bg-zinc-900/60 group">
              <div className="w-12 h-12 bg-emerald-500/10 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <Sparkles className="w-6 h-6 text-emerald-500" />
              </div>
              <h3 className="text-lg font-extrabold mb-3 text-white">5. Suggest AI & Auto-Translation</h3>
              <p className="text-zinc-400 leading-relaxed text-xs sm:text-sm">
                Dapatkan 3 ide prompt visual otomatis berbasis AI yang relevan dengan topik channel Anda, lengkap dengan auto-translation ke Bahasa Inggris untuk hasil visual maksimal.
              </p>
            </div>

            <div className="p-8 rounded-3xl bg-zinc-900/40 border border-zinc-800/60 hover:border-pink-500/20 transition-all hover:bg-zinc-900/60 group">
              <div className="w-12 h-12 bg-pink-500/10 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <Eye className="w-6 h-6 text-pink-500" />
              </div>
              <h3 className="text-lg font-extrabold mb-3 text-white">6. Bedah Visual & Thumbnail CTR</h3>
              <p className="text-zinc-400 leading-relaxed text-xs sm:text-sm">
                Unggah thumbnail Anda untuk di-scan AI Vision. Bongkar kontras warna, keterbacaan teks, ekspresi karakter, estimasi skor CTR, beserta unduh laporan .md offline.
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
          <p className="text-zinc-600 text-xs">&copy; {new Date().getFullYear()} Auto Pilot AI Commander - <a href="https://kreatorautopilot.my.id" target="_blank" rel="noopener noreferrer" className="hover:text-red-500 transition-colors">kreatorautopilot.my.id</a>. Didesain oleh Arek Gresik.</p>
        </div>
      </footer>

      {/* Modal Pendaftaran QRIS */}
      {regUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md transition-all duration-300">
          <div className="relative w-full max-w-lg max-h-[92vh] overflow-y-auto bg-zinc-950/90 border border-zinc-800/80 rounded-3xl p-6 sm:p-8 shadow-[0_0_50px_-5px_rgba(239,68,68,0.15)] flex flex-col items-center [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:bg-zinc-800 [&::-webkit-scrollbar-thumb]:rounded-full">
            {/* Header */}
            <div className="w-12 h-12 bg-red-500/10 border border-red-500/30 rounded-2xl flex items-center justify-center mb-4">
              <Sparkles className="w-6 h-6 text-red-500 animate-pulse" />
            </div>

            <h3 className="text-xl sm:text-2xl font-black text-white text-center tracking-tight mb-2">
              Pendaftaran Autopilot AI Commander
            </h3>

            <p className="text-xs sm:text-sm text-zinc-400 text-center font-light mb-6 leading-relaxed max-w-md">
              Email Google Anda belum terdaftar di sistem kami. Pilih paket langganan Anda di bawah untuk mendapatkan akses penuh ke seluruh 10+ alat AI taktis, riset mikro-niche, bedah kompetitor, generator klip video, dan mode autopilot.
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

              <div>
                <label className="block text-[10px] font-bold text-zinc-500 uppercase tracking-widest mb-1.5">Pilih Paket Langganan:</label>
                <select
                  value={regPlan}
                  onChange={(e) => setRegPlan(e.target.value as any)}
                  className="w-full bg-zinc-900/80 border border-zinc-800 text-sm text-white rounded-xl px-3.5 py-2.5 focus:ring-1 focus:ring-red-500 focus:border-red-500 outline-none transition-all cursor-pointer"
                >
                  <option value="daily" className="bg-zinc-950">Daily Pass (Rp 9.000 / hari)</option>
                  <option value="monthly" className="bg-zinc-950">Monthly Pro (Rp 49.000 / bulan)</option>
                  <option value="yearly" className="bg-zinc-950">Yearly Master (Rp 299.000 / tahun)</option>
                  <option value="lifetime" className="bg-zinc-950">Lifetime Access (Rp 599.000 sekali bayar)</option>
                </select>
              </div>

              <div>
                <label className="block text-[10px] font-bold text-zinc-500 uppercase tracking-widest mb-1.5">Metode Pembayaran:</label>
                <select
                  value={regMethod}
                  onChange={(e) => {
                    const method = e.target.value;
                    setRegMethod(method);
                    if (method === 'QRIS') {
                      setShowQRIS(true);
                    } else {
                      setShowQRIS(false);
                    }
                  }}
                  className="w-full bg-zinc-900/80 border border-zinc-800 text-sm text-white rounded-xl px-3.5 py-2.5 focus:ring-1 focus:ring-red-500 focus:border-red-500 outline-none transition-all cursor-pointer"
                >
                  <option value="" disabled className="bg-zinc-950">Pilih Metode Pembayaran</option>
                  <option value="QRIS" className="bg-zinc-950">Scan QRIS (Otomatis)</option>
                  <option value="BRI" className="bg-zinc-950">Transfer Bank BRI</option>
                  <option value="Jago" className="bg-zinc-950">Transfer Bank Jago</option>
                  <option value="E-Wallet" className="bg-zinc-950">E-Wallet (Gopay / Dana)</option>
                </select>
              </div>
            </div>

            {/* Ringkasan Biaya */}
            <div className="w-full bg-zinc-900/40 border border-zinc-800/80 p-4 rounded-2xl mb-6 text-left flex justify-between items-center">
              <div>
                <span className="text-[9px] font-black text-zinc-500 uppercase tracking-wider block">Paket Pilihan</span>
                <span className="text-xs font-bold text-white uppercase mt-0.5 block">
                  {regPlan === 'lifetime' && 'Lifetime Access'}
                  {regPlan === 'daily' && 'Daily Pass'}
                  {regPlan === 'monthly' && 'Monthly Pro'}
                  {regPlan === 'yearly' && 'Yearly Master'}
                </span>
              </div>
              <div className="text-right">
                <span className="text-[9px] font-black text-zinc-500 uppercase tracking-wider block">Total Tagihan</span>
                <span className="text-sm font-black text-red-500 block mt-0.5">
                  {regPlan === 'lifetime' && 'Rp 599.000'}
                  {regPlan === 'daily' && 'Rp 9.000'}
                  {regPlan === 'monthly' && 'Rp 49.000'}
                  {regPlan === 'yearly' && 'Rp 299.000'}
                </span>
              </div>
            </div>

            {/* Collapsible Payment Details */}
            {regMethod && regMethod !== 'QRIS' && (
              <div className="w-full space-y-3 mb-6">
                {regMethod === 'BRI' && (
                  <div className="flex items-center justify-between bg-zinc-900 border border-zinc-800 p-4 rounded-xl">
                    <div className="flex flex-col">
                      <span className="text-[10px] font-bold text-red-500 uppercase tracking-widest">Bank BRI</span>
                      <span className="text-sm font-bold font-mono text-white mt-1">002601080458504</span>
                      <span className="text-[9px] text-zinc-500 uppercase tracking-wider mt-0.5">a.n. Arif Tirtana</span>
                    </div>
                    <button
                      onClick={() => {
                        navigator.clipboard.writeText('002601080458504');
                        alert('Nomor Rekening BRI berhasil disalin!');
                      }}
                      className="p-2 bg-zinc-850 hover:bg-zinc-800 text-zinc-400 hover:text-white rounded-lg border border-zinc-800 transition-all active:scale-95"
                      title="Salin Nomor Rekening"
                    >
                      <Copy size={16} />
                    </button>
                  </div>
                )}
                {regMethod === 'Jago' && (
                  <div className="flex items-center justify-between bg-zinc-900 border border-zinc-800 p-4 rounded-xl">
                    <div className="flex flex-col">
                      <span className="text-[10px] font-bold text-orange-500 uppercase tracking-widest">Bank Jago</span>
                      <span className="text-sm font-bold font-mono text-white mt-1">4889506026373948</span>
                      <span className="text-[9px] text-zinc-500 uppercase tracking-wider mt-0.5">a.n. Arif Tirtana</span>
                    </div>
                    <button
                      onClick={() => {
                        navigator.clipboard.writeText('4889506026373948');
                        alert('Nomor Rekening Bank Jago berhasil disalin!');
                      }}
                      className="p-2 bg-zinc-850 hover:bg-zinc-800 text-zinc-400 hover:text-white rounded-lg border border-zinc-800 transition-all active:scale-95"
                      title="Salin Nomor Rekening"
                    >
                      <Copy size={16} />
                    </button>
                  </div>
                )}
                {regMethod === 'E-Wallet' && (
                  <div className="flex items-center justify-between bg-zinc-900 border border-zinc-800 p-4 rounded-xl">
                    <div className="flex flex-col">
                      <span className="text-[10px] font-bold text-emerald-500 uppercase tracking-widest">Gopay / Dana / ShopeePay</span>
                      <span className="text-sm font-bold font-mono text-white mt-1">081330763633</span>
                      <span className="text-[9px] text-zinc-500 uppercase tracking-wider mt-0.5">a.n. Arif Tirtana</span>
                    </div>
                    <button
                      onClick={() => {
                        navigator.clipboard.writeText('081330763633');
                        alert('Nomor E-Wallet berhasil disalin!');
                      }}
                      className="p-2 bg-zinc-850 hover:bg-zinc-800 text-zinc-400 hover:text-white rounded-lg border border-zinc-800 transition-all active:scale-95"
                      title="Salin Nomor"
                    >
                      <Copy size={16} />
                    </button>
                  </div>
                )}
              </div>
            )}

            {/* QRIS Code Box */}
            {showQRIS && (
              <div className="relative group bg-zinc-900/50 border border-zinc-800/80 p-4 rounded-2xl flex flex-col items-center mb-6 shadow-inner w-full max-w-[280px]">
                <div className="absolute inset-0 bg-gradient-to-tr from-red-500/5 to-transparent rounded-2xl -z-10 group-hover:opacity-100 transition-opacity"></div>

                <div className="bg-white p-2.5 rounded-xl shadow-lg border border-zinc-200">
                  <img
                    src="/qris.png"
                    alt="QRIS Pembayaran"
                    className="w-48 h-48 sm:w-52 sm:h-52 object-contain rounded"
                    onError={(e) => {
                      e.currentTarget.src = "https://placehold.co/200x200?text=Scan+QRIS";
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

                <span className="text-[9px] font-bold text-zinc-500 uppercase tracking-wider mt-2.5 text-center">
                  Pindai dengan Aplikasi M-Banking / E-Wallet
                </span>
              </div>
            )}

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
                  const planNames = {
                    lifetime: 'Lifetime Access (Rp 599.000)',
                    daily: 'Daily Pass (Rp 9.000)',
                    monthly: 'Monthly Pro (Rp 49.000)',
                    yearly: 'Yearly Master (Rp 299.000)'
                  };
                  const selectedPlanName = planNames[regPlan];
                  const msg = `Halo Admin, saya ingin mendaftar Autopilot AI Commander dengan detail berikut:\n\n*Nama:* ${regName}\n*Email:* ${regEmail}\n*Paket Pilihan:* ${selectedPlanName}\n*Metode Pembayaran:* ${regMethod}\n\n*Berikut saya lampirkan bukti transfer/pembayaran pada chat ini.*`;
                  const encodedMsg = encodeURIComponent(msg);
                  window.open(`https://wa.me/6281330763633?text=${encodedMsg}`, '_blank');
                }}
                disabled={!regName || !regEmail || !regMethod}
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
