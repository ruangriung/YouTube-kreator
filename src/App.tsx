import React, { useState, useEffect } from 'react';
import { callPollinationsAI, callPollinationsImage, callPollinationsVideo } from './lib/pollinations';
import { Lightbulb, BookOpen, RotateCcw, BrainCircuit, Sparkles, Brain, Filter, ArrowUpDown, Palette, CheckCircle2, Download, Loader2, Cpu, ChevronDown, LogOut, ShieldAlert, Play } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, Tooltip as RechartsTooltip, ResponsiveContainer, LineChart, Line, CartesianGrid, Cell } from 'recharts';
import { initAuth, getAccessToken, logout } from './lib/auth';
import LandingPage from './components/LandingPage';
import AdminPanel from './components/AdminPanel';
import TitleSimulator from './components/TitleSimulator';
import ImageGenerator from './components/ImageGenerator';
import CompetitorAnalyzer from './components/CompetitorAnalyzer';
import VisualDissector from './components/VisualDissector';

// Helper component for Section 6 visual CTR preview
const ThumbnailPreviewSection = ({ params, setParams }: { params: any; setParams: any }) => {
  const [loading, setLoading] = useState(false);
  const [generatedImg, setGeneratedImg] = useState<string | null>(null);
  const [showLayoutOverlay, setShowLayoutOverlay] = useState(true);

  const getCuratedMockImage = () => {
    if (params.warna?.includes("Kuning")) {
      return "https://images.unsplash.com/photo-1542751371-adc38448a05e?q=80&w=600&auto=format&fit=crop";
    } else if (params.warna?.includes("Merah")) {
      return "https://images.unsplash.com/photo-1511512578047-dfb367046420?q=80&w=600&auto=format&fit=crop";
    } else {
      return "https://images.unsplash.com/photo-1538481199705-c710c4e965fc?q=80&w=600&auto=format&fit=crop";
    }
  };

  const handleGenerateVisual = async () => {
    setLoading(true);
    try {
      const prompt = `A premium cinematic high-CTR YouTube thumbnail style design. Dark atmospheric background with bold glowing neon colors: ${params.warna}. Subject: ${params.karakter}. Clean composition, intense expression, high contrast lighting, award-winning gaming/tech YouTube thumbnail aesthetic.`;
      const url = await callPollinationsImage(prompt, 'flux', 1024, 576);
      if (url) {
        setGeneratedImg(url);
      }
    } catch (err) {
      console.error("Gagal men-generate gambar draf:", err);
    } finally {
      setLoading(false);
    }
  };

  const currentImg = generatedImg || getCuratedMockImage();

  return (
    <div className="mt-4 border-t border-zinc-800/85 pt-4 space-y-4 text-left">
      <div className="flex justify-between items-center">
        <span className="text-[10px] font-black uppercase text-pink-500 tracking-widest flex items-center gap-1.5">
          <span className="w-1.5 h-1.5 rounded-full bg-pink-500 animate-pulse"></span>
          Simulasi Visual & Layout Grid AI
        </span>
        <button
          type="button"
          onClick={() => setShowLayoutOverlay(!showLayoutOverlay)}
          className={`px-2.5 py-1 text-[9px] font-extrabold uppercase rounded-lg border transition-all ${
            showLayoutOverlay 
              ? 'bg-zinc-800 text-white border-zinc-700' 
              : 'bg-zinc-950 text-zinc-505 border-zinc-900 hover:text-zinc-400'
          }`}
        >
          {showLayoutOverlay ? 'Sembunyikan Grid CTR' : 'Tampilkan Grid CTR'}
        </button>
      </div>

      <div className="grid md:grid-cols-12 gap-4">
        {/* Visual Preview Panel */}
        <div className="md:col-span-7 relative rounded-2xl overflow-hidden border border-zinc-800 bg-zinc-950 group min-h-[160px] flex items-center justify-center">
          <img 
            src={currentImg} 
            alt="AI Thumbnail Preview" 
            className="w-full h-full object-cover max-h-[220px] transition-transform duration-500 group-hover:scale-105" 
          />

          {/* Rule of Thirds / Focal Layout Grid Overlay */}
          {showLayoutOverlay && (
            <div className="absolute inset-0 grid grid-cols-3 grid-rows-3 pointer-events-none z-10">
              <div className="border-r border-b border-white/20"></div>
              <div className="border-r border-b border-white/20"></div>
              <div className="border-b border-white/20"></div>
              
              <div className="border-r border-b border-white/20"></div>
              <div className="border-r border-b border-white/20"></div>
              <div className="border-b border-white/20"></div>
              
              <div className="border-r border-white/20"></div>
              <div className="border-r border-white/20"></div>
              <div></div>

              <div className="absolute top-2 left-2 bg-black/60 border border-zinc-800 text-[8px] font-black text-zinc-400 px-1.5 py-0.5 rounded uppercase tracking-wider">
                Zona Judul
              </div>
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-red-600/80 border border-red-500 text-[8px] font-black text-white px-2 py-0.5 rounded-full uppercase tracking-wider animate-pulse">
                Titik Fokus Utama
              </div>
              <div className="absolute bottom-2 right-2 bg-zinc-950/80 border border-zinc-800 text-[8px] font-black text-yellow-500 px-1.5 py-0.5 rounded">
                10:14
              </div>
            </div>
          )}

          {loading && (
            <div className="absolute inset-0 bg-black/75 flex flex-col items-center justify-center gap-2 z-20">
              <div className="w-6 h-6 border-2 border-pink-500 border-t-transparent rounded-full animate-spin"></div>
              <span className="text-[10px] font-black text-pink-400 uppercase tracking-widest animate-pulse">Generasi Desain AI...</span>
            </div>
          )}
        </div>

        {/* Action Panel */}
        <div className="md:col-span-5 flex flex-col justify-between space-y-3">
          <div className="space-y-2">
            <span className="text-[9px] font-black text-zinc-500 uppercase tracking-widest block">Rekomendasi Struktur Tata Letak:</span>
            
            <div className="bg-zinc-950/80 border border-zinc-850 p-3 rounded-xl space-y-1.5">
              <div className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-green-500"></span>
                <span className="text-[9px] font-bold text-zinc-300">Warna: {params.warna ? params.warna.split(' ')[0] : 'Kontras'}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-green-500"></span>
                <span className="text-[9px] font-bold text-zinc-300">Fokus: {params.karakter ? params.karakter.split(' ')[0] : 'Karakter'}</span>
              </div>
              <p className="text-[10px] text-zinc-400 font-light leading-relaxed pt-1">
                Letakkan subjek utama di sepertiga kanan (sesuai grid) dan overlay teks pemicu di sepertiga kiri untuk keterbacaan yang optimal.
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={handleGenerateVisual}
            disabled={loading}
            className="w-full bg-pink-600 hover:bg-pink-500 text-white font-bold py-2.5 px-4 rounded-xl text-xs uppercase tracking-wider transition-all cursor-pointer shadow-lg shadow-pink-500/10 active:scale-95 flex items-center justify-center gap-1.5"
          >
            <Sparkles size={13} className="shrink-0" />
            Generate Draf Visual AI Baru
          </button>
        </div>
      </div>
    </div>
  );
};

const SECTIONS = [
  {
    id: 1,
    title: "Pilih niche yang bisa kamu bahas setiap hari",
    desc: "Mencari ide sub-niche mikro yang konsisten agar terhindar dari burnout.",
    icon: <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="6"/><circle cx="12" cy="12" r="2"/></svg>,
    category: 'Konten / Niche',
    defaultParams: { audiens: 'Pemula (Mulai dari Nol)', monetisasi: 'AdSense YouTube Semata' },
    renderInputs: (params, setParams) => (
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-zinc-900/50 p-4 rounded-xl border border-zinc-800">
        <div>
          <label className="block text-xs font-bold text-zinc-400 uppercase mb-1">Target Tingkat Audiens:</label>
          <select value={params.audiens} onChange={e => setParams({...params, audiens: e.target.value})} className="w-full bg-zinc-950 border border-zinc-800 text-xs text-white rounded p-2 focus:ring-1 focus:ring-red-500 outline-none">
            <option value="Pemula (Mulai dari Nol)">Pemula (Mulai dari Nol)</option>
            <option value="Hobiis / Penggemar Menengah">Hobiis / Penggemar Menengah</option>
            <option value="Profesional / Edukasi Tingkat Lanjut">Profesional / Edukasi Lanjut</option>
          </select>
        </div>
        <div>
          <label className="block text-xs font-bold text-zinc-400 uppercase mb-1">Model Pendapatan Utama:</label>
          <select value={params.monetisasi} onChange={e => setParams({...params, monetisasi: e.target.value})} className="w-full bg-zinc-950 border border-zinc-800 text-xs text-white rounded p-2 focus:ring-1 focus:ring-red-500 outline-none">
            <option value="AdSense YouTube Semata">AdSense YouTube Semata</option>
            <option value="Sponsorship & Penjualan Jasa/Produk">Sponsorship & Jasa/Produk</option>
            <option value="Afiliasi Produk e-Commerce">Afiliasi Produk e-Commerce</option>
          </select>
        </div>
      </div>
    ),
    getPrompt: (topic, params) => `Kembangkan niche mikro dan target pasar spesifik untuk topik "${topic}". Target audiens adalah: ${params.audiens}. Model monetisasi utama adalah: ${params.monetisasi}. Tolong buatkan analisis kelayakan, 3 sub-niche mikro yang belum banyak digarap di Indonesia, dan draf judul dari 5 ide video pertama yang langsung bisa dikerjakan minggu ini. Berikan juga CONTOH NYATA seperti narasi pendek, ide gambaran thumbnail, caption, dan hook visual yang relevan.`
  },
  {
    id: 2,
    title: "Pelajari 50 video viral di niche kamu",
    desc: "Menganalisis pola pemicu psikologis apa saja yang membuat video sejenis viral.",
    icon: <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/></svg>,
    category: 'Konten / Niche',
    defaultParams: { gaya: 'Dokumenter Kritis / Video Essay', durasi: 'Standar Efektif (8 - 12 Menit)' },
    renderInputs: (params, setParams) => (
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-zinc-900/50 p-4 rounded-xl border border-zinc-800">
        <div>
          <label className="block text-xs font-bold text-zinc-400 uppercase mb-1">Gaya Konten Anda:</label>
          <select value={params.gaya} onChange={e => setParams({...params, gaya: e.target.value})} className="w-full bg-zinc-950 border border-zinc-800 text-xs text-white rounded p-2 focus:ring-1 focus:ring-red-500 outline-none">
            <option value="Dokumenter Kritis / Video Essay">Dokumenter Kritis / Video Essay</option>
            <option value="Vlog Hiburan Cepat & Energik">Vlog Hiburan Cepat & Energik</option>
            <option value="Screencast / Tutorial Langkah Demi Langkah">Screencast / Tutorial Langkah-Langkah</option>
          </select>
        </div>
        <div>
          <label className="block text-xs font-bold text-zinc-400 uppercase mb-1">Durasi Video Utama:</label>
          <select value={params.durasi} onChange={e => setParams({...params, durasi: e.target.value})} className="w-full bg-zinc-950 border border-zinc-800 text-xs text-white rounded p-2 focus:ring-1 focus:ring-red-500 outline-none">
            <option value="Shorts Vertikal (< 60 Detik)">Shorts Vertikal (&lt; 60 Detik)</option>
            <option value="Standar Efektif (8 - 12 Menit)">Standar Efektif (8 - 12 Menit)</option>
            <option value="Panjang & Komprehensif (> 20 Menit)">Panjang & Komprehensif (&gt; 20 Menit)</option>
          </select>
        </div>
      </div>
    ),
    getPrompt: (topic, params) => `Saya memproduksi video dengan topik "${topic}" menggunakan gaya "${params.gaya}" and durasi "${params.durasi}". Bedah pola psikologi dari 3 tema video yang paling sering viral di niche ini. Berikan struktur narasi yang memancing interaksi komentar tinggi, emosi apa yang wajib dieksploitasi. Lengkapi juga dengan CONTOH NYATA hook kalimat, gaya pengeditan visual kasar, dan ide teks thumbnail yang terbukti bekerja di topik serupa.`
  },
  {
    id: 3,
    title: "Curi teknik pancingan (hooks), bukan kontennya",
    desc: "Membeli formula teks hook pembuka video paling adiktif.",
    icon: <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1"/></svg>,
    category: 'Skrip & Hook',
    defaultParams: { emosi: 'Memicu Rasa Takut Ketinggalan (FOMO/Urgensi)', sapaan: 'Sangat Santai & Gaul (Bro/Sist, Lu/Gua, Guys)' },
    renderInputs: (params, setParams) => (
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-zinc-900/50 p-4 rounded-xl border border-zinc-800">
        <div>
          <label className="block text-xs font-bold text-zinc-400 uppercase mb-1">Pendekatan Emosi Hook:</label>
          <select value={params.emosi} onChange={e => setParams({...params, emosi: e.target.value})} className="w-full bg-zinc-950 border border-zinc-800 text-xs text-white rounded p-2 focus:ring-1 focus:ring-red-500 outline-none">
            <option value="Memicu Rasa Takut Ketinggalan (FOMO/Urgensi)">Ketakutan / FOMO (Urgensi)</option>
            <option value="Kontroversial / Menantang Opini Populer">Kontroversial / Menantang Opini Umum</option>
            <option value="Fakta Menakjubkan / Rahasia Tersembunyi">Rasa Ingin Tahu Tinggi / Rahasia</option>
          </select>
        </div>
        <div>
          <label className="block text-xs font-bold text-zinc-400 uppercase mb-1">Gaya Sapaan Konten:</label>
          <select value={params.sapaan} onChange={e => setParams({...params, sapaan: e.target.value})} className="w-full bg-zinc-950 border border-zinc-800 text-xs text-white rounded p-2 focus:ring-1 focus:ring-red-500 outline-none">
            <option value="Sangat Santai & Gaul (Bro/Sist, Lu/Gua, Guys)">Sangat Santai (Lu, Gua, Guys)</option>
            <option value="Profesional Bersahabat (Anda, Teman-teman)">Profesional Bersahabat (Anda, Teman-teman)</option>
            <option value="Dramatis Serius bak Pembawa Berita">Dramatis & Misterius</option>
          </select>
        </div>
      </div>
    ),
    getPrompt: (topic, params) => `Tolong buatkan 5 variasi naskah kalimat Hook (3 detik pertama) yang sangat memikat untuk video bertema "${topic}". Pendekatan emosi yang diinginkan adalah "${params.emosi}" dengan gaya sapaan tutur kata "${params.sapaan}". Sediakan instruksi intonasi suara dan ekspresi wajah yang harus dilakukan di depan kamera untuk setiap draf. WAJIB sertakan CONTOH NYATA kalimat dialog pembuka verbatim yang benar-benar siap dibaca.`
  },
  {
    id: 4,
    title: "Posting minimal 3 kali seminggu",
    desc: "Membangun kalender produksi konten mingguan tanpa membuat stres.",
    icon: <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"/></svg>,
    category: 'Sistem & Jadwal',
    defaultParams: { sumberdaya: 'Sangat Sibuk (Pekerja Kantoran / Pelajar)', format: 'Campuran: 1 Video Panjang + 2 Shorts' },
    renderInputs: (params, setParams) => (
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-zinc-900/50 p-4 rounded-xl border border-zinc-800">
        <div>
          <label className="block text-xs font-bold text-zinc-400 uppercase mb-1">Ketersediaan Waktu:</label>
          <select value={params.sumberdaya} onChange={e => setParams({...params, sumberdaya: e.target.value})} className="w-full bg-zinc-950 border border-zinc-800 text-xs text-white rounded p-2 focus:ring-1 focus:ring-red-500 outline-none">
            <option value="Sangat Sibuk (Pekerja Kantoran / Pelajar)">Sangat Sibuk (Part-Time)</option>
            <option value="Fokus Penuh (Full-Time Creator)">Fokus Penuh (Full-Time)</option>
          </select>
        </div>
        <div>
          <label className="block text-xs font-bold text-zinc-400 uppercase mb-1">Format Pembagian:</label>
          <select value={params.format} onChange={e => setParams({...params, format: e.target.value})} className="w-full bg-zinc-950 border border-zinc-800 text-xs text-white rounded p-2 focus:ring-1 focus:ring-red-500 outline-none">
            <option value="Campuran: 1 Video Panjang + 2 Shorts">Campuran (1 Panjang + 2 Shorts)</option>
            <option value="Fokus Shorts Terus-Menerus (3 Video Vertikal)">Fokus Shorts (3 Video Vertikal)</option>
            <option value="Ambisius: 3 Video Panjang Per Minggu">Murni Panjang (3 Video Panjang)</option>
          </select>
        </div>
      </div>
    ),
    getPrompt: (topic, params) => `Rancang kalender produksi mingguan untuk mengupload 3 konten seminggu dengan topik "${topic}". Hambatan kesibukan saya adalah "${params.sumberdaya}" dengan target format penayangan "${params.format}". Berikan jadwal harian kapan waktu riset, menulis draf, syuting, editing, dan waktu publish optimal. Sertakan CONTOH NYATA jadwal jam-jam realistis dan draf konten harian secara spesifik.`
  },
  {
    id: 5,
    title: "2 detik pertama menentukan segalanya",
    desc: "Mendesain draf naskah pembuka audio-visual agar penonton tidak skip.",
    icon: <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>,
    category: 'Skrip & Hook',
    defaultParams: { elemen: 'Talking Head Terbuka (Wajah Langsung Depan Kamera)', musik: 'Hening Tanpa Suara lalu Menghentak Tiba-tiba' },
    renderInputs: (params, setParams) => (
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-zinc-900/50 p-4 rounded-xl border border-zinc-800">
        <div>
          <label className="block text-xs font-bold text-zinc-400 uppercase mb-1">Elemen Visual Pembuka:</label>
          <select value={params.elemen} onChange={e => setParams({...params, elemen: e.target.value})} className="w-full bg-zinc-950 border border-zinc-800 text-xs text-white rounded p-2 focus:ring-1 focus:ring-red-500 outline-none">
            <option value="Talking Head Terbuka (Wajah Langsung Depan Kamera)">Talking Head Terbuka (Tatap Muka)</option>
            <option value="Montase Kejutan / Cuplikan Hasil Akhir Heboh">Montase Kejutan B-Roll Cepat</option>
            <option value="Teks Grafis Besar + Efek Suara Woosh Menegangkan">Teks Grafis Tebal + Sound Effect</option>
          </select>
        </div>
        <div>
          <label className="block text-xs font-bold text-zinc-400 uppercase mb-1">Gaya Musik Latar:</label>
          <select value={params.musik} onChange={e => setParams({...params, musik: e.target.value})} className="w-full bg-zinc-950 border border-zinc-800 text-xs text-white rounded p-2 focus:ring-1 focus:ring-red-500 outline-none">
            <option value="Hening Tanpa Suara lalu Menghentak Tiba-tiba">Mendadak Menghentak (Cuts)</option>
            <option value="Ketukan Misterius / Tekno Menggelitik Pikiran">Misterius / Tekno Menggelitik</option>
            <option value="Sinematik Orkestra Megah Penuh Semangat">Orkestra Megah & Heroik</option>
          </select>
        </div>
      </div>
    ),
    getPrompt: (topic, params) => `Tulis naskah storyboard detik-demi-detik yang dinamis dari Detik 0 hingga Detik 5 untuk video tentang "${topic}". Taktik visual pembuka: "${params.elemen}", gaya musik "${params.musik}". WAJIB sertakan CONTOH NYATA gambaran frame-by-frame (misal: "Scene 1: Layar merah, teks 'RAHASIA' bergetar"), plus dialog, SFX, dan pergerakan kamera ekstrem.`
  },
  {
    id: 6,
    title: "Thumbnail jauh lebih penting daripada videonya",
    desc: "Mendesain tata letak objek, teks ringkas, dan efek warna thumbnail CTR tinggi.",
    icon: <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"/></svg>,
    category: 'Visual & Thumbnail',
    defaultParams: { warna: 'Kuning Stabilo & Hitam Pekat (Sangat Kontras)', karakter: 'Ekspresi Terkejut dengan Mulut Terbuka' },
    renderInputs: (params, setParams) => (
      <div className="space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-zinc-900/50 p-4 rounded-xl border border-zinc-800">
          <div>
            <label className="block text-xs font-bold text-zinc-400 uppercase mb-1">Palet Warna Utama:</label>
            <select value={params.warna} onChange={e => setParams({...params, warna: e.target.value})} className="w-full bg-zinc-950 border border-zinc-800 text-xs text-white rounded p-2 focus:ring-1 focus:ring-red-500 outline-none">
              <option value="Kuning Stabilo & Hitam Pekat (Sangat Kontras)">Kuning Stabilo & Hitam Kontras</option>
              <option value="Merah YouTube & Abu-Abu Industri">Merah & Abu-Abu Industri</option>
              <option value="Biru Toska Neon & Ungu Violet">Biru Neon & Ungu Violet</option>
            </select>
          </div>
          <div>
            <label className="block text-xs font-bold text-zinc-400 uppercase mb-1">Fokus Karakter/Emosi:</label>
            <select value={params.karakter} onChange={e => setParams({...params, karakter: e.target.value})} className="w-full bg-zinc-950 border border-zinc-800 text-xs text-white rounded p-2 focus:ring-1 focus:ring-red-500 outline-none">
              <option value="Ekspresi Terkejut dengan Mulut Terbuka">Ekspresi Terkejut / Syok</option>
              <option value="Wajah Menunjuk Objek Misterius dengan Tatapan Tajam">Menunjuk Objek Misterius</option>
              <option value="Tanpa Wajah, Fokus ke Produk/Grafik yang Menggunung">Hanya Fokus Objek / Perubahan Grafis</option>
            </select>
          </div>
        </div>
        {/* Real-time interactive AI Image Layout Previewer inside Card 6 */}
        <ThumbnailPreviewSection params={params} setParams={setParams} />
      </div>
    ),
    getPrompt: (topic, params) => `Buat panduan konsep visual kreatif untuk draf Thumbnail video bertema "${topic}". Skema warna kontras: "${params.warna}", ekspresi karakter: "${params.karakter}". WAJIB SERTAKAN CONTOH MOCKUP TEKS (maksimal 3 kata pemicu), ide objek di latar belakang, dan spesifikasi efek cahaya. Jadikan ini seolah sketch nyata untuk desainer grafis.`
  },
  {
    id: 7,
    title: "Fokus ganda pada kandungan yang mendapat sambutan",
    desc: "Menciptakan sub-topik lanjutan (Part 2) dari draf video berkinerja tinggi.",
    icon: <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"/></svg>,
    category: 'Konten / Niche',
    defaultParams: { viral: '', sudut: 'Uji Coba Ekstrem 30 Hari' },
    renderInputs: (params, setParams) => (
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-zinc-900/50 p-4 rounded-xl border border-zinc-800">
        <div>
          <label className="block text-xs font-bold text-zinc-400 uppercase mb-1">Topik Video Tersukses Anda Saat Ini:</label>
          <input type="text" value={params.viral} onChange={e => setParams({...params, viral: e.target.value})} placeholder="Contoh: Bongkar cara jualan tanpa modal" className="w-full bg-zinc-950 border border-zinc-800 text-xs text-white rounded p-2 focus:ring-1 focus:ring-red-500 outline-none" />
        </div>
        <div>
          <label className="block text-xs font-bold text-zinc-400 uppercase mb-1">Sudut Pandang Sekuel:</label>
          <select value={params.sudut} onChange={e => setParams({...params, sudut: e.target.value})} className="w-full bg-zinc-950 border border-zinc-800 text-xs text-white rounded p-2 focus:ring-1 focus:ring-red-500 outline-none">
            <option value="Uji Coba Ekstrem 30 Hari">Pembuktian Eksperimen / Uji Coba</option>
            <option value="Studi Kasus Kesalahan Kegagalan">Studi Kasus & Mengapa Banyak yang Gagal</option>
            <option value="Panduan Lengkap Versi Ultimate">Versi Lengkap / Ultimate Masterclass</option>
          </select>
        </div>
      </div>
    ),
    getPrompt: (topic, params) => `Seandainya video saya yang berjudul atau bertema "${params.viral || topic}" meledak di pasaran, buatkan rancangan strategi pelipatgandaan konten dengan sudut pandang "${params.sudut}". Berikan CONTOH NYATA draf judul sekuel lanjutan (Part 2), spin-off edukatif, dan plot/skrip singkat untuk serial pendek 3 bagian yang memancing subscribe.`
  },
  {
    id: 8,
    title: "Buat konten secara pukal (batch) untuk kekal konsisten",
    desc: "Menciptakan metode hemat energi untuk produksi syuting 4 video sekaligus.",
    icon: <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"/></svg>,
    category: 'Sistem & Jadwal',
    defaultParams: { waktu: 'Hanya 1 - 2 Jam Saja', gaya: 'Satu Kamera Statis dengan Tripod' },
    renderInputs: (params, setParams) => (
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-zinc-900/50 p-4 rounded-xl border border-zinc-800">
        <div>
          <label className="block text-xs font-bold text-zinc-400 uppercase mb-1">Waktu Syuting Sekali Jalan:</label>
          <select value={params.waktu} onChange={e => setParams({...params, waktu: e.target.value})} className="w-full bg-zinc-950 border border-zinc-800 text-xs text-white rounded p-2 focus:ring-1 focus:ring-red-500 outline-none">
            <option value="Hanya 1 - 2 Jam Saja">Hanya 1 - 2 Jam (Sangat Singkat)</option>
            <option value="Setengah Hari (4 Jam)">Setengah Hari (4 Jam Terencana)</option>
            <option value="Satu Hari Penuh Terdedikasi">Satu Hari Penuh Terdedikasi (Maraton)</option>
          </select>
        </div>
        <div>
          <label className="block text-xs font-bold text-zinc-400 uppercase mb-1">Gaya Pengambilan Gambar:</label>
          <select value={params.gaya} onChange={e => setParams({...params, gaya: e.target.value})} className="w-full bg-zinc-950 border border-zinc-800 text-xs text-white rounded p-2 focus:ring-1 focus:ring-red-500 outline-none">
            <option value="Satu Kamera Statis dengan Tripod">Kamera Statis (Tripod)</option>
            <option value="Dinamis Banyak B-Roll & Pindah Lokasi">Dinamis B-Roll (Multi-Lokasi)</option>
            <option value="Screen-recording + Voice Over Saja">Rekam Layar + Voice Over</option>
          </select>
        </div>
      </div>
    ),
    getPrompt: (topic, params) => `Saya ingin memproduksi konten secata massal (batching) tentang topik "${topic}". Waktu syuting: "${params.waktu}", gaya: "${params.gaya}". Buatkan alur step-by-step untuk memproduksi 4 video sekaligus. Sertakan CONTOH NYATA rundown waktu dari jam ke jam, layout ruangan/kamera, dan ide manajemen skrip agar hemat energi.`
  },
  {
    id: 9,
    title: "Gunakan semula setiap video di pelbagai platform",
    desc: "Mengonversi naskah video panjang menjadi konten klip vertikal pendek.",
    icon: <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M11 5.882V19.24a1.76 1.76 0 01-3.417.592l-2.147-6.15M18 13a3 3 0 100-6M5.436 13.683A4.001 4.001 0 017 6h1.832c4.1 0 7.625-1.234 9.168-3v14c-1.543-1.766-5.067-3-9.168-3H7a3.988 3.988 0 01-1.564-.317z"/></svg>,
    category: 'Konten / Niche',
    defaultParams: { platform: 'TikTok & Instagram Reels (Format Cepat)', potong: 'Ambil 3 Bagian Inti Terbaik (Klimaks)' },
    renderInputs: (params, setParams) => (
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-zinc-900/50 p-4 rounded-xl border border-zinc-800">
        <div>
          <label className="block text-xs font-bold text-zinc-400 uppercase mb-1">Target Platform Tambahan:</label>
          <select value={params.platform} onChange={e => setParams({...params, platform: e.target.value})} className="w-full bg-zinc-950 border border-zinc-800 text-xs text-white rounded p-2 focus:ring-1 focus:ring-red-500 outline-none">
            <option value="TikTok & Instagram Reels (Format Cepat)">TikTok & Instagram Reels</option>
            <option value="YouTube Shorts (Format Pengikat Subscriber)">YouTube Shorts</option>
            <option value="Utas X (Twitter) & LinkedIn Post (Format Teks/Carousel)">Utas Tulis X & LinkedIn Post</option>
          </select>
        </div>
        <div>
          <label className="block text-xs font-bold text-zinc-400 uppercase mb-1">Metode Pemotongan:</label>
          <select value={params.potong} onChange={e => setParams({...params, potong: e.target.value})} className="w-full bg-zinc-950 border border-zinc-800 text-xs text-white rounded p-2 focus:ring-1 focus:ring-red-500 outline-none">
            <option value="Ambil 3 Bagian Inti Terbaik (Klimaks)">3 Potongan Menit Klimaks Terlucu/Terdahsyat</option>
            <option value="Bikin Rangkuman Teaser berdurasi 30 Detik">Rangkuman / Teaser Penuh Penasaran</option>
            <option value="Ubah Pembahasan Jadi Tips Mandiri Baru">Ubah Jadi Tips Mandiri Terpisah</option>
          </select>
        </div>
      </div>
    ),
    getPrompt: (topic, params) => `Rancang draf taktik mengubah (repurpose) video horizontal tentang "${topic}" menjadi klip pendek di "${params.platform}" dengan gaya pemotongan "${params.potong}". WAJIB berikan CONTOH NYATA naskah Call To Action (CTA), format teks caption pop-up, dan contoh detik apa yang diubah menjadi klip baru.`
  },
  {
    id: 10,
    title: "Jangan pernah menyerah sebelum mencapai 100 video",
    desc: "Mendapatkan sistem militer mental dan audit performa video di fase awal.",
    icon: <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2"/></svg>,
    category: 'Mindset',
    defaultParams: { video: 'Belum Mulai Sama Sekali (0 Video)', mental: 'Penonton (Views) Masih Sangat Sedikit/Sepi' },
    renderInputs: (params, setParams) => (
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-zinc-900/50 p-4 rounded-xl border border-zinc-800">
        <div>
          <label className="block text-xs font-bold text-zinc-400 uppercase mb-1">Jumlah Video yang Diupload Saat Ini:</label>
          <select value={params.video} onChange={e => setParams({...params, video: e.target.value})} className="w-full bg-zinc-950 border border-zinc-800 text-xs text-white rounded p-2 focus:ring-1 focus:ring-red-500 outline-none">
            <option value="Belum Mulai Sama Sekali (0 Video)">Belum Mulai Sama Sekali (0 Video)</option>
            <option value="Baru Memulai Sedikit (1 - 20 Video)">Baru Memulai Sedikit (1 - 20 Video)</option>
            <option value="Fase Menengah Menantang (21 - 60 Video)">Fase Menengah Menantang (21 - 60 Video)</option>
            <option value="Mendekati Garis Finis Pertama (> 60 Video)">Mendekati Target Pertama (&gt; 60 Video)</option>
          </select>
        </div>
        <div>
          <label className="block text-xs font-bold text-zinc-400 uppercase mb-1">Hambatan Mental Terbesar:</label>
          <select value={params.mental} onChange={e => setParams({...params, mental: e.target.value})} className="w-full bg-zinc-950 border border-zinc-800 text-xs text-white rounded p-2 focus:ring-1 focus:ring-red-500 outline-none">
            <option value="Penonton (Views) Masih Sangat Sedikit/Sepi">Penonton (Views) Sangat Sedikit/Sepi</option>
            <option value="Malas Melakukan Editing Video yang Rumit">Malas Melakukan Editing yang Rumit</option>
            <option value="Bingung Mencari Ide Konten yang Menarik">Bingung Mencari Ide Baru</option>
          </select>
        </div>
      </div>
    ),
    getPrompt: (topic, params) => `Saya di posisi "${params.video}" mengupload tentang "${topic}". Tantangan mental utamaku: "${params.mental}". Berikan surat evaluasi taktis, eksperimen konkret untuk dicoba minggu depan, dan suntikan motivasi. Berikan CONTOH NYATA cara creator lain bertahan dan contoh cara membaca analitik sederhana (CTR & Retensi).`
  }
];

function formatMarkdown(text) {
  let formatted = text
    .replace(/\*\*(.*?)\*\*/g, '<strong class="text-white font-extrabold">$1</strong>')
    .replace(/\*(.*?)\*/g, '<em class="text-zinc-300">$1</em>')
    .replace(/`([^`]+)`/g, '<code class="bg-zinc-950 px-1.5 py-0.5 rounded text-red-500 font-mono text-xs border border-zinc-800">$1</code>')
    .replace(/\n/g, '<br>');
  formatted = formatted.split('<br>').map(line => {
      const trimmed = line.trim();
      if (trimmed.startsWith('-') || trimmed.startsWith('*')) {
          return `<div class="flex items-start gap-2 my-1"><span class="text-red-500 font-black mt-1 shrink-0">•</span><span>${trimmed.substring(1).trim()}</span></div>`;
      }
      return line;
  }).join('');
  return `<div class="space-y-2 text-left leading-relaxed text-zinc-300 text-xs sm:text-sm">${formatted}</div>`;
}

export default function App() {
  const [topic, setTopic] = useState('');
  const [globalTopic, setGlobalTopic] = useState('');
  const [checkedSteps, setCheckedSteps] = useState(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('ytBuilder_checkedSteps');
      if (saved) return JSON.parse(saved);
    }
    return {};
  });
  const [openSectionId, setOpenSectionId] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState(null);
  const [sectionData, setSectionData] = useState(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('ytBuilder_sectionData');
      if (saved) return JSON.parse(saved);
    }
    return {};
  });
  const [filterCategory, setFilterCategory] = useState('Semua');
  const [sortBy, setSortBy] = useState('id_asc');
  
  const sectionDataRef = React.useRef(sectionData);
  const checkedStepsRef = React.useRef(checkedSteps);
  sectionDataRef.current = sectionData;
  checkedStepsRef.current = checkedSteps;

  const [userData, setUserData] = useState<any>(null);
  const [loadingAuth, setLoadingAuth] = useState(true);
  const [isAutopilotRunning, setIsAutopilotRunning] = useState(false);
  const autopilotRef = React.useRef(false);
  
  const [models, setModels] = useState<any[]>([]);
  const [selectedModel, setSelectedModel] = useState<string>(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('ytBuilder_selectedModel') || 'openai';
    }
    return 'openai';
  });
  const [isAdminOpen, setIsAdminOpen] = useState(false);
  const [isModelDropdownOpen, setIsModelDropdownOpen] = useState(false);
  const [isUserDropdownOpen, setIsUserDropdownOpen] = useState(false);

  const [outputLanguage, setOutputLanguage] = useState(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('ytBuilder_outputLanguage') || 'Bahasa Indonesia (Santai/Gaul)';
    }
    return 'Bahasa Indonesia (Santai/Gaul)';
  });
  const [visualStyle, setVisualStyle] = useState(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('ytBuilder_visualStyle') || 'B-Roll Cepat & Dinamis';
    }
    return 'B-Roll Cepat & Dinamis';
  });
  const [skripLength, setSkripLength] = useState(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('ytBuilder_skripLength') || 'Skrip Sedang (8-12 Menit)';
    }
    return 'Skrip Sedang (8-12 Menit)';
  });

  const [titleA, setTitleA] = useState('');
  const [titleB, setTitleB] = useState('');
  const [activePreview, setActivePreview] = useState<'A' | 'B'>('A');
  const [simulatingCTR, setSimulatingCTR] = useState(false);
  const [ctrResult, setCtrResult] = useState<any>(null);
  const [imagePrompt, setImagePrompt] = useState('Thumbnail epik dengan gaya cinematic premium');
  const [imageModel, setImageModel] = useState('flux');
  const [imageLoading, setImageLoading] = useState(false);
  const [imageResult, setImageResult] = useState<string | null>(null);
  const [imageError, setImageError] = useState('');

  // States for Bedah Video Kompetitor
  const [competitorUrl, setCompetitorUrl] = useState('');
  const [analyzingCompetitor, setAnalyzingCompetitor] = useState(false);
  const [competitorTranscript, setCompetitorTranscript] = useState<string | null>(null);
  const [competitorAnalysis, setCompetitorAnalysis] = useState<string | null>(null);
  const [competitorError, setCompetitorError] = useState<string | null>(null);

  const [imageModels, setImageModels] = useState<string[]>(['flux']);

  // States for Bedah Visual & Thumbnail
  const [dissectImage, setDissectImage] = useState<string | null>(null);
  const [dissecting, setDissecting] = useState(false);
  const [dissectResult, setDissectResult] = useState<string | null>(null);
  const [dissectError, setDissectError] = useState<string | null>(null);

  useEffect(() => {
    localStorage.setItem('ytBuilder_outputLanguage', outputLanguage);
  }, [outputLanguage]);

  useEffect(() => {
    localStorage.setItem('ytBuilder_visualStyle', visualStyle);
  }, [visualStyle]);

  useEffect(() => {
    localStorage.setItem('ytBuilder_skripLength', skripLength);
  }, [skripLength]);
  
  const isTopicUnsaved = topic.trim() !== globalTopic && topic.trim() !== '';

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const savedTopic = localStorage.getItem('ytBuilder_globalTopic');
      if (savedTopic) {
        setTopic(savedTopic);
        setGlobalTopic(savedTopic);
      }
    }
    
    // Initialize sectionData only if it's empty Object
    if (Object.keys(sectionData).length === 0) {
        const defaultData = {};
        SECTIONS.forEach(s => {
          defaultData[s.id] = { params: s.defaultParams, result: null, loading: false, tipLoading: false, tipResult: null, visualLoading: false, visualResult: null };
        });
        setSectionData(defaultData);
    }

    const fetchModels = async () => {
      try {
        const res = await fetch('https://gen.pollinations.ai/models');
        if (res.ok) {
          const list = await res.json();
          if (Array.isArray(list)) {
            // Hanya ambil model untuk generasi teks (bukan gambar, video, musik, dsb) dan ambil namanya saja sebagai string
            const textModels = list
              .filter((m: any) => 
                m.output_modalities?.includes('text') && 
                !m.is_specialized
              )
              .map((m: any) => m.name);
            setModels(textModels);
          }
        }
      } catch (err) {
        console.error("Gagal memuat list model:", err);
      }
    };
    fetchModels();

    const fetchImageModels = async () => {
      try {
        const res = await fetch('https://gen.pollinations.ai/image/models');
        if (res.ok) {
          const list = await res.json();
          if (Array.isArray(list)) {
            const imgModels = list
              .filter((m: any) => m.output_modalities?.includes('image'))
              .map((m: any) => m.name);
            if (imgModels.length > 0) {
              setImageModels(imgModels);
            }
          }
        }
      } catch (err) {
        console.error("Gagal memuat list model gambar:", err);
      }
    };
    fetchImageModels();

    initAuth(
      async (user, token) => {
        setUserData(user);
        setLoadingAuth(false);
      },
      () => {
        setUserData(null);
        setLoadingAuth(false);
      }
    );
  }, []);

  useEffect(() => {
    if (globalTopic) localStorage.setItem('ytBuilder_globalTopic', globalTopic);
  }, [globalTopic]);

  useEffect(() => {
    localStorage.setItem('ytBuilder_checkedSteps', JSON.stringify(checkedSteps));
  }, [checkedSteps]);

  useEffect(() => {
    localStorage.setItem('ytBuilder_sectionData', JSON.stringify(sectionData));
  }, [sectionData]);

  useEffect(() => {
    localStorage.setItem('ytBuilder_selectedModel', selectedModel);
  }, [selectedModel]);

  const handleGoogleLogin = async () => {
    // Deprecated since we use LandingPage login
  };



  const exportAllToMarkdown = () => {
    if (!globalTopic) {
        showToast("Topik belum diatur.");
        return;
    }
    
    let md = `# Panduan Konten YouTube: ${globalTopic}\n\n`;
    
    SECTIONS.forEach(section => {
        md += `## ${section.id}. ${section.title}\n`;
        md += `Kategori: ${section.category}\n\n`;
        
        const data = sectionData[section.id];
        if (data && data.result) {
            md += `${data.result}\n\n`;
        } else {
            md += `*(Belum ada data/analisis AI)*\n\n`;
        }
        
        if (data && data.tipResult) {
            md += `### Ide & Tips Tambahan:\n${data.tipResult}\n\n`;
        }
        
        if (data && data.visualResult) {
            md += `### Ide Visual:\n${data.visualResult}\n\n`;
        }
        
        md += `---\n\n`;
    });
    
    const blob = new Blob([md], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Panduan_YouTube_${globalTopic.replace(/\s+/g, '_')}.md`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    showToast("Berhasil mengunduh panduan!");
  };

  useEffect(() => {
    const defaultData = {};
    SECTIONS.forEach(s => {
      defaultData[s.id] = { params: s.defaultParams, result: null, loading: false, tipLoading: false, tipResult: null, visualLoading: false, visualResult: null };
    });
    setSectionData(defaultData);
  }, []);

  const resetAll = () => {
    if (!window.confirm("Apakah Anda yakin ingin menghapus semua progres?")) return;
    setTopic('');
    setGlobalTopic('');
    setCheckedSteps({});
    setOpenSectionId(null);
    const defaultData = {};
    SECTIONS.forEach(s => {
      defaultData[s.id] = { params: s.defaultParams, result: null, loading: false, tipLoading: false, tipResult: null, visualLoading: false, visualResult: null };
    });
    setSectionData(defaultData);
    
    // Remove from localstorage
    if (typeof window !== 'undefined') {
      localStorage.removeItem('ytBuilder_globalTopic');
      localStorage.removeItem('ytBuilder_checkedSteps');
      localStorage.removeItem('ytBuilder_sectionData');
    }
    showToast("Semua progres telah di-reset!");
  };

  const getQuickTip = async (section) => {
    if (!globalTopic) {
      showToast("Tulis Topik Utama Channel Anda di kolom atas dahulu dan klik Set Topik Utama!");
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }

    setSectionData(prev => ({
        ...prev,
        [section.id]: { ...prev[section.id], tipLoading: true, tipResult: null }
    }));

    try {
        const systemInstruction = "Anda adalah asisten AI yang singkat, jelas, dan sangat memotivasi untuk kreator YouTube.";
        const prompt = `Berikan SATU ide/tips taktis yang sangat spesifik (1-2 kalimat) dan SATU kalimat motivasi berapi-api untuk kreator YouTube dengan topik "${globalTopic}" yang sedang berada di langkah: ${section.title}. Parameter yang dipilih: ${JSON.stringify(sectionData[section.id].params)}.
[KONTEKS SALURAN TAMBAHAN]:
- Bahasa Output: ${outputLanguage}
- Gaya Bahasa Visual: ${visualStyle}
- Panjang Skrip Target: ${skripLength}

PENTING: Berikan ide/tips dan motivasi yang sepenuhnya segar, unik, orisinal, dan berbeda dari ide konvensional biasa atau rekomendasi standar sebelumnya. Jelajahi sudut pandang alternatif yang berani dan kreatif! (Variasi Kreatif #${Math.floor(Math.random() * 1000000)})`;

        const text = await callPollinationsAI(prompt, systemInstruction, selectedModel);

        if (text) {
            setSectionData(prev => ({
                ...prev,
                [section.id]: { ...prev[section.id], tipLoading: false, tipResult: text }
            }));
        } else {
             throw new Error("No text response");
        }
    } catch (error) {
        console.error(error);
        setSectionData(prev => ({
            ...prev,
            [section.id]: { ...prev[section.id], tipLoading: false, tipResult: "Gagal memuat ide cepat. Coba lagi nanti." }
        }));
    }
  };

  const getVisualIdeas = async (section) => {
    if (!globalTopic) {
      showToast("Tulis Topik Utama Channel Anda di kolom atas dahulu dan klik Set Topik Utama!");
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }

    setSectionData(prev => ({
        ...prev,
        [section.id]: { ...prev[section.id], visualLoading: true, visualResult: null }
    }));

    try {
        const systemInstruction = "Anda adalah Direktur Seni (Art Director) YouTube visual yang jenius.";
        const prompt = `Berikan 3 ide visual yang sangat berbeda (misal: konsep thumbnail, shot B-roll, atau overlay grafis) yang sejalan dengan topik "${globalTopic}" untuk tahap: ${section.title}. Parameter yang dipilih: ${JSON.stringify(sectionData[section.id].params)}.
[KONTEKS SALURAN TAMBAHAN]:
- Bahasa Output: ${outputLanguage}
- Gaya Bahasa Visual: ${visualStyle}
- Panjang Skrip Target: ${skripLength}

PENTING: Jangan memberikan ide visual yang klise, biasa, atau berulang. Hasilkan 3 ide visual yang sangat kreatif, unik, out-of-the-box, menarik perhatian, dan orisinal! (Variasi Kreatif #${Math.floor(Math.random() * 1000000)})`;

        const text = await callPollinationsAI(prompt, systemInstruction, selectedModel);

        if (text) {
            setSectionData(prev => ({
                ...prev,
                [section.id]: { ...prev[section.id], visualLoading: false, visualResult: text }
            }));
        } else {
             throw new Error("No text response");
        }
    } catch (error) {
        console.error(error);
        setSectionData(prev => ({
            ...prev,
            [section.id]: { ...prev[section.id], visualLoading: false, visualResult: "Gagal memuat ide visual. Coba lagi nanti." }
        }));
    }
  };

  const suggestTopicAI = async () => {
    try {
        setTopic("Menggali ide dari AI...");
        const prompt = `Berikan 1 ide niche/topik channel YouTube berbahasa Indonesia yang sedang tren saat ini, tapi belum terlalu jenuh. Contoh format: 'Review Gadget Unik', 'Jelajah Kuliner Pedas'. Hanya berikan nama topiknya saja, maksimal 5-6 kata, tanpa penjelasan apa-apa.
PENTING: Berikan ide niche/topik yang sangat unik, tidak biasa, jarang terpikirkan, namun memiliki potensi audiens yang tinggi. Hindari niche mainstream konvensional seperti review gadget biasa, gaming standar, vlog harian biasa, atau tutorial pemrograman dasar. Cari ide-ide yang inovatif dan segar! (Ide #${Math.floor(Math.random() * 1000000)})`;
        const text = await callPollinationsAI(prompt, undefined, selectedModel);
        setTopic(text.trim().replace(/^['"]|['"]$/g, ''));
    } catch (error) {
        setTopic("");
        showToast("Gagal mendapatkan ide topik.");
    }
  };

  const showToast = (message) => {
    setToastMessage(message);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const saveGlobalTopic = () => {
    if (!topic.trim()) {
      showToast("Silakan ketikkan topik channel Anda terlebih dahulu!");
      return;
    }
    setGlobalTopic(topic.trim());
    showToast(`Topik "${topic.trim()}" berhasil ditetapkan untuk 10 alat AI!`);
  };

  const copyToClipboard = async (text, stepId) => {
      try {
          await navigator.clipboard.writeText(text);
          showToast(`Hasil Analisis Aturan ${stepId} berhasil disalin!`);
      } catch (err) {
          showToast("Terjadi kesalahan saat menyalin.");
      }
  };

  const toggleSection = (sectionId) => {
    setOpenSectionId(prev => prev === sectionId ? null : sectionId);
  };

  const toggleCheck = (stepId, e) => {
    e.stopPropagation();
    setCheckedSteps(prev => {
        const isCurrentlyChecked = prev[stepId];
        if (!isCurrentlyChecked) {
            showToast(`Aturan ${stepId} diselesaikan dengan sukses!`);
        }
        return { ...prev, [stepId]: !isCurrentlyChecked };
    });
  };

  const toggleAutopilot = async () => {
    if (isAutopilotRunning) {
        autopilotRef.current = false;
        setIsAutopilotRunning(false);
        showToast("Autopilot dihentikan.");
        return;
    }

    if (!globalTopic) {
      showToast("Kesalahan: Tulis Topik Utama Channel Anda di kolom atas dahulu dan klik Set Topik Utama!");
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }

    const confirmed = window.confirm("Jalankan Autopilot? AI akan memproses semua langkah yang belum selesai secara otomatis.");
    if (!confirmed) return;

    setIsAutopilotRunning(true);
    autopilotRef.current = true;

    for (const section of SECTIONS) {
       if (!autopilotRef.current) break;
       
       const currentResult = sectionDataRef.current[section.id]?.result;
       if (currentResult && !currentResult.includes("Gagal memuat")) {
           continue; // Skip if already successfully generated
       }

       // Automatically open the section so the user can see progress
       setOpenSectionId(section.id);
       
       // Scroll to the element slightly before running
       setTimeout(() => {
           const element = document.getElementById(`section-${section.id}`);
           if (element) {
               element.scrollIntoView({ behavior: "smooth", block: "center" });
           }
       }, 100);

       const success = await runAI(section);
       
       if (success && autopilotRef.current) {
           // Optionally, auto-check the step to increment progress
           setCheckedSteps(prev => {
               if (!prev[section.id]) {
                   return { ...prev, [section.id]: true };
               }
               return prev;
           });
       }
       
       // Delay before the next AI call to prevent rate limiting
       await new Promise(r => setTimeout(r, 2000));
    }
    
    if (autopilotRef.current) {
        setIsAutopilotRunning(false);
        autopilotRef.current = false;
        showToast("Autopilot selesai! Seluruh langkah telah diproses.");
    }
  };

  const runAI = async (section) => {
    if (!globalTopic) {
      showToast("Kesalahan: Tulis Topik Utama Channel Anda di kolom atas dahulu dan klik Set Topik Utama!");
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return false;
    }

    setSectionData(prev => ({
        ...prev,
        [section.id]: { ...prev[section.id], loading: true, result: null }
    }));

    try {
        const systemInstruction = "Anda adalah Ahli Algoritma YouTube kelas dunia. Berikan saran taktis, langkah nyata, draf naskah konkret yang siap digunakan. Gunakan Bahasa Indonesia yang segar, kasual, bertenaga, dan sangat aplikatif. Format langsung aksi nyatanya dalam list poin yang rapi.";
        const prompt = section.getPrompt(globalTopic, sectionDataRef.current[section.id].params) + `
[KONTEKS SALURAN TAMBAHAN]:
- Bahasa Output: ${outputLanguage}
- Gaya Bahasa Visual: ${visualStyle}
- Panjang Skrip Target: ${skripLength}

PENTING: Analisis ini harus dirancang dari awal dengan pendekatan yang sangat tajam, taktis, segar, mendalam, dan memiliki nilai guna yang tinggi bagi kreator. Berikan draf ide/naskah konkret yang unik, tidak membosankan, kreatif, dan sepenuhnya berbeda dari materi umum standar! (Variasi Unik #${Math.floor(Math.random() * 1000000)})`;

        const text = await callPollinationsAI(prompt, systemInstruction, selectedModel);

        if (text) {
            setSectionData(prev => ({
                ...prev,
                [section.id]: { ...prev[section.id], loading: false, result: text }
            }));
            showToast(`Strategi Aturan ${section.id} Berhasil Diproses!`);
            return true;
        } else {
             throw new Error("No text response");
        }
    } catch (error) {
        console.error(error);
        setSectionData(prev => ({
            ...prev,
            [section.id]: { ...prev[section.id], loading: false, result: "Gagal memuat strategi konten. Pastikan Token API Pollinations disetel di env (sebagai VITE_GEMINI_API_KEY atau VITE_POLLINATIONS_API_KEY). Silakan cek console atau coba lagi." }
        }));
        return false;
    }
  };



  const completedCount = Object.values(checkedSteps).filter(Boolean).length;
  const progressPercentage = (completedCount / 10) * 100;

  const [progressHistory, setProgressHistory] = useState([{ time: new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit', second:'2-digit'}), completed: 0 }]);

  useEffect(() => {
    setProgressHistory(prev => {
      const lastCompleted = prev[prev.length - 1]?.completed;
      if (lastCompleted !== completedCount) {
        return [...prev, { time: new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit', second:'2-digit'}), completed: completedCount }];
      }
      return prev;
    });
  }, [completedCount]);

  useEffect(() => {
    const handleOutsideClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (!target.closest('.model-dropdown-container')) {
        setIsModelDropdownOpen(false);
      }
      if (!target.closest('.user-dropdown-container')) {
        setIsUserDropdownOpen(false);
      }
    };
    document.addEventListener('click', handleOutsideClick);
    return () => document.removeEventListener('click', handleOutsideClick);
  }, []);

  const barChartData = [
    { name: 'Total Langkah', Selesai: completedCount, Sisa: 10 - completedCount }
  ];

  let filteredSections = [...SECTIONS];
  if (filterCategory !== 'Semua') {
      filteredSections = filteredSections.filter(s => s.category === filterCategory);
  }
  filteredSections.sort((a, b) => {
      if (sortBy === 'id_asc') return a.id - b.id;
      if (sortBy === 'id_desc') return b.id - a.id;
      const aChecked = checkedSteps[a.id] ? 1 : 0;
      const bChecked = checkedSteps[b.id] ? 1 : 0;
      if (sortBy === 'incomplete_first') return aChecked - bChecked || a.id - b.id;
      if (sortBy === 'complete_first') return bChecked - aChecked || a.id - b.id;
      return 0;
  });

  if (loadingAuth) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
         <div className="w-10 h-10 border-4 border-zinc-800 border-t-red-600 rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!userData) {
    return <LandingPage onLoginSuccess={() => {
      initAuth(
        async (user, token) => {
          setUserData(user);
        }
      );
    }} />;
  }

  return (
    <div className="min-h-screen pb-20 relative bg-[#09090b] text-white">
      {/* Sticky Navbar with Model Selector & User Avatar */}
      <nav className="sticky top-0 z-40 bg-zinc-950/80 backdrop-blur-md border-b border-zinc-800/80 py-3.5 px-6 flex items-center justify-between shadow-lg">
        {/* Left: Branding Logo */}
        <div className="flex items-center gap-3">
          <div className="bg-red-600 w-9 h-9 rounded-xl flex items-center justify-center shadow-lg shadow-red-500/20 active:scale-95 transition-transform duration-200">
            <Brain className="w-5 h-5 text-white animate-pulse" />
          </div>
          <div>
            <span className="font-black text-sm tracking-widest text-white block uppercase">AUTOPILOT AI</span>
            <span className="text-[10px] text-red-500 font-bold uppercase tracking-wider block -mt-1">COMMANDER</span>
          </div>
        </div>

        {/* Right: Dynamic Model Selector & User Dropdown */}
        <div className="flex items-center gap-4">
          {/* Dynamic Model Dropdown */}
          <div className="relative model-dropdown-container">
            <button
              onClick={() => {
                setIsModelDropdownOpen(!isModelDropdownOpen);
                setIsUserDropdownOpen(false);
              }}
              className="flex items-center gap-1.5 bg-zinc-900/90 border border-zinc-800/80 rounded-xl px-3 py-2 text-xs font-semibold text-zinc-300 hover:text-white transition-all cursor-pointer outline-none focus:outline-none"
            >
              <Cpu className="w-3.5 h-3.5 text-red-500 animate-pulse" />
              <span className="max-w-[120px] truncate uppercase">{selectedModel}</span>
              <ChevronDown className="w-3.5 h-3.5 text-zinc-500" />
            </button>
            
            {isModelDropdownOpen && (
              <>
                <div 
                  className="fixed inset-0 z-40 bg-transparent cursor-default" 
                  onClick={() => setIsModelDropdownOpen(false)}
                />
                <div className="absolute right-0 mt-2 w-56 bg-zinc-900 border border-zinc-800 rounded-xl shadow-2xl z-50 py-1.5 overflow-hidden animate-in fade-in slide-in-from-top-1 duration-150">
                  <div className="px-3.5 py-1.5 border-b border-zinc-800/60 mb-1">
                    <span className="text-[10px] font-black uppercase text-zinc-500 tracking-wider">Pilih Model AI Teks</span>
                  </div>
                  
                  <div className="max-h-[260px] overflow-y-auto [&::-webkit-scrollbar]:w-1 [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:bg-zinc-800 [&::-webkit-scrollbar-thumb]:rounded-full">
                    {models.length > 0 ? (
                      models.map((modelName) => (
                        <button
                          key={modelName}
                          onClick={() => {
                            setSelectedModel(modelName);
                            setIsModelDropdownOpen(false);
                          }}
                          className={`w-full text-left px-3.5 py-2 text-xs font-medium transition-colors hover:bg-zinc-800 flex items-center justify-between ${selectedModel === modelName ? 'text-red-500 bg-red-500/5' : 'text-zinc-300'}`}
                        >
                          <span className="truncate uppercase">{modelName}</span>
                          {selectedModel === modelName && <span className="w-1.5 h-1.5 rounded-full bg-red-500"></span>}
                        </button>
                      ))
                    ) : (
                      ['openai', 'mistral', 'qwen', 'llama'].map((modelName) => (
                        <button
                          key={modelName}
                          onClick={() => {
                            setSelectedModel(modelName);
                            setIsModelDropdownOpen(false);
                          }}
                          className={`w-full text-left px-3.5 py-2 text-xs font-medium transition-colors hover:bg-zinc-800 flex items-center justify-between ${selectedModel === modelName ? 'text-red-500 bg-red-500/5' : 'text-zinc-300'}`}
                        >
                          <span className="truncate uppercase">{modelName}</span>
                          {selectedModel === modelName && <span className="w-1.5 h-1.5 rounded-full bg-red-500"></span>}
                        </button>
                      ))
                    )}
                  </div>
                </div>
              </>
            )}
          </div>

          {/* User Avatar + Dropdown */}
          <div className="relative user-dropdown-container">
            <button
              onClick={() => {
                setIsUserDropdownOpen(!isUserDropdownOpen);
                setIsModelDropdownOpen(false);
              }}
              className="flex items-center gap-2 bg-zinc-900/90 border border-zinc-800/80 rounded-xl p-1.5 pr-3 hover:border-zinc-700 transition-all cursor-pointer outline-none focus:outline-none"
            >
              <img
                src={userData.picture || `https://api.dicebear.com/7.x/bottts/svg?seed=${userData.email}`}
                alt="Avatar"
                className="w-7 h-7 rounded-lg object-cover ring-1 ring-zinc-700/60"
              />
              <div className="hidden md:flex flex-col text-left">
                <span className="text-xs font-bold text-white truncate max-w-[100px]">{userData.name || 'Creator'}</span>
                <span className="text-[9px] text-zinc-500 font-semibold truncate max-w-[100px]">{userData.email}</span>
              </div>
              <ChevronDown className="w-3.5 h-3.5 text-zinc-500" />
            </button>
            
            {isUserDropdownOpen && (
              <>
                <div 
                  className="fixed inset-0 z-40 bg-transparent cursor-default" 
                  onClick={() => setIsUserDropdownOpen(false)}
                />
                <div className="absolute right-0 mt-2 w-64 bg-zinc-900 border border-zinc-800 rounded-xl shadow-2xl z-50 py-1.5 overflow-hidden animate-in fade-in slide-in-from-top-1 duration-150">
                  <div className="px-4 py-2 border-b border-zinc-800/60 mb-1 flex items-center gap-3">
                    <img
                      src={userData.picture || `https://api.dicebear.com/7.x/bottts/svg?seed=${userData.email}`}
                      alt="Avatar"
                      className="w-9 h-9 rounded-lg object-cover ring-1 ring-zinc-700/60"
                    />
                    <div className="flex flex-col text-left overflow-hidden">
                      <span className="text-xs font-black text-white truncate">{userData.name || 'Creator'}</span>
                      <span className="text-[10px] text-zinc-400 font-bold truncate">{userData.email}</span>
                      {userData.role?.toLowerCase() === 'admin' ? (
                        <span className="inline-flex items-center gap-1 mt-0.5 px-1.5 py-0.5 rounded bg-orange-500/10 border border-orange-500/25 text-orange-500 text-[8px] font-black uppercase tracking-wider w-max">
                          <ShieldAlert className="w-2 h-2" /> Administrator
                        </span>
                      ) : (
                        (() => {
                          const isLifetime = !userData.expires_at || userData.expires_at.startsWith('9999');
                          if (isLifetime) {
                            return (
                              <span className="inline-flex items-center gap-1 mt-0.5 px-1.5 py-0.5 rounded bg-purple-500/10 border border-purple-500/25 text-purple-400 text-[8px] font-black uppercase tracking-wider w-max">
                                Lifetime Access
                              </span>
                            );
                          } else {
                            const dateStr = new Date(userData.expires_at).toLocaleDateString('id-ID', { year: 'numeric', month: 'short', day: 'numeric' });
                            return (
                              <span className="inline-flex items-center gap-1 mt-0.5 px-1.5 py-0.5 rounded bg-emerald-500/10 border border-emerald-500/25 text-emerald-400 text-[8px] font-black uppercase tracking-wider w-max">
                                Aktif s.d. {dateStr}
                              </span>
                            );
                          }
                        })()
                      )}
                    </div>
                  </div>

                  {userData.role?.toLowerCase() === 'admin' && (
                    <button
                      onClick={() => {
                        setIsAdminOpen(true);
                        setIsUserDropdownOpen(false);
                      }}
                      className="w-full text-left px-4 py-2 text-xs font-semibold text-zinc-300 hover:text-white transition-colors hover:bg-zinc-800 flex items-center gap-2"
                    >
                      <ShieldAlert className="w-4 h-4 text-orange-500" />
                      Panel Admin
                    </button>
                  )}

                  <button
                    onClick={() => {
                      logout();
                      window.location.reload();
                    }}
                    className="w-full text-left px-4 py-2.5 text-xs font-bold text-red-500 hover:text-red-400 transition-colors hover:bg-zinc-800 flex items-center gap-2 border-t border-zinc-800/60 mt-1"
                  >
                    <LogOut className="w-4 h-4" />
                    Keluar Sesi
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      </nav>

      {/* Admin Panel Modal Overlay */}
      {isAdminOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/95 transition-all duration-300">
          <div className="bg-zinc-950 border border-zinc-800/80 rounded-2xl w-full max-w-4xl max-h-[90vh] flex flex-col shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            <div className="p-5 border-b border-zinc-800/80 flex justify-between items-center bg-zinc-900/50">
              <div className="flex items-center gap-2">
                <ShieldAlert className="w-5 h-5 text-orange-500 animate-pulse" />
                <h2 className="font-black text-sm tracking-wider text-white uppercase">Panel Admin YouTube Kreator</h2>
              </div>
              <button 
                onClick={() => setIsAdminOpen(false)} 
                className="text-zinc-400 hover:text-white text-xs bg-zinc-900 border border-zinc-800 w-8 h-8 rounded-full flex items-center justify-center transition-all hover:bg-zinc-800"
              >
                ✕
              </button>
            </div>
            <div className="p-6 overflow-y-auto bg-[#09090b]">
              <AdminPanel />
            </div>
            <div className="p-4 border-t border-zinc-800/80 bg-zinc-900/30 text-right">
              <button 
                onClick={() => setIsAdminOpen(false)} 
                className="bg-zinc-800 hover:bg-zinc-700 text-zinc-300 hover:text-white font-bold text-xs px-5 py-2.5 rounded-xl transition-all shadow-lg active:scale-95"
              >
                Tutup Panel Admin
              </button>
            </div>
          </div>
        </div>
      )}

      <div className={`fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 transition-opacity duration-300 ${isModalOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
        <div className={`bg-zinc-900 border border-zinc-800 rounded-2xl w-full max-w-2xl max-h-[85vh] flex flex-col shadow-2xl transition-transform duration-300 overflow-hidden ${isModalOpen ? 'scale-100' : 'scale-95'}`}>
          <div className="p-5 border-b border-zinc-800 flex justify-between items-center bg-zinc-950">
            <div className="flex items-center gap-2 text-red-500">
              <svg className="w-5 h-5 animate-pulse" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd"></path></svg>
              <h2 className="font-bold text-sm sm:text-base tracking-wide text-white uppercase">Panduan Autopilot AI Commander</h2>
            </div>
            <button onClick={() => setIsModalOpen(false)} className="text-zinc-400 hover:text-white text-sm bg-zinc-900 border border-zinc-800 w-8 h-8 rounded-full flex items-center justify-center transition-all">✕</button>
          </div>
          <div className="p-6 overflow-y-auto space-y-6 text-sm text-zinc-300 leading-relaxed">
             <p>
                Gunakan <strong className="text-white">Autopilot AI Commander</strong> ini dengan sederhana agar Anda bisa langsung menggunakannya untuk melejitkan channel Anda!
            </p>
            <p className="bg-red-950/20 border border-red-900/40 rounded-xl p-3 text-xs sm:text-sm text-zinc-400">
                Secara singkat, aplikasi ini adalah <strong className="text-red-400 font-bold">lembar kerja interaktif autopilot</strong> yang menggabungkan 10 aturan sukses dari gambar yang Anda unggah dengan kecerdasan buatan (AI) Gemini & Pollinations secara real-time.
            </p>
            <h3 className="font-black text-white uppercase tracking-wider text-xs text-red-500">Berikut adalah panduan langkah demi langkah cara menggunakannya:</h3>
            
            <div className="flex gap-4 items-start bg-zinc-950/50 p-4 rounded-xl border border-zinc-800">
                <div className="bg-red-600 text-white font-bold text-xs px-2.5 py-1 rounded-lg shrink-0">1</div>
                <div className="space-y-1">
                    <h4 className="font-bold text-white text-xs sm:text-sm">Masukkan Topik & Set Parameter Konteks</h4>
                    <p className="text-xs text-zinc-400">Tentukan topik utama channel Anda di kolom header, lalu sesuaikan Bahasa Output AI, Estetika Visual, dan Panjang Skrip Target pada card Parameter Konteks Saluran.</p>
                </div>
            </div>
            <div className="flex gap-4 items-start bg-zinc-950/50 p-4 rounded-xl border border-zinc-800">
                <div className="bg-red-600 text-white font-bold text-xs px-2.5 py-1 rounded-lg shrink-0">2</div>
                <div className="space-y-1">
                    <h4 className="font-bold text-white text-xs sm:text-sm">Pilih Model AI Secara Dinamis</h4>
                    <p className="text-xs text-zinc-400">Di sudut kanan atas navigasi, klik model dropdown untuk memilih secara dinamis model AI teks (seperti OpenAI, Mistral, Qwen, dll.) yang dimuat real-time dari endpoint resmi Pollinations AI.</p>
                </div>
            </div>
            <div className="flex gap-4 items-start bg-zinc-950/50 p-4 rounded-xl border border-zinc-800">
                <div className="bg-red-600 text-white font-bold text-xs px-2.5 py-1 rounded-lg shrink-0">3</div>
                <div className="space-y-1">
                    <h4 className="font-bold text-white text-xs sm:text-sm">Jalankan Autopilot atau Modular AI</h4>
                    <p className="text-xs text-zinc-400">Klik "Jalankan Analisis AI" pada setiap 10 aturan emas untuk memproses strategi dan naskah secara khusus, atau klik "Jalankan Autopilot" di bagian atas untuk memproses semua 10 langkah emas secara otomatis berurutan!</p>
                </div>
            </div>
            <div className="flex gap-4 items-start bg-zinc-950/50 p-4 rounded-xl border border-zinc-800">
                <div className="bg-red-600 text-white font-bold text-xs px-2.5 py-1 rounded-lg shrink-0">4</div>
                <div className="space-y-1">
                    <h4 className="font-bold text-white text-xs sm:text-sm">Unduh Panduan Lengkap</h4>
                    <p className="text-xs text-zinc-400">Setelah semua langkah selesai atau diproses, klik tombol "Unduh Panduan" untuk mengekspor draf komprehensif Anda dalam format Markdown (.md) yang rapi.</p>
                </div>
            </div>
          </div>
          <div className="p-4 border-t border-zinc-800 bg-zinc-950 text-right">
             <button onClick={() => setIsModalOpen(false)} className="bg-red-600 hover:bg-red-700 text-white font-bold text-xs px-5 py-2.5 rounded-xl transition-all shadow-lg active:scale-95">Mulai Sesi Creator</button>
          </div>
        </div>
      </div>

      <button onClick={() => setIsModalOpen(true)} className="fixed bottom-5 right-5 z-40 bg-zinc-900 border border-zinc-700 hover:border-red-500 text-white w-12 h-12 rounded-full shadow-2xl flex items-center justify-center font-bold text-lg transition-all active:scale-90 group">
          <span className="group-hover:scale-110 transition-transform text-red-500 font-bold">?</span>
      </button>

      <header className="relative overflow-hidden bg-gradient-to-b from-red-950/30 via-zinc-900 to-[#09090b] py-12 px-4 border-b border-zinc-800/80">
        <div className="absolute top-0 left-0 w-36 h-full bg-red-600/10 blur-3xl lightning-bg"></div>
        <div className="absolute top-0 right-0 w-36 h-full bg-red-600/10 blur-3xl lightning-bg" style={{ animationDelay: '2.5s' }}></div>
        <div className="max-w-4xl mx-auto text-center relative z-10">
          <div className="inline-flex items-center gap-3 mb-5">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-red-500/10 border border-red-500/20 text-red-500 text-xs font-bold tracking-wider uppercase">
                  <span className="w-2 h-2 rounded-full bg-red-500 animate-ping"></span>
                  10 Alat AI Terintegrasi
              </div>
              <button onClick={() => setIsModalOpen(true)} className="text-zinc-400 hover:text-white bg-zinc-900 border border-zinc-800 rounded-full px-3 py-1 text-xs font-medium transition-all flex items-center gap-1.5">
                  <BookOpen className="w-4 h-4" /> Panduan & Cara Kerja
              </button>
          </div>
          <h1 className="text-4xl md:text-6xl impact-font uppercase tracking-tight text-white leading-none">
              AUTOPILOT <span className="text-red-600 drop-shadow-[0_0_15px_rgba(239,68,68,0.5)]">AI COMMANDER</span>
          </h1>
          <h2 className="text-lg md:text-xl text-zinc-400 font-semibold mt-2">
              Asisten yang Bantu Tembus 100K Subscribers Pertama Anda
          </h2>
          <p className="text-zinc-500 mt-3 max-w-xl mx-auto text-xs sm:text-sm">
              Isi topik utama channel Anda di bawah ini, lalu klik salah satu dari 10 langkah emas untuk memproses strategi video, naskah, thumbnail, dan jadwal dengan AI secara khusus!
          </p>

          <div className="mt-8 bg-zinc-900/90 border border-zinc-800 rounded-2xl p-5 max-w-2xl mx-auto shadow-2xl relative">
              <div className="absolute -top-3 left-6 px-3 py-0.5 bg-red-600 text-[10px] font-black uppercase rounded text-white tracking-widest">
                  Langkah Awal
              </div>
              <div className="flex flex-col sm:flex-row justify-between sm:items-center mb-3 sm:mb-2 gap-2 sm:gap-0">
                <label className="block text-left text-xs font-bold text-zinc-300 uppercase mt-2 sm:mt-0">Apa Topik atau Niche Channel Anda?</label>
                <div className="flex flex-wrap items-center gap-2">
                    <button onClick={toggleAutopilot} className={`text-[10px] font-bold flex items-center gap-1 transition-all px-2 py-1 rounded border border-transparent hover:border-current ${isAutopilotRunning ? 'bg-red-500/10 text-red-500 hover:text-red-400' : 'bg-blue-500/10 text-blue-500 hover:text-blue-400'}`}>
                      {isAutopilotRunning ? (
                          <><div className="w-2 h-2 rounded-full bg-red-500 animate-pulse"></div> HENTIKAN AUTOPILOT</>
                      ) : (
                          <><Sparkles className="w-3 h-3" /> JALANKAN AUTOPILOT</>
                      )}
                    </button>
                    <button onClick={exportAllToMarkdown} className="text-green-500/80 hover:text-green-400 text-[10px] font-bold flex items-center gap-1 transition-all bg-green-500/10 px-2 py-1 rounded">
                      <Download className="w-3 h-3" />
                      UNDUH PANDUAN
                    </button>
                    <button onClick={resetAll} className="text-zinc-500 hover:text-red-500 text-[10px] font-semibold flex items-center gap-1 transition-all py-1 px-1">
                      <RotateCcw className="w-3 h-3" />
                      RESET
                    </button>
                </div>
              </div>
              <div className="flex flex-col sm:flex-row gap-2">
                  <button onClick={suggestTopicAI} disabled={topic === 'Menggali ide dari AI...'} className="bg-zinc-800 hover:bg-zinc-700 text-yellow-500/90 font-bold text-xs px-4 py-3 rounded-xl transition-all shadow-lg active:scale-95 shrink-0 flex items-center justify-center gap-2">
                    {topic === 'Menggali ide dari AI...' ? <Loader2 className="w-4 h-4 animate-spin text-yellow-500" /> : <Sparkles className="w-4 h-4" />}
                    <span className="hidden sm:inline">Temukan Ide Niche</span>
                  </button>
                  <input 
                    type="text" 
                    value={topic}
                    onChange={(e) => setTopic(e.target.value)}
                    placeholder="Contoh: Street Food Nusantara, Review Gadget Pemula..." 
                    className={`bg-zinc-950 border ${isTopicUnsaved ? 'border-yellow-500/50 focus:ring-yellow-500' : 'border-zinc-800 focus:ring-red-500'} rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:ring-2 focus:border-transparent flex-1 placeholder:text-zinc-600`} 
                  />
                  <button onClick={saveGlobalTopic} className={`bg-red-600 hover:bg-red-700 text-white font-bold text-xs sm:text-sm px-6 py-3 rounded-xl transition-all shadow-lg active:scale-95 shrink-0 flex items-center justify-center gap-2 ${isTopicUnsaved ? 'ring-2 ring-yellow-500/50 ring-offset-2 ring-offset-zinc-900' : ''}`}>
                    {isTopicUnsaved && <Loader2 className="w-4 h-4 animate-spin text-yellow-500" />}
                    {globalTopic && isTopicUnsaved ? 'Perbarui Topik' : 'Set Topik Utama'}
                  </button>
              </div>

              {/* Parameter Konteks Saluran */}
              <div className="mt-5 border-t border-zinc-800/80 pt-4 text-left">
                <span className="text-[10px] font-black uppercase text-red-500 tracking-widest block mb-3">⚙️ PARAMETER KONTEKS SALURAN (DIVERSIFIKASI PRODUKSI)</span>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  <div>
                    <label className="block text-[10px] font-bold text-zinc-400 uppercase mb-1">Bahasa Output AI</label>
                    <select
                      value={outputLanguage}
                      onChange={(e) => setOutputLanguage(e.target.value)}
                      className="w-full bg-zinc-950/80 border border-zinc-800 text-xs text-white rounded-xl p-2.5 focus:ring-1 focus:ring-red-500 outline-none transition-all cursor-pointer"
                    >
                      <option value="Bahasa Indonesia (Santai/Gaul)">Bahasa Indonesia (Santai/Gaul)</option>
                      <option value="Bahasa Indonesia (Formal/Edukasi)">Bahasa Indonesia (Formal/Edukasi)</option>
                      <option value="Bahasa Inggris (Global/Internasional)">Bahasa Inggris (Global/Internasional)</option>
                      <option value="Bilingual (Campuran Indonesia-Inggris)">Bilingual (Campuran Indonesia-Inggris)</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-zinc-400 uppercase mb-1">Gaya & Estetika Visual</label>
                    <select
                      value={visualStyle}
                      onChange={(e) => setVisualStyle(e.target.value)}
                      className="w-full bg-zinc-950/80 border border-zinc-800 text-xs text-white rounded-xl p-2.5 focus:ring-1 focus:ring-red-500 outline-none transition-all cursor-pointer"
                    >
                      <option value="B-Roll Cepat & Dinamis">B-Roll Cepat & Dinamis</option>
                      <option value="Sinematik Lambat & Estetis">Sinematik Lambat & Estetis</option>
                      <option value="Minimalis & Grafis Bergerak">Minimalis & Grafis Bergerak</option>
                      <option value="Kamera Wajah Langsung (Talking Head)">Talking Head (Kamera Wajah)</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-zinc-400 uppercase mb-1">Panjang Skrip Target</label>
                    <select
                      value={skripLength}
                      onChange={(e) => setSkripLength(e.target.value)}
                      className="w-full bg-zinc-950/80 border border-zinc-800 text-xs text-white rounded-xl p-2.5 focus:ring-1 focus:ring-red-500 outline-none transition-all cursor-pointer"
                    >
                      <option value="Skrip Sangat Singkat (YouTube Shorts/Reels, &lt;1 Menit)">YouTube Shorts (&lt; 1 Menit)</option>
                      <option value="Skrip Pendek & Padat (3-5 Menit)">Skrip Pendek (3-5 Menit)</option>
                      <option value="Skrip Sedang (8-12 Menit)">Skrip Sedang (8-12 Menit)</option>
                      <option value="Skrip Mendalam / Video Essay (&gt;15 Menit)">Video Essay (&gt; 15 Menit)</option>
                    </select>
                  </div>
                </div>
              </div>

              {isTopicUnsaved && globalTopic && (
                <div className="mt-3 text-left flex items-start flex-col sm:flex-row gap-2 text-yellow-500 bg-yellow-500/10 p-3 rounded-xl border border-yellow-500/20">
                  <div className="flex items-center gap-2 shrink-0">
                    <BrainCircuit className="w-5 h-5 animate-pulse" />
                    <span className="font-bold text-xs uppercase tracking-wider">Perhatian!</span>
                  </div>
                  <p className="text-xs leading-relaxed">
                    Anda baru saja merubah topik tapi belum menyimpannya. Sistem AI di bawah masih menggunakan topik yang lama: <span className="text-white italic">"{globalTopic}"</span>. Klik tombol <strong className="text-white">Perbarui Topik</strong> di atas untuk menerapkan.
                  </p>
                </div>
              )}
              {globalTopic && !isTopicUnsaved && (
                <div className="mt-3 text-left flex items-center gap-2 text-green-500 bg-green-500/10 p-2.5 rounded-lg border border-green-500/20">
                   <svg className="w-4 h-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"/></svg>
                   <p className="text-xs">Topik tersimpan saat ini: <strong className="text-white">"{globalTopic}"</strong>. Semua sistem AI siap bekerja.</p>
                </div>
              )}
          </div>

          <div className="mt-4 bg-zinc-900/40 border border-zinc-800/60 rounded-xl p-4 max-w-2xl mx-auto flex flex-col gap-4">
              <div>
                  <div className="flex justify-between items-center mb-1 text-xs">
                      <span className="text-zinc-400 font-medium">Progres Pelaksanaan & Implementasi Anda:</span>
                      <span className="text-red-500 font-bold">{progressPercentage.toFixed(0)}% Selesai</span>
                  </div>
                  <div className="w-full bg-zinc-950 rounded-full h-2 overflow-hidden border border-zinc-850">
                      <div className="bg-gradient-to-r from-red-800 to-red-600 h-full transition-all duration-500 ease-out" style={{ width: `${progressPercentage}%` }}></div>
                  </div>
              </div>
              
              <div className="flex justify-end pt-3 border-t border-zinc-800/50">
                <button onClick={logout} className="text-zinc-500 hover:text-red-500 text-[10px] uppercase font-bold underline">Logout</button>
              </div>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 mt-8 space-y-6">

        {/* Bedah Video Kompetitor Card */}
        <CompetitorAnalyzer 
          selectedModel={selectedModel}
          callPollinationsAI={callPollinationsAI}
          showToast={showToast}
          getAccessToken={getAccessToken}
          formatMarkdown={formatMarkdown}
        />

        {/* Bedah Visual & Thumbnail Card */}
        <VisualDissector 
          globalTopic={globalTopic}
          callPollinationsAI={callPollinationsAI}
          showToast={showToast}
          formatMarkdown={formatMarkdown}
        />

        {/* YouTube Title & CTR A/B Test Simulator Card */}
        <TitleSimulator 
          globalTopic={globalTopic}
          selectedModel={selectedModel}
          callPollinationsAI={callPollinationsAI}
          showToast={showToast}
          userData={userData}
        />

        {/* Image Generator Card */}
        <ImageGenerator 
          globalTopic={globalTopic}
          selectedModel={selectedModel}
          callPollinationsAI={callPollinationsAI}
          callPollinationsImage={callPollinationsImage}
          callPollinationsVideo={callPollinationsVideo}
          showToast={showToast}
        />

        {/* Charts Dashboard */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="bg-zinc-900/40 border border-zinc-800 rounded-2xl p-4 shadow-xl h-64 flex flex-col">
                <h3 className="text-xs font-bold text-zinc-400 uppercase tracking-wider mb-2 shrink-0">Persentase Selesai</h3>
                <div className="flex-1 min-h-0">
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={barChartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#27272a" vertical={false} />
                            <XAxis dataKey="name" stroke="#a1a1aa" fontSize={10} tickLine={false} axisLine={false} />
                            <YAxis stroke="#a1a1aa" fontSize={10} tickLine={false} axisLine={false} domain={[0, 10]} />
                            <RechartsTooltip cursor={{fill: '#27272a', opacity: 0.4}} contentStyle={{backgroundColor: '#18181b', borderColor: '#27272a', borderRadius: '12px', fontSize: '12px', color: '#fff'}} />
                            <Bar dataKey="Selesai" stackId="a" fill="#ef4444" radius={[0, 0, 4, 4]} />
                            <Bar dataKey="Sisa" stackId="a" fill="#3f3f46" radius={[4, 4, 0, 0]} />
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </div>
            
            <div className="bg-zinc-900/40 border border-zinc-800 rounded-2xl p-4 shadow-xl h-64 flex flex-col">
                <h3 className="text-xs font-bold text-zinc-400 uppercase tracking-wider mb-2 shrink-0">Tren Progres</h3>
                <div className="flex-1 min-h-0">
                    <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={progressHistory} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#27272a" vertical={false} />
                            <XAxis dataKey="time" stroke="#a1a1aa" fontSize={10} tickLine={false} axisLine={false} />
                            <YAxis stroke="#a1a1aa" fontSize={10} tickLine={false} axisLine={false} domain={[0, 10]} />
                            <RechartsTooltip contentStyle={{backgroundColor: '#18181b', borderColor: '#27272a', borderRadius: '12px', fontSize: '12px', color: '#fff'}} />
                            <Line type="monotone" dataKey="completed" name="Langkah Selesai" stroke="#ef4444" strokeWidth={3} dot={{ fill: '#ef4444', strokeWidth: 2 }} activeDot={{ r: 6 }} />
                        </LineChart>
                    </ResponsiveContainer>
                </div>
            </div>
        </div>

        <div className="flex flex-col sm:flex-row justify-between items-center bg-zinc-900/40 border border-zinc-800 rounded-2xl p-4 gap-4 shadow-xl">
            <div className="flex items-center gap-2 w-full sm:w-auto flex-1">
                <Filter className="w-4 h-4 text-zinc-400 shrink-0" />
                <select value={filterCategory} onChange={e => setFilterCategory(e.target.value)} className="w-full bg-zinc-950 border border-zinc-800 text-xs text-white rounded-lg p-2 focus:ring-1 focus:ring-red-500 outline-none">
                    <option value="Semua">Semua Kategori</option>
                    <option value="Konten / Niche">Konten / Niche</option>
                    <option value="Skrip & Hook">Skrip & Hook</option>
                    <option value="Visual & Thumbnail">Visual & Thumbnail</option>
                    <option value="Sistem & Jadwal">Sistem & Jadwal</option>
                    <option value="Mindset">Mindset</option>
                </select>
            </div>
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 w-full sm:w-auto flex-1">
                <ArrowUpDown className="w-4 h-4 text-zinc-400 shrink-0 hidden sm:block" />
                <span className="text-xs text-zinc-400 font-bold block sm:hidden">Urutkan:</span>
                <select value={sortBy} onChange={e => setSortBy(e.target.value)} className="w-full bg-zinc-950 border border-zinc-800 text-xs text-white rounded-lg p-2 focus:ring-1 focus:ring-red-500 outline-none">
                    <option value="id_asc">Urutan Default (1-10)</option>
                    <option value="id_desc">Urutan Terbalik (10-1)</option>
                    <option value="incomplete_first">Belum Selesai Dahulu</option>
                    <option value="complete_first">Sudah Selesai Dahulu</option>
                </select>
            </div>
        </div>

        {filteredSections.map((section) => {
          const sData = sectionData[section.id];
          if (!sData) return null;
          const isOpen = openSectionId === section.id;
          const isChecked = !!checkedSteps[section.id];

          return (
            <div key={section.id} className={`bg-zinc-900/40 border transition-all duration-300 shadow-xl overflow-hidden rounded-2xl ${isOpen ? 'border-red-600/50 neon-red-glow' : 'border-zinc-800 hover:border-red-600/30'}`}>
              <div className="p-5 flex items-center justify-between gap-4 cursor-pointer" onClick={() => toggleSection(section.id)}>
                  <div className="flex items-center gap-4 flex-1">
                      <div className="impact-font text-2xl text-red-500 bg-zinc-950 border border-zinc-800 px-3 py-1.5 rounded-xl shrink-0">
                        {section.id.toString().padStart(2, '0')}
                      </div>
                      <div className="p-2 bg-red-600/10 rounded-xl text-red-500 shrink-0">
                          {section.icon}
                      </div>
                      <div>
                          <div className="flex items-center gap-2 mb-1">
                              <span className="text-[10px] font-bold tracking-wider text-red-500 uppercase bg-red-500/10 px-2 py-0.5 rounded-full border border-red-500/20">{section.category}</span>
                          </div>
                          <h3 className="font-bold text-white text-sm md:text-base leading-tight">{section.title}</h3>
                          <p className="text-xs text-zinc-500 mt-1">{section.desc}</p>
                      </div>
                  </div>
                  <button onClick={(e) => toggleCheck(section.id, e)} className={`w-8 h-8 rounded-full border-2 flex items-center justify-center transition-all shrink-0 ${isChecked ? 'border-red-500 bg-red-600' : 'border-zinc-700'}`}>
                      <svg className={`w-4 h-4 text-white transition-opacity ${isChecked ? 'opacity-100' : 'opacity-0'}`} fill="none" stroke="currentColor" strokeWidth="3" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7"/></svg>
                  </button>
              </div>

              {isOpen && (
                <div className="p-6 bg-zinc-950/80 border-t border-zinc-800 space-y-4">
                  {section.renderInputs(sData.params, (newParams) => {
                      setSectionData(prev => ({
                          ...prev,
                          [section.id]: { ...prev[section.id], params: newParams }
                      }));
                  })}
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                      <div className="flex flex-wrap gap-2 w-full sm:w-auto">
                          <button onClick={() => getQuickTip(section)} disabled={sData.tipLoading} className={`text-xs font-bold text-yellow-500 hover:text-yellow-400 bg-yellow-500/10 hover:bg-yellow-500/20 px-3 py-2 rounded-lg transition-all flex items-center gap-2 ${sData.tipLoading ? 'opacity-50 cursor-not-allowed' : ''}`}>
                              {sData.tipLoading ? <><Loader2 className="w-4 h-4 animate-spin" /> Memikirkan...</> : <><Sparkles className="w-4 h-4" /> Motivasi & Tips</>}
                          </button>
                          <button onClick={() => getVisualIdeas(section)} disabled={sData.visualLoading} className={`text-xs font-bold text-blue-500 hover:text-blue-400 bg-blue-500/10 hover:bg-blue-500/20 px-3 py-2 rounded-lg transition-all flex items-center gap-2 ${sData.visualLoading ? 'opacity-50 cursor-not-allowed' : ''}`}>
                              {sData.visualLoading ? <><Loader2 className="w-4 h-4 animate-spin" /> Melukis...</> : <><Palette className="w-4 h-4" /> Ide Visual Baru</>}
                          </button>
                      </div>
                      <button onClick={() => runAI(section)} disabled={sData.loading} className={`w-full sm:w-auto bg-red-600 hover:bg-red-700 text-white text-xs font-bold px-6 py-2 rounded-lg transition-all flex items-center justify-center gap-2 ${sData.loading ? 'opacity-50 cursor-not-allowed' : ''}`}>
                          {sData.loading ? <><Loader2 className="w-4 h-4 animate-spin" /> Berpikir Mendalam...</> : 'Jalankan Analisis AI'}
                      </button>
                  </div>
                  {sData.tipResult && (
                      <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-xl p-4 text-xs text-yellow-300/90 leading-relaxed italic">
                          <div dangerouslySetInnerHTML={{ __html: formatMarkdown(sData.tipResult) }} />
                      </div>
                  )}
                  {sData.visualResult && (
                      <div className="bg-blue-500/10 border border-blue-500/20 rounded-xl p-4 text-xs text-blue-300/90 leading-relaxed">
                          <div dangerouslySetInnerHTML={{ __html: formatMarkdown(sData.visualResult) }} />
                      </div>
                  )}
                  <div className="relative">
                      {sData.loading ? (
                          <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-10 flex flex-col items-center justify-center space-y-4">
                              <div className="relative">
                                <Brain className="w-12 h-12 text-red-600 animate-pulse" />
                                <Sparkles className="w-5 h-5 text-yellow-500 absolute -top-1 -right-2 animate-bounce" />
                              </div>
                              <p className="text-sm text-zinc-300 font-bold tracking-wider uppercase animate-pulse text-center">
                                Berpikir Mendalam...
                              </p>
                              <div className="flex gap-1">
                                <span className="w-2 h-2 bg-red-600 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></span>
                                <span className="w-2 h-2 bg-red-600 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></span>
                                <span className="w-2 h-2 bg-red-600 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></span>
                              </div>
                          </div>
                      ) : sData.result ? (
                          <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-4 text-xs text-zinc-300 min-h-[50px] overflow-auto whitespace-pre-wrap relative group">
                            <div dangerouslySetInnerHTML={{ __html: formatMarkdown(sData.result) }} />
                            <div className="absolute top-2 right-2 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                <button onClick={() => copyToClipboard(sData.result, section.id)} className="bg-zinc-950 hover:bg-zinc-800 text-zinc-400 hover:text-white px-2 py-1 rounded text-[10px] font-bold transition-all border border-zinc-800">Salin</button>
                            </div>
                          </div>
                      ) : (
                          <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-4 text-xs text-zinc-500 italic min-h-[50px] overflow-auto whitespace-pre-wrap">Hasil analisis AI akan muncul di sini...</div>
                      )}
                  </div>
                </div>
              )}
            </div>
          );
        })}

        <div className="bg-gradient-to-r from-red-600 to-red-800 rounded-2xl p-6 shadow-2xl text-white mt-8 relative overflow-hidden">
            <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#fff_1px,transparent_1px)] [background-size:16px_16px]"></div>
            <div className="relative z-10 flex flex-col md:flex-row justify-between items-center gap-6">
                <div className="text-center md:text-left">
                    <h4 className="impact-font text-2xl md:text-3xl tracking-wider uppercase">FOKUS. BUAT. PERBAIKI. ULANGI.</h4>
                    <p className="text-xs md:text-sm text-red-100 mt-1 font-medium">Konsistensi hari ini, 100K pelanggan esok hari.</p>
                </div>
                <div className="flex items-center gap-4 bg-black/20 px-5 py-3 rounded-xl border border-white/10 shrink-0">
                    <div className="text-center">
                        <span className="block text-[10px] text-red-200 uppercase font-bold tracking-widest font-sans">Target Terbesar</span>
                        <span className="text-2xl font-extrabold tracking-tight">100K SUBS</span>
                    </div>
                </div>
            </div>
        </div>
      </main>

      <div className={`fixed bottom-5 right-5 bg-zinc-900 border border-red-500 text-white text-xs px-4 py-3 rounded-xl shadow-2xl transition-all duration-300 flex items-center gap-3 z-50 ${toastMessage ? 'translate-y-0 opacity-100' : 'translate-y-20 opacity-0 pointer-events-none'}`}>
          <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse"></span>
          <span>{toastMessage}</span>
      </div>
    </div>
  );
}
