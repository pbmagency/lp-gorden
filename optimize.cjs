const fs = require('fs');

function optimizeFile(filePath) {
    let content = fs.readFileSync(filePath, 'utf-8');
    
    // Add rel="noopener noreferrer" to external links
    content = content.replace(/rel="noopener"/g, 'rel="noopener noreferrer"');
    content = content.replace(/target="_blank"(?!.*rel=)/g, 'target="_blank" rel="noopener noreferrer"');
    
    // Add loading="lazy" decoding="async" to images without them
    // Skip logo.webp as it's likely above the fold
    content = content.replace(/<img([^>]+)>/g, (match, attrs) => {
        if (attrs.includes('logo.webp')) {
            // Keep eager for logo
            if (!attrs.includes('decoding=')) attrs += ' decoding="async"';
            if (!attrs.includes('fetchpriority=')) attrs += ' fetchpriority="high"';
            return `<img${attrs}>`;
        }
        
        let newAttrs = attrs;
        if (!newAttrs.includes('loading=')) {
            newAttrs += ' loading="lazy"';
        }
        if (!newAttrs.includes('decoding=')) {
            newAttrs += ' decoding="async"';
        }
        return `<img${newAttrs}>`;
    });
    
    fs.writeFileSync(filePath, content);
}

optimizeFile('resources/js/pages/cycle1/c1-lp.tsx');
optimizeFile('resources/js/pages/GordenLanding.tsx');
optimizeFile('resources/js/components/sections/gorden/WhatsAppGreeting.tsx');
