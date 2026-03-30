const express = require('express');
const cors = require('cors');
const http = require('http');
const { createProxyMiddleware } = require('http-proxy-middleware');

const app = express();
const server = http.createServer(app);

const BACKEND_PORT = process.env.BACKEND_PORT || 8081;
const GATEWAY_PORT = process.env.PORT || 10000;
let BACKEND_URL = process.env.BACKEND_URL || `http://localhost:${BACKEND_PORT}`;

// 确保 BACKEND_URL 有 http:// 协议
if (BACKEND_URL && !BACKEND_URL.startsWith('http://') && !BACKEND_URL.startsWith('https://')) {
    // 如果只提供了主机名，添加协议
    if (BACKEND_URL.indexOf(':') === -1) {
        // 只有主机名，没有端口，添加默认端口
        BACKEND_URL = `http://${BACKEND_URL}:${BACKEND_PORT}`;
    } else {
        // 有主机名和端口，只添加协议
        BACKEND_URL = `http://${BACKEND_URL}`;
    }
}

console.log('🔧 后端连接配置:', {
    rawEnv: process.env.BACKEND_URL,
    finalUrl: BACKEND_URL
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
    res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Requested-With, Accept, Origin');
    res.header('Access-Control-Max-Age', '86400');
    res.sendStatus(204);
});

app.use(express.json());

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

// 健康检查端点（Render必需）
app.get('/health', (req, res) => {
    res.json({ 
        status: 'ok', 
        service: 'gateway',
        backendUrl: BACKEND_URL,
        timestamp: new Date().toISOString()
    });
});

app.use('/api', backendProxy);
app.use('/api/v1', backendProxy);

const { WebSocketServer } = require('ws');
const wsClients = new Set();
let wss = null;

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

function forwardToBackend(data) {
    const ws = require('ws');
    const backendWs = new ws.WebSocket(`ws://localhost:${BACKEND_PORT}/ws`);

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

app.use((req, res) => {
    res.status(404).json({
        code: -1,
        message: '接口不存在',
        data: null
    });
});

server.listen(GATEWAY_PORT, '0.0.0.0', () => {
    console.log('═══════════════════════════════════════');
    console.log('🌐 Gateway 网关服务器已启动');
    console.log('═══════════════════════════════════════');
    console.log(`📋 监听端口: ${GATEWAY_PORT}`);
    console.log(`🔗 后端地址: ${BACKEND_URL}`);
    console.log('═══════════════════════════════════════');
});

module.exports = { app, server };
