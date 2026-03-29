import express from 'express';
import { getDashboard, getJudges, getDebateFlow } from '../controllers/admin.controller.js';
const router = express.Router();
router.get('/admin/dashboard', getDashboard);
router.get('/admin/judges', getJudges);
router.get('/admin/debate-flow', getDebateFlow);
export default router;