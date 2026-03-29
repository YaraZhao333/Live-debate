import express from 'express';
import { submitVote, getVotes } from '../controllers/vote.controller.js';
const router = express.Router();
router.post('/user-vote', submitVote);
router.get('/admin/votes', getVotes);
export default router;