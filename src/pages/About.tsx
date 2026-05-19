import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Sparkles, Youtube, CheckCircle2 } from 'lucide-react';

export default function About() {
  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-300 p-6 md:p-12 font-sans selection:bg-red-500/30">
      <div className="max-w-3xl mx-auto space-y-8 pb-20">
        <div className="flex items-center gap-4 border-b border-zinc-800 pb-6">
          <Link to="/" className="p-2 bg-zinc-900 border border-zinc-800 rounded-xl hover:bg-zinc-800 hover:border-zinc-700 transition">
            <ArrowLeft className="w-5 h-5 text-zinc-400" />
          </Link>
          <h1 className="text-3xl font-extrabold text-white tracking-tight uppercase">Tentang Kami</h1>
        </div>
        
        <div className="space-y-8 text-sm sm:text-base leading-relaxed">
          <section className="space-y-4">
            <div className="flex items-center gap-2 text-red-500 font-bold">
              <Sparkles className="w-5 h-5" />
              <span className="uppercase tracking-wider text-xs">Visi Utama</span>
            </div>
            <h2 className="text-2xl font-black text-white tracking-tight">
              Auto Pilot AI Commander
            </h2>
            <p className="text-zinc-400">
              **Auto Pilot AI Commander** adalah sistem asisten taktis berbasis kecerdasan buatan (*AI*) yang dirancang khusus untuk memotong waktu riset dan eksekusi konten bagi para kreator YouTube. Kami percaya bahwa setiap ide hebat layak mendapatkan strategi penyajian visual dan audio terbaik tanpa harus membuat kreator stres atau mengalami *burnout*.
            </p>
          </section>

          <section className="space-y-4 bg-zinc-900/40 border border-zinc-850 p-6 sm:p-8 rounded-3xl relative overflow-hidden">
            <div className="absolute top-0 right-0 -translate-y-1/4 translate-x-1/4 w-32 h-32 bg-red-600/10 rounded-full blur-2xl"></div>
            
            <div className="flex items-center gap-3 mb-2">
              <div className="w-16 h-16 rounded-full overflow-hidden border-2 border-red-500/40 flex-shrink-0">
                <img 
                  src="/assets/arekgresikID.jpg" 
                  alt="Arek Gresik" 
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.currentTarget.src = "https://api.dicebear.com/7.x/bottts/svg?seed=arekgresik";
                  }}
                />
              </div>
              <div>
                <h3 className="text-lg font-black text-white">Karya Kreatif Arek Gresik 🇮🇩</h3>
                <p className="text-xs text-zinc-500">Dibuat dengan sepenuh hati di Jawa Timur</p>
              </div>
            </div>
            
            <p className="text-zinc-400 text-sm leading-relaxed">
              Produk ini didesain dan dirancang secara orisinal oleh **arek Gresik** asli. Melalui dedikasi tinggi, kami ingin membuktikan bahwa talenta lokal mampu menghadirkan perangkat lunak premium berkualitas global yang mampu memberdayakan sesama kreator Indonesia dalam melipatgandakan produktivitas dan membangun aset digital profesional secara konsisten.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-xl font-bold text-white uppercase tracking-wide border-b border-zinc-900 pb-2">
              Apa Saja Fitur Autopilot Kami?
            </h2>
            <p className="text-zinc-400 text-sm">
              Kami menyatukan 6 pilar kecerdasan video YouTube dalam satu alur kerja cerdas otomatis:
            </p>
            <ul className="grid sm:grid-cols-2 gap-3 text-xs sm:text-sm text-zinc-400">
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-red-500 flex-shrink-0" />
                <span>Riset Mikro-Niche Terarah</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-red-500 flex-shrink-0" />
                <span>Bongkar Formula Video Viral</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-red-500 flex-shrink-0" />
                <span>Penyusunan Hook Retensi Tinggi</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-red-500 flex-shrink-0" />
                <span>Storyboard Audio-Visual Detail</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-red-500 flex-shrink-0" />
                <span>Generasi Skrip Video Utuh</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-red-500 flex-shrink-0" />
                <span>Taktik Thumbnail CTR Maksimal</span>
              </li>
            </ul>
          </section>

          <section className="space-y-4 pt-4 border-t border-zinc-900">
            <h2 className="text-xl font-bold text-white uppercase tracking-wide">
              Bergabung Bersama Kami
            </h2>
            <p className="text-zinc-400 text-sm">
              Mari bersama-sama meningkatkan ekosistem konten kreator edukatif dan menghibur di Indonesia. Dengan sekali pendaftaran QRIS senilai **Rp 69.000 (Lifetime Access)**, Anda sudah mendapatkan akses penuh tanpa batas ke seluruh fitur asisten AI taktis buatan arek Gresik ini.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
