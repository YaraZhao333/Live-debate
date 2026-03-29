import express from 'express';
import cors from 'cors';
import voteRoutes from './routes/vote.route.js';
import adminRoutes from './routes/admin.route.js';
import streamRoutes from './routes/stream.route.js';
import { initWebSocket } from './ws/wsServer.js';

const app = express();
app.use(cors());
app.use(express.json());

app.use('/api', voteRoutes);
app.use('/api', adminRoutes);
app.use('/api', streamRoutes);

initWebSocket(app);
export default app;