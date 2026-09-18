const fs = require('fs');
const lines = fs.readFileSync('resources/js/pages/cycle2/c2-lp.tsx','utf8').split('\n');
lines.forEach((l,i) => {
    if(l.includes('target="_blank"')) console.log((i+1)+': '+l.trim());
});
