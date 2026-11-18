import fs from 'fs';
import path from 'path';
import { servicesData } from './src/data/servicesData.js';

const baseRoutes = [
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

// Dynamically generate routes for all service slugs (e.g. services/ui-ux-design, service/ui-ux-design)
const serviceSlugs = Object.keys(servicesData || {});
const dynamicServiceRoutes = [];
serviceSlugs.forEach((slug) => {
  dynamicServiceRoutes.push(`services/${slug}`);
  dynamicServiceRoutes.push(`service/${slug}`);
});

const routes = Array.from(new Set([...baseRoutes, ...dynamicServiceRoutes]));

const distDir = path.resolve('dist');
const indexHtmlPath = path.join(distDir, 'index.html');

if (fs.existsSync(indexHtmlPath)) {
  const indexHtml = fs.readFileSync(indexHtmlPath, 'utf8');

  // Standard 404 fallback for SPAs
  fs.writeFileSync(path.join(distDir, '404.html'), indexHtml);

  // Generate directory entrypoints and direct HTML files
  routes.forEach((route) => {
    // 1. Directory with index.html (e.g. dist/services/ui-ux-design/index.html)
    const targetDir = path.join(distDir, route);
    fs.mkdirSync(targetDir, { recursive: true });
    fs.writeFileSync(path.join(targetDir, 'index.html'), indexHtml);

    // 2. Direct HTML file (e.g. dist/services/ui-ux-design.html)
    const targetHtmlFile = path.join(distDir, `${route}.html`);
    const parentDir = path.dirname(targetHtmlFile);
    fs.mkdirSync(parentDir, { recursive: true });
    fs.writeFileSync(targetHtmlFile, indexHtml);
  });

  // Ensure vercel.json in dist specifies SPA catch-all fallback
  const vercelDistConfig = {
    cleanUrls: true,
    rewrites: [
      {
        source: '/(.*)',
        destination: '/index.html'
      }
    ]
  };
  fs.writeFileSync(path.join(distDir, 'vercel.json'), JSON.stringify(vercelDistConfig, null, 2));

  console.log(`✓ Successfully generated ${routes.length} SPA route entrypoints in dist/ (including ${dynamicServiceRoutes.length} service routes)`);
} else {
  console.error('dist/index.html not found. Please run vite build first.');
}
