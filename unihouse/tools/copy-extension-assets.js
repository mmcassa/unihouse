const fs = require('fs');
const path = require('path');

// set src and dest paths
const srcDir = path.join(__dirname, '../apps/chrome-extension/src');
const distDir = path.join(__dirname, '../dist/apps/chrome-extension/browser');

// files and directories to copy
const filesToCopy = ['manifest.json', 'background.js', 'content.js', 'icon.png'];
const dirsToCopy = ['content_scripts'];

// copy files
for (const file of filesToCopy) {
  const src = path.join(srcDir, file);
  const dest = path.join(distDir, file);
  if (fs.existsSync(src)) {
    fs.copyFileSync(src, dest);
    console.log(`Copied ${file}`);
  }
}

// copy directories
for (const dir of dirsToCopy) {
  const src = path.join(srcDir, dir);
  const dest = path.join(distDir, dir);
  if (fs.existsSync(src)) {
    fs.cpSync(src, dest, { recursive: true });
    console.log(`Copied directory ${dir}`);
  }
}

// Remove lazy loading to prevent Chrome Extension CSP violations 
// path to index.html
const indexPath = path.join(distDir, 'index.html');

let html = fs.readFileSync(indexPath, 'utf-8');

// Remove inline `onload=` and change media back to 'all' 
html = html
  .replace(/onload="[^"]*"/g, '')
  .replace(/media="print"/g, 'media="all"');

fs.writeFileSync(indexPath, html);
console.log('✔ Fixed index.html for CSP compliance');
