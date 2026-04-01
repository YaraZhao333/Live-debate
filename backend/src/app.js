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

// WebSocket
const { setupWebSocketServer } = require('./websocket/wsServer');

// 初始化 Express
const app = express();
const server = http.createServer(app);

// CORS
app.use(cors({
    origin: '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
    credentials: true
}));

// JSON 解析
app.use(express.json());

// 禁用缓存
app.use((req, res, next) => {
    res.set('Cache-Control', 'no-store, no-cache, must-revalidate, private');
    res.set('Pragma', 'no-cache');
    res.set('Expires', '0');
    next();
});

// WebSocket
setupWebSocketServer(server);

// 健康检查
app.get('/health', (req, res) => {
    res.json({
        status: 'ok',
        service: 'backend',
        timestamp: new Date().toISOString()
    });
});

// 测试路由
app.get('/api/v1/test', (req, res) => {
    res.json({
        code: 0,
        message: 'test success',
        data: {
            test: 'hello world',
            timestamp: Date.now()
        }
    });
});

// 直接添加辩题路由
const debateTopicController = require('./controllers/debateTopicController');
app.get('/api/v1/debate-topic', debateTopicController.getDebateTopic);

/*  
========================================================
🔥 关键修复：所有后台管理 API 必须挂载到 /api/v1/admin
========================================================
*/
app.use('/api/v1/admin', voteRoutes);
app.use('/api/v1/admin', liveRoutes);
app.use('/api/v1/admin', adminRoutes);
app.use('/api/v1/admin', aiRoutes);
app.use('/api/v1/admin', streamsRoutes);
app.use('/api/v1/admin', userVoteRoutes);
app.use('/api/v1/admin', aiContentRoutes);
app.use('/api/v1/admin', commentRoutes);
app.use('/api/v1/admin', wechatLoginRoutes);
app.use('/api/v1/admin', authRoutes);
app.use('/api/v1/admin', judgesRoutes);
app.use('/api/v1/admin', debateFlowRoutes);
app.use('/api/v1/admin', statisticsRoutes);
app.use('/api/v1/admin', streamDetailRoutes);

// 前端小程序需要的直播状态接口
app.use('/api/v1', liveRoutes);

// 辩题路由（前端直接访问，不需要/admin前缀）
app.use('/api/v1', debateTopicRoutes);

module.exports = { app, server };
