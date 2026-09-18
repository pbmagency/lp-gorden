const fs = require('fs');
const path = 'resources/views/app.blade.php';
let content = fs.readFileSync(path, 'utf8');

// 1. Update isLeanLanding to include c2-lp
content = content.replace(
    /\$isLeanLanding = request\(\)->is\('\/'\) \|\| request\(\)->is\('c1-lp'\);/,
    "$isLeanLanding = request()->is('/') || request()->is('c1-lp') || request()->is('c2-lp');"
);

// 2. Add app.css load for c2-lp under landing-loader
const targetVite = `@viteReactRefresh
    @if($isLeanLanding)
        @vite('resources/js/landing-loader.ts')
    @else`;

const replacementVite = `@viteReactRefresh
    @if($isLeanLanding)
        @vite('resources/js/landing-loader.ts')
        @if(request()->is('c2-lp'))
            @vite('resources/css/app.css')
        @endif
    @else`;

content = content.replace(targetVite, replacementVite);

fs.writeFileSync(path, content, 'utf8');
console.log("Updated app.blade.php for lean landing with CSS.");
