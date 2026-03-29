const { getCurrentVotes, calculateVotePercentages } = require('../state/voteState');
const { getGlobalLiveStatus } = require('../state/liveState');
const { getDebateTopic, getAIDebateContent } = require('../state/aiState');
const mockService = require('../services/mockService');

// WebSocket相关变量
let WebSocketServer;
const wsClients = new Set();
let wss = null;

// 尝试加载ws模块
try {
    const ws = require('ws');
    WebSocketServer = ws.WebSocketServer;
} catch (error) {
    console.warn('⚠️  WebSocket模块未安装，实时通信功能将不可用。请运行: npm install ws');
    WebSocketServer = null;
}

// 广播消息给所有客户端
function broadcast(type, data) {
    if (!wss || wsClients.size === 0) return;

    const message = JSON.stringify({ type, data, timestamp: Date.now() });

    // 移除已关闭的连接并发送消息
    wsClients.forEach(client => {
        if (client.readyState === 1) { // WebSocket.OPEN
            client.send(message);
        } else {
            wsClients.delete(client);
        }
    });
}

// 广播当前状态（用于新连接）
function broadcastCurrentState(ws) {
    if (!ws || ws.readyState !== 1) return;

    try {
        const dashboard = mockService.statistics.getDashboard();
        const debate = mockService.debate.get();
        const votes = getCurrentVotes();
        const voteStats = calculateVotePercentages();

        ws.send(JSON.stringify({
            type: 'state',
            data: {
                votes: { ...votes, ...voteStats },
                debate: debate,
                dashboard: dashboard,
                liveStatus: dashboard.isLive
            },
            timestamp: Date.now()
        }));
    } catch (error) {
        console.error('发送当前状态失败:', error);
    }
}

// WebSocket消息处理
function handleWebSocketMessage(ws, data) {
    switch (data.type) {
        case 'ping':
            ws.send(JSON.stringify({ type: 'pong' }));
            break;
        case 'control-live':
            // 处理直播控制
            const { action } = data;
            if (action === 'start') {
                const liveStatus = getGlobalLiveStatus();
                broadcast('live-status-changed', {
                    status: 'started',
                    streamUrl: liveStatus.streamUrl,
                    timestamp: Date.now()
                });
            } else if (action === 'stop') {
                broadcast('live-status-changed', {
                    status: 'stopped',
                    timestamp: Date.now()
                });
            }
            break;
        case 'update-debate':
            // 处理辩论更新
            broadcast('debate-updated', {
                debate: data.debate,
                timestamp: Date.now()
            });
            break;
        default:
            console.log('未知的WebSocket消息类型:', data.type);
    }
}

// 设置WebSocket服务器
function setupWebSocketServer(server) {
    if (!WebSocketServer) return;

    wss = new WebSocketServer({ server, path: '/ws' });

    wss.on('connection', (ws, req) => {
        console.log('✅ WebSocket客户端已连接:', req.socket.remoteAddress);
        wsClients.add(ws);

        // 发送欢迎消息
        ws.send(JSON.stringify({
            type: 'connected',
            message: '已连接到实时数据服务'
        }));

        // 发送当前状态
        broadcastCurrentState(ws);

        // 消息处理
        ws.on('message', (message) => {
            try {
                const data = JSON.parse(message);
                handleWebSocketMessage(ws, data);
            } catch (error) {
                console.error('WebSocket消息解析失败:', error);
            }
        });

        // 连接关闭
        ws.on('close', () => {
            console.log('❌ WebSocket客户端已断开');
            wsClients.delete(ws);
        });

        // 错误处理
        ws.on('error', (error) => {
            console.error('WebSocket错误:', error);
            wsClients.delete(ws);
        });
    });

    console.log('🔌 WebSocket服务器已初始化');
}

// 导出广播函数供其他模块使用
module.exports = {
    setupWebSocketServer,
    broadcast,
    broadcastCurrentState
};