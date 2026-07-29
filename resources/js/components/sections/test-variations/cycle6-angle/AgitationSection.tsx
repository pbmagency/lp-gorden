import { ArrowDown } from 'lucide-react';
import SectionWrapper from '@/components/ui/section-wrapper';

// Variant ID: c6-angle-1
// Cycle: 6 | Role: Challenger

const beforeItems = [
    '"Yang penting essay kuat, TOEFL nomor dua."',
    '"Belajar TOEFL sendiri dari YouTube juga cukup."',
    '"Nanti aja ngejar skor TOEFL pas deadline sudah dekat"',
];

const afterItems = [
    'Submission ditolak karena syarat TOEFL belum tercapai.',
    'Skor stuck di 450 meski sudah belajar sendiri berminggu-minggu.',
    'Terpaksa mengubur impian kuliah ke luar negeri gara-gara TOEFL.',
];

export default function AgitationSection() {
    return (
        <SectionWrapper bg="cultured" className="py-14 md:py-20" id="agitation">
            <div className="mx-auto max-w-2xl">
                {/* Tag */}
                <div className="mb-8 text-center md:mb-10">
                    <div
                        className="mb-6 inline-flex items-center gap-2 rounded-full px-4 py-1.5 text-xs font-bold tracking-widest uppercase"
                        style={{
                            backgroundColor: '#FFF0F0',
                            color: '#D70808',
                            border: '1px solid #ffb3b3',
                        }}
                    >
                        <span>😩</span> Submission Ditolak Gara-Gara TOEFL?
                    </div>

                    {/* Headline */}
                    <h2
                        className="mb-3 text-2xl leading-tight font-black sm:text-3xl md:mb-4 md:text-4xl"
                        style={{
                            fontFamily: 'var(--font-heading)',
                            color: '#151515',
                        }}
                    >
                        Banyak Pejuang Beasiswa Luar Negeri Baru Sadar TOEFL Itu
                        Rintangan Terbesar{' '}
                        <span style={{ color: '#D70808' }}>
                            Setelah Submission Ditolak.
                        </span>
                    </h2>

                    {/* Subheadline */}
                    <p
                        className="mx-auto max-w-xl text-base leading-relaxed"
                        style={{ color: '#3d3d3d' }}
                    >
                        Yang awalnya dikira cukup belajar sendiri, ternyata
                        butuh strategi submission yang tepat.
                    </p>
                </div>

                {/* Before / After Block */}
                <div
                    className="mb-10 overflow-hidden rounded-2xl md:mb-12"
                    style={{ border: '1px solid #e0e0e0' }}
                >
                    {/* "Before" Column */}
                    <div
                        style={{ backgroundColor: '#ffffff' }}
                        className="p-5 md:p-7"
                    >
                        <p
                            className="mb-4 text-xs font-bold tracking-widest uppercase"
                            style={{ color: '#9a9a9a' }}
                        >
                            Mungkin Awalnya berpikir...
                        </p>
                        <ul className="space-y-3">
                            {beforeItems.map((item, i) => (
                                <li key={i} className="flex items-start gap-3">
                                    <span
                                        className="mt-0.5 flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full text-xs font-black"
                                        style={{
                                            backgroundColor: '#FFF0F0',
                                            color: '#D70808',
                                        }}
                                    >
                                        ✗
                                    </span>
                                    <p
                                        className="text-sm leading-snug font-medium sm:text-base"
                                        style={{ color: '#3d3d3d' }}
                                    >
                                        {item}
                                    </p>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Divider */}
                    <div
                        className="flex items-center gap-3 px-5 py-3 md:px-7"
                        style={{
                            backgroundColor: '#F7F7F7',
                            borderTop: '1px solid #e0e0e0',
                            borderBottom: '1px solid #e0e0e0',
                        }}
                    >
                        <div
                            className="h-px flex-1"
                            style={{ backgroundColor: '#e0e0e0' }}
                        />
                        <span
                            className="flex-shrink-0 text-xs font-bold tracking-widest uppercase"
                            style={{ color: '#9a9a9a' }}
                        >
                            Setelah dijalani...
                        </span>
                        <div
                            className="h-px flex-1"
                            style={{ backgroundColor: '#e0e0e0' }}
                        />
                    </div>

                    {/* "After" Column */}
                    <div
                        style={{ backgroundColor: '#FFFAFA' }}
                        className="p-5 md:p-7"
                    >
                        <ul className="space-y-3">
                            {afterItems.map((item, i) => (
                                <li key={i} className="flex items-start gap-3">
                                    <span
                                        className="mt-0.5 flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full text-xs font-black"
                                        style={{
                                            backgroundColor: '#FFE0E0',
                                            color: '#D70808',
                                        }}
                                    >
                                        !
                                    </span>
                                    <p
                                        className="text-sm leading-snug font-medium sm:text-base"
                                        style={{ color: '#3d3d3d' }}
                                    >
                                        {item}
                                    </p>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>

                {/* Closing Bridge */}
                <div className="space-y-3 text-center">
                    <p
                        className="text-xl leading-relaxed md:text-[22px]"
                        style={{ color: '#3d3d3d' }}
                    >
                        Kabar baiknya, submission yang ditolak bukan akhir dari
                        cerita.
                    </p>
                    <p
                        className="text-xl leading-relaxed font-semibold md:text-[22px]"
                        style={{ color: '#151515' }}
                    >
                        Selama kamu mulai sekarang dengan strategi dan bimbingan
                        yang tepat
                    </p>

                    <div className="flex justify-center pt-2">
                        <ArrowDown size={22} style={{ color: '#D70808' }} />
                    </div>
                </div>
            </div>
        </SectionWrapper>
    );
}
