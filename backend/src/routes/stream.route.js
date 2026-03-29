import express from 'express';
import { getStreams } from '../controllers/stream.controller.js';
const router = express.Router();
router.get('/admin/streams', getStreams);
export default router;