const express = require('express');
const cors = require('cors');
const path = require('path');
const http = require('http');

// 导入路由
const voteRoutes = require('./routes/voteRoutes');
const liveRoutes = require('./routes/liveRoutes');
const adminRoutes = require('./routes/adminRoutes');
const aiRoutes = require('./routes/aiRoutes');
const streamsRoutes = require('./routes/streamsRoutes');
const userVoteRoutes = require('./routes/userVoteRoutes');
const debateTopicRoutes = require('./routes/debateTopicRoutes');
const aiContentRoutes = require('./routes/aiContentRoutes');
const commentRoutes = require('./routes/commentRoutes');
const wechatLoginRoutes = require('./routes/wechatLoginRoutes');
const authRoutes = require('./routes/authRoutes');
const judgesRoutes = require('./routes/judgesRoutes');
const debateFlowRoutes = require('./routes/debateFlowRoutes');
const statisticsRoutes = require('./routes/statisticsRoutes');
const streamDetailRoutes = require('./routes/streamDetailRoutes');

// 导入WebSocket服务
const { setupWebSocketServer } = require('./websocket/wsServer');

// 初始化Express应用
const app = express();
const server = http.createServer(app);

// CORS配置
app.use(cors({
    origin: '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
    credentials: true
}));

// 解析JSON请求体
app.use(express.json());

// 禁用缓存
app.use((req, res, next) => {
    res.set('Cache-Control', 'no-store, no-cache, must-revalidate, private');
    res.set('Pragma', 'no-cache');
    res.set('Expires', '0');
    next();
});

// 配置WebSocket
setupWebSocketServer(server);

// 健康检查（Render 必需）
app.get('/health', (req, res) => {
    res.json({ 
        status: 'ok', 
        service: 'backend',
        timestamp: new Date().toISOString()
    });
});

/*  
========================================================
🔥 关键修复：只保留 /api/v1 前缀
========================================================
*/
app.use('/api/v1', voteRoutes);
app.use('/api/v1', liveRoutes);
app.use('/api/v1', adminRoutes);
app.use('/api/v1', aiRoutes);
app.use('/api/v1', streamsRoutes);
app.use('/api/v1', userVoteRoutes);
app.use('/api/v1', debateTopicRoutes);
app.use('/api/v1', aiContentRoutes);
app.use('/api/v1', commentRoutes);
app.use('/api/v1', wechatLoginRoutes);
app.use('/api/v1', authRoutes);
app.use('/api/v1', judgesRoutes);
app.use('/api/v1', debateFlowRoutes);
app.use('/api/v1', statisticsRoutes);
app.use('/api/v1', streamDetailRoutes);

module.exports = { app, server };
