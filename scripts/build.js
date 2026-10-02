const fs = require('fs');
const path = require('path');

const sourceDir = path.resolve(__dirname, '..', 'src');
const outputDir = path.resolve(__dirname, '..', 'dist');

fs.rmSync(outputDir, { recursive: true, force: true });
fs.mkdirSync(outputDir, { recursive: true });

for (const file of fs.readdirSync(sourceDir)) {
    const source = path.join(sourceDir, file);
    const destination = path.join(outputDir, file);

    if (fs.statSync(source).isFile()) {
        fs.copyFileSync(source, destination);
    }
}

console.log(`Build concluído: ${sourceDir} -> ${outputDir}`);
