import { Star } from 'lucide-react';

interface SocialProofMicroProps {
  variant?: 'default' | 'light';
}

export default function SocialProofMicro({ variant = 'default' }: SocialProofMicroProps) {
  const color = variant === 'light' ? 'rgba(255,255,255,0.75)' : '#6b7280';

  return (
    <div className="flex items-center justify-center flex-wrap gap-x-3 gap-y-1 mt-3">
      <span className="flex items-center gap-1 text-xs font-semibold" style={{ color }}>
        {Array.from({ length: 5 }).map((_, i) => (
          <Star key={i} size={11} fill="#F59E0B" color="#F59E0B" />
        ))}
        <span className="ml-1">4.9/5</span>
      </span>
      <span className="text-xs" style={{ color }}>•</span>
      <span className="text-xs font-semibold" style={{ color }}>45.000+ Alumni Sukses</span>
      <span className="text-xs" style={{ color }}>•</span>
      <span className="text-xs font-semibold" style={{ color }}>✅ Garansi 100% Uang Kembali</span>
    </div>
  );
}
