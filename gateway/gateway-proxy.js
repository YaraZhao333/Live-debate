const express = require('express');
const cors = require('cors');
const http = require('http');
const { createProxyMiddleware } = require('http-proxy-middleware');
const httpProxy = require('http-proxy');

const app = express();
const server = http.createServer(app);

const BACKEND_PORT = process.env.BACKEND_PORT || 8081;
const GATEWAY_PORT = process.env.PORT || 10000;
let BACKEND_URL = process.env.BACKEND_URL || `http://localhost:${BACKEND_PORT}`;

// 确保 BACKEND_URL 有 http:// 协议
if (BACKEND_URL && !BACKEND_URL.startsWith('http://') && !BACKEND_URL.startsWith('https://')) {
    if (BACKEND_URL.indexOf(':') === -1) {
        BACKEND_URL = `http://${BACKEND_URL}:${BACKEND_PORT}`;
    } else {
        BACKEND_URL = `http://${BACKEND_URL}`;
    }
}

console.log('🔧 后端连接配置:', {
    rawEnv: process.env.BACKEND_URL,
    finalUrl: BACKEND_URL
});

// 健康检查端点（Render必需）
app.get('/health', (req, res) => {
    res.json({ 
        status: 'ok', 
        service: 'gateway',
        backendUrl: BACKEND_URL,
        timestamp: new Date().toISOString()
    });
});

app.use(cors({
    origin: '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'Accept', 'Origin'],
    exposedHeaders: ['Content-Length', 'Content-Type'],
    credentials: true,
    maxAge: 86400
}));

app.options('*', (req, res) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS, PATCH');
    res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Requested-With', 'Accept', 'Origin');
    res.header('Access-Control-Max-Age', '86400');
    res.sendStatus(204);
});

app.use(express.json());

// HTTP 代理
const backendProxy = createProxyMiddleware({
    target: BACKEND_URL,
    changeOrigin: true,
    pathRewrite: {
        '^/api': '/api'
    },
    onProxyReq: (proxyReq, req, res) => {
        console.log(`🔄 [代理] ${req.method} ${req.path} -> ${BACKEND_URL}${req.path}`);
    },
    onProxyRes: (proxyRes, req, res) => {
        console.log(`✅ [代理] ${req.path} <- ${proxyRes.statusCode} ${BACKEND_URL}`);
    },
    onError: (err, req, res) => {
        console.error(`❌ [代理错误] ${req.path}:`, err.message);
        if (!res.headersSent) {
            res.status(502).json({
                code: -1,
                message: '后端服务不可用',
                data: null
            });
        }
    }
});

app.use('/api', backendProxy);
app.use('/api/v1', backendProxy);

// =========================
// WebSocket 真实代理（符合测试题要求）
// =========================
const wsProxy = httpProxy.createProxyServer({
    target: BACKEND_URL.replace(/^http/, 'ws'),
    changeOrigin: true,
    ws: true
});

// 将 /ws 的 Upgrade 请求转发到后端 /ws
server.on('upgrade', (req, socket, head) => {
    if (req.url === '/ws') {
        console.log('🔄 [WS代理] 前端 /ws -> 后端 /ws');
        wsProxy.ws(req, socket, head);
    } else {
        socket.destroy();
    }
});

// 404 处理
app.use((req, res) => {
    res.status(404).json({
        code: -1,
        message: '接口不存在',
        data: null
    });
});

// 启动服务器
server.listen(GATEWAY_PORT, '0.0.0.0', () => {
    console.log('═══════════════════════════════════════');
    console.log('🌐 Gateway 网关服务器已启动');
    console.log('═══════════════════════════════════════');
    console.log(`📋 监听端口: ${GATEWAY_PORT}`);
    console.log(`🔗 后端地址: ${BACKEND_URL}`);
    console.log('═══════════════════════════════════════');
});

module.exports = { app, server };
