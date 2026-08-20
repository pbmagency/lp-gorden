const fs = require('node:fs');
const path = require('node:path');
const sharp = require('sharp');

const root = path.resolve(__dirname, '..');
const landingPath = path.join(
    root,
    'resources',
    'js',
    'pages',
    'GordenLanding.tsx',
);
const assetsPath = path.join(root, 'public', 'assets');

async function optimizeImages() {
    const files = fs
        .readdirSync(assetsPath)
        .filter((file) => file.endsWith('.webp'));

    for (const file of files) {
        const source = path.join(assetsPath, file);
        const sourceSize = fs.statSync(source).size;
        const metadata = await sharp(source).metadata();

        // Small WebP files are already efficient. Large source photos, however,
        // should never ship at camera resolution to a 1000px-wide landing page.
        if (sourceSize < 150 * 1024 && (metadata.width ?? 0) <= 1600) continue;

        const temporary = `${source}.optimized`;
        await sharp(source)
            .rotate()
            .resize({
                width: 1280,
                height: 1280,
                fit: 'inside',
                withoutEnlargement: true,
            })
            .webp({ quality: 76, effort: 6 })
            .toFile(temporary);

        const optimizedSize = fs.statSync(temporary).size;
        if (optimizedSize < sourceSize) {
            fs.unlinkSync(source);
            fs.renameSync(temporary, source);
            console.log(
                `${file}: ${Math.round(sourceSize / 1024)}KB -> ${Math.round(optimizedSize / 1024)}KB`,
            );
        } else {
            fs.unlinkSync(temporary);
        }
    }
}

function enableLazyBackgrounds() {
    const source = fs.readFileSync(landingPath, 'utf8');
    const result = source.replace(
        /backgroundImage:\s*("[^"]*"|`[^`]*`),\s*backgroundSize:/g,
        '...lazyBackground($1), backgroundSize:',
    );

    fs.writeFileSync(landingPath, result);
}

enableLazyBackgrounds();
optimizeImages().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});
