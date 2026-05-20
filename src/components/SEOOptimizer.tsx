import React, { useState } from 'react';
import { Search, Loader2, Sparkles, Hash, Info } from 'lucide-react';

interface SEOOptimizerProps {
  globalTopic: string;
  selectedModel: string;
  callPollinationsAI: (prompt: string, systemInstruction?: string, model?: string) => Promise<string>;
  showToast: (msg: string) => void;
  formatMarkdown: (text: string) => React.ReactNode;
}

export default function SEOOptimizer({
  globalTopic,
  selectedModel,
  callPollinationsAI,
  showToast,
  formatMarkdown
}: SEOOptimizerProps) {
  const [finalTitle, setFinalTitle] = useState('');
  const [generating, setGenerating] = useState(false);
  const [result, setResult] = useState('');

  const generateSEO = async () => {
    if (!finalTitle.trim()) {
      showToast("Silakan masukkan judul final terlebih dahulu!");
      return;
    }
    setGenerating(true);
    setResult('');
    try {
      const systemInstruction = "Anda adalah Pakar SEO YouTube dan Algorithm Hacker kelas dunia. Hasilkan metadata (deskripsi, tag, hashtag) yang teroptimasi secara sempurna untuk algoritma pencarian YouTube. Gunakan format Markdown.";
      const prompt = `Buatkan optimasi SEO YouTube secara lengkap untuk topik "${globalTopic || 'Umum'}" dengan Judul Video: "${finalTitle}".
      
Tolong berikan:
1. **Deskripsi YouTube (Optimasi SEO):** Tulis paragraf deskripsi yang menarik, natural, namun mengandung kata kunci turunan yang relevan.
2. **Timestamps / Chapters:** Berikan contoh kerangka chapter waktu yang direkomendasikan (misal: 0:00 Intro, 1:20 Poin 1, dst).
3. **Hidden Tags (Pisahkan dengan koma):** Berikan 15-20 kata kunci (tags) panjang (long-tail keywords) yang sering dicari orang. Pisahkan dengan koma agar mudah disalin ke kolom tags YouTube.
4. **Hashtags:** Berikan 3-5 hashtag terbaik (#) untuk disematkan di bawah deskripsi.`;

      const text = await callPollinationsAI(prompt, systemInstruction, selectedModel);
      setResult(text);
      showToast("Metadata SEO berhasil dibuat!");
    } catch (err) {
      console.error(err);
      showToast("Gagal menghasilkan SEO. Silakan coba lagi.");
    } finally {
      setGenerating(false);
    }
  };

  return (
    <div className="bg-zinc-900/40 border border-zinc-800 rounded-2xl p-5 sm:p-6 shadow-xl space-y-6">
      <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-3 border-b border-zinc-800/80 pb-4">
        <div className="flex items-center gap-2.5">
          <div className="bg-emerald-500/10 border border-emerald-500/25 p-2 rounded-xl text-emerald-500 shrink-0">
            <Search className="w-5 h-5 animate-pulse" />
          </div>
          <div className="text-left">
            <h3 className="text-sm sm:text-base font-black text-white uppercase tracking-wider text-left">SEO & Metadata Optimizer</h3>
            <p className="text-[10px] text-zinc-500 font-semibold mt-0.5 text-left">Otomatis buat deskripsi video, rekomendasi timestamp, dan deretan tag/kata kunci penembus algoritma.</p>
          </div>
        </div>
        <div className="group relative hidden sm:block">
          <Info className="w-5 h-5 text-zinc-500 cursor-help hover:text-white transition-colors" />
          <div className="absolute right-0 top-8 w-64 p-3 bg-zinc-800 border border-zinc-700 rounded-xl text-xs text-zinc-300 shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-20 text-left">
            <strong>Cara kerja:</strong> AI akan otomatis meracik deskripsi SEO-friendly, rekomendasi timestamps, hidden tags, dan hashtags terbaik berdasarkan judul video Anda.
          </div>
        </div>
      </div>

      <div className="space-y-4 text-left">
        <div>
          <label className="block text-[10px] font-bold text-zinc-400 uppercase tracking-widest mb-1.5">Judul Video Final:</label>
          <input
            type="text"
            value={finalTitle}
            onChange={(e) => setFinalTitle(e.target.value)}
            placeholder="Masukkan judul video final Anda..."
            className="w-full bg-zinc-950 border border-zinc-800 focus:border-emerald-500 text-xs sm:text-sm text-white rounded-xl px-3.5 py-2.5 outline-none transition-all"
          />
        </div>

        <button
          onClick={generateSEO}
          disabled={generating || !finalTitle.trim()}
          className="w-full bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 disabled:hover:bg-emerald-600 text-white font-bold text-xs sm:text-sm py-3 px-4 rounded-xl transition-all shadow-lg shadow-emerald-600/10 active:scale-95 flex items-center justify-center gap-2 cursor-pointer"
        >
          {generating ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin text-white" />
              Meracik Metadata SEO...
            </>
          ) : (
            <>
              <Sparkles className="w-4 h-4" />
              Generate Deskripsi & Tags
            </>
          )}
        </button>
      </div>

      {result && (
        <div className="border-t border-zinc-850 pt-5 space-y-4 animate-in fade-in duration-200">
          <div className="bg-zinc-950 border border-zinc-800 rounded-2xl p-4 sm:p-5 text-left relative overflow-hidden">
            <div className="absolute top-0 right-0 bg-emerald-600/20 px-3 py-1 rounded-bl-xl border-b border-l border-emerald-500/20">
              <span className="text-[9px] font-black uppercase text-emerald-500 tracking-widest flex items-center gap-1.5">
                <Hash className="w-3 h-3" /> SEO Package
              </span>
            </div>
            <div className="prose prose-invert prose-sm md:prose-base prose-p:text-zinc-400 prose-headings:text-zinc-200 prose-a:text-emerald-400 max-w-none mt-4">
              {formatMarkdown(result)}
            </div>
            
            <button
              onClick={() => {
                navigator.clipboard.writeText(result);
                showToast("Metadata SEO disalin ke clipboard!");
              }}
              className="mt-6 w-full bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-zinc-300 font-bold text-xs py-2.5 rounded-xl transition-all active:scale-95 flex justify-center items-center gap-2"
            >
              Salin Metadata
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
