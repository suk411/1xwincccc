import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const versionFilePath = path.join(process.cwd(), 'public', 'version.json');

try {
  const versionData = JSON.parse(fs.readFileSync(versionFilePath, 'utf8'));
  
  // Use current timestamp as the version for simplicity and uniqueness
  const newVersion = Date.now().toString();
  versionData.version = newVersion;
  
  fs.writeFileSync(versionFilePath, JSON.stringify(versionData, null, 2));
  console.log(`Successfully updated version to: ${newVersion}`);
} catch (error) {
  console.error('Error updating version:', error);
  process.exit(1);
}
