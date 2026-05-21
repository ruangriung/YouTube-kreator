import React, { useState } from 'react';
import { Brain, Loader2, Cpu, Sparkles, Download, Info } from 'lucide-react';

interface CompetitorAnalyzerProps {
  selectedModel: string;
  callPollinationsAI: (prompt: string, systemInstruction?: string, model?: string) => Promise<string>;
  showToast: (msg: string) => void;
  getAccessToken: () => Promise<string>;
  formatMarkdown: (text: string) => string;
}

export default function CompetitorAnalyzer({
  selectedModel,
  callPollinationsAI,
  showToast,
  getAccessToken,
  formatMarkdown
}: CompetitorAnalyzerProps) {
  const [competitorUrl, setCompetitorUrl] = useState('');
  const [analyzingCompetitor, setAnalyzingCompetitor] = useState(false);
  const [competitorTranscript, setCompetitorTranscript] = useState<string | null>(null);
  const [competitorAnalysis, setCompetitorAnalysis] = useState<string | null>(null);
  const [competitorError, setCompetitorError] = useState<string | null>(null);
  const [loadingStep, setLoadingStep] = useState('');

  const analyzeCompetitorVideo = async () => {
    if (!competitorUrl.trim()) {
      showToast("Silakan tempelkan URL YouTube video kompetitor terlebih dahulu!");
      return;
    }
    setAnalyzingCompetitor(true);
    setCompetitorError(null);
    setCompetitorTranscript(null);
    setCompetitorAnalysis(null);
    setLoadingStep('Mengekstrak transkrip percakapan video... (AI Supadata sedang menyiapkan data transkrip, mohon tunggu)');

    try {
      const token = await getAccessToken();
      
      const res = await fetch('/api/transcript', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ videoUrl: competitorUrl.trim() })
      });

      if (!res.ok) {
        const errData = await res.json().catch(() => ({}));
        throw new Error(errData.error || `Gagal mengambil transkrip: ${res.statusText}`);
      }

      const data = await res.json();
      if (!data.success || !data.transcript) {
        throw new Error(data.error || 'Gagal mengekstrak teks transkrip dari video.');
      }

      setCompetitorTranscript(data.transcript);
      setLoadingStep('Menganalisis psikologi retensi, struktur skrip, dan hook dengan AI...');

      const systemInstruction = "Anda adalah Ahli Analisis Kompetitor YouTube dan Psikologi Retensi Penonton kelas dunia.";
      const prompt = `Bedah kenapa video ini bisa menarik perhatian penonton berdasarkan transkrip berikut: \n\n"${data.transcript}"\n\nAnalisis dengan detail struktur hook visual/verbal di 30 detik pertama, penataan ritme cerita, teknik penjelasan atau retensi penonton di pertengahan video, dan taktik Call-to-Action di akhir. Berikan rekomendasi konkret berupa 3 strategi emas yang bisa langsung kami adaptasi untuk membuat video yang jauh lebih baik!`;

      const aiText = await callPollinationsAI(prompt, systemInstruction, selectedModel);
      if (!aiText) {
        throw new Error("Gagal mendapatkan analisis dari AI.");
      }

      setCompetitorAnalysis(aiText);
      showToast("Analisis Video Kompetitor Selesai!");
    } catch (err: any) {
      console.error(err);
      let friendlyError = err.message || 'Terjadi kesalahan saat membedah video kompetitor.';
      if (
        friendlyError.includes('Transcript is disabled') || 
        friendlyError.includes('No transcripts are available') || 
        friendlyError.includes('disabled on this video') ||
        friendlyError.includes('transcript') && friendlyError.includes('disable')
      ) {
        friendlyError = 'Video ini tidak memiliki subtitle/CC aktif di YouTube. Silakan gunakan video kompetitor lain yang memiliki subtitle/CC aktif (tombol CC menyala) agar AI dapat membaca dan membedah percakapan di dalamnya.';
      } else if (friendlyError.includes('too many requests') || friendlyError.includes('429')) {
        friendlyError = 'YouTube membatasi permintaan saat ini (Too Many Requests). Silakan coba lagi beberapa saat lagi atau gunakan tautan video lain.';
      }
      setCompetitorError(friendlyError);
    } finally {
      setAnalyzingCompetitor(false);
      setLoadingStep('');
    }
  };

  return (
    <div className="bg-zinc-900/40 border border-zinc-800 rounded-2xl p-5 sm:p-6 shadow-xl space-y-6">
      <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-3 border-b border-zinc-800/80 pb-4">
        <div className="flex items-center gap-2.5">
          <div className="bg-red-500/10 border border-red-500/25 p-2 rounded-xl text-red-500 shrink-0">
            <Brain className="w-5 h-5 animate-pulse" />
          </div>
          <div className="text-left">
            <h3 className="text-sm sm:text-base font-black text-white uppercase tracking-wider text-left">Bedah Video Kompetitor</h3>
            <p className="text-[10px] text-zinc-500 font-semibold mt-0.5 text-left">Salin teks transkrip YouTube secara otomatis & bedah psikologi retensinya menggunakan AI.</p>
          </div>
        </div>
        <div className="group relative hidden sm:block">
          <Info className="w-5 h-5 text-zinc-500 cursor-help hover:text-white transition-colors" />
          <div className="absolute right-0 top-8 w-64 p-3 bg-zinc-800 border border-zinc-700 rounded-xl text-xs text-zinc-300 shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-20 text-left">
            <strong>Cara kerja:</strong> Masukkan link YouTube kompetitor atau keyword untuk meriset ide dan konten yang sedang tren. AI akan mengurai skrip dan pola retensi penonton dari video tersebut.
          </div>
        </div>
      </div>

      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="flex-1 text-left">
            <label className="block text-[10px] font-bold text-zinc-400 uppercase tracking-widest mb-1.5">URL Video YouTube Kompetitor</label>
            <input
              type="text"
              value={competitorUrl}
              onChange={(e) => setCompetitorUrl(e.target.value)}
              placeholder="Tempelkan link YouTube kompetitor (e.g. https://www.youtube.com/watch?v=...)"
              className="w-full bg-zinc-950 border border-zinc-800 focus:border-red-500 text-xs sm:text-sm text-white rounded-xl px-3.5 py-3 outline-none transition-all"
            />
          </div>
          <div className="flex items-end">
            <button
              onClick={analyzeCompetitorVideo}
              disabled={analyzingCompetitor || !competitorUrl.trim()}
              className="w-full sm:w-auto bg-red-600 hover:bg-red-700 disabled:opacity-50 text-white font-bold text-xs sm:text-sm py-3 px-6 rounded-xl transition-all shadow-lg active:scale-95 flex items-center justify-center gap-2 cursor-pointer shrink-0"
            >
              {analyzingCompetitor ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin text-white" />
                  Membedah Video...
                </>
              ) : (
                <>
                  <Cpu className="w-4 h-4" />
                  Bedah Video
                </>
              )}
            </button>
          </div>
        </div>

        {analyzingCompetitor && loadingStep && (
          <div className="bg-zinc-950 border border-zinc-900 rounded-xl p-4 text-left flex items-center gap-3.5 border-l-2 border-l-red-500 animate-in fade-in duration-300">
            <Loader2 className="w-5 h-5 animate-spin text-red-500 shrink-0" />
            <div className="space-y-1">
              <span className="text-[10px] font-bold text-red-500 uppercase tracking-widest block">Proses Analisis Video</span>
              <p className="text-[11px] text-zinc-300 leading-relaxed">
                {loadingStep}
              </p>
            </div>
          </div>
        )}

        {competitorError && (
          <div className="rounded-xl border border-red-500/30 bg-red-500/10 p-3 text-xs text-red-200 text-left">
            {competitorError}
          </div>
        )}

        {/* Menampilkan transkrip ringkas jika sedang memuat atau sudah dimuat */}
        {competitorTranscript && (
          <div className="bg-zinc-950 border border-zinc-850 rounded-xl p-4 text-left space-y-2">
            <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider block">Transkrip Terdeteksi:</span>
            <p className="text-[11px] text-zinc-400 leading-relaxed line-clamp-3 italic">
              "{competitorTranscript}"
            </p>
          </div>
        )}

        {/* AI Result Card Section */}
        {competitorAnalysis && (
          <div className="border-t border-zinc-850 pt-5 space-y-4 animate-in fade-in duration-200">
            <div className="bg-zinc-950 border border-zinc-800 rounded-2xl p-4 sm:p-5 text-left space-y-3 relative group">
              <div className="flex justify-between items-center border-b border-zinc-850 pb-2">
                <div className="flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-yellow-500" />
                  <span className="text-xs font-black uppercase text-zinc-300 tracking-wider">Hasil Bedah Strategi AI</span>
                </div>
                <div className="flex gap-2">
                  <button 
                    onClick={() => {
                      if (!competitorAnalysis) return;
                      const blob = new Blob([competitorAnalysis], { type: 'text/markdown;charset=utf-8;' });
                      const url = URL.createObjectURL(blob);
                      const link = document.createElement("a");
                      link.setAttribute("href", url);
                      link.setAttribute("download", `bedah-video-kompetitor-${Date.now()}.md`);
                      document.body.appendChild(link);
                      link.click();
                      document.body.removeChild(link);
                      showToast("Laporan berhasil diunduh sebagai file .md!");
                    }}
                    className="px-3 py-1 bg-emerald-600/20 hover:bg-emerald-600/30 border border-emerald-500/30 rounded text-[9px] font-bold text-emerald-400 transition-all uppercase tracking-wider active:scale-95 flex items-center gap-1 cursor-pointer"
                  >
                    <Download className="w-3 h-3" />
                    Download Laporan
                  </button>
                  <button 
                    onClick={() => {
                      navigator.clipboard.writeText(competitorAnalysis);
                      showToast("Hasil analisis bedah video disalin!");
                    }}
                    className="px-3 py-1 bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 rounded text-[9px] font-bold text-zinc-300 transition-all uppercase tracking-wider active:scale-95"
                  >
                    Salin Hasil
                  </button>
                </div>
              </div>
              <div className="text-xs sm:text-sm text-zinc-300 leading-relaxed space-y-2 prose-zinc">
                <div dangerouslySetInnerHTML={{ __html: formatMarkdown(competitorAnalysis) }} />
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
