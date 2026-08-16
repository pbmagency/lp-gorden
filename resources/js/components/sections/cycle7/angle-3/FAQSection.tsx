'use client';

import { ChevronDown } from 'lucide-react';
import { useState } from 'react';
import type { ReactNode } from 'react';
import LpButton from '@/components/ui/lp-button';
import SectionWrapper from '@/components/ui/section-wrapper';
import SocialProofMicro from '@/components/ui/social-proof-micro';
import { useAnalytics } from '@/hooks/use-analytics';
import { waUrl } from '@/lib/wa-number';

const jadwalSlots = [
    'Pagi (09.00 – 10.00 WIB)',
    'Siang (13.00 – 14.00 WIB)',
    'Sore (16.00 – 17.00 WIB)',
    'Malam (19.00 – 20.00 WIB)',
    'Malam (20.15 – 21.15 WIB)',
];

const faqs: { category: string; q: string; a: string; node?: ReactNode }[] = [
    { 
        category: 'Belajar Mandiri (LMS)', 
        q: 'Kalau ambil paket Self-Study LMS, apa saja yang saya dapat?', 
        a: 'Kamu dapat akses penuh ke LMS Full Bright: 60+ video materi Full Skills (Listening, Structure, Reading), materi terstruktur hari ke-1 sampai ke-15, 1.000+ nomor latihan soal beserta pembahasan, diagnostic test, serta grup WA diskusi. Semua bisa diakses kapan saja tanpa terikat jadwal kelas.' 
    },
    { 
        category: 'Belajar Mandiri (LMS)', 
        q: 'Bagaimana cara akses LMS setelah saya bayar?', 
        a: 'Setelah pembayaran berhasil, kamu langsung menerima email berisi link dan akun untuk masuk ke platform LMS Full Bright. Akses berlaku 2 tahun dan bisa dibuka dari HP maupun laptop, kapan pun kamu punya waktu.' 
    },
    { 
        category: 'Belajar Mandiri (LMS)', 
        q: 'Saya belajar sendiri di LMS. Kalau bingung, bisa tanya ke siapa?', 
        a: 'Kamu tetap tidak belajar sendirian. Setiap peserta LMS masuk ke grup WA diskusi, jadi kalau ada soal atau materi yang bikin bingung, kamu bisa langsung bertanya dan dibantu. Ini bedanya dengan belajar otodidak dari YouTube — di sana tidak ada yang menjawab kalau kamu stuck.' 
    },
    { 
        category: 'Belajar Mandiri (LMS)', 
        q: 'Apakah bisa dicoba dulu sebelum bayar?', 
        a: 'Bisa. Tersedia akses free trial LMS agar kamu bisa merasakan sendiri kualitas video materi dan latihan soalnya sebelum memutuskan. Kalau cocok, tinggal lanjut ambil paketnya.' 
    },
    { 
        category: 'Belajar Mandiri (LMS)', 
        q: 'Apakah bisa belajar tanpa terikat jadwal karena saya sibuk?', 
        a: 'Justru itu kelebihan paket belajar mandiri: tidak ada jam kelas yang harus dikejar. Semua materi tersedia di LMS 24/7 dan bisa diulang berapa kali pun. Banyak alumni kami karyawan, PNS aktif, dan mahasiswa tingkat akhir yang belajar di sela-sela kesibukan.' 
    },
    { 
        category: 'Metode & Efektivitas', 
        q: 'Apakah metode ini cocok untuk pemula yang grammar-nya sangat lemah?', 
        a: 'Sangat cocok. Materi disusun dari level dasar dan berurutan hari ke-1 sampai ke-15, jadi kamu tidak perlu grammar sempurna untuk memulai. Fokusnya bukan menguasai semua tata bahasa Inggris, tapi mengenali pola soal yang benar-benar keluar di TOEFL ITP.' 
    },
    { 
        category: 'Metode & Efektivitas', 
        q: 'Kenapa belajar di sini beda dengan belajar sendiri dari buku dan YouTube?', 
        a: 'Dua hal yang paling sering bikin belajar otodidak gagal: materinya tidak terstruktur dan tidak ada yang bisa ditanya kalau salah. Di Full Bright, materi sudah berurutan dan fokus ke pola soal TOEFL, setiap latihan ada pembahasannya, dan ada grup diskusi untuk bertanya.' 
    },
    { 
        category: 'Metode & Efektivitas', 
        q: 'Berapa kenaikan skor yang bisa saya harapkan?', 
        a: 'Berdasarkan data alumni, peserta yang mengikuti materi secara konsisten dan mengerjakan semua bank soal rata-rata naik 80–100 poin. Yang paling banyak dirasakan alumni adalah jadi paham pola soal TOEFL, dan dari situ skornya ikut naik.' 
    },
    { 
        category: 'Metode & Efektivitas', 
        q: 'Apakah dijamin bisa mencapai skor 500?', 
        a: 'Kami tidak menjanjikan skor 500 secara mutlak karena hasil tergantung konsistensi masing-masing peserta. Yang bisa kami jamin: metode yang sudah terbukti pada 45.000+ alumni, materi yang fokus dan terstruktur, serta pendampingan selama program.' 
    },
    { 
        category: 'Metode & Efektivitas', 
        q: 'Apakah ada batasan usia untuk mengikuti program ini?', 
        a: 'Program terbuka untuk usia 17 hingga 45 tahun. Cocok untuk pelajar, mahasiswa, fresh graduate, maupun karyawan yang butuh skor TOEFL untuk studi, karir, atau beasiswa.' 
    },
    { 
        category: 'Dibimbing Tutor', 
        q: 'Apa bedanya paket Dibimbing Tutor dengan Self-Study LMS?', 
        a: 'Semua materi LMS tetap kamu dapat. Tambahannya khusus di paket Dibimbing Tutor: LIVE ZOOM 15 hari bersama instruktur, rekaman ZOOM, dan sertifikat TOEFL Prediction. Cocok kalau kamu merasa lebih terbantu dengan penjelasan langsung dan tempo belajar yang dipandu.' 
    },
    { 
        category: 'Dibimbing Tutor', 
        q: 'Kapan jadwal LIVE ZOOM-nya dan apakah bisa dipilih?', 
        a: 'Khusus paket Dibimbing Tutor. Tersedia 5 pilihan sesi harian:\n\n',
        node: (
            <div
                className="text-sm leading-relaxed"
                style={{ color: '#3d3d3d' }}
            >
                <p className="mb-2.5" style={{ color: '#3d3d3d' }}>
                    Khusus paket Dibimbing Tutor. Tersedia 5 pilihan sesi harian:
                </p>
                <ul className="mb-3 flex flex-col gap-1.5">
                    {jadwalSlots.map((s) => (
                        <li key={s} className="flex items-center gap-2">
                            <span
                                className="font-black"
                                style={{ color: '#D70808' }}
                            >
                                •
                            </span>{' '}
                            {s}
                        </li>
                    ))}
                </ul>
                <p className="text-xs italic" style={{ color: '#6b7280' }}>
                    Catatan: Jika berhalangan hadir LIVE ZOOM, jangan khawatir —
                    materi bisa diakses di rekaman ZOOM.
                </p>
            </div>
        ),
    },
    { 
        category: 'Dibimbing Tutor', 
        q: 'Kalau saya tidak bisa hadir LIVE ZOOM, bagaimana?', 
        a: 'Khusus paket Dibimbing Tutor. Setiap sesi direkam dan rekamannya bisa diakses seumur hidup, jadi kamu tetap bisa mengejar materi kalau berhalangan hadir. Kelas hanya 60 menit per hari agar tetap muat di jadwal yang padat.' 
    },
    { 
        category: 'Sertifikat & Legalitas', 
        q: 'Apakah saya dapat sertifikat TOEFL?', 
        a: 'Sertifikat TOEFL Prediction diberikan khusus untuk paket Dibimbing Tutor setelah mengikuti post test. Paket Self-Study LMS fokus pada materi dan latihan, tanpa sertifikat.' 
    },
    { 
        category: 'Sertifikat & Legalitas', 
        q: 'Apakah lembaganya resmi dan sertifikatnya valid?', 
        a: 'Full Bright Indonesia adalah lembaga resmi dengan legalitas lengkap: SK Kemenkumham RI Nomor AHU-0055720-AH.0114 Tahun 2020, SK Izin Operasional LKP 503/20177/LKP/DPM-PTSP/8/2024, NPSN Nomor K9998700, dan bekerja sama dengan IIEF Jakarta. Sertifikat dapat digunakan untuk daftar kuliah S1/S2/S3, lamar kerja, seleksi CPNS, rekrutmen BUMN, ujian skripsi, kenaikan pangkat, dan pendaftaran beasiswa.' 
    },
    { 
        category: 'Pendaftaran & Pembayaran', 
        q: 'Bagaimana cara mendaftar dan metode pembayaran apa saja?', 
        a: 'Klik tombol daftar, pilih paket yang sesuai, lalu selesaikan pembayaran. Setelah itu kamu langsung menerima email konfirmasi beserta akses LMS dan grup WhatsApp. Pembayaran bisa via transfer bank, GoPay, OVO, DANA, dan QRIS.' 
    },
    { 
        category: 'Jaminan & Garansi', 
        q: 'Apakah ada garansi kalau skor saya belum mencapai target?', 
        a: 'Garansi mengulang sampai skor target tercapai berlaku khusus untuk Paket Bundling (Dibimbing Tutor). Jika sudah mengikuti program secara penuh dan konsisten tapi skor belum tercapai, kamu bisa claim garansi dan mengulang kelas di batch berikutnya.' 
    },
];

const defaultOpen = new Set([
    'Kalau ambil paket Self-Study LMS, apa saja yang saya dapat?',
    'Kenapa belajar di sini beda dengan belajar sendiri dari buku dan YouTube?',
    'Apa bedanya paket Dibimbing Tutor dengan Self-Study LMS?',
]);
const categories = [...new Set(faqs.map((f) => f.category))];

const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map((faq) => ({
        '@type': 'Question',
        name: faq.q,
        acceptedAnswer: { '@type': 'Answer', text: faq.a },
    })),
};

function FAQItem({ q, a, node }: { q: string; a: string; node?: ReactNode }) {
    const [open, setOpen] = useState(defaultOpen.has(q));

    return (
        <div className="border-b border-gray-100 last:border-0">
            <button
                onClick={() => setOpen((o) => !o)}
                className="flex w-full cursor-pointer items-start justify-between gap-4 py-5 text-left"
            >
                <span
                    className="text-sm leading-snug font-bold transition-colors duration-200"
                    style={{
                        fontFamily: 'var(--font-heading)',
                        color: open ? '#D70808' : '#151515',
                    }}
                >
                    {q}
                </span>
                <ChevronDown
                    size={18}
                    className="mt-0.5 shrink-0 transition-transform duration-300"
                    style={{
                        transform: open ? 'rotate(180deg)' : 'rotate(0deg)',
                        color: open ? '#D70808' : '#9ca3af',
                    }}
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
                <div className="pr-8 pb-6">
                    {node ?? (
                        <p
                            className="text-sm leading-relaxed"
                            style={{ color: '#3d3d3d' }}
                        >
                            {a}
                        </p>
                    )}
                </div>
            </div>
        </div>
    );
}

export default function FAQSection() {
    const [activeCategory, setActiveCategory] = useState<string | null>(null);
    const { trackCTA, trackConversion } = useAnalytics();
    const inquiryUrl = waUrl(
        'Halo Admin Full Bright Indonesia. Saya minat mau daftar kelas TOEFL. Saya mau tanya-tanya dulu.',
    );
    const filtered = activeCategory
        ? faqs.filter((f) => f.category === activeCategory)
        : faqs;

    return (
        <>
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
            />
            <SectionWrapper
                id="faq"
                bg="cultured"
                className="pt-20 pb-12 md:pt-28 md:pb-16"
            >
                <div className="mb-14 text-center">
                    <div
                        className="mb-5 inline-flex items-center gap-2 rounded-full px-4 py-1.5 text-xs font-bold tracking-widest uppercase"
                        style={{
                            backgroundColor: '#FFF0F0',
                            color: '#D70808',
                            border: '1px solid #ffb3b3',
                        }}
                    >
                        ❓ FAQ
                    </div>
                    <h2
                        className="mb-5 text-2xl font-black sm:text-3xl md:text-4xl"
                        style={{
                            fontFamily: 'var(--font-heading)',
                            color: '#151515',
                        }}
                    >
                        Pertanyaan yang Sering Ditanyakan{' '}
                        <span style={{ color: '#D70808' }}>Sebelum Daftar</span>
                    </h2>
                </div>

                <div className="mb-8 flex flex-wrap justify-center gap-2">
                    <button
                        onClick={() => setActiveCategory(null)}
                        className="cursor-pointer rounded-full px-4 py-2 text-xs font-bold transition-all"
                        style={{
                            backgroundColor:
                                activeCategory === null ? '#D70808' : '#fff',
                            color: activeCategory === null ? '#fff' : '#D70808',
                            border: '1.5px solid #D70808',
                        }}
                    >
                        Semua
                    </button>
                    {categories.map((cat) => (
                        <button
                            key={cat}
                            onClick={() =>
                                setActiveCategory(
                                    activeCategory === cat ? null : cat,
                                )
                            }
                            className="cursor-pointer rounded-full px-4 py-2 text-xs font-bold transition-all"
                            style={{
                                backgroundColor:
                                    activeCategory === cat ? '#D70808' : '#fff',
                                color:
                                    activeCategory === cat ? '#fff' : '#D70808',
                                border: '1.5px solid #D70808',
                            }}
                        >
                            {cat}
                        </button>
                    ))}
                </div>

                <div
                    className="mx-auto mb-12 max-w-3xl rounded-3xl bg-white px-7 py-2"
                    style={{ boxShadow: '0 4px 24px rgba(0,0,0,0.06)' }}
                >
                    {filtered.map((item) => (
                        <FAQItem
                            key={item.q}
                            q={item.q}
                            a={item.a}
                            node={item.node}
                        />
                    ))}
                </div>

                <div className="mx-auto max-w-lg text-center">
                    <p
                        className="mb-6 text-sm font-semibold"
                        style={{ color: '#3d3d3d' }}
                    >
                        Masih ada pertanyaan lain? Hubungi kami sekarang.
                    </p>
                    <div className="mb-1 flex flex-col justify-center gap-3 sm:flex-row">
                        <LpButton
                            href={inquiryUrl}
                            size="md"
                            onClick={() => {
                                try {
                                    (
                                        window as {
                                            fbq?: (
                                                e: string,
                                                n: string,
                                                p?: object,
                                            ) => void;
                                        }
                                    ).fbq?.('track', 'Search', {
                                        search_string:
                                            'TOEFL Full Bright - WhatsApp Inquiry',
                                    });
                                } catch {
                                    /* fbq not loaded */
                                }

                                trackCTA(
                                    'faq_primary',
                                    'Chat Via WA',
                                    inquiryUrl,
                                );
                                trackConversion('wa_inquiry', {
                                    location: 'faq_primary',
                                });
                            }}
                        >
                            Chat Via WA →
                        </LpButton>
                        <LpButton
                            href="#testimonials"
                            variant="ghost"
                            size="md"
                            onClick={() =>
                                trackCTA(
                                    'faq_testimonials',
                                    'Lihat Bukti Alumni',
                                    '#testimonials',
                                )
                            }
                        >
                            Lihat Bukti Alumni →
                        </LpButton>
                    </div>
                    <SocialProofMicro />
                </div>
            </SectionWrapper>
        </>
    );
}