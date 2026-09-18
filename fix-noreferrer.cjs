const fs = require('fs');
let c = fs.readFileSync('resources/js/pages/cycle2/c2-lp.tsx','utf8');
c = c.replace(/rel="noopener"/g, 'rel="noopener noreferrer"');
fs.writeFileSync('resources/js/pages/cycle2/c2-lp.tsx', c);
console.log("Fixed noreferrer in c2-lp.tsx");
