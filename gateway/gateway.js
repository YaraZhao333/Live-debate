/**
 * Gateway - 纯代理服务
 * 将前端请求转发到后端服务
 */
const express = require('express');
const cors = require('cors');
const http = require('http');
const { createProxyMiddleware } = require('http-proxy-middleware');
const path = require('path');

const app = express();
const server = http.createServer(app);

// 配置
const GATEWAY_PORT = process.env.GATEWAY_PORT || 3000;
const BACKEND_URL = process.env.BACKEND_URL || 'http://localhost:8081';

// 跨域配置
app.use(cors({
    origin: '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'Accept', 'Origin'],
    exposedHeaders: ['Content-Length', 'Content-Type'],
    credentials: true,
    maxAge: 86400
}));

// 处理 OPTIONS 预检请求
app.options('*', (req, res) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS, PATCH');
    res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Requested-With, Accept, Origin');
    res.header('Access-Control-Max-Age', '86400');
    res.sendStatus(204);
});

app.use(express.json());

// 前端静态资源服务 - 指向构建后的 H5 目录
app.use(express.static(path.join(__dirname, '../frontend/unpackage/dist/build/web')));

// 前端首页路由
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '../frontend/unpackage/dist/build/web/index.html'));
});

// 后台管理页面路由
app.get('/admin', (req, res) => {
    res.sendFile(path.join(__dirname, '../frontend/admin/index.html'));
});
app.use('/admin', express.static(path.join(__dirname, '../frontend/admin')));

// 创建代理中间件 - 代理所有 /api 开头的路径到后端服务器
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

// 只保留一个代理入口即可，覆盖 /api 和 /api/v1
app.use('/api', backendProxy);

// WebSocket 代理
const { WebSocketServer } = require('ws');
const wsClients = new Set();
let wss = null;

// 创建 WebSocket 代理
function setupWebSocketProxy() {
    if (!WebSocketServer) {
        console.warn('⚠️  WebSocket模块未安装，实时通信功能将不可用。请运行: npm install ws');
        return;
    }

    wss = new WebSocketServer({ server, path: '/ws' });

    wss.on('connection', (ws, req) => {
        console.log('✅ WebSocket客户端已连接:', req.socket.remoteAddress);
        wsClients.add(ws);

        ws.send(JSON.stringify({
            type: 'connected',
            message: '已连接到实时数据服务'
        }));

        ws.on('message', (message) => {
            try {
                const data = JSON.parse(message);
                console.log('📨 收到WebSocket消息:', data.type);
                forwardToBackend(data);
            } catch (error) {
                console.error('WebSocket消息解析失败:', error);
            }
        });

        ws.on('close', () => {
            console.log('❌ WebSocket客户端已断开');
            wsClients.delete(ws);
        });

        ws.on('error', (error) => {
            console.error('WebSocket错误:', error);
            wsClients.delete(ws);
        });
    });

    console.log('🔌 WebSocket代理服务器已初始化');
}

// 转发消息到后端 WebSocket
function forwardToBackend(data) {
    const ws = require('ws');
    // 根据后端实际路径调整，如果后端是 /api/ws 就改成 /api/ws
    const wsBackendUrl = BACKEND_URL.replace(/^http/, 'ws') + '/ws';
    const backendWs = new ws.WebSocket(wsBackendUrl);

    backendWs.on('open', () => {
        backendWs.send(JSON.stringify(data));
    });

    backendWs.on('message', (message) => {
        wsClients.forEach(client => {
            if (client.readyState === 1) {
                client.send(message);
            }
        });
    });

    backendWs.on('error', (error) => {
        console.error('后端WebSocket连接错误:', error);
    });
}

setupWebSocketProxy();

// 404 处理
app.use((req, res) => {
    res.status(404).json({
        code: -1,
        message: '接口不存在',
        data: null
    });
});

// 启动服务器
server.listen(GATEWAY_PORT, () => {
    console.log('═══════════════════════════════════════');
    console.log('🌐 Gateway 服务器已启动');
    console.log('═══════════════════════════════════════');
    console.log(`📋 监听端口: ${GATEWAY_PORT}`);
    console.log(`🔗 后端地址: ${BACKEND_URL}`);
    console.log(`🌐 访问地址: http://localhost:${GATEWAY_PORT}`);
    console.log(`🖥️  后台管理: http://localhost:${GATEWAY_PORT}/admin`);
    console.log('═══════════════════════════════════════');
});

module.exports = { app, server };
