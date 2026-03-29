/**
 * 原 gateway.js
 * 已重构为：纯代理 + 路由转发
 * 所有业务逻辑已拆分到 controllers / services / state
 */
const express = require('express');
const cors = require('cors');
const http = require('http');
const path = require('path');

// 路由导入
const voteRoutes = require('./routes/voteRoutes');
const liveRoutes = require('./routes/liveRoutes');
const adminRoutes = require('./routes/adminRoutes');
const aiRoutes = require('./routes/aiRoutes');
const authRoutes = require('./routes/authRoutes');

// WebSocket
const { setupWebSocketServer } = require('./websocket/wsServer');

const app = express();
const server = http.createServer(app);

// 跨域
app.use(cors({
    origin: '*',
    methods: ['GET,POST,PUT,DELETE,OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true
}));

app.use(express.json());

// WebSocket
setupWebSocketServer(server);

// 静态后台
app.get('/admin', (req, res) => {
    res.sendFile(path.join(__dirname, '../admin/index.html'));
});
app.use('/admin', express.static(path.join(__dirname, '../admin')));

// 纯代理转发：所有接口转发到拆分后的路由
app.use('/api', voteRoutes);
app.use('/api', liveRoutes);
app.use('/api', adminRoutes);
app.use('/api', aiRoutes);
app.use('/api', authRoutes);

app.use('/api/v1', voteRoutes);
app.use('/api/v1', liveRoutes);
app.use('/api/v1', adminRoutes);
app.use('/api/v1', aiRoutes);
app.use('/api/v1', authRoutes);

// 404
app.use((req, res) => {
    res.status(404).json({ code: -1, message: '接口不存在', data: null });
});

module.exports = { app, server };