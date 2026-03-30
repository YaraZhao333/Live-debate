const express = require('express');
const cors = require('cors');
const path = require('path');
const http = require('http');

const app = express();
const server = http.createServer(app);
const PORT = process.env.PORT || 3000;

app.use(cors({
    origin: '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
    credentials: true
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
