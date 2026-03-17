const fs = require('fs');
const path = require('path');

// Source and destination directories
const serverDir = path.join(__dirname, 'dist', 'server', 'app');
const staticDir = path.join(__dirname, 'dist', 'static');
const destDir = path.join(__dirname, 'dist');

// Check if server app directory exists
if (!fs.existsSync(serverDir)) {
  console.error('Build not found. Run npm run build first.');
  process.exit(1);
}

// Copy HTML files from server/app to dist root
function copyHtmlFiles(source, dest) {
  const items = fs.readdirSync(source, { withFileTypes: true });
  
  for (const item of items) {
    const srcPath = path.join(source, item.name);
    const destPath = path.join(dest, item.name);
    
    if (item.isDirectory()) {
      // Create directory if it doesn't exist
      if (!fs.existsSync(destPath)) {
        fs.mkdirSync(destPath, { recursive: true });
      }
      copyHtmlFiles(srcPath, destPath);
    } else if (item.name.endsWith('.html')) {
      // Copy HTML file
      fs.copyFileSync(srcPath, destPath);
      console.log(`Copied: ${srcPath} -> ${destPath}`);
    }
  }
}

// Copy static assets
function copyStaticAssets() {
  const staticSrc = path.join(__dirname, '.next', 'static');
  const staticDest = path.join(destDir, '_next', 'static');
  
  if (fs.existsSync(staticSrc)) {
    if (!fs.existsSync(staticDest)) {
      fs.mkdirSync(staticDest, { recursive: true });
    }
    
    // Copy all static files
    function copyRecursive(src, dest) {
      const items = fs.readdirSync(src, { withFileTypes: true });
      for (const item of items) {
        const srcPath = path.join(src, item.name);
        const destPath = path.join(dest, item.name);
        
        if (item.isDirectory()) {
          if (!fs.existsSync(destPath)) {
            fs.mkdirSync(destPath, { recursive: true });
          }
          copyRecursive(srcPath, destPath);
        } else {
          fs.copyFileSync(srcPath, destPath);
        }
      }
    }
    
    copyRecursive(staticSrc, staticDest);
    console.log('Static assets copied successfully');
  }
}

console.log('Preparing files for Capacitor...');

// Copy HTML files
copyHtmlFiles(serverDir, destDir);

// Copy static assets
copyStaticAssets();

// Rename index.html if it exists at root (it should already be there)
const rootIndex = path.join(destDir, 'index.html');
if (!fs.existsSync(rootIndex)) {
  // Try to copy from server/pages if it exists there
  const pagesIndex = path.join(__dirname, 'dist', 'server', 'pages', 'index.html');
  if (fs.existsSync(pagesIndex)) {
    fs.copyFileSync(pagesIndex, rootIndex);
    console.log('Created root index.html');
  }
}

console.log('✅ Capacitor preparation complete!');
console.log('You can now run: npx cap sync android');
