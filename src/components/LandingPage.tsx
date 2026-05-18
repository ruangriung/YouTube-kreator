import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Sparkles, BrainCircuit, CalendarDays, Rocket, Play, ChevronRight, Loader2 } from 'lucide-react';
import { useGoogleLogin } from '@react-oauth/google';
import { verifyAccount } from '../lib/auth';

export default function LandingPage({ onLoginSuccess }: { onLoginSuccess: () => void }) {
  const [errorMsg, setErrorMsg] = useState('');
  const [loading, setLoading] = useState(false);

  const login = useGoogleLogin({
    scope: 'https://www.googleapis.com/auth/calendar.events',
    onSuccess: async (tokenResponse) => {
      setLoading(true);
      setErrorMsg('');
      try {
        await verifyAccount(tokenResponse.access_token);
        onLoginSuccess();
      } catch (err: any) {
        console.error(err);
        setErrorMsg(err.message || 'Gagal login. Hubungi Admin.');
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
            CreatorBlueprint.
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
          <span>didukung oleh gemini ai</span>
        </div>
        
        <h1 className="text-5xl md:text-7xl font-black tracking-tighter leading-[1.1] mb-6">
          Sistem Autopilot untuk <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-500 to-red-800">
             Kreator YouTube.
          </span>
        </h1>
        
        <p className="text-zinc-400 text-lg md:text-xl max-w-2xl font-light mb-10 leading-relaxed">
          Ubah ide acak menjadi strategi konten taktis. Riset niche, kalender produksi, 
          hingga skrip video—semuanya digenerate AI dan disinkronkan langsung ke Google Calendar Anda.
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
          className="group flex items-center gap-3 bg-white text-black px-8 py-4 rounded-2xl font-bold text-lg hover:bg-zinc-200 transition-all shadow-[0_0_40px_-10px_rgba(255,255,255,0.3)] hover:scale-105 active:scale-95 disabled:opacity-70 disabled:hover:scale-100"
        >
          {loading ? (
             <Loader2 className="w-6 h-6 animate-spin text-black" />
          ) : (
            <svg className="w-6 h-6" viewBox="0 0 48 48" fill="none"><path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"></path><path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"></path><path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"></path><path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"></path></svg>
          )}
          {loading ? 'Menghubungkan...' : 'Masuk / Daftar App'}
          {!loading && <ChevronRight className="w-5 h-5 text-zinc-500 group-hover:text-black transition-colors" />}
        </button>
        <p className="mt-4 text-xs text-zinc-600">Akses hanya untuk pengguna terdaftar (Cloudflare D1 Allowlist)</p>
      </main>

      {/* Feature Section */}
      <section className="border-t border-zinc-900 bg-black/50 backdrop-blur-3xl z-10">
        <div className="max-w-6xl mx-auto px-6 py-20">
          <div className="text-center mb-16">
             <h2 className="text-2xl md:text-4xl font-bold tracking-tight">Kenapa menggunakan sistem ini?</h2>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="p-8 rounded-3xl bg-zinc-900/40 border border-zinc-800/60 hover:bg-zinc-900/60 transition-colors">
              <div className="w-12 h-12 bg-red-500/10 rounded-xl flex items-center justify-center mb-6">
                <BrainCircuit className="w-6 h-6 text-red-500" />
              </div>
              <h3 className="text-xl font-bold mb-3">Riset Taktis AI</h3>
              <p className="text-zinc-400 leading-relaxed text-sm">
                Temukan micro-niche yang belum jenuh, buat judul viral, dan bongkar psikologi audiens dengan analisis Gemini AI tingkat lanjut.
              </p>
            </div>
            
            <div className="p-8 rounded-3xl bg-zinc-900/40 border border-zinc-800/60 hover:bg-zinc-900/60 transition-colors">
              <div className="w-12 h-12 bg-blue-500/10 rounded-xl flex items-center justify-center mb-6">
                <CalendarDays className="w-6 h-6 text-blue-500" />
              </div>
              <h3 className="text-xl font-bold mb-3">Google Calendar Sync</h3>
              <p className="text-zinc-400 leading-relaxed text-sm">
                Jadwal produksi (riset, syuting, editing) yang dibuat AI, diekstrak dan disinkronkan langsung ke kalender Google Anda dengan satu klik.
              </p>
            </div>
            
            <div className="p-8 rounded-3xl bg-zinc-900/40 border border-zinc-800/60 hover:bg-zinc-900/60 transition-colors">
              <div className="w-12 h-12 bg-green-500/10 rounded-xl flex items-center justify-center mb-6">
                <Rocket className="w-6 h-6 text-green-500" />
              </div>
              <h3 className="text-xl font-bold mb-3">Eksekusi Massal</h3>
              <p className="text-zinc-400 leading-relaxed text-sm">
                Pelajari strategi batching, repurposing konten untuk Reels/TikTok, dan atasi burnout dengan panduan operasional kreator.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="w-full py-8 border-t border-zinc-900 z-10">
        <div className="max-w-7xl mx-auto px-6 text-center space-y-4">
          <div className="text-zinc-500 text-xs flex items-center justify-center gap-4">
            <Link to="/privacy-policy" className="hover:text-red-500 transition-colors">Privacy Policy</Link>
            <span>&bull;</span>
            <Link to="/terms-of-service" className="hover:text-red-500 transition-colors">Terms of Service</Link>
          </div>
          <p className="text-zinc-600 text-xs">&copy; {new Date().getFullYear()} CreatorBlueprint. Built with AI Studio.</p>
        </div>
      </footer>
    </div>
  );
}
