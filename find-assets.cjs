const fs = require('fs');

const content = fs.readFileSync('resources/js/pages/cycle2/c2-lp.tsx', 'utf-8');

// Extract all asset paths
const assetMatches = content.match(/\/assets-?[0-9]*\/[^'"\s)]+/g);
if (assetMatches) {
    const unique = [...new Set(assetMatches)];
    unique.forEach(p => console.log(p));
} else {
    // Try generic asset pattern
    const genericMatches = content.match(/['"`][^'"`]*\.(webp|png|jpg|jpeg|svg|gif)[^'"`]*['"`]/g);
    if (genericMatches) {
        const unique = [...new Set(genericMatches)];
        unique.forEach(p => console.log(p));
    } else {
        console.log('No asset paths found');
    }
}
