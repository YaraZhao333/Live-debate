# 项目架构说明

## 概述

本项目采用标准的三层架构设计，严格遵循企业级开发标准。

## 架构图

```
┌─────────────┐
│   浏览器    │
└──────┬──────┘
       │
       ▼
┌──────────────────────────┐
│   Frontend (端口3000)    │
│  - 用户界面与交互        │
│  - 静态资源服务          │
│  - 发起API请求到网关     │
└──────┬───────────────────┘
       │
       ▼
┌──────────────────────────┐
│   Gateway (端口10000)    │
│  - 请求转发与统一入口    │
│  - API代理到后端         │
│  - WebSocket代理         │
└──────┬───────────────────┘
       │
       ▼
┌──────────────────────────┐
│   Backend (端口8081)     │
│  - 业务逻辑与数据处理    │
│  - Mock数据服务          │
│  - API接口               │
│  - WebSocket服务         │
└──────────────────────────┘
```

## 各服务职责

### 1. Frontend (前端)
- **目录**: `d:\live-debate\frontend\`
- **端口**: 3000
- **职责**:
  - 提供用户界面与交互
  - 静态资源服务（H5页面、管理后台）
  - 发起API请求到网关
- **启动命令**: `cd frontend && npm start`
- **入口文件**: `server-static.js`

### 2. Gateway (网关)
- **目录**: `d:\live-debate\gateway\`
- **端口**: 10000
- **职责**:
  - 请求转发与统一入口
  - API代理到后端
  - WebSocket代理
- **启动命令**: `cd gateway && npm start`
- **入口文件**: `gateway-proxy.js`

### 3. Backend (后端)
- **目录**: `d:\live-debate\backend\`
- **端口**: 8081
- **职责**:
  - 业务逻辑与数据处理
  - Mock数据服务
  - API接口
  - WebSocket服务
- **启动命令**: `cd backend && npm start`
- **入口文件**: `src/server.js`

## 请求流程

### 一次完整的请求流程

```
1. 浏览器访问 Frontend (3000端口)
   ↓
2. Frontend 提供静态页面
   ↓
3. 前端页面发起 API 请求到 Gateway (10000端口)
   ↓
4. Gateway 转发请求到 Backend (8081端口)
   ↓
5. Backend 处理业务逻辑，返回 Mock 数据
   ↓
6. Gateway 将响应返回给 Frontend
   ↓
7. Frontend 渲染页面
```

## 部署配置

### Render 云服务器部署

项目配置在 `render.yaml` 中，包含三个独立服务：

- `live-debate-backend`: 后端服务
- `live-debate-gateway`: 网关服务  
- `live-debate-frontend`: 前端服务

### 本地开发

```bash
# 安装所有依赖
npm run install:all

# 启动所有服务
npm start

# 或分别启动
npm run start:backend
npm run start:gateway
npm run start:frontend
```

## 企业级开发标准符合情况

✅ **职责分离**: 前端、网关、后端职责明确，互不越界
✅ **模块化架构**: 后端采用MVC架构（Controllers、Routes、Services）
✅ **统一入口**: 所有API请求通过网关统一转发
✅ **可扩展性**: 各服务可独立部署和扩展
✅ **Mock数据**: 后端提供完整的Mock数据服务
✅ **WebSocket支持**: 支持实时通信
