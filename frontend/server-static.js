const express = require('express');
const cors = require('cors');
const path = require('path');
const http = require('http');
const { createProxyMiddleware } = require('http-proxy-middleware');

const app = express();
const server = http.createServer(app);
const PORT = process.env.PORT || 3000;
//网关线上地址
const GATEWAY_URL = 'https://live-debate-gateway.onrender.com';

app.use(cors({
    origin: '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
    credentials: true
}));
// =====================================================================
// ✅【核心修复】代理 /api 和 /ws 到线上网关
// =====================================================================
// 兼容旧版前端构建文件的路由
app.get('/api/votes', (req, res) => {
    // 重定向到正确的路径
    const streamId = req.query.stream_id || '';
    const redirectUrl = `/api/v1/admin/votes${streamId ? `?stream_id=${streamId}` : ''}`;
    res.redirect(307, redirectUrl);
});

app.use('/api', createProxyMiddleware({
    target: GATEWAY_URL,
    changeOrigin: true,
    secure: true,
    ws: true
}));

app.use('/ws', createProxyMiddleware({
    target: GATEWAY_URL,
    changeOrigin: true,
    secure: true,
    ws: true
}));

app.use(express.static(path.join(__dirname, 'unpackage/dist/build/web')));

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'unpackage/dist/build/web/index.html'));
});

app.get('/admin', (req, res) => {
    res.sendFile(path.join(__dirname, 'admin/index.html'));
});

app.use('/admin', express.static(path.join(__dirname, 'admin')));

app.use('/static', express.static(path.join(__dirname, 'static')));

// 健康检查端点（Render必需）
app.get('/health', (req, res) => {
    res.json({ 
        status: 'ok', 
        service: 'frontend',
        timestamp: new Date().toISOString()
    });
});

server.listen(PORT, '0.0.0.0', () => {
    console.log('═══════════════════════════════════════');
    console.log('🌐 Frontend 静态资源服务器已启动');
    console.log('═══════════════════════════════════════');
    console.log(`📋 监听端口: ${PORT}`);
    console.log(`🌐 访问地址: http://0.0.0.0:${PORT}`);
    console.log(`🖥️  后台管理: http://0.0.0.0:${PORT}/admin`);
    console.log('═══════════════════════════════════════');
});

module.exports = { app, server };
