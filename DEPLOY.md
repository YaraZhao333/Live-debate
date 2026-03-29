# 🚀 部署指南

## 项目结构

```
/live-debate/
├── frontend/         # 前端项目（uni-app）
├── gateway/          # 网关服务（纯代理）
├── backend/          # 后端服务（API + WebSocket）
└── README.md
```

## 本地开发

### 1. 安装依赖

```bash
# 安装所有依赖
npm run install:all

# 或者分别安装
cd backend && npm install
cd ../gateway && npm install
```

### 2. 启动服务

**方式一：同时启动（推荐）**
```bash
npm start
```

**方式二：分别启动**
```bash
# 终端1：启动后端
cd backend && npm start

# 终端2：启动网关
cd gateway && npm start
```

### 3. 访问服务

- 网关地址: http://localhost:3000
- 后端地址: http://localhost:8081
- 后台管理: http://localhost:3000/admin

## 云端部署

### 方案一：Render（推荐）

1. 注册 [Render](https://render.com) 账号
2. 创建 Blueprint
3. 上传 `render.yaml` 配置文件
4. 自动部署后端和网关服务

### 方案二：Railway

1. 注册 [Railway](https://railway.app) 账号
2. 导入 GitHub 仓库
3. 配置环境变量
4. 自动部署

### 方案三：Vercel（仅网关）

**注意**: Vercel 不支持 WebSocket 和多服务，仅适合部署网关。

```bash
# 安装 Vercel CLI
npm i -g vercel

# 部署
cd gateway
vercel
```

## 环境变量

| 变量名 | 说明 | 默认值 |
|--------|------|--------|
| `NODE_ENV` | 环境模式 | production |
| `PORT` | 服务端口 | 8080 |
| `BACKEND_PORT` | 后端端口 | 8081 |
| `GATEWAY_PORT` | 网关端口 | 3000 |

## 端口配置

- **后端服务**: 8081
- **网关服务**: 3000
- **前端开发**: 8080 (H5)

## 部署检查清单

- [ ] 后端服务正常运行
- [ ] 网关服务正常运行
- [ ] API 接口响应正常
- [ ] WebSocket 连接正常
- [ ] 后台管理页面可访问
- [ ] 跨域配置正确

## 常见问题

### 1. 端口冲突

**错误**: `EADDRINUSE: address already in use`

**解决**:
```bash
# 查看端口占用
netstat -ano | findstr :8080

# 停止进程
taskkill /F /PID <PID>
```

### 2. 后端服务不可用

**检查**:
- 后端是否已启动
- 端口配置是否正确
- 网关的 `BACKEND_URL` 是否指向正确的后端地址

### 3. WebSocket 连接失败

**检查**:
- WebSocket 服务是否已启动
- 防火墙是否开放端口
- 网关是否正确代理 WebSocket

## 演示地址

部署完成后，更新 README.md 中的演示地址：

```markdown
- **前端访问地址**: https://your-app.render.com
- **后端 API 地址**: https://your-backend.render.com
```
