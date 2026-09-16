const fs = require('fs');

function addPreload(filePath) {
    let content = fs.readFileSync(filePath, 'utf-8');
    if (!content.includes('<link rel="preload" href="/assets/hero-gorden-flip.webp"')) {
        content = content.replace('</title>', '</title>\n                <link rel="preload" href="/assets/hero-gorden-flip.webp" as="image" fetchpriority="high" />\n                <link rel="preload" href="/assets/logo.webp" as="image" fetchpriority="high" />');
        fs.writeFileSync(filePath, content);
    }
}

addPreload('resources/js/pages/cycle1/c1-lp.tsx');
addPreload('resources/js/pages/GordenLanding.tsx');
