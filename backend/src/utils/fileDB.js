import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const dataDir = path.join(__dirname, '../mock');

export async function readJSON(file) {
  const filePath = path.join(dataDir, file);
  return JSON.parse(await fs.readFile(filePath, 'utf-8'));
}

export async function writeJSON(file, data) {
  const filePath = path.join(dataDir, file);
  await fs.writeFile(filePath, JSON.stringify(data, null, 2));
}