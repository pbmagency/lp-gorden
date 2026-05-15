import { useState } from 'react';
import { ChevronDown } from 'lucide-react';
import SectionWrapper from '../ui/SectionWrapper';
import Button from '../ui/Button';
import SocialProofMicro from '../ui/SocialProofMicro';

const faqs = [
  {
    category: 'Jadwal & Format',
    q: 'Kapan jadwal kelas dan apakah bisa disesuaikan?',
    a: 'Kami menyediakan 4 sesi harian: Pagi (07.00–08.30), Siang (12.00–13.30), Sore (16.00–17.30), dan Malam (19.00–20.30) — dari Senin hingga Sabtu. Kamu cukup pilih satu sesi yang paling cocok dengan jadwalmu. Rekaman lengkap setiap sesi tersedia 24 jam, jadi tidak perlu khawatir jika kamu sesekali ketinggalan.',
  },
  {
    category: 'Jadwal & Format',
    q: 'Apakah kelasnya online atau offline?',
    a: 'Kelas berlangsung sepenuhnya secara online via Zoom. Kamu bisa mengikuti dari mana saja — baik dari rumah, kantor, maupun kafe. Yang kamu butuhkan hanya smartphone atau laptop dengan koneksi internet yang stabil.',
  },
  {
    category: 'Jadwal & Format',
    q: 'Bagaimana cara akses LMS dan materinya?',
    a: 'Setelah mendaftar dan melakukan pembayaran, kamu akan mendapatkan akses ke platform LMS (Learning Management System) Full Bright melalui WhatsApp tim kami. Di sana tersedia video e-course (30+ video untuk Level Starter, 60+ video untuk Level Intermediate), e-book, dan bank soal yang bisa diakses kapan saja selama masa program berlangsung, plus 3 bulan akses setelah batch selesai.',
  },
  {
    category: 'Sertifikat & Legalitas',
    q: 'Apakah sertifikat Full Bright valid untuk melamar kerja atau kuliah?',
    a: 'Full Bright Indonesia adalah lembaga resmi yang terdaftar di ITP (Institutional Testing Program) dan IIEF (Indonesian International Education Foundation) Jakarta, dengan SK Kemenkumham AHU-0055720-AH.01.14 Tahun 2020. Sertifikat TOEFL Institusional Full Bright dapat digunakan untuk: Daftar Kuliah S1/S2/S3, Lamar Kerja, Seleksi CPNS, Rekrutmen BUMN (PLN, Telkom, dll), Ujian Skripsi, Kenaikan Pangkat, dan Pendaftaran Beasiswa. Untuk persyaratan beasiswa internasional resmi (Fulbright, LPDP, AAS), kamu tetap perlu mengikuti ujian ITP atau IBT resmi — dan kelas kami dirancang untuk mempersiapkanmu tepat untuk itu.',
  },
  {
    category: 'Sertifikat & Legalitas',
    q: 'Apakah sertifikatnya bisa digunakan untuk syarat CPNS dan BUMN?',
    a: 'Sertifikat Full Bright diakui untuk berbagai keperluan: CPNS di kementerian, BUMN (PLN, Telkom, Pertamina, dll), Ujian Skripsi, Kenaikan Pangkat, dan Rekrutmen Perusahaan Multinasional. Setiap instansi memiliki kebijakan masing-masing, jadi kami sarankan untuk selalu mengkonfirmasi langsung ke instansi yang dituju. Tim kami juga siap membantu memberikan klarifikasi jika dibutuhkan.',
  },
  {
    category: 'Metode & Efektivitas',
    q: 'Apakah metode ini cocok untuk pemula yang grammar-nya sangat lemah?',
    a: 'Sangat cocok! Kurikulum kami dirancang dari level dasar menggunakan Pattern Recognition Method™. Kamu tidak perlu memiliki grammar yang sempurna untuk memulai. Instruktur kami akan membimbingmu dari fondasi dasar hingga pola soal yang paling sering keluar — langkah demi langkah.',
  },
  {
    category: 'Metode & Efektivitas',
    q: 'Berapa kenaikan skor yang bisa saya harapkan dalam 15 hari?',
    a: 'Kami tidak menjanjikan angka skor tertentu karena hasilnya sangat bergantung pada kondisi awal dan seberapa aktif kamu mengikuti kelas serta mengerjakan latihan. Namun berdasarkan data alumni kami, rata-rata peningkatan berkisar 80–160 poin dalam 15 hari bagi yang mengikuti program secara konsisten. Kuncinya sederhana: hadir di setiap sesi dan kerjakan semua bank soal yang diberikan.',
  },
  {
    category: 'Metode & Efektivitas',
    q: 'Apakah ada sesi try-out / mock test sebelum tes asli?',
    a: 'Ya! Setiap program mencakup Placement Test di awal (untuk mengetahui level dan kelemahan kamu) dan Post Test di akhir (untuk mengukur peningkatan). Untuk paket Intermediate, tersedia juga Mid Test di pertengahan program. Semua soal try-out kami dirancang sesuai format resmi TOEFL ITP.',
  },
  {
    category: 'Metode & Efektivitas',
    q: 'Bahasa pengantar kelas menggunakan bahasa apa?',
    a: 'Kelas menggunakan Bahasa Indonesia sebagai pengantar agar lebih mudah dipahami, khususnya untuk konsep grammar dan strategi menjawab soal. Untuk latihan listening dan reading comprehension, tentu menggunakan Bahasa Inggris sesuai format TOEFL ITP yang sesungguhnya.',
  },
  {
    category: 'Untuk Orang Sibuk',
    q: 'Bagaimana jika saya sangat sibuk bekerja atau kuliah?',
    a: 'Kelas Full Bright dirancang compact: hanya 90 menit per hari — tidak lebih. Setiap menit diisi dengan materi high-impact saja, tanpa basa-basi. Rekaman tersedia 24 jam sehingga kamu bisa menonton ulang kapan saja. Banyak alumni kami adalah dokter, PNS aktif, dan karyawan korporat yang berhasil dengan keterbatasan waktu mereka.',
  },
  {
    category: 'Untuk Orang Sibuk',
    q: 'Berapa lama akses ke materi dan rekaman kelas?',
    a: 'Kamu mendapatkan akses penuh ke semua rekaman kelas dan video materi (30+ video untuk Starter, 60+ video untuk Intermediate) selama minimal 3 bulan setelah batch selesai. Artinya kamu bisa terus mengulang materi bahkan setelah program 10 hari (Starter) atau 15 hari (Intermediate) berakhir — sangat berguna untuk persiapan ujian resmi.',
  },
  {
    category: 'Pendaftaran & Pembayaran',
    q: 'Bagaimana cara mendaftar dan metode pembayaran apa saja?',
    a: 'Pendaftaran sangat mudah: klik tombol "Daftar Sekarang", pilih paket yang sesuai, dan kamu akan langsung diarahkan ke WhatsApp tim kami. Pembayaran dapat dilakukan via transfer bank (BCA, Mandiri, BRI, BNI), GoPay, OVO, DANA, dan QRIS. Tidak ada tes masuk — semua level bisa langsung bergabung.',
  },
  {
    category: 'Pendaftaran & Pembayaran',
    q: 'Kapan batch berikutnya dimulai dan apakah ada batas kuota?',
    a: 'Batch baru dimulai setiap bulan dengan jadwal yang diumumkan di grup WhatsApp alumni dan di halaman ini. Setiap batch dibatasi jumlah pesertanya agar kualitas interaksi dengan instruktur tetap terjaga. Kami sarankan mendaftar lebih awal untuk memastikan tempat kamu.',
  },
  {
    category: 'Jaminan & Garansi',
    q: 'Apa yang terjadi jika saya tidak puas atau skor tidak sesuai harapan?',
    a: 'Kami memberikan dua lapisan jaminan: (1) Garansi Mengulang 1 Bulan — jika skor kamu belum mencapai target setelah mengikuti program secara penuh dan konsisten, kamu boleh mengulang batch berikutnya secara GRATIS. (2) Garansi 100% Uang Kembali — jika kamu tidak puas setelah mengikuti sesi pertama, kami kembalikan uangmu penuh tanpa pertanyaan dan tanpa potongan apapun. Risiko ada di pihak kami, bukan kamu.',
  },
];

// 3 FAQs pre-expanded by default
const defaultOpen = new Set([
  'Kapan jadwal kelas dan apakah bisa disesuaikan?',
  'Berapa kenaikan skor yang bisa saya harapkan dalam 15 hari?',
  'Apa yang terjadi jika saya tidak puas atau skor tidak sesuai harapan?',
]);

const categories = [...new Set(faqs.map(f => f.category))];

// JSON-LD schema for Google rich results
const faqSchema = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: faqs.map(faq => ({
    '@type': 'Question',
    name: faq.q,
    acceptedAnswer: {
      '@type': 'Answer',
      text: faq.a,
    },
  })),
};

function FAQItem({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(defaultOpen.has(q));
  return (
    <div className="border-b border-gray-100 last:border-0">
      <button
        onClick={() => setOpen(o => !o)}
        className="w-full flex items-start justify-between text-left py-5 gap-4 group"
      >
        <span className="text-sm font-bold leading-snug transition-colors duration-200"
          style={{ fontFamily: 'var(--font-heading)', color: open ? '#D70808' : '#151515' }}>
          {q}
        </span>
        <ChevronDown
          size={18}
          className="shrink-0 mt-0.5 transition-transform duration-300"
          style={{ transform: open ? 'rotate(180deg)' : 'rotate(0deg)', color: open ? '#D70808' : '#9ca3af' }}
        />
      </button>
      <div
        style={{
          maxHeight: open ? '600px' : '0',
          overflow: 'hidden',
          transition: 'max-height 0.35s cubic-bezier(0.4, 0, 0.2, 1)',
          opacity: open ? 1 : 0,
        }}
        className="transition-opacity duration-300"
      >
        <div className="pb-6 pr-8">
          <p className="text-sm leading-relaxed" style={{ color: '#3d3d3d' }}>{a}</p>
        </div>
      </div>
    </div>
  );
}

export default function FAQSection() {
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const filtered = activeCategory ? faqs.filter(f => f.category === activeCategory) : faqs;

  return (
    <>
      {/* JSON-LD for FAQ rich results */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />

      <SectionWrapper id="faq" bg="cultured" className="py-20 md:py-28">

        <div className="text-center mb-14">
          <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest px-4 py-1.5 rounded-full mb-5"
            style={{ backgroundColor: '#FFF0F0', color: '#D70808', border: '1px solid #ffb3b3' }}>
            ❓ FAQ
          </div>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-black mb-5"
            style={{ fontFamily: 'var(--font-heading)', color: '#151515' }}>
            Pertanyaan yang Sering Ditanyakan{' '}
            <span style={{ color: '#D70808' }}>Sebelum Daftar</span>
          </h2>
          <p className="text-base max-w-md mx-auto leading-relaxed" style={{ color: '#3d3d3d' }}>
            Sudah kami jawab semua di sini.
            <br />
            Masih ada yang kurang jelas? Tim kami siap membantu dalam hitungan menit.
          </p>
        </div>

        {/* Category filter pills — active = red */}
        <div className="flex flex-wrap gap-2 justify-center mb-8">
          <button
            onClick={() => setActiveCategory(null)}
            className="text-xs font-bold px-4 py-2 rounded-full transition-all"
            style={{
              backgroundColor: activeCategory === null ? '#D70808' : '#fff',
              color: activeCategory === null ? '#fff' : '#D70808',
              border: '1.5px solid #D70808',
            }}>
            Semua
          </button>
          {categories.map(cat => (
            <button key={cat}
              onClick={() => setActiveCategory(activeCategory === cat ? null : cat)}
              className="text-xs font-bold px-4 py-2 rounded-full transition-all"
              style={{
                backgroundColor: activeCategory === cat ? '#D70808' : '#fff',
                color: activeCategory === cat ? '#fff' : '#D70808',
                border: '1.5px solid #D70808',
              }}>
              {cat}
            </button>
          ))}
        </div>

        {/* FAQ accordion */}
        <div className="max-w-3xl mx-auto bg-white rounded-3xl px-7 py-2 mb-12"
          style={{ boxShadow: '0 4px 24px rgba(0,0,0,0.06)' }}>
          {filtered.map(item => <FAQItem key={item.q} q={item.q} a={item.a} />)}
        </div>

        {/* CTA block */}
        <div className="max-w-lg mx-auto text-center">
          <p className="text-sm font-semibold mb-6" style={{ color: '#3d3d3d' }}>
            Masih ada pertanyaan lain? Tim Full Bright siap menjawab dalam hitungan menit.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center mb-1">
            <Button href="https://wa.me/6281234567890?text=Halo%20Kak%2C%20saya%20mau%20tanya%20tentang%20program%20TOEFL%20Full%20Bright%20Indonesia" size="lg">
              💬 Chat via WhatsApp
            </Button>
            <Button href="#pricing" variant="ghost" size="lg">
              Daftar Sekarang →
            </Button>
          </div>
          <SocialProofMicro />
        </div>
      </SectionWrapper>
    </>
  );
}
