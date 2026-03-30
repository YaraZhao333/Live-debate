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
const BACKEND_PORT = process.env.BACKEND_PORT || 8081;
const GATEWAY_PORT = process.env.GATEWAY_PORT || 3000;
const BACKEND_URL = `http://localhost:${BACKEND_PORT}`;

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

// 前端首页路由 - 创建一个简单的欢迎页面
app.get('/', (req, res) => {
    res.send(`
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <title>直播辩论系统</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            display: flex;
            justify-content: center;
            align-items: center;
            height: 100vh;
            margin: 0;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        }
        .container {
            text-align: center;
            background: white;
            padding: 40px;
            border-radius: 10px;
            box-shadow: 0 10px 30px rgba(0,0,0,0.3);
        }
        h1 {
            color: #333;
            margin-bottom: 20px;
        }
        .btn {
            display: inline-block;
            padding: 15px 40px;
            background: #667eea;
            color: white;
            text-decoration: none;
            border-radius: 5px;
            font-size: 18px;
            margin: 10px;
            transition: all 0.3s;
        }
        .btn:hover {
            background: #764ba2;
            transform: translateY(-2px);
            box-shadow: 0 5px 15px rgba(0,0,0,0.2);
        }
    </style>
</head>
<body>
    <div class="container">
        <h1>🎉 直播辩论系统</h1>
        <p style="color: #666; margin-bottom: 30px;">欢迎使用直播辩论管理系统</p>
        <a href="/admin" class="btn">进入后台管理</a>
        <a href="/api/admin/votes" class="btn" style="background: #28a745;">测试API接口</a>
    </div>
</body>
</html>
    `);
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

// 在所有路由之前添加代理中间件
app.use('/api', backendProxy);
app.use('/api/v1', backendProxy);

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

        // 发送欢迎消息
        ws.send(JSON.stringify({
            type: 'connected',
            message: '已连接到实时数据服务'
        }));

        ws.on('message', (message) => {
            try {
                const data = JSON.parse(message);
                console.log('📨 收到WebSocket消息:', data.type);

                // 转发消息到后端 WebSocket
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
    const backendWs = new ws.WebSocket(`ws://localhost:${BACKEND_PORT}/ws`);

    backendWs.on('open', () => {
        backendWs.send(JSON.stringify(data));
    });

    backendWs.on('message', (message) => {
        // 广播消息给所有前端客户端
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

// 设置 WebSocket 代理
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
