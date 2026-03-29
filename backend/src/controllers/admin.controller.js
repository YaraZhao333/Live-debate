import { readJSON } from '../utils/fileDB.js';

export async function getDashboard(req, res) {
  const { stream_id } = req.query;
  const votes = await readJSON('votes.json');
  const result = {};
  votes.filter(v => v.stream_id === stream_id).forEach(v => {
    result[v.option] = (result[v.option] || 0) + 1;
  });
  res.json({ code: 0, data: result });
}

export async function getJudges(req, res) {
  res.json({ code: 0, data: await readJSON('judges.json') });
}

export async function getDebateFlow(req, res) {
  res.json({ code: 0, data: await readJSON('debate-flows.json') });
}