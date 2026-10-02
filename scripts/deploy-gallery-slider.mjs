import fs from 'fs';
import path from 'path';
import zlib from 'zlib';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');
const pluginDir = path.join(rootDir, 'wordpress-plugin/olla-podrida-gallery-slider');
const targetFolder = 'olla-podrida-gallery-slider';

function getAllFiles(dir, baseDir = '') {
  let results = [];
  const list = fs.readdirSync(dir);
  for (const file of list) {
    if (file === '.DS_Store') continue;
    const fullPath = path.join(dir, file);
    const relPath = path.join(baseDir, file);
    const stat = fs.statSync(fullPath);
    if (stat && stat.isDirectory()) {
      results = results.concat(getAllFiles(fullPath, relPath));
    } else {
      results.push(relPath);
    }
  }
  return results;
}

async function main() {
  console.log(`🚀 Starting deployment for ${targetFolder}...`);

  const allFiles = getAllFiles(pluginDir);
  console.log(`📦 Found ${allFiles.length} files to deploy.`);

  // Make sure main plugin file is deployed last so PHP doesn't trigger fatal error midway
  const sortedFiles = allFiles.filter(f => f !== 'olla-podrida-gallery-slider.php');
  sortedFiles.push('olla-podrida-gallery-slider.php');

  let successCount = 0;
  for (const rel of sortedFiles) {
    const full = path.join(pluginDir, rel);
    const buf = fs.readFileSync(full);
    const gz = zlib.gzipSync(buf);
    const b64 = gz.toString('base64');

    const form = new URLSearchParams();
    form.append('action', 'write_file');
    form.append('folder', targetFolder);
    form.append('path', rel);
    form.append('data', b64);

    const res = await fetch('https://cms.janbruening.de/?olla_upload=1', {
      method: 'POST',
      body: form
    });

    const text = await res.text();
    try {
      const json = JSON.parse(text);
      if (json.success) {
        console.log(`✅ ${rel} (${json.bytes} bytes)`);
        successCount++;
      } else {
        console.error(`❌ ${rel}:`, json.error);
      }
    } catch {
      console.error(`❌ ${rel}: non-JSON response: ${text.slice(0, 100)}`);
    }
  }

  console.log(`🎉 Finished deploying ${successCount}/${sortedFiles.length} files to https://cms.janbruening.de/`);
}

main().catch(err => {
  console.error('Fatal deployment error:', err);
  process.exit(1);
});
