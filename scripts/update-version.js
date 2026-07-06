import fs from 'fs';
import path from 'path';

const versionFilePath = path.join(process.cwd(), 'public', 'version.json');

try {
  const versionData = JSON.parse(fs.readFileSync(versionFilePath, 'utf8'));
  const current = versionData.version || '0.0.0';

  const parts = current.split('.').map(Number);
  let major = parts[0] ?? 0;
  let minor = parts[1] ?? 0;
  let patch = parts[2] ?? 0;

  if (isNaN(major) || isNaN(minor) || isNaN(patch)) {
    major = 1; minor = 0; patch = 0;
  } else {
    patch += 1;
    if (patch > 99) { patch = 0; minor += 1; }
    if (minor > 99) { minor = 0; major += 1; }
  }

  const newVersion = `${major}.${minor}.${patch}`;
  versionData.version = newVersion;

  fs.writeFileSync(versionFilePath, JSON.stringify(versionData, null, 2));
  console.log(`Successfully updated version to: ${newVersion}`);
} catch (error) {
  console.error('Error updating version:', error);
  process.exit(1);
}
