import React, { useState } from 'react';
import { PenTool, Loader2, Sparkles, FileText, Info } from 'lucide-react';

interface ScriptGeneratorProps {
  globalTopic: string;
  selectedModel: string;
  callPollinationsAI: (prompt: string, systemInstruction?: string, model?: string) => Promise<string>;
  showToast: (msg: string) => void;
  formatMarkdown: (text: string) => React.ReactNode;
}

export default function ScriptGenerator({
  globalTopic,
  selectedModel,
  callPollinationsAI,
  showToast,
  formatMarkdown
}: ScriptGeneratorProps) {
  const [finalTitle, setFinalTitle] = useState('');
  const [generating, setGenerating] = useState(false);
  const [result, setResult] = useState('');

  const generateScript = async () => {
    if (!finalTitle.trim()) {
      showToast("Silakan masukkan judul final terlebih dahulu!");
      return;
    }
    setGenerating(true);
    setResult('');
    try {
      const systemInstruction = "Anda adalah YouTube Scriptwriter kelas dunia. Buat naskah video YouTube yang sangat memikat dan terstruktur. Gunakan format Markdown yang rapi dengan heading, bullet points, dan penekanan teks (bold/italic) jika diperlukan. Jangan pernah memberikan pembukaan/penutup di luar konten naskah.";
      const prompt = `Buat kerangka naskah video YouTube yang sangat detail untuk topik "${globalTopic || 'Umum'}" dengan Judul Video: "${finalTitle}".
      
Tolong berikan:
1. **Hook 3 Detik Pertama:** 3 kalimat tajam yang bikin penonton langsung ketagihan dan tidak bisa skip.
2. **Intro (0:03 - 0:30):** Penjelasan singkat tentang masalah penonton dan janji apa yang akan mereka dapatkan di video ini.
3. **Poin-poin Utama (Body):** Minimal 3 poin pembahasan utama. Berikan kerangka pembahasannya secara singkat.
4. **Call to Action (Outro):** Arahan untuk like, subscribe, dan klik video selanjutnya dengan alasan yang kuat.

Gunakan bahasa yang mengalir, natural (Bahasa Indonesia Gaul/Santai namun Profesional). Gunakan gaya penceritaan (storytelling).`;

      const text = await callPollinationsAI(prompt, systemInstruction, selectedModel);
      setResult(text);
      showToast("Hook & Kerangka Naskah berhasil dibuat!");
    } catch (err) {
      console.error(err);
      showToast("Gagal menghasilkan naskah. Silakan coba lagi.");
    } finally {
      setGenerating(false);
    }
  };

  return (
    <div className="bg-zinc-900/40 border border-zinc-800 rounded-2xl p-5 sm:p-6 shadow-xl space-y-6">
      <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-3 border-b border-zinc-800/80 pb-4">
        <div className="flex items-center gap-2.5">
          <div className="bg-amber-500/10 border border-amber-500/25 p-2 rounded-xl text-amber-500 shrink-0">
            <PenTool className="w-5 h-5 animate-bounce-slow" />
          </div>
          <div className="text-left">
            <h3 className="text-sm sm:text-base font-black text-white uppercase tracking-wider text-left">Script & Hook Generator AI</h3>
            <p className="text-[10px] text-zinc-500 font-semibold mt-0.5 text-left">Otomatis buat kalimat pancingan (hook) dan kerangka naskah video yang terstruktur berdasarkan judul Anda.</p>
          </div>
        </div>
        <div className="group relative hidden sm:block">
          <Info className="w-5 h-5 text-zinc-500 cursor-help hover:text-white transition-colors" />
          <div className="absolute right-0 top-8 w-64 p-3 bg-zinc-800 border border-zinc-700 rounded-xl text-xs text-zinc-300 shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-20 text-left">
            <strong>Cara kerja:</strong> Masukkan judul akhir video Anda. AI akan menganalisis judul tersebut dan memformulasikan hook 3 detik yang memikat, kerangka konten, serta Call to Action.
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
            placeholder="Masukkan judul video yang sudah Anda tentukan..."
            className="w-full bg-zinc-950 border border-zinc-800 focus:border-amber-500 text-xs sm:text-sm text-white rounded-xl px-3.5 py-2.5 outline-none transition-all"
          />
        </div>

        <button
          onClick={generateScript}
          disabled={generating || !finalTitle.trim()}
          className="w-full bg-amber-600 hover:bg-amber-700 disabled:opacity-50 disabled:hover:bg-amber-600 text-white font-bold text-xs sm:text-sm py-3 px-4 rounded-xl transition-all shadow-lg shadow-amber-600/10 active:scale-95 flex items-center justify-center gap-2 cursor-pointer"
        >
          {generating ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin text-white" />
              Menulis Naskah Kreatif...
            </>
          ) : (
            <>
              <Sparkles className="w-4 h-4" />
              Generate Hook & Kerangka Naskah
            </>
          )}
        </button>
      </div>

      {result && (
        <div className="border-t border-zinc-850 pt-5 space-y-4 animate-in fade-in duration-200">
          <div className="bg-zinc-950 border border-zinc-800 rounded-2xl p-4 sm:p-5 text-left relative overflow-hidden">
            <div className="absolute top-0 right-0 bg-amber-600/20 px-3 py-1 rounded-bl-xl border-b border-l border-amber-500/20">
              <span className="text-[9px] font-black uppercase text-amber-500 tracking-widest flex items-center gap-1.5">
                <FileText className="w-3 h-3" /> Script Draft
              </span>
            </div>
            <div className="prose prose-invert prose-sm md:prose-base prose-p:text-zinc-400 prose-headings:text-zinc-200 prose-a:text-amber-400 max-w-none mt-4">
              {formatMarkdown(result)}
            </div>
            
            <button
              onClick={() => {
                navigator.clipboard.writeText(result);
                showToast("Naskah disalin ke clipboard!");
              }}
              className="mt-6 w-full bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-zinc-300 font-bold text-xs py-2.5 rounded-xl transition-all active:scale-95 flex justify-center items-center gap-2"
            >
              Salin Naskah
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
