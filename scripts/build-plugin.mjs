import fs from 'fs';
import path from 'path';
import { execSync } from 'child_process';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');
const wpPluginDir = path.join(rootDir, 'wordpress-plugin');
const pluginDir = path.join(wpPluginDir, 'olla-podrida');
const distTargetDir = path.join(pluginDir, 'assets/dist');
const versionsDir = path.join(wpPluginDir, 'Versionen');
const mainPhpFile = path.join(pluginDir, 'olla-podrida.php');
const packageJsonFile = path.join(rootDir, 'package.json');

// Ensure Versionen directory exists
if (!fs.existsSync(versionsDir)) {
  fs.mkdirSync(versionsDir, { recursive: true });
}

// 1. Determine Current Version from olla-podrida.php
const phpContent = fs.readFileSync(mainPhpFile, 'utf8');
const versionMatch = phpContent.match(/Version:\s*([0-9]+\.[0-9]+\.[0-9]+)/);
const currentVersion = versionMatch ? versionMatch[1] : '1.0.0';

// 2. Determine New Version (CLI argument or auto-increment patch)
let newVersion = process.argv[2];
if (!newVersion) {
  const parts = currentVersion.split('.').map(Number);
  parts[2] = (parts[2] || 0) + 1;
  newVersion = parts.join('.');
}

console.log('==================================================');
console.log(`📦 Ensemble Olla Podrida Plugin Build System`);
console.log(`📌 Vorherige Version:  ${currentVersion}`);
console.log(`🚀 Neue Version:       ${newVersion}`);
console.log('==================================================\n');

// 3. Archive existing ZIP before creating the new version
const activeZipPath = path.join(wpPluginDir, 'olla-podrida.zip');
let prevVersion = currentVersion;
if (fs.existsSync(activeZipPath)) {
  try {
    const zipPhp = execSync(`unzip -p "${activeZipPath}" olla-podrida/olla-podrida.php`, { encoding: 'utf8' });
    const m = zipPhp.match(/Version:\s*([0-9]+\.[0-9]+\.[0-9]+)/);
    if (m) prevVersion = m[1];
  } catch (e) {}
  if (prevVersion !== newVersion) {
    const archiveName = `olla-podrida-v${prevVersion}.zip`;
    const archivePath = path.join(versionsDir, archiveName);
    fs.copyFileSync(activeZipPath, archivePath);
    console.log(`📂 Vorherige Version archiviert nach: wordpress-plugin/Versionen/${archiveName}`);
  }
}

// 4. Update Version in olla-podrida.php
let updatedPhp = phpContent.replace(
  /Version:\s*[0-9]+\.[0-9]+\.[0-9]+/,
  `Version: ${newVersion}`
);
updatedPhp = updatedPhp.replace(
  /define\(\s*'OLLA_PODRIDA_VERSION',\s*'[^']+'\s*\);/,
  `define('OLLA_PODRIDA_VERSION', '${newVersion}');`
);
fs.writeFileSync(mainPhpFile, updatedPhp, 'utf8');

// Update Version in package.json
if (fs.existsSync(packageJsonFile)) {
  const pkg = JSON.parse(fs.readFileSync(packageJsonFile, 'utf8'));
  pkg.version = newVersion;
  fs.writeFileSync(packageJsonFile, JSON.stringify(pkg, null, 2) + '\n', 'utf8');
}
console.log(`✅ Versionsnummer auf v${newVersion} aktualisiert.`);

// 5. Build Frontend with Vite
console.log('\n🚀 Erstelle Frontend mit Vite...');
execSync('node node_modules/vite/bin/vite.js build', { cwd: rootDir, stdio: 'inherit' });

// 6. Sync built assets to WordPress plugin folder
console.log('\n📦 Synchronisiere Assets in das WordPress-Plugin-Verzeichnis...');
if (fs.existsSync(distTargetDir)) {
  fs.rmSync(distTargetDir, { recursive: true, force: true });
}
fs.mkdirSync(distTargetDir, { recursive: true });

function copyDir(src, dest) {
  if (!fs.existsSync(src)) return;
  if (!fs.existsSync(dest)) fs.mkdirSync(dest, { recursive: true });
  const entries = fs.readdirSync(src, { withFileTypes: true });
  for (const entry of entries) {
    const srcPath = path.join(src, entry.name);
    const destPath = path.join(dest, entry.name);
    if (entry.isDirectory()) {
      copyDir(srcPath, destPath);
    } else {
      fs.copyFileSync(srcPath, destPath);
    }
  }
}

// Copy dist/assets
copyDir(path.join(rootDir, 'dist/assets'), path.join(distTargetDir, 'assets'));

// Copy public/fonts
copyDir(path.join(rootDir, 'public/fonts'), path.join(distTargetDir, 'fonts'));

// Copy public/images
copyDir(path.join(rootDir, 'public/images'), path.join(distTargetDir, 'images'));

// Copy public/audio
copyDir(path.join(rootDir, 'public/audio'), path.join(distTargetDir, 'audio'));

// Copy root/public files
const publicEntries = fs.readdirSync(path.join(rootDir, 'public'), { withFileTypes: true });
for (const entry of publicEntries) {
  if (!entry.isDirectory()) {
    fs.copyFileSync(path.join(rootDir, 'public', entry.name), path.join(distTargetDir, entry.name));
  }
}

// 7. Package WordPress Plugin into olla-podrida.zip
console.log(`\n📦 Packe WordPress-Plugin (v${newVersion}) in olla-podrida.zip...`);
const rootZip = path.join(rootDir, 'olla-podrida.zip');
if (fs.existsSync(rootZip)) {
  fs.unlinkSync(rootZip);
}

try {
  // Zip only the olla-podrida folder, strictly excluding Versionen, nested zips, and OS cache
  execSync(
    `cd "${wpPluginDir}" && zip -r "${rootZip}" "${path.basename(pluginDir)}" -x "*/.DS_Store" "*/olla-podrida.zip" "*/Versionen/*" "*/Versionen"`,
    { stdio: 'inherit' }
  );

  // Copy to constant main destination: wordpress-plugin/olla-podrida.zip
  fs.copyFileSync(rootZip, activeZipPath);

  // Copy to plugin subfolder: wordpress-plugin/olla-podrida/olla-podrida.zip
  const subfolderZip = path.join(pluginDir, 'olla-podrida.zip');
  fs.copyFileSync(rootZip, subfolderZip);

  // Clean up temporary rootZip
  if (fs.existsSync(rootZip)) {
    fs.unlinkSync(rootZip);
  }

  console.log('\n==================================================');
  console.log(`🎉 Plugin v${newVersion} erfolgreich erstellt!`);
  console.log(`📍 Aktuelle ZIP:    wordpress-plugin/olla-podrida.zip`);
  console.log(`📁 Archiv-Ordner:   wordpress-plugin/Versionen/`);
  console.log(`📦 Archivierte ZIP: wordpress-plugin/Versionen/olla-podrida-v${currentVersion}.zip`);
  console.log('==================================================\n');
} catch (e) {
  console.error('Fehler beim Erstellen der ZIP-Datei:', e.message);
}
