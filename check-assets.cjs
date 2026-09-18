const fs = require('fs');
const path = require('path');

const content = fs.readFileSync('resources/js/pages/cycle2/c2-lp.tsx', 'utf-8');
const assetMatches = content.match(/\/assets\/[^'"`\s)\\]+/g);
const unique = [...new Set(assetMatches)];

console.log('=== MISSING FILES ===');
unique.forEach(assetPath => {
    const cleanPath = assetPath.replace(/\\.*/, ''); // clean escapes
    const fullPath = 'public' + cleanPath;
    if (!fs.existsSync(fullPath)) {
        console.log('MISSING:', cleanPath);
    }
});

console.log('\n=== ALL FOUND ===');
unique.forEach(assetPath => {
    const fullPath = 'public' + assetPath;
    if (fs.existsSync(fullPath)) {
        console.log('OK:', assetPath);
    }
});
