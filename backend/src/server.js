const { app, server } = require('./app');
const serverCfg = require('../config/server-mode.node.js');
const { getCurrentServerConfig, printConfig } = serverCfg;

// 获取服务器配置 - 优先使用环境变量 PORT
const port = process.env.PORT || 8081;

// 启动服务器
server.listen(port, '0.0.0.0', () => {
  printConfig();
  console.log(`✅ 服务器已启动，运行在端口 ${port}`);
  console.log(`🔗 访问地址: http://0.0.0.0:${port}`);
  console.log(`🖥️  后台管理: http://0.0.0.0:${port}/admin`);
});

// 错误处理
server.on('error', (err) => {
  console.error('❌ 服务器启动失败:', err);
  process.exit(1);
});