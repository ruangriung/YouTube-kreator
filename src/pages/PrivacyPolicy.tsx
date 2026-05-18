import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';

export default function PrivacyPolicy() {
  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-300 p-6 md:p-12 font-sans selection:bg-red-500/30">
      <div className="max-w-3xl mx-auto space-y-8 pb-20">
        <div className="flex items-center gap-4 border-b border-zinc-800 pb-6">
          <Link to="/" className="p-2 bg-zinc-900 border border-zinc-800 rounded-xl hover:bg-zinc-800 hover:border-zinc-700 transition">
            <ArrowLeft className="w-5 h-5 text-zinc-400" />
          </Link>
          <h1 className="text-3xl font-extrabold text-white tracking-tight impact-font uppercase">Kebijakan Privasi</h1>
        </div>
        
        <div className="space-y-6 text-sm leading-relaxed">
          <p>
            Terakhir diperbarui: {new Date().toLocaleDateString('id-ID', { year: 'numeric', month: 'long', day: 'numeric' })}
          </p>

          <section className="space-y-3">
            <h2 className="text-xl font-bold text-white uppercase impact-font tracking-wide">1. Informasi yang Kami Kumpulkan</h2>
            <p>
              Kami mengumpulkan informasi dari Anda ketika Anda mendaftar di situs kami, masuk ke akun Anda, dan berpartisipasi dalam layanan kami.
            </p>
            <ul className="list-disc pl-5 space-y-1 text-zinc-400">
              <li>Informasi profil Google (email, nama, foto) ketika Anda login.</li>
              <li>Data input topik dan konten YouTube Anda, yang kami gunakan untuk memfasilitasi pembuatan strategi video dengan kecerdasan buatan.</li>
            </ul>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-bold text-white uppercase impact-font tracking-wide">2. Penggunaan Informasi</h2>
            <p>
              Setiap informasi yang kami kumpulkan dari Anda dapat digunakan untuk:
            </p>
            <ul className="list-disc pl-5 space-y-1 text-zinc-400">
              <li>Mempersonalisasi pengalaman Anda dan memenuhi kebutuhan pribadi Anda.</li>
              <li>Meningkatkan situs web kami dan fitur untuk kreator.</li>
            </ul>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-bold text-white uppercase impact-font tracking-wide">3. Keamanan Data</h2>
            <p>
              Kami menerapkan berbagai langkah keamanan untuk menjaga keamanan informasi pribadi Anda. Aplikasi kami tidak menyimpan kata sandi akun Google Anda karena kami menggunakan autentikasi OAuth.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-bold text-white uppercase impact-font tracking-wide">4. Persetujuan Anda</h2>
            <p>
              Dengan menggunakan situs kami, Anda menyetujui kebijakan privasi situs web kami ini.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
