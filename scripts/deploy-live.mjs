import fs from 'fs';
import path from 'path';
import zlib from 'zlib';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');
const pluginDir = path.join(rootDir, 'wordpress-plugin/olla-podrida');

async function main() {
  const assetsDir = path.join(pluginDir, 'assets/dist/assets');
  let jsFile = '';
  let cssFile = '';
  if (fs.existsSync(assetsDir)) {
    const distFiles = fs.readdirSync(assetsDir);
    jsFile = distFiles.find(f => f.startsWith('index-') && f.endsWith('.js')) || '';
    cssFile = distFiles.find(f => f.startsWith('index-') && f.endsWith('.css')) || '';
  }

  const filesToDeploy = [
    jsFile ? `assets/dist/assets/${jsFile}` : '',
    cssFile ? `assets/dist/assets/${cssFile}` : '',
    'assets/css/admin.css',
    'assets/js/admin.js',
    'assets/dist/images/Favicon-transparent.png',
    'assets/dist/images/Favicon2-2.png',
    'assets/dist/images/favicon.ico',
    'olla-podrida.php',
    'includes/class-olla-podrida.php',
    'includes/class-roles.php',
    'includes/class-events.php',
    'includes/class-contact.php',
    'includes/class-admin.php',
    'includes/class-frontend.php',
    'includes/class-settings.php',
    'templates/canvas-page.php',
    'templates/admin/main.php',
    'templates/admin/tab-settings.php',
    'templates/admin/tab-hero.php',
    'templates/admin/tab-ensemble.php',
    'templates/admin/tab-events.php',
    'templates/admin/tab-seo.php',
    'templates/admin/tab-roles.php',
    'templates/admin/tab-contact.php',
    'templates/admin/tab-legal.php',
    'templates/admin/tab-press.php',
  ].filter(Boolean);

  const phpCode = fs.readFileSync(path.join(pluginDir, 'olla-podrida.php'), 'utf8');
  const vMatch = phpCode.match(/Version:\s*([0-9]+\.[0-9]+\.[0-9]+)/);
  const version = vMatch ? vMatch[1] : '1.1.5';

  console.log(`🚀 Deploying v${version} to https://cms.janbruening.de...`);
  console.log(`📦 JS: ${jsFile}, CSS: ${cssFile}`);

  for (const rel of filesToDeploy) {
    const full = path.join(pluginDir, rel);
    if (!fs.existsSync(full)) {
      console.warn('⚠️ File missing:', full);
      continue;
    }
    const buf = fs.readFileSync(full);
    const gz = zlib.gzipSync(buf);
    const b64 = gz.toString('base64');
    const form = new URLSearchParams();
    form.append('action', 'write_file');
    form.append('path', rel);
    form.append('data', b64);
    const res = await fetch('https://cms.janbruening.de/?olla_upload=1', { method: 'POST', body: form });
    const text = await res.text();
    let json;
    try {
      json = JSON.parse(text);
      console.log(`${json.success ? '✅' : '❌'} ${rel}: ${json.bytes ?? json.error} bytes`);
    } catch {
      console.error(`❌ ${rel}: non-JSON response: ${text.slice(0, 100)}`);
    }
  }

  if (jsFile && cssFile) {
    const cleanupForm = new URLSearchParams();
    cleanupForm.append('action', 'cleanup_dist');
    cleanupForm.append('keep_js', jsFile);
    cleanupForm.append('keep_css', cssFile);
    const cleanRes = await fetch('https://cms.janbruening.de/?olla_upload=1', { method: 'POST', body: cleanupForm });
    const cleanJson = await cleanRes.json();
    console.log('🧹 Cleanup:', cleanJson.deleted);
  }
  console.log(`🎉 v${version} live deployment complete!`);
}

main().catch(err => { console.error('Deploy error:', err); process.exit(1); });
