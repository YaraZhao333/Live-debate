import { readJSON, writeJSON } from '../utils/fileDB.js';
import { v4 as uuid } from 'uuid';

export async function submitVote(req, res) {
  const { stream_id, option } = req.body;
  const votes = await readJSON('votes.json');
  votes.push({ id: uuid(), stream_id, option, time: Date.now() });
  await writeJSON('votes.json', votes);
  res.json({ code: 0, message: 'ok' });
}

export async function getVotes(req, res) {
  const { stream_id } = req.query;
  const votes = await readJSON('votes.json');
  res.json({ code: 0, data: votes.filter(v => v.stream_id === stream_id) });
}