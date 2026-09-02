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

async function optimizeCycleOneImages() {
    const source = fs.readFileSync(
        path.join(root, 'resources', 'js', 'pages', 'cycle1', 'c1-lp.tsx'),
        'utf8',
    );
    const names = [...source.matchAll(/\/assets\/([A-Za-z0-9._-]+\.(?:png|jpe?g))/gi)]
        .map((match) => match[1]);

    for (const name of new Set(names)) {
        const input = path.join(assetsPath, name);
        const output = path.join(assetsPath, `${path.parse(name).name}.webp`);
        if (!fs.existsSync(input) || fs.existsSync(output)) continue;
        await sharp(input)
            .rotate()
            .resize({ width: 1280, height: 1280, fit: 'inside', withoutEnlargement: true })
            .webp({ quality: 76, effort: 6 })
            .toFile(output);
        console.log(`${name} -> ${path.basename(output)}`);
    }
}

async function optimizeImages() {
    await sharp(path.join(assetsPath, 'logo.webp'))
        .resize(64, 64, { fit: 'inside', withoutEnlargement: true })
        .webp({ quality: 82, effort: 6 })
        .toFile(path.join(assetsPath, 'logo-64.webp'));

    await sharp(path.join(assetsPath, 'proses-pasang.webp'))
        .rotate()
        .resize({
            width: 1280,
            height: 1280,
            fit: 'inside',
            withoutEnlargement: true,
        })
        .webp({ quality: 76, effort: 6 })
        .toFile(path.join(assetsPath, 'proses-pasang-1280.webp'));

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
            try {
                fs.copyFileSync(temporary, source);
                fs.unlinkSync(temporary);
                console.log(
                    `${file}: ${Math.round(sourceSize / 1024)}KB -> ${Math.round(optimizedSize / 1024)}KB`,
                );
            } catch (error) {
                fs.unlinkSync(temporary);
                if (!['EBUSY', 'EPERM', 'UNKNOWN'].includes(error.code)) throw error;
                console.warn(`${file}: skipped because the source file is in use`);
            }
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
Promise.all([optimizeImages(), optimizeCycleOneImages()]).catch((error) => {
    console.error(error);
    process.exitCode = 1;
});
