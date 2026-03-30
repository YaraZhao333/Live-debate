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

// 导入WebSocket服务
const { setupWebSocketServer } = require('./websocket/wsServer');

// 初始化Express应用
const app = express();
const server = http.createServer(app);

// CORS配置 - 允许所有来源（开发环境）
app.use(cors({
    origin: '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
    credentials: true
}));

// 解析JSON请求体
app.use(express.json());

// 配置WebSocket
setupWebSocketServer(server);

// 根路径 - 重定向到后台管理
app.get('/', (req, res) => {
    res.redirect('/admin');
});

// 后台管理页面路由 - 使用 frontend 目录下的完整文件
app.get('/admin', (req, res) => {
    res.sendFile(path.join(__dirname, '../../frontend/admin', 'index.html'));
});
app.use('/admin', express.static(path.join(__dirname, '../../frontend/admin')));
app.use('/static', express.static(path.join(__dirname, '../../frontend/static')));

// API路由挂载
app.use('/api', voteRoutes);
app.use('/api', liveRoutes);
app.use('/api', adminRoutes);
app.use('/api', aiRoutes);
app.use('/api', streamsRoutes);
app.use('/api/v1', voteRoutes);
app.use('/api/v1', liveRoutes);
app.use('/api/v1', adminRoutes);
app.use('/api/v1', aiRoutes);
app.use('/api/v1', streamsRoutes);

module.exports = { app, server };