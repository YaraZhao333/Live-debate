import { readJSON } from '../utils/fileDB.js';
export async function getStreams(req, res) {
  res.json({ code: 0, data: await readJSON('streams.json') });
}