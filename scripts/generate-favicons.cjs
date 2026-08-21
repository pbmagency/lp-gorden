const sharp = require('sharp');
const path = require('path');
const fs = require('fs');

const root = path.resolve(__dirname, '..');
const publicDir = path.join(root, 'public');

// Source logo - use the icon/brand mark version
const sourceLogo = path.join(publicDir, 'logo', 'Logo-Fullbright.webp');

async function generateFavicons() {
    // Check if source exists
    if (!fs.existsSync(sourceLogo)) {
        console.error('Source logo not found:', sourceLogo);
        process.exit(1);
    }

    console.log('Generating favicons from:', sourceLogo);

    // Generate apple-touch-icon.png (180x180)
    await sharp(sourceLogo)
        .resize(180, 180, { fit: 'contain', background: { r: 255, g: 255, b: 255, alpha: 1 } })
        .png()
        .toFile(path.join(publicDir, 'apple-touch-icon.png'));
    console.log('Generated apple-touch-icon.png (180x180)');

    // Generate favicon-192.png (for Android)
    await sharp(sourceLogo)
        .resize(192, 192, { fit: 'contain', background: { r: 255, g: 255, b: 255, alpha: 1 } })
        .png()
        .toFile(path.join(publicDir, 'favicon-192.png'));
    console.log('Generated favicon-192.png (192x192)');

    // Generate favicon-512.png (for PWA)
    await sharp(sourceLogo)
        .resize(512, 512, { fit: 'contain', background: { r: 255, g: 255, b: 255, alpha: 1 } })
        .png()
        .toFile(path.join(publicDir, 'favicon-512.png'));
    console.log('Generated favicon-512.png (512x512)');

    // Generate favicon.png (32x32 for standard favicon fallback)
    await sharp(sourceLogo)
        .resize(32, 32, { fit: 'contain', background: { r: 255, g: 255, b: 255, alpha: 1 } })
        .png()
        .toFile(path.join(publicDir, 'favicon.png'));
    console.log('Generated favicon.png (32x32)');

    // Generate favicon.ico using multiple sizes
    const sizes = [16, 32, 48];
    const icoBuffers = [];
    
    for (const size of sizes) {
        const buffer = await sharp(sourceLogo)
            .resize(size, size, { fit: 'contain', background: { r: 255, g: 255, b: 255, alpha: 1 } })
            .png()
            .toBuffer();
        icoBuffers.push(buffer);
    }

    // Create ICO file manually (simple format)
    const ico = createICO(icoBuffers, sizes);
    fs.writeFileSync(path.join(publicDir, 'favicon.ico'), ico);
    console.log('Generated favicon.ico (multi-size: 16, 32, 48)');

    console.log('\nAll favicons generated successfully!');
}

function createICO(pngBuffers, sizes) {
    // ICO file format:
    // Header (6 bytes): reserved (2), type (2), count (2)
    // Directory entries (16 bytes each): width, height, colors, reserved, planes, bpp, size, offset
    // PNG data for each size

    const count = pngBuffers.length;
    const headerSize = 6;
    const dirEntrySize = 16;
    const dirSize = dirEntrySize * count;
    
    let dataOffset = headerSize + dirSize;
    
    // Build directory entries and collect data
    const entries = [];
    const dataParts = [];
    
    for (let i = 0; i < count; i++) {
        const size = sizes[i];
        const buffer = pngBuffers[i];
        
        entries.push({
            width: size >= 256 ? 0 : size,
            height: size >= 256 ? 0 : size,
            colors: 0,
            reserved: 0,
            planes: 1,
            bpp: 32,
            size: buffer.length,
            offset: dataOffset,
        });
        
        dataParts.push(buffer);
        dataOffset += buffer.length;
    }
    
    // Calculate total size
    const totalSize = dataOffset;
    const ico = Buffer.alloc(totalSize);
    
    // Write header
    ico.writeUInt16LE(0, 0);      // reserved
    ico.writeUInt16LE(1, 2);      // type = ICO
    ico.writeUInt16LE(count, 4);  // count
    
    // Write directory entries
    let offset = headerSize;
    for (const entry of entries) {
        ico.writeUInt8(entry.width, offset);
        ico.writeUInt8(entry.height, offset + 1);
        ico.writeUInt8(entry.colors, offset + 2);
        ico.writeUInt8(entry.reserved, offset + 3);
        ico.writeUInt16LE(entry.planes, offset + 4);
        ico.writeUInt16LE(entry.bpp, offset + 6);
        ico.writeUInt32LE(entry.size, offset + 8);
        ico.writeUInt32LE(entry.offset, offset + 12);
        offset += dirEntrySize;
    }
    
    // Write PNG data
    for (const part of dataParts) {
        part.copy(ico, offset);
        offset += part.length;
    }
    
    return ico;
}

generateFavicons().catch((error) => {
    console.error('Error generating favicons:', error);
    process.exit(1);
});
