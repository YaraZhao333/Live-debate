// config/server-mode.node.js (Node.js后端专用)
const USE_MOCK_SERVER = true; // 使用模拟服务器
const LOCAL_SERVER_URL = 'http://localhost:8081';
const REAL_SERVER_URL = 'http://localhost:8081'; // 本地服务器地址
const REAL_SERVER_PORT = 8081; // 服务器端口
const REAL_WECHAT_CONFIG = {
    appid: 'wx94289b0d2ca7a802',
    secret: '10409c1193a326a7b328f675b1776195'
};

const getLocalIP = () => {
    const os = require('os');
    const interfaces = os.networkInterfaces();
    for (const key in interfaces) {
        const iface = interfaces[key];
        for (const alias of iface) {
            if (alias.family === 'IPv4' && !alias.internal) {
                return alias.address;
            }
        }
    }
    return '127.0.0.1';
};

const MOCK_SERVER_CONFIG = {
    host: getLocalIP(),
    port: 8081,
    url: `http://${getLocalIP()}:8081`
};

const getCurrentServerConfig = () => {
    if (USE_MOCK_SERVER) {
        return {
            mode: 'mock',
            url: MOCK_SERVER_CONFIG.url,
            host: MOCK_SERVER_CONFIG.host,
            port: MOCK_SERVER_CONFIG.port,
            wechat: {
                useMock: true,
                appid: 'wx94289b0d2ca7a802',
                secret: '10409c1193a326a7b328f675b1776195'
            }
        };
    } else {
        return {
            mode: 'real',
            url: REAL_SERVER_URL,
            port: REAL_SERVER_PORT,
            wechat: {
                useMock: false,
                appid: REAL_WECHAT_CONFIG.appid,
                secret: REAL_WECHAT_CONFIG.secret
            }
        };
    }
};

const printConfig = () => {
    const config = getCurrentServerConfig();
    console.log('═══════════════════════════════════════');
    console.log('📋 服务器配置信息');
    console.log('═══════════════════════════════════════');
    console.log(`模式: ${config.mode === 'mock' ? '🧪 模拟服务器' : '🌐 真实服务器'}`);
    console.log(`地址: ${config.url}`);
    if (config.mode === 'mock') {
        console.log(`本地访问: http://localhost:${config.port}`);
        console.log(`局域网访问: ${config.url}`);
    }
    console.log(`微信登录: ${config.wechat.useMock ? '模拟模式' : '真实模式'}`);
    if (!config.wechat.useMock) {
        console.log(`微信 AppID: ${config.wechat.appid}`);
        console.log(`微信 Secret: ${config.wechat.secret ? config.wechat.secret.substring(0, 8) + '...' : '未设置'}`);
    }
    console.log('═══════════════════════════════════════');
};

module.exports = {
    USE_MOCK_SERVER,
    MOCK_SERVER_CONFIG,
    REAL_SERVER_URL,
    REAL_SERVER_PORT,
    REAL_WECHAT_CONFIG,
    getCurrentServerConfig,
    printConfig,
    LOCAL_SERVER_URL,
};
