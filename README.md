# 直播辩论项目

## 📌 基本信息

**项目名称**: 直播辩论系统 (Live Debate)

这是一个基于 Node.js + Express + WebSocket 的直播辩论平台，支持实时投票、AI 辩论内容生成、直播控制等功能。

---

## 🚀 演示地址

- **前端访问地址**: [https://live-debate-gateway.onrender.com](https://live-debate-gateway.onrender.com)
- **后端 API 地址**: [https://live-debate-backend.onrender.com](https://live-debate-backend.onrender.com)
- **后台管理页面**: [https://live-debate-gateway.onrender.com/admin](https://live-debate-gateway.onrender.com/admin)

> **注意**: 演示地址需要在 Render 平台部署后才能访问。详见 [DEPLOY.md](./DEPLOY.md)

---

## 🧱 技术栈说明

### 后端框架
- **Node.js**: JavaScript 运行时环境
- **Express**: Web 框架
- **WebSocket (ws)**: 实时通信

### Mock 数据生成方案
- **内存存储**: 使用内存对象模拟数据库
- **动态生成**: 投票数据和 AI 辩论内容通过代码动态生成
- **服务位置**: `backend/src/services/mockService.js`

### 部署平台与方式
- **推荐平台**: Vercel / Render / Railway
- **部署方式**: 将前端、网关、后端部署到同一服务器

---

## 🔗 项目结构

```
/live-debate/
├── frontend/         # 前端项目（Fork自 https://github.com/xuelinc91-creator/Live）
│   ├── admin/        # 后台管理页面
│   ├── components/   # Vue 组件
│   ├── pages/        # 页面
│   └── static/       # 静态资源
│
├── gateway/          # 网关项目（Fork自 https://github.com/xuelinc91-creator/live-gateway）
│   ├── gateway.js    # 网关入口
│   └── config/       # 配置文件
│
├── backend/          # 后端项目（我编写的后端服务）
│   ├── src/
│   │   ├── controllers/    # 控制器层
│   │   ├── routes/         # 路由层
│   │   ├── services/       # 服务层（含 mockService.js）
│   │   ├── state/          # 状态管理
│   │   ├── websocket/      # WebSocket服务
│   │   └── scheduler/      # 定时任务
│   └── package.json
│
└── README.md         # 项目说明文件
```

---

## 📡 主要接口列表

### 投票管理

| 功能 | 方法 | 路径 | 描述 |
|------|------|------|------|
| 获取投票数据 | GET | `/api/admin/votes` | 返回当前票数和百分比 |
| 更新投票数据 | PUT | `/api/admin/votes` | 管理员修改票数 |
| 重置投票 | POST | `/api/admin/votes/reset` | 重置票数为0 |

### 直播管理

| 功能 | 方法 | 路径 | 描述 |
|------|------|------|------|
| 获取直播状态 | GET | `/api/admin/live/status` | 返回直播状态信息 |
| 控制直播 | POST | `/api/admin/live/control` | 开始/停止直播 |
| 设置直播计划 | POST | `/api/admin/live/schedule` | 设置定时直播 |
| 获取直播计划 | GET | `/api/admin/live/schedule` | 获取当前直播计划 |
| 取消直播计划 | POST | `/api/admin/live/schedule/cancel` | 取消直播计划 |

### 辩论管理

| 功能 | 方法 | 路径 | 描述 |
|------|------|------|------|
| 获取辩论设置 | GET | `/api/admin/debate` | 获取辩题信息 |
| 更新辩论设置 | PUT | `/api/admin/debate` | 修改辩题 |

### AI 内容管理

| 功能 | 方法 | 路径 | 描述 |
|------|------|------|------|
| 获取AI内容列表 | GET | `/api/admin/ai-content/list` | 分页获取AI辩论内容 |
| 获取单个AI内容 | GET | `/api/admin/ai-content/:id` | 获取单个AI内容详情 |
| 添加AI内容 | POST | `/api/admin/ai-content` | 添加新的AI辩论内容 |
| 更新AI内容 | PUT | `/api/admin/ai-content/:id` | 更新AI辩论内容 |

### 用户管理

| 功能 | 方法 | 路径 | 描述 |
|------|------|------|------|
| 获取用户列表 | GET | `/api/admin/users` | 获取所有用户 |
| 获取单个用户 | GET | `/api/admin/users/:id` | 获取单个用户详情 |

---

## 🧠 项目开发过程笔记

### 实现思路
1. **架构设计**: 采用标准 MVC 架构，清晰分离业务逻辑
2. **数据管理**: 使用内存存储模拟数据库，简化开发流程
3. **实时通信**: 集成 WebSocket 实现实时数据更新
4. **模块化设计**: 按功能模块拆分代码，提高可维护性

### 遇到的问题与解决方案
1. **文件不存在错误**: 原代码引用了不存在的 `admin/db.js` 文件，改为使用 `mockService.js` 提供模拟数据
2. **跨域问题**: 配置 CORS 中间件，允许所有来源的请求
3. **WebSocket 连接**: 实现了完善的 WebSocket 服务，支持实时状态同步

### 本地联调经验
1. 先启动后端服务，确保 API 接口正常
2. 使用 Postman 测试所有 API 接口
3. 启动前端项目，验证前后端交互
4. 测试 WebSocket 实时通信功能

### 部署步骤与踩坑记录
- **端口配置**: 确保服务器端口与配置一致
- **环境变量**: 生产环境需要适当的环境变量配置
- **静态文件**: 确保静态资源正确配置

---

## 🧍 个人介绍

### 技术背景
- **主语言**: JavaScript/TypeScript
- **擅长方向**: 全栈开发、Node.js、Vue.js
- **学习目标**: 不断学习新技术，提升系统架构设计能力

### 项目经验
- 开发过多个基于 Express 和 Vue 的全栈应用
- 熟悉 WebSocket 实时通信技术
- 有云服务平台部署经验

---

## 📄 许可证

MIT License
