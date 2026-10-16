import fs from 'fs';
import path from 'path';

const routes = [
  'admin',
  'admin/login',
  'admin/dashboard',
  'admin/register',
  'about',
  'portfolio',
  'pricing',
  'contact',
  'contact-us',
  'terms',
  'terms-of-service',
  'privacy',
  'privacy-policy',
  'cookies',
  'cookie-policy',
  'legal',
  'services',
  'service'
];

const distDir = path.resolve('dist');
const indexHtmlPath = path.join(distDir, 'index.html');

if (fs.existsSync(indexHtmlPath)) {
  const indexHtml = fs.readFileSync(indexHtmlPath, 'utf8');

  // Standard 404 fallback
  fs.writeFileSync(path.join(distDir, '404.html'), indexHtml);

  routes.forEach((route) => {
    // 1. Directory with index.html (e.g. dist/admin/login/index.html)
    const targetDir = path.join(distDir, route);
    fs.mkdirSync(targetDir, { recursive: true });
    fs.writeFileSync(path.join(targetDir, 'index.html'), indexHtml);

    // 2. Direct HTML file (e.g. dist/admin/login.html)
    const targetHtmlFile = path.join(distDir, `${route}.html`);
    const parentDir = path.dirname(targetHtmlFile);
    fs.mkdirSync(parentDir, { recursive: true });
    fs.writeFileSync(targetHtmlFile, indexHtml);
  });

  console.log(`✓ Successfully generated ${routes.length} SPA route entrypoints in dist/`);
} else {
  console.error('dist/index.html not found. Please run vite build first.');
}
