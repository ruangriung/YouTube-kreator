import React, { useState } from 'react';
import { Eye, Loader2, Cpu, Sparkles, UploadCloud, Download, Info } from 'lucide-react';

interface VisualDissectorProps {
  globalTopic: string;
  callPollinationsAI: (prompt: any, systemInstruction?: string, model?: string) => Promise<string>;
  showToast: (msg: string) => void;
  formatMarkdown: (text: string) => string;
}

export default function VisualDissector({
  globalTopic,
  callPollinationsAI,
  showToast,
  formatMarkdown
}: VisualDissectorProps) {
  const [dissectImage, setDissectImage] = useState<string | null>(null);
  const [dissecting, setDissecting] = useState(false);
  const [dissectResult, setDissectResult] = useState<string | null>(null);
  const [dissectError, setDissectError] = useState<string | null>(null);

  const analyzeVisualThumbnail = async () => {
    if (!dissectImage) {
      setDissectError("Tolong pilih atau unggah gambar terlebih dahulu.");
      return;
    }
    setDissecting(true);
    setDissectError(null);
    setDissectResult(null);

    try {
      const promptArray = [
        {
          type: "text",
          text: `Tolong lakukan bedah visual dan thumbnail yang sangat mendalam dan kritis ini untuk saluran kreator YouTube.
Konteks Saluran Kreator:
- Topik Utama Saluran: "${globalTopic || 'Umum / Pembuat Konten'}"

Lakukan analisis berdasarkan kriteria ini:
1. **Daya Tarik Visual & Focal Point**: Di mana mata tertuju pertama kali (focal point)? Apakah elemen wajah, ekspresi, atau objek utama terlihat sangat tajam dan jelas?
2. **Psikologi Warna & Kontras**: Apakah warna latar belakang dan teks kontras? Apakah membangkitkan emosi/klikan penonton sesuai topik "${globalTopic || 'Kreator'}"?
3. **Keterbacaan & Tipografi Teks**: Apakah teks pada thumbnail mudah dibaca dalam waktu kurang dari 1 detik di layar HP berukuran kecil? Apakah font terlihat kusam/biasa saja?
4. **Potensi CTR & Daya Tarik Klik**: Berikan estimasi rating daya pikat (Rendah / Sedang / Tinggi) beserta penjelasan psikologi penonton mengapa demikian.
5. **Rekomendasi Perbaikan Kreatif & Konkret**: Berikan minimal 3-5 solusi taktis dan konkret yang dapat diterapkan dengan segera untuk melipatgandakan performa visual/thumbnail ini agar menonjol dari kompetitor.

Format laporan Anda dalam bentuk dokumen Markdown yang dirancang secara profesional, berenergi tinggi, rapi, dan langsung to the point.`
        },
        {
          type: "image_url",
          image_url: {
            url: dissectImage
          }
        }
      ];

      // Vision requests require standard OpenAI/Gemini multimodal models. Pollinations 'openai' is GPT-4o which supports vision.
      const result = await callPollinationsAI(promptArray, undefined, 'openai');
      setDissectResult(result);
      showToast("Bedah Visual & Thumbnail Selesai!");
    } catch (err: any) {
      console.error(err);
      setDissectError(err.message || "Gagal menganalisis gambar. Pastikan format gambar valid.");
    } finally {
      setDissecting(false);
    }
  };

  const handleDissectImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setDissectError(null);
    setDissectResult(null);

    const reader = new FileReader();
    reader.onloadend = () => {
      setDissectImage(reader.result as string);
    };
    reader.onerror = () => {
      setDissectError("Gagal membaca file gambar.");
    };
    reader.readAsDataURL(file);
  };

  return (
    <div className="bg-zinc-900/40 border border-zinc-800 rounded-2xl p-5 sm:p-6 shadow-xl space-y-6">
      <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-3 border-b border-zinc-800/80 pb-4">
        <div className="flex items-center gap-2.5">
          <div className="bg-emerald-500/10 border border-emerald-500/25 p-2 rounded-xl text-emerald-500 shrink-0">
            <Eye className="w-5 h-5 animate-pulse" />
          </div>
          <div className="text-left">
            <h3 className="text-sm sm:text-base font-black text-white uppercase tracking-wider text-left">Bedah Visual & Thumbnail</h3>
            <p className="text-[10px] text-zinc-500 font-semibold mt-0.5 text-left">Unggah draf thumbnail atau storyboard visual Anda untuk dianalisis oleh AI Vision secara mendalam.</p>
          </div>
        </div>
        <div className="group relative hidden sm:block">
          <Info className="w-5 h-5 text-zinc-500 cursor-help hover:text-white transition-colors" />
          <div className="absolute right-0 top-8 w-64 p-3 bg-zinc-800 border border-zinc-700 rounded-xl text-xs text-zinc-300 shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-20 text-left">
            <strong>Cara kerja:</strong> AI akan membedah elemen visual thumbnail secara detail sehingga Anda tahu persis teknik warna, komposisi, dan ekspresi apa yang membuatnya menarik perhatian penonton.
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-4 text-left">
          <div>
            <label className="block text-[10px] font-bold text-zinc-400 uppercase tracking-widest mb-2">Unggah File Gambar / Thumbnail:</label>
            <div className="relative border-2 border-dashed border-zinc-800 hover:border-emerald-500/60 rounded-2xl p-6 transition-all bg-zinc-950 flex flex-col items-center justify-center cursor-pointer group">
              <input
                type="file"
                accept="image/*"
                onChange={handleDissectImageUpload}
                className="absolute inset-0 opacity-0 cursor-pointer"
              />
              <UploadCloud className="w-8 h-8 text-zinc-500 group-hover:text-emerald-400 mb-2 transition-colors" />
              <span className="text-xs text-zinc-400 font-bold text-center">Klik atau seret file gambar untuk diunggah</span>
              <span className="text-[9px] text-zinc-600 mt-1">Mendukung PNG, JPG, JPEG, WEBP</span>
            </div>
          </div>

          <button
            onClick={analyzeVisualThumbnail}
            disabled={dissecting || !dissectImage}
            className="w-full bg-emerald-500 hover:bg-emerald-600 disabled:opacity-50 text-black font-bold text-xs sm:text-sm py-3 px-4 rounded-xl transition-all shadow-lg active:scale-95 flex items-center justify-center gap-2 cursor-pointer"
          >
            {dissecting ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Menganalisis Gambar Vision...
              </>
            ) : (
              <>
                <Cpu className="w-4 h-4" />
                Bedah Visual & Nilai CTR
              </>
            )}
          </button>

          {dissectError && (
            <div className="rounded-xl border border-red-500/30 bg-red-500/10 p-3 text-xs text-red-200">{dissectError}</div>
          )}
        </div>

        {/* Display Image Preview & Vision Results */}
        <div className="bg-zinc-950 border border-zinc-800 rounded-3xl min-h-[280px] flex flex-col items-center justify-center p-4">
          {dissectImage ? (
            <div className="space-y-4 w-full">
              <span className="text-[9px] font-black text-zinc-500 uppercase tracking-widest block text-center">Preview Gambar Unggahan</span>
              <img src={dissectImage} alt="Uploaded Dissect" className="mx-auto rounded-2xl max-h-[220px] object-contain border border-zinc-800/80 shadow-2xl" />
              <button
                onClick={() => {
                  setDissectImage(null);
                  setDissectResult(null);
                }}
                className="w-full bg-zinc-900/60 hover:bg-zinc-900 text-zinc-400 hover:text-white text-[9px] uppercase tracking-widest font-bold py-2 rounded-xl transition-all"
              >
                Hapus Gambar
              </button>
            </div>
          ) : (
            <div className="text-zinc-500 text-xs leading-relaxed max-w-xs px-4 text-center">
              Belum ada gambar yang diunggah. Silakan pilih draf thumbnail di panel kiri.
            </div>
          )}
        </div>
      </div>

      {/* AI Visual Dissector Result Section */}
      {dissectResult && (
        <div className="border-t border-zinc-850 pt-5 space-y-4 animate-in fade-in duration-200">
          <div className="bg-zinc-950 border border-zinc-800 rounded-2xl p-4 sm:p-5 text-left space-y-3 relative group">
            <div className="flex justify-between items-center border-b border-zinc-850 pb-2">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-emerald-400" />
                <span className="text-xs font-black uppercase text-zinc-300 tracking-wider">Hasil Analisis Visual AI</span>
              </div>
              <div className="flex gap-2">
                <button 
                  onClick={() => {
                    if (!dissectResult) return;
                    const blob = new Blob([dissectResult], { type: 'text/markdown;charset=utf-8;' });
                    const url = URL.createObjectURL(blob);
                    const link = document.createElement("a");
                    link.setAttribute("href", url);
                    link.setAttribute("download", `bedah-visual-thumbnail-${Date.now()}.md`);
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
                    navigator.clipboard.writeText(dissectResult);
                    showToast("Hasil bedah visual disalin!");
                  }}
                  className="px-3 py-1 bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 rounded text-[9px] font-bold text-zinc-300 transition-all uppercase tracking-wider active:scale-95"
                >
                  Salin Hasil
                </button>
              </div>
            </div>
            <div className="text-xs sm:text-sm text-zinc-300 leading-relaxed space-y-2 prose-zinc">
              <div dangerouslySetInnerHTML={{ __html: formatMarkdown(dissectResult) }} />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
