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
        
        // 修复：如果请求体已被解析，需要重新写入
        if (req.body && Object.keys(req.body).length > 0) {
            const bodyData = JSON.stringify(req.body);
            proxyReq.setHeader('Content-Type', 'application/json');
            proxyReq.setHeader('Content-Length', Buffer.byteLength(bodyData));
            proxyReq.write(bodyData);
        }
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

// 后台管理接口代理
app.use('/api/v1/admin', createProxyMiddleware({
    target: BACKEND_URL,
    changeOrigin: true,
    pathRewrite: {
        '^/api/v1/admin': '/api/v1/admin'
    },
    onProxyReq: (proxyReq, req, res) => {
        console.log(`🔄 [Admin代理] ${req.method} ${req.path} -> ${BACKEND_URL}${req.path}`);
        
        // 修复：如果请求体已被解析，需要重新写入
        if (req.body && Object.keys(req.body).length > 0) {
            const bodyData = JSON.stringify(req.body);
            proxyReq.setHeader('Content-Type', 'application/json');
            proxyReq.setHeader('Content-Length', Buffer.byteLength(bodyData));
            proxyReq.write(bodyData);
        }
    },
    onProxyRes: (proxyRes, req, res) => {
        console.log(`✅ [Admin代理] ${req.path} <- ${proxyRes.statusCode} ${BACKEND_URL}`);
    },
    onError: (err, req, res) => {
        console.error(`❌ [Admin代理错误] ${req.path}:`, err.message);
        if (!res.headersSent) {
            res.status(502).json({
                code: -1,
                message: '后端服务不可用',
                data: null
            });
        }
    }
}));

// 其他API代理
app.use('/api', backendProxy);

// HLS 直播流代理
app.use('/live', createProxyMiddleware({
    target: BACKEND_URL,
    changeOrigin: true,
    ws: false
}));

// =========================
// WebSocket 真实代理（符合测试题要求）
// =========================
// 使用 HTTP 后端地址，让网关处理 WebSocket 升级
const wsProxy = httpProxy.createProxyServer({
    target: BACKEND_URL,
    changeOrigin: true,
    ws: true
});

// WebSocket 代理错误处理（防止 EPIPE 导致崩溃）
wsProxy.on('error', (err, req, res) => {
    console.error('❌ [WS代理错误]:', err.message);
    if (err.code === 'EPIPE' || err.code === 'ECONNRESET') {
        console.log('⚠️ [WS代理] 连接被意外关闭，忽略错误');
        return;
    }
});

// 将 /ws 的 Upgrade 请求转发到后端 /ws
server.on('upgrade', (req, socket, head) => {
    if (req.url === '/ws') {
        console.log('🔄 [WS代理] 前端 /ws -> 后端 /ws');
        try {
            wsProxy.ws(req, socket, head);
        } catch (error) {
            console.error('❌ [WS代理] 升级请求失败:', error.message);
            socket.destroy();
        }
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
    
    // Keep-alive ping 防止 Render 免费实例休眠
    console.log('🔄 启动 Keep-alive ping 机制...');
    setInterval(() => {
        console.log('🟢 发送 Keep-alive ping 到后端...');
        fetch(BACKEND_URL + "/health").catch(() => {
            console.log('⚠️ Keep-alive ping 失败（后端可能正在启动）');
        });
    }, 30000); // 每 30 秒 ping 一次
});

module.exports = { app, server };
