import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';

export default function TermsOfService() {
  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-300 p-6 md:p-12 font-sans selection:bg-red-500/30">
      <div className="max-w-3xl mx-auto space-y-8 pb-20">
        <div className="flex items-center gap-4 border-b border-zinc-800 pb-6">
          <Link to="/" className="p-2 bg-zinc-900 border border-zinc-800 rounded-xl hover:bg-zinc-800 hover:border-zinc-700 transition">
            <ArrowLeft className="w-5 h-5 text-zinc-400" />
          </Link>
          <h1 className="text-3xl font-extrabold text-white tracking-tight impact-font uppercase">Syarat dan Ketentuan (TOS)</h1>
        </div>
        
        <div className="space-y-6 text-sm leading-relaxed">
          <p>
            Terakhir diperbarui: {new Date().toLocaleDateString('id-ID', { year: 'numeric', month: 'long', day: 'numeric' })}
          </p>

          <section className="space-y-3">
            <h2 className="text-xl font-bold text-white uppercase impact-font tracking-wide">1. Ketentuan Umum</h2>
            <p>
              Dengan mengakses dan menggunakan situs ini, Anda menerima dan menyetujui untuk terikat oleh syarat dan ketentuan ini. Apabila Anda tidak setuju dengan ketentuan mana pun di sini, harap untuk tidak menggunakan layanan kami.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-bold text-white uppercase impact-font tracking-wide">2. Penggunaan Layanan</h2>
            <p>
              Layanan kami menggunakan AI generatif untuk membantu Anda membuat rencana konten YouTube. Hasil yang diberikan oleh AI tidak dijamin sukses 100%. Anda setuju bahwa:
            </p>
            <ul className="list-disc pl-5 space-y-1 text-zinc-400">
              <li>Layanan ini berfungsi sebagai alat bantu (tools) dan bukan sebagai kebenaran mutlak.</li>
              <li>Anda bertanggung jawab secara sadar atas risiko jika suatu rencana gagal atau tidak efektif.</li>
              <li>Anda tidak akan menggunakan platform ini untuk meng-generate konten yang melanggar hukum, berbahaya, mengancam, penuh kebencian, atau hal lain yang merugikan.</li>
            </ul>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-bold text-white uppercase impact-font tracking-wide">3. Tautan Ke Layanan Spesifik (Google API)</h2>
            <p>
              Layanan ini terintegrasi dengan Google API termasuk integrasi kalender dan sign-in. Saat sinkronisasi dilakukan, Anda memberi kami izin sesuai batasan OAuth yang telah disetujui. Kami tak bertanggung jawab atas kerusakan kalender, penghapusan terencana acara kalender secara manual oleh Anda, maupun sinkronisasi Google yang terhambat.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-bold text-white uppercase impact-font tracking-wide">4. Penafian Tanggung Jawab</h2>
            <p>
              Semua produk, perangkat lunak, dan layanan disediakan "sebagaimana adanya". Kami tidak bertanggung jawab atas kerugian dalam bentuk apa pun, termasuk kerugian finansial atau turunnya performa channel YouTube Anda. 
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-bold text-white uppercase impact-font tracking-wide">5. Perubahan Ketentuan</h2>
            <p>
              Kami dapat merevisi syarat penggunaan untuk situs webnya sewaktu-waktu tanpa pemberitahuan. Dengan menggunakan situs web ini, Anda setuju untuk terikat oleh versi Syarat dan Ketentuan Penggunaan saat ini.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
