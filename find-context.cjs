const fs = require('fs');
const content = fs.readFileSync('resources/js/pages/cycle2/c2-lp.tsx', 'utf-8');

['kat-vitrase', 'kat-outdoor', 'owner-elang'].forEach(name => {
    const idx = content.indexOf(name);
    if (idx !== -1) {
        console.log(`\n=== ${name} ===`);
        console.log(content.substring(idx - 100, idx + 100));
    } else {
        console.log(`\n=== ${name} === NOT FOUND`);
    }
});
