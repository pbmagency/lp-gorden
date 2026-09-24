const fs = require('fs');
let c = fs.readFileSync('resources/js/pages/cycle3/c3-lp.tsx', 'utf8');
c = c.replace('<style>{', '<Head title="Gorden Custom Solo – Survey & Pasang ke Lokasi Anda"><link rel="preload" href="/assets-c3/hero-gorden-flip.webp" as="image" type="image/webp" fetchPriority="high" /><link rel="preload" href="/assets-c3/logo.webp" as="image" type="image/webp" /><meta name="description" content="Gorden custom Solo & sekitarnya. Survey & pasang ke lokasi, free ongkos ukur. Hubungi owner langsung via WhatsApp." /></Head><style>{');
fs.writeFileSync('resources/js/pages/cycle3/c3-lp.tsx', c, 'utf8');
