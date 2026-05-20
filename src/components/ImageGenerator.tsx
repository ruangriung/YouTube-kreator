import React, { useState, useEffect } from 'react';
import { Sparkles, Loader2, Image, Video, Volume2, VolumeX, Download, Info } from 'lucide-react';

interface ImageGeneratorProps {
  globalTopic: string;
  selectedModel: string;
  callPollinationsAI: (prompt: string, systemInstruction?: string, model?: string) => Promise<string>;
  callPollinationsImage: (prompt: string, model: string, width?: number, height?: number) => Promise<string>;
  callPollinationsVideo: (prompt: string, model: string, width?: number, height?: number, duration?: number, aspectRatio?: string, audio?: boolean) => Promise<string>;
  showToast: (msg: string) => void;
}

export default function ImageGenerator({
  globalTopic,
  selectedModel,
  callPollinationsAI,
  callPollinationsImage,
  callPollinationsVideo,
  showToast
}: ImageGeneratorProps) {
  // Tabs: 'image' or 'video'
  const [activeTab, setActiveTab] = useState<'image' | 'video'>('image');

  // Image states
  const [imagePrompt, setImagePrompt] = useState('Thumbnail epik dengan gaya cinematic premium');
  const [imageModel, setImageModel] = useState('flux');
  const [imageModels, setImageModels] = useState<string[]>(['flux']);
  const [imageLoading, setImageLoading] = useState(false);
  const [imageResult, setImageResult] = useState<string | null>(null);
  const [imageError, setImageError] = useState('');
  const [aspectRatio, setAspectRatio] = useState<'landscape' | 'portrait' | 'square'>('landscape');

  // Video states
  const [videoPrompt, setVideoPrompt] = useState('B-Roll video dramatis transisi kilat, sinematik 4k');
  const [videoModel, setVideoModel] = useState('wan');
  const [videoDuration, setVideoDuration] = useState<number>(4);
  const [videoAudio, setVideoAudio] = useState<boolean>(false);
  const [videoLoading, setVideoLoading] = useState(false);
  const [videoResult, setVideoResult] = useState<string | null>(null);
  const [videoError, setVideoError] = useState('');

  // Suggestions states
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [suggesting, setSuggesting] = useState(false);

  const [videoModels, setVideoModels] = useState<string[]>([
    'wan',
    'veo',
    'seedance-pro',
    'seedance-2.0',
    'grok-video-pro',
    'ltx-2',
    'p-video',
    'nova-reel'
  ]);

  useEffect(() => {
    const fetchModels = async () => {
      try {
        const res = await fetch('https://gen.pollinations.ai/image/models');
        if (res.ok) {
          const list = await res.json();
          if (Array.isArray(list)) {
            // Filter image models
            const imgModels = list
              .filter((m: any) => m.output_modalities?.includes('image'))
              .map((m: any) => m.name);
            if (imgModels.length > 0) {
              setImageModels(imgModels);
            }

            // Filter video models dynamically from the registry
            const vidModels = list
              .filter((m: any) => m.output_modalities?.includes('video'))
              .map((m: any) => m.name);
            if (vidModels.length > 0) {
              setVideoModels(vidModels);
              if (!vidModels.includes(videoModel)) {
                setVideoModel(vidModels[0]);
              }
            }
          }
        }
      } catch (err) {
        console.error("Gagal memuat list model Pollinations:", err);
      }
    };
    fetchModels();
  }, []);

  const getAiSuggestions = async () => {
    setSuggesting(true);
    try {
      showToast("Meningkatkan CTR & merancang ide prompt kreatif...");
      const prompt = `Diberikan topik utama channel YouTube: "${globalTopic || 'Tutorial, Tips & Trik Kreator, Vlog Kreatif'}".
Tolong buatkan 3 ide deskripsi prompt visual terperinci, epik, sinematik, dan sangat menarik perhatian penonton (high CTR) untuk ${activeTab === 'image' ? 'Thumbnail YouTube' : 'Klip Video B-Roll YouTube'}.
Tolong buat dalam Bahasa Indonesia yang deskriptif dan profesional.
Kembalikan ide dalam format JSON array berisi 3 string saja (misal: ["Ide 1", "Ide 2", "Ide 3"]).
Kembalikan HANYA array JSON tersebut, tanpa format markdown \`\`\`json, penjelasan, prefix atau kata-kata pembuka lain!`;

      const aiText = await callPollinationsAI(
        prompt,
        "You are an expert YouTube Thumbnail and B-Roll prompt designer. Respond only with a raw JSON array of 3 descriptive visual prompts in Indonesian.",
        selectedModel
      );

      if (aiText) {
        const cleanedText = aiText.trim().replace(/^```json\s*|```\s*$/g, '');
        try {
          const parsed = JSON.parse(cleanedText);
          if (Array.isArray(parsed) && parsed.length > 0) {
            setSuggestions(parsed.map(item => String(item)));
            showToast("Berhasil memuat 3 ide prompt visual baru!");
            return;
          }
        } catch (e) {
          const lines = cleanedText
            .split('\n')
            .map(line => line.trim().replace(/^["'\-\d\.\s\[\],]+|["'\s\[\],]+$/g, ''))
            .filter(line => line.length > 15);
          if (lines.length > 0) {
            setSuggestions(lines.slice(0, 3));
            showToast("Berhasil merumuskan ide prompt baru!");
            return;
          }
        }
      }
      throw new Error("Format respon AI tidak dapat dibaca");
    } catch (err) {
      console.error(err);
      if (activeTab === 'image') {
        setSuggestions([
          `Thumbnail 3D render premium tentang kreativitas digital, neon glow terang, sudut cinematic`,
          `Ekspresi wajah terkejut menghadap layar laptop dengan grafik penjualan yang meroket tajam`,
          `Desain minimalis modern dengan warna komplementer kontras tinggi tentang kesuksesan finansial`
        ]);
      } else {
        setSuggestions([
          `Gerakan lambat tangan menulis ide kreatif di kertas bergaris, pencahayaan moody keemasan`,
          `Layar monitor menunjukkan garis timeline video bergerak cepat, latar belakang studio malam hari`,
          `Kamera drone terbang rendah melintasi pegunungan berkabut di pagi hari, transisi sinematik`
        ]);
      }
      showToast("Menggunakan ide rekomendasi standar.");
    } finally {
      setSuggesting(false);
    }
  };

  const generateImage = async () => {
    if (!imagePrompt.trim()) {
      setImageError('Silakan isi prompt gambar terlebih dahulu.');
      return;
    }
    setImageLoading(true);
    setImageError('');
    setImageResult(null);

    try {
      showToast("Menerjemahkan prompt ke Bahasa Inggris di belakang layar...");
      const translationPrompt = `Translate the following image generation prompt into descriptive English suitable for AI image generators (like Flux/Midjourney). Return ONLY the translated English prompt, without any extra explanation, quotes, prefix or introduction: "${imagePrompt}"`;
      
      const translatedPrompt = await callPollinationsAI(
        translationPrompt,
        "You are a professional image generation prompt translator. Translate the text exactly into descriptive, detailed English prompts.",
        selectedModel
      );
      
      const cleanPrompt = translatedPrompt ? translatedPrompt.trim().replace(/^['"]|['"]$/g, '') : imagePrompt;

      let width = 1024;
      let height = 576;
      if (aspectRatio === 'portrait') {
        width = 576;
        height = 1024;
      } else if (aspectRatio === 'square') {
        width = 768;
        height = 768;
      }

      const imageData = await callPollinationsImage(cleanPrompt, imageModel, width, height);
      setImageResult(imageData);
      showToast("Gambar berhasil dibuat!");
    } catch (err: any) {
      console.error(err);
      setImageError(err.message || 'Gagal membuat gambar. Coba lagi.');
    } finally {
      setImageLoading(false);
    }
  };

  const generateVideo = async () => {
    if (!videoPrompt.trim()) {
      setVideoError('Silakan isi prompt video terlebih dahulu.');
      return;
    }
    setVideoLoading(true);
    setVideoError('');
    setVideoResult(null);

    try {
      showToast("Menerjemahkan prompt video ke Bahasa Inggris di belakang layar...");
      const translationPrompt = `Translate the following video B-roll prompt into descriptive English suitable for AI video generators (like Wan/Veo). Return ONLY the translated English prompt, without any extra explanation, quotes, prefix or introduction: "${videoPrompt}"`;
      
      const translatedPrompt = await callPollinationsAI(
        translationPrompt,
        "You are a professional video prompt translator. Translate the text exactly into descriptive, detailed English prompts for video generators.",
        selectedModel
      );
      
      const cleanPrompt = translatedPrompt ? translatedPrompt.trim().replace(/^['"]|['"]$/g, '') : videoPrompt;

      let width = 1024;
      let height = 576;
      let aspectStr = '16:9';
      if (aspectRatio === 'portrait') {
        width = 576;
        height = 1024;
        aspectStr = '9:16';
      } else if (aspectRatio === 'square') {
        width = 768;
        height = 768;
        aspectStr = '1:1';
      }

      showToast("Menghubungi server Pollinations Video AI (Proses ini memerlukan waktu 10-30 detik)...");
      const videoData = await callPollinationsVideo(
        cleanPrompt,
        videoModel,
        width,
        height,
        videoDuration,
        aspectStr,
        videoAudio
      );
      setVideoResult(videoData);
      showToast("Video B-Roll berhasil dibuat!");
    } catch (err: any) {
      console.error(err);
      setVideoError(err.message || 'Gagal membuat video. Coba lagi.');
    } finally {
      setVideoLoading(false);
    }
  };

  return (
    <div className="bg-zinc-900/40 border border-zinc-800 rounded-2xl p-5 sm:p-6 shadow-xl space-y-6">
      {/* Header and Tab Switcher */}
      <div className="flex flex-col lg:flex-row justify-between lg:items-center gap-4 border-b border-zinc-800/80 pb-4">
        <div className="flex flex-col lg:flex-row lg:items-center gap-4 flex-1">
          <div className="flex items-center gap-2.5">
            <div className="bg-emerald-500/10 border border-emerald-500/25 p-2 rounded-xl text-emerald-500 shrink-0">
              <Sparkles className="w-5 h-5 animate-pulse" />
            </div>
            <div className="text-left">
              <h3 className="text-sm sm:text-base font-black text-white uppercase tracking-wider text-left">AI Media & Content Creator</h3>
              <p className="text-[10px] text-zinc-500 font-semibold mt-0.5 text-left">Buat gambar visual berkualitas tinggi dan klip video B-Roll sinematik dalam satu tempat.</p>
            </div>
          </div>
          <div className="group relative hidden lg:block ml-2">
            <Info className="w-5 h-5 text-zinc-500 cursor-help hover:text-white transition-colors" />
            <div className="absolute left-0 top-8 w-64 p-3 bg-zinc-800 border border-zinc-700 rounded-xl text-xs text-zinc-300 shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-20 text-left">
              <strong>Cara kerja:</strong> Generate thumbnail atau B-Roll video pendek secara otomatis berdasarkan instruksi visual yang Anda berikan menggunakan AI generatif khusus visual.
            </div>
          </div>
        </div>

        {/* Tab Selection buttons */}
        <div className="flex bg-zinc-950 p-1 rounded-xl border border-zinc-850 self-start lg:self-auto">
          <button
            onClick={() => setActiveTab('image')}
            className={`flex items-center gap-1.5 px-4 py-1.5 rounded-lg text-xs font-bold transition-all ${
              activeTab === 'image'
                ? 'bg-emerald-500 text-black shadow-md'
                : 'text-zinc-400 hover:text-white'
            }`}
          >
            <Image className="w-3.5 h-3.5" />
            <span>Generate Image</span>
          </button>
          <button
            onClick={() => setActiveTab('video')}
            className={`flex items-center gap-1.5 px-4 py-1.5 rounded-lg text-xs font-bold transition-all ${
              activeTab === 'video'
                ? 'bg-emerald-500 text-black shadow-md'
                : 'text-zinc-400 hover:text-white'
            }`}
          >
            <Video className="w-3.5 h-3.5" />
            <span>Generate Video (B-Roll)</span>
            <span className="bg-red-600 text-white text-[8px] px-1 py-0.2 rounded font-black tracking-wider uppercase ml-1 animate-pulse">BETA</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Left Control Panel */}
        <div className="space-y-4 text-left">
          {activeTab === 'image' ? (
            <div>
              <textarea
                value={imagePrompt}
                onChange={(e) => setImagePrompt(e.target.value)}
                placeholder="Jelaskan gambar yang ingin dibuat (misal: Seorang kreator sedang mengedit video di depan layar komputer menyala, gaya 3D render premium, neon glow)..."
                className="w-full bg-zinc-950 border border-zinc-800 focus:border-emerald-500 text-xs sm:text-sm text-white rounded-2xl p-4 outline-none min-h-[120px] transition-all resize-none leading-relaxed"
              />
            </div>
          ) : (
            <div>
              <textarea
                value={videoPrompt}
                onChange={(e) => setVideoPrompt(e.target.value)}
                placeholder="Jelaskan video B-Roll yang ingin dibuat (misal: Air terjun megah di tengah hutan tropis fajar berkabut, gerakan kamera panning lambat, sinematik 4k, photorealistic)..."
                className="w-full bg-zinc-950 border border-zinc-800 focus:border-emerald-500 text-xs sm:text-sm text-white rounded-2xl p-4 outline-none min-h-[120px] transition-all resize-none leading-relaxed"
              />
            </div>
          )}

          {/* AI Prompt Suggestions */}
          <div className="bg-zinc-950/50 border border-zinc-850 rounded-2xl p-4 space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-[10px] font-black text-zinc-400 uppercase tracking-widest flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
                Inspirasi Ide Prompt AI
              </span>
              <button
                type="button"
                onClick={getAiSuggestions}
                disabled={suggesting}
                className="text-[10px] text-emerald-400 hover:text-emerald-300 font-bold uppercase tracking-wider disabled:opacity-50 flex items-center gap-1 cursor-pointer"
              >
                {suggesting ? 'Mencari...' : 'Dapatkan Ide Baru'}
              </button>
            </div>
            
            {suggestions.length > 0 ? (
              <div className="space-y-2">
                {suggestions.map((s, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => {
                      if (activeTab === 'image') setImagePrompt(s);
                      else setVideoPrompt(s);
                      showToast("Prompt berhasil diaplikasikan!");
                    }}
                    className="w-full text-left bg-zinc-900/40 hover:bg-zinc-900 border border-zinc-850 hover:border-emerald-500/20 rounded-xl p-2.5 text-[11px] text-zinc-300 leading-normal transition-all duration-250 cursor-pointer flex items-start gap-2 group"
                  >
                    <span className="bg-emerald-950 text-emerald-400 text-[9px] font-black w-5 h-5 rounded-lg flex items-center justify-center shrink-0 mt-0.5 group-hover:bg-emerald-400 group-hover:text-black transition-colors">{idx + 1}</span>
                    <span className="line-clamp-2 font-medium">{s}</span>
                  </button>
                ))}
              </div>
            ) : (
              <p className="text-[10px] text-zinc-500 italic font-semibold leading-relaxed">
                Klik "Dapatkan Ide Baru" untuk merumuskan 3 saran prompt visual kreatif yang terintegrasi khusus dengan niche topik channel Anda ("{globalTopic || 'Umum'}").
              </p>
            )}
          </div>

          {/* YouTube Content Quality Note */}
          <div className="bg-amber-500/5 border border-amber-500/20 rounded-2xl p-4 flex gap-3 text-left">
            <div className="bg-amber-500/10 border border-amber-500/20 p-2 rounded-xl text-amber-500 shrink-0 h-9 w-9 flex items-center justify-center">
              <svg className="w-5 h-5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"/></svg>
            </div>
            <div className="space-y-1">
              <span className="text-[10px] font-black text-amber-500 uppercase tracking-widest block">Pedoman Kebijakan AI YouTube</span>
              <p className="text-[11px] text-zinc-400 font-medium leading-relaxed">
                YouTube tidak melarang total penggunaan Kecerdasan Buatan (AI), namun mereka secara tegas menindak dan melarang konten <strong className="text-white">"AI slop"</strong> atau video buatan AI berkualitas rendah yang diproduksi secara massal tanpa nilai tambah. Konten semacam ini sering kali dianggap spam atau melanggar pedoman komunitas.
              </p>
            </div>
          </div>

          {/* Ratio Selector Options (Shared) */}
          <div>
            <label className="block text-[10px] font-bold text-zinc-400 uppercase tracking-widest mb-2">Pilih Rasio Ukuran Media:</label>
            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => setAspectRatio('landscape')}
                className={`py-2 px-3 rounded-xl border text-[10px] font-extrabold uppercase tracking-wider transition-all flex flex-col items-center gap-1 ${
                  aspectRatio === 'landscape'
                    ? 'bg-emerald-600/20 border-emerald-500 text-emerald-400 shadow-md shadow-emerald-950/20'
                    : 'bg-zinc-950 border-zinc-850 text-zinc-500 hover:text-zinc-300'
                }`}
              >
                <span>Lansekap (16:9)</span>
                <span className="text-[8px] font-medium text-zinc-500 capitalize">YouTube Video</span>
              </button>
              <button
                type="button"
                onClick={() => setAspectRatio('portrait')}
                className={`py-2 px-3 rounded-xl border text-[10px] font-extrabold uppercase tracking-wider transition-all flex flex-col items-center gap-1 ${
                  aspectRatio === 'portrait'
                    ? 'bg-emerald-600/20 border-emerald-500 text-emerald-400 shadow-md shadow-emerald-950/20'
                    : 'bg-zinc-950 border-zinc-850 text-zinc-500 hover:text-zinc-300'
                }`}
              >
                <span>Potret (9:16)</span>
                <span className="text-[8px] font-medium text-zinc-500 capitalize">YouTube Shorts</span>
              </button>
              <button
                type="button"
                onClick={() => setAspectRatio('square')}
                className={`py-2 px-3 rounded-xl border text-[10px] font-extrabold uppercase tracking-wider transition-all flex flex-col items-center gap-1 ${
                  aspectRatio === 'square'
                    ? 'bg-emerald-600/20 border-emerald-500 text-emerald-400 shadow-md shadow-emerald-950/20'
                    : 'bg-zinc-950 border-zinc-850 text-zinc-500 hover:text-zinc-300'
                }`}
              >
                <span>Persegi (1:1)</span>
                <span className="text-[8px] font-medium text-zinc-500 capitalize">Community Post</span>
              </button>
            </div>
          </div>

          {activeTab === 'image' ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-[10px] font-bold text-zinc-400 uppercase tracking-widest mb-1.5">Model AI Gambar:</label>
                <select
                  value={imageModel}
                  onChange={(e) => setImageModel(e.target.value)}
                  className="w-full bg-zinc-950 border border-zinc-800 text-xs text-white rounded-xl px-4 py-3 focus:ring-1 focus:ring-emerald-500 outline-none transition-all cursor-pointer"
                >
                  {imageModels.map((m) => (
                    <option key={m} value={m}>{m}</option>
                  ))}
                </select>
              </div>
              <div className="flex items-end">
                <button
                  onClick={generateImage}
                  disabled={imageLoading}
                  className="w-full bg-emerald-500 hover:bg-emerald-600 text-black font-bold text-xs sm:text-sm px-4 py-3 rounded-2xl transition-all shadow-lg active:scale-95 disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {imageLoading ? (
                    <><Loader2 className="w-4 h-4 animate-spin" /> Memproses...</>
                  ) : (
                    'Generate Image'
                  )}
                </button>
              </div>
            </div>
          ) : (
            // Video Generation controls
            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] font-bold text-zinc-400 uppercase tracking-widest mb-1.5">Model AI Video:</label>
                  <select
                    value={videoModel}
                    onChange={(e) => setVideoModel(e.target.value)}
                    className="w-full bg-zinc-950 border border-zinc-800 text-xs text-white rounded-xl px-4 py-3 focus:ring-1 focus:ring-emerald-500 outline-none transition-all cursor-pointer"
                  >
                    {videoModels.map((m) => (
                      <option key={m} value={m}>{m.toUpperCase()}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-[10px] font-bold text-zinc-400 uppercase tracking-widest mb-1.5">Durasi Video (Detik):</label>
                  <select
                    value={videoDuration}
                    onChange={(e) => setVideoDuration(Number(e.target.value))}
                    className="w-full bg-zinc-950 border border-zinc-800 text-xs text-white rounded-xl px-4 py-3 focus:ring-1 focus:ring-emerald-500 outline-none transition-all cursor-pointer"
                  >
                    <option value={4}>4 Detik (Standar)</option>
                    <option value={6}>6 Detik</option>
                    <option value={8}>8 Detik (Panjang)</option>
                  </select>
                </div>
              </div>

              <div className="flex items-center justify-between bg-zinc-950 border border-zinc-850 p-3.5 rounded-xl">
                <div className="flex items-center gap-2">
                  {videoAudio ? (
                    <Volume2 className="w-4 h-4 text-emerald-400 animate-bounce" />
                  ) : (
                    <VolumeX className="w-4 h-4 text-zinc-500" />
                  )}
                  <div className="text-left">
                    <span className="block text-[10px] font-extrabold text-white uppercase tracking-wider">Hasilkan Audio / Musik Latar:</span>
                    <span className="block text-[8px] text-zinc-500 font-medium">Buat efek audio ambient yang cocok dengan video B-Roll secara otomatis.</span>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setVideoAudio(!videoAudio)}
                  className={`w-10 h-6 flex items-center rounded-full p-1 transition-all ${
                    videoAudio ? 'bg-emerald-500 justify-end' : 'bg-zinc-800 justify-start'
                  }`}
                >
                  <span className={`w-4 h-4 rounded-full shadow-md transition-all ${videoAudio ? 'bg-black' : 'bg-zinc-400'}`} />
                </button>
              </div>

              <button
                onClick={generateVideo}
                disabled={videoLoading}
                className="w-full bg-emerald-500 hover:bg-emerald-600 text-black font-bold text-xs sm:text-sm px-4 py-3.5 rounded-2xl transition-all shadow-lg active:scale-95 disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {videoLoading ? (
                  <><Loader2 className="w-4 h-4 animate-spin" /> Menerjemahkan & Me-render Video...</>
                ) : (
                  'Generate Video B-Roll'
                )}
              </button>
            </div>
          )}

          {activeTab === 'image' && imageError && (
            <div className="rounded-2xl border border-red-500/30 bg-red-500/10 p-3 text-xs text-red-200">{imageError}</div>
          )}
          {activeTab === 'video' && videoError && (
            <div className="rounded-2xl border border-red-500/30 bg-red-500/10 p-3 text-xs text-red-200">{videoError}</div>
          )}
        </div>

        {/* Right Preview Panel */}
        <div className="bg-zinc-950 border border-zinc-800 rounded-3xl min-h-[300px] flex flex-col items-center justify-center p-4 text-center">
          {activeTab === 'image' ? (
            imageResult ? (
              <div className="space-y-4 w-full">
                <img src={imageResult} alt="Generated" className="mx-auto rounded-3xl max-h-[320px] w-full object-contain border border-zinc-800 shadow-2xl" />
                <div className="flex gap-2">
                  <a
                    href={imageResult}
                    download="youtube-kreator-visual.png"
                    className="flex-1 bg-emerald-500 hover:bg-emerald-600 text-black font-bold text-[10px] uppercase tracking-widest py-3 rounded-2xl transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    <Download className="w-3.5 h-3.5" />
                    Download Gambar
                  </a>
                  <button
                    onClick={() => {
                      navigator.clipboard.writeText(imagePrompt);
                      showToast('Prompt gambar berhasil disalin!');
                    }}
                    className="bg-zinc-900/80 text-zinc-200 text-[10px] uppercase tracking-widest font-bold px-5 py-3 rounded-2xl transition-all hover:bg-zinc-800"
                  >Salin Prompt</button>
                </div>
              </div>
            ) : (
              <div className="text-zinc-500 text-xs leading-relaxed max-w-xs px-4">
                {imageLoading ? (
                  <div className="flex flex-col items-center justify-center space-y-3">
                    <Loader2 className="w-8 h-8 animate-spin text-emerald-400" />
                    <p className="text-zinc-400 font-bold animate-pulse">Sedang menerjemahkan prompt & memproses pembuatan gambar biner berkualitas tinggi...</p>
                  </div>
                ) : (
                  'Masukkan prompt gambar di sebelah kiri lalu klik Generate Image untuk membuat visual AI yang relevan dengan channel Anda.'
                )}
              </div>
            )
          ) : (
            // Video Result View
            videoResult ? (
              <div className="space-y-4 w-full">
                <video
                  src={videoResult}
                  controls
                  autoPlay
                  loop
                  className="mx-auto rounded-3xl max-h-[320px] w-full object-contain border border-zinc-800 shadow-2xl"
                />
                <div className="flex gap-2">
                  <a
                    href={videoResult}
                    download="youtube-kreator-b-roll.mp4"
                    className="flex-1 bg-emerald-500 hover:bg-emerald-600 text-black font-bold text-[10px] uppercase tracking-widest py-3 rounded-2xl transition-all flex items-center justify-center gap-1.5"
                  >
                    <Download className="w-3.5 h-3.5" />
                    Download Video
                  </a>
                  <button
                    onClick={() => {
                      navigator.clipboard.writeText(videoPrompt);
                      showToast('Prompt video berhasil disalin!');
                    }}
                    className="bg-zinc-900/80 text-zinc-200 text-[10px] uppercase tracking-widest font-bold px-5 py-3 rounded-2xl transition-all hover:bg-zinc-800"
                  >Salin Prompt</button>
                </div>
              </div>
            ) : (
              <div className="text-zinc-500 text-xs leading-relaxed max-w-xs px-4">
                {videoLoading ? (
                  <div className="flex flex-col items-center justify-center space-y-3">
                    <Loader2 className="w-8 h-8 animate-spin text-emerald-400" />
                    <p className="text-zinc-400 font-bold animate-pulse">Menghubungi model AI video Pollinations. Proses kompilasi rendering video MP4 memerlukan waktu sekitar 10-30 detik...</p>
                  </div>
                ) : (
                  'Masukkan deskripsi klip video B-Roll di sebelah kiri, atur durasi & audio, lalu klik Generate Video untuk merender video MP4 Anda.'
                )}
              </div>
            )
          )}
        </div>
      </div>
    </div>
  );
}
