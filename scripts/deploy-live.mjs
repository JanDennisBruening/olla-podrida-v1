import fs from 'fs';
import path from 'path';
import zlib from 'zlib';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');
const pluginDir = path.join(rootDir, 'wordpress-plugin/olla-podrida');

async function main() {
  const filesToDeploy = [
    'assets/dist/assets/index-CxO1nb46.js',
    'assets/dist/assets/index-hIkZP5m5.css',
    'assets/css/admin.css',
    'assets/dist/images/Favicon-transparent.png',
    'assets/dist/images/Favicon2-2.png',
    'assets/dist/images/favicon.ico',
    'olla-podrida.php',
    'includes/class-olla-podrida.php',
    'includes/class-roles.php',
    'includes/class-contact.php',
    'includes/class-admin.php',
    'includes/class-settings.php',
    'templates/canvas-page.php',
    'templates/admin/main.php',
    'templates/admin/tab-seo.php',
    'templates/admin/tab-roles.php',
    'templates/admin/tab-contact.php',
    'templates/admin/tab-legal.php',
    'templates/admin/tab-press.php',
  ];

  console.log('🚀 Deploying v1.1.3 to https://cms.janbruening.de...');

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

  const cleanupForm = new URLSearchParams();
  cleanupForm.append('action', 'cleanup_dist');
  cleanupForm.append('keep_js', 'index-CxO1nb46.js');
  cleanupForm.append('keep_css', 'index-hIkZP5m5.css');
  const cleanRes = await fetch('https://cms.janbruening.de/?olla_upload=1', { method: 'POST', body: cleanupForm });
  const cleanJson = await cleanRes.json();
  console.log('🧹 Cleanup:', cleanJson.deleted);
  console.log('🎉 v1.1.3 live deployment complete!');
}

main().catch(err => { console.error('Deploy error:', err); process.exit(1); });
