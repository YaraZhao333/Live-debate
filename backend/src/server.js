const { app, server } = require('./app');
const serverCfg = require('../config/server-mode.node.js');
const { getCurrentServerConfig, printConfig } = serverCfg;

// 获取服务器配置 - Render 环境优先使用 process.env.PORT
const port = process.env.PORT || 8080;

// 启动服务器
server.listen(port, '0.0.0.0', () => {
  printConfig();
  console.log(`✅ 服务器已启动，运行在端口 ${port}`);
  console.log(`🔗 访问地址: http://localhost:${port}`);
  console.log(`🖥️  后台管理: http://localhost:${port}/admin`);
});

// 错误处理
server.on('error', (err) => {
  console.error('❌ 服务器启动失败:', err);
  process.exit(1);
});