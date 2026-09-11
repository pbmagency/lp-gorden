const fs = require('fs');
const path = 'resources/js/pages/cycle1/c1-lp.tsx';
let content = fs.readFileSync(path, 'utf-8');
const start1 = content.indexOf('Gorden Siang &amp; Vitrase');
console.log(content.substring(start1 - 600, start1));

const start2 = content.indexOf('Outdoor Blinds');
console.log(content.substring(start2 - 600, start2));
