const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

const dir = path.join(__dirname, 'public', 'assets');
const files = fs.readdirSync(dir);

const exts = ['.jpg', '.jpeg', '.png'];

async function convert() {
    for (const file of files) {
        const ext = path.extname(file).toLowerCase();
        if (exts.includes(ext)) {
            const input = path.join(dir, file);
            const output = path.join(dir, file.replace(new RegExp(`\\${ext}$`, 'i'), '.webp'));
            
            console.log(`Converting ${file}...`);
            await sharp(input).webp({ quality: 80 }).toFile(output);
            
            // Delete original
            fs.unlinkSync(input);
        }
    }
    console.log('Done!');
}

convert().catch(console.error);
