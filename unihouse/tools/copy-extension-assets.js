const fs = require('fs');
const path = require('path');

const srcDir = path.join(__dirname, '../apps/chrome-extension/src');
const distDir = path.join(__dirname, '../dist/apps/chrome-extension');

const filesToCopy = ['manifest.json', 'background.js', 'content.js', 'icon.png'];
const dirsToCopy = ['content_scripts'];

for (const file of filesToCopy) {
  const src = path.join(srcDir, file);
  const dest = path.join(distDir, file);
  if (fs.existsSync(src)) {
    fs.copyFileSync(src, dest);
    console.log(`Copied ${file}`);
  }
}
for (const dir of dirsToCopy) {
  const src = path.join(srcDir, dir);
  const dest = path.join(distDir, dir);
  if (fs.existsSync(src)) {
    fs.cpSync(src, dest, { recursive: true });
    console.log(`Copied directory ${dir}`);
  }
}