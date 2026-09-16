const fs = require('fs');
const paths = [
    'resources/js/pages/cycle1/c1-lp.tsx',
    'resources/js/pages/GordenLanding.tsx',
    'resources/js/components/sections/gorden/WhatsAppGreeting.tsx'
];
paths.forEach(p => {
    let c = fs.readFileSync(p, 'utf-8');
    c = c.replace(/\/ loading="lazy"/g, 'loading="lazy" /');
    c = c.replace(/\/ decoding="async"/g, 'decoding="async" /');
    c = c.replace(/\/ fetchpriority="high"/g, 'fetchpriority="high" /');
    fs.writeFileSync(p, c);
});
