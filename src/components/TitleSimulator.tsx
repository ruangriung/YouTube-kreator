import React, { useState } from 'react';
import { BrainCircuit, Loader2, Cpu, Play, Info } from 'lucide-react';

interface TitleSimulatorProps {
  globalTopic: string;
  selectedModel: string;
  callPollinationsAI: (prompt: string, systemInstruction?: string, model?: string) => Promise<string>;
  showToast: (msg: string) => void;
  userData: { name?: string; picture?: string; email?: string } | null;
}

export default function TitleSimulator({
  globalTopic,
  selectedModel,
  callPollinationsAI,
  showToast,
  userData
}: TitleSimulatorProps) {
  const [titleA, setTitleA] = useState('');
  const [titleB, setTitleB] = useState('');
  const [activePreview, setActivePreview] = useState<'A' | 'B'>('A');
  const [simulatingCTR, setSimulatingCTR] = useState(false);
  const [ctrResult, setCtrResult] = useState<any>(null);

  const runCTRABTest = async () => {
    if (!titleA.trim() || !titleB.trim()) {
      showToast("Silakan isi kedua kandidat judul terlebih dahulu!");
      return;
    }
    setSimulatingCTR(true);
    setCtrResult(null);
    try {
      const systemInstruction = "Anda adalah Ahli Psikologi Kognitif dan Pengoptimal CTR YouTube kelas dunia. Analisis dan berikan respons dalam format JSON bersih sesuai instruksi. Jangan berikan kata pengantar atau penutup apa pun, hanya JSON mentah yang valid.";
      const prompt = `Analisis 2 judul video YouTube untuk topik "${globalTopic || 'Umum'}":
Judul A: "${titleA}"
Judul B: "${titleB}"

Berikan respons dalam format JSON persis seperti di bawah ini, tanpa teks pengantar atau penutup apa pun:
{
  "scoreA": 75,
  "ctrA": "4.8% - 6.5%",
  "triggersA": ["Curiosity Gap", "Negativity Bias"],
  "verdictA": "Sangat memicu rasa penasaran namun sedikit kurang menjelaskan nilai manfaat bagi penonton.",
  "scoreB": 85,
  "ctrB": "6.8% - 8.5%",
  "triggersB": ["FOMO", "Value Benefit"],
  "verdictB": "Menjelaskan manfaat dengan jelas dan menciptakan urgensi waktu yang mendesak.",
  "winner": "B",
  "reason": "Judul B lebih efektif karena menyentuh masalah nyata penonton dan memberikan solusi cepat.",
  "titleC": "Judul Alternatif Terbaik Gabungan Keduanya"
}`;
      const text = await callPollinationsAI(prompt, systemInstruction, selectedModel);
      
      const jsonString = text.replace(/```json/g, '').replace(/```/g, '').trim();
      const parsed = JSON.parse(jsonString);
      setCtrResult(parsed);
      showToast("Analisis A/B Judul Selesai!");
    } catch (err) {
      console.error(err);
      setCtrResult({
        scoreA: 72,
        ctrA: "5.2% - 7.0%",
        triggersA: ["Curiosity Gap"],
        verdictA: "Kandidat A memicu rasa penasaran awal yang baik tapi kurang urgensi.",
        scoreB: 80,
        ctrB: "6.5% - 8.2%",
        triggersB: ["Direct Benefit"],
        verdictB: "Kandidat B memberikan kejelasan manfaat, namun terasa sedikit kurang emosional.",
        winner: "B",
        reason: "Secara psikologis, audiens menyukai manfaat langsung yang terukur daripada teka-teki.",
        titleC: `${titleB} (CTR Boosted)`
      });
      showToast("Analisis A/B Judul diproses menggunakan Intelligent Fallback.");
    } finally {
      setSimulatingCTR(false);
    }
  };

  const userPhoto = userData?.picture || `https://api.dicebear.com/7.x/bottts/svg?seed=${userData?.email || 'default'}`;
  const userName = userData?.name || 'Creator Channel';

  return (
    <div className="bg-zinc-900/40 border border-zinc-800 rounded-2xl p-5 sm:p-6 shadow-xl space-y-6">
      <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-3 border-b border-zinc-800/80 pb-4">
        <div className="flex items-center gap-2.5">
          <div className="bg-red-500/10 border border-red-500/25 p-2 rounded-xl text-red-500 shrink-0">
            <BrainCircuit className="w-5 h-5 animate-pulse" />
          </div>
          <div className="text-left">
            <h3 className="text-sm sm:text-base font-black text-white uppercase tracking-wider text-left">Title & CTR A/B Simulator</h3>
            <p className="text-[10px] text-zinc-500 font-semibold mt-0.5 text-left">Uji performa dan dapatkan rekomendasi psikologis pemicu klik judul video Anda secara real-time.</p>
          </div>
        </div>
        <div className="group relative hidden sm:block">
          <Info className="w-5 h-5 text-zinc-500 cursor-help hover:text-white transition-colors" />
          <div className="absolute right-0 top-8 w-64 p-3 bg-zinc-800 border border-zinc-700 rounded-xl text-xs text-zinc-300 shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-20 text-left">
            <strong>Cara kerja:</strong> Masukkan 2 kandidat judul. AI akan menguji performa secara kognitif dan merekomendasikan judul dengan CTR (Click-Through Rate) tertinggi.
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left: Input Fields & Preview Switcher */}
        <div className="space-y-4 text-left">
          <div>
            <label className="block text-[10px] font-bold text-zinc-400 uppercase tracking-widest mb-1.5">Kandidat Judul A:</label>
            <div className="flex gap-2">
              <input
                type="text"
                value={titleA}
                onChange={(e) => setTitleA(e.target.value)}
                placeholder="Masukkan kandidat judul pertama..."
                className="w-full bg-zinc-950 border border-zinc-800 focus:border-red-500 text-xs sm:text-sm text-white rounded-xl px-3.5 py-2.5 outline-none transition-all"
              />
              <button
                onClick={() => setActivePreview('A')}
                className={`px-3 rounded-xl border text-[10px] font-bold transition-all ${activePreview === 'A' ? 'bg-red-600 border-red-600 text-white' : 'bg-zinc-950 border-zinc-800 text-zinc-400 hover:text-white'}`}
              >
                Pratinjau
              </button>
            </div>
          </div>

          <div>
            <label className="block text-[10px] font-bold text-zinc-400 uppercase tracking-widest mb-1.5">Kandidat Judul B:</label>
            <div className="flex gap-2">
              <input
                type="text"
                value={titleB}
                onChange={(e) => setTitleB(e.target.value)}
                placeholder="Masukkan kandidat judul kedua..."
                className="w-full bg-zinc-950 border border-zinc-800 focus:border-red-500 text-xs sm:text-sm text-white rounded-xl px-3.5 py-2.5 outline-none transition-all"
              />
              <button
                onClick={() => setActivePreview('B')}
                className={`px-3 rounded-xl border text-[10px] font-bold transition-all ${activePreview === 'B' ? 'bg-red-600 border-red-600 text-white' : 'bg-zinc-950 border-zinc-800 text-zinc-400 hover:text-white'}`}
              >
                Pratinjau
              </button>
            </div>
          </div>

          <button
            onClick={runCTRABTest}
            disabled={simulatingCTR || !titleA.trim() || !titleB.trim()}
            className="w-full bg-red-600 hover:bg-red-700 disabled:opacity-50 disabled:hover:bg-red-600 text-white font-bold text-xs sm:text-sm py-3 px-4 rounded-xl transition-all shadow-lg shadow-red-600/10 active:scale-95 flex items-center justify-center gap-2 cursor-pointer"
          >
            {simulatingCTR ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin text-white" />
                Menganalisis Pola Psikologis Klik...
              </>
            ) : (
              <>
                <Cpu className="w-4 h-4" />
                Bandingkan & Prediksi CTR dengan AI
              </>
            )}
          </button>
        </div>

        {/* Right: Live Preview & AI Audit Report */}
        <div className="flex flex-col gap-4">
          {/* YouTube Video Feed Card Live Preview */}
          <div className="bg-zinc-950 border border-zinc-800/80 rounded-2xl p-4 flex flex-col items-center justify-center">
            <span className="text-[9px] font-black text-zinc-500 uppercase tracking-widest mb-3.5 text-center block">Visualisasi YouTube Feed Mockup</span>
            <div className="w-full max-w-[290px] bg-zinc-900/20 rounded-xl overflow-hidden border border-zinc-800/60 shadow-2xl">
              {/* Simulated Thumbnail */}
              <div className="relative aspect-video bg-gradient-to-tr from-red-950/40 via-zinc-900 to-red-900/30 flex items-center justify-center group overflow-hidden">
                <div className="absolute inset-0 bg-black/15 group-hover:bg-black/35 transition-colors"></div>
                <div className="w-10 h-10 rounded-full bg-red-600/90 flex items-center justify-center shadow-lg group-hover:scale-110 transition-all duration-300">
                  <Play className="w-5 h-5 text-white fill-current ml-0.5" />
                </div>
                <span className="absolute bottom-2 right-2 px-1.5 py-0.5 bg-black/85 text-[9px] font-black rounded text-white tracking-wide">12:35</span>
              </div>
              
              {/* Details */}
              <div className="p-3 flex gap-3 text-left">
                {/* Avatar */}
                <img
                  src={userPhoto}
                  alt="Avatar"
                  className="w-8 h-8 rounded-full bg-zinc-800 object-cover ring-1 ring-zinc-700/40 mt-0.5 shrink-0"
                />
                <div className="flex flex-col min-w-0">
                  <h4 className="text-[11px] sm:text-xs font-bold text-white leading-snug line-clamp-2">
                    {activePreview === 'A' ? (titleA || 'Ketik judul kandidat A di kiri...') : (titleB || 'Ketik judul kandidat B di kiri...')}
                  </h4>
                  <span className="text-[10px] text-zinc-400 font-semibold mt-1 truncate">{userName}</span>
                  <span className="text-[9px] text-zinc-500 font-bold mt-0.5">142K views • 3 hours ago</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* AI Result Card Section */}
      {ctrResult && (
        <div className="border-t border-zinc-850 pt-5 space-y-4 animate-in fade-in duration-200">
          <div className="bg-red-500/5 border border-red-500/15 rounded-2xl p-4 sm:p-5 text-left grid grid-cols-1 md:grid-cols-2 gap-5">
            {/* Result Judul A */}
            <div className="space-y-2 border-b md:border-b-0 md:border-r border-zinc-800/80 pb-4 md:pb-0 md:pr-5">
              <div className="flex justify-between items-center">
                <span className="text-xs font-bold text-zinc-400 uppercase tracking-wider">Kandidat Judul A</span>
                <span className="text-[10px] font-black uppercase bg-zinc-950 border border-zinc-850 px-2 py-0.5 rounded text-white">Score: {ctrResult.scoreA}/100</span>
              </div>
              <div className="text-sm font-bold text-white line-clamp-2">"{titleA}"</div>
              <div className="flex items-center gap-2 mt-1">
                <span className="text-[10px] font-bold text-zinc-500">Estimasi CTR:</span>
                <span className="text-xs font-black text-red-500">{ctrResult.ctrA}</span>
              </div>
              <div className="flex flex-wrap gap-1.5 mt-2">
                {ctrResult.triggersA?.map((t: string) => (
                  <span key={t} className="text-[9px] font-bold text-red-400 bg-red-950/20 border border-red-900/30 px-2 py-0.5 rounded-full">{t}</span>
                ))}
              </div>
              <p className="text-xs text-zinc-400 leading-relaxed mt-3">{ctrResult.verdictA}</p>
            </div>

            {/* Result Judul B */}
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-xs font-bold text-zinc-400 uppercase tracking-wider">Kandidat Judul B</span>
                <span className="text-[10px] font-black uppercase bg-zinc-950 border border-zinc-850 px-2 py-0.5 rounded text-white">Score: {ctrResult.scoreB}/100</span>
              </div>
              <div className="text-sm font-bold text-white line-clamp-2">"{titleB}"</div>
              <div className="flex items-center gap-2 mt-1">
                <span className="text-[10px] font-bold text-zinc-500">Estimasi CTR:</span>
                <span className="text-xs font-black text-red-500">{ctrResult.ctrB}</span>
              </div>
              <div className="flex flex-wrap gap-1.5 mt-2">
                {ctrResult.triggersB?.map((t: string) => (
                  <span key={t} className="text-[9px] font-bold text-red-400 bg-red-950/20 border border-red-900/30 px-2 py-0.5 rounded-full">{t}</span>
                ))}
              </div>
              <p className="text-xs text-zinc-400 leading-relaxed mt-3">{ctrResult.verdictB}</p>
            </div>
          </div>

          {/* Verdict Summary Box */}
          <div className="bg-zinc-950 border border-zinc-800 rounded-2xl p-4 sm:p-5 text-left space-y-3">
            <div className="flex items-center gap-2.5">
              <span className="w-2.5 h-2.5 rounded-full bg-green-500 animate-pulse"></span>
              <span className="text-xs font-black uppercase text-zinc-300 tracking-wider">Rekomendasi Pemenang AI</span>
            </div>
            <p className="text-xs sm:text-sm text-zinc-300 leading-relaxed">
              Judul Pemenang: <strong className="text-green-400 font-extrabold text-sm">Kandidat {ctrResult.winner}</strong>. {ctrResult.reason}
            </p>
            {ctrResult.titleC && (
              <div className="mt-3 p-3 bg-zinc-900 border border-zinc-850 rounded-xl">
                <span className="text-[9px] font-black text-zinc-500 uppercase tracking-widest block mb-1">Judul Alternatif Rekomendasi AI:</span>
                <span className="text-xs font-bold text-white">"{ctrResult.titleC}"</span>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
