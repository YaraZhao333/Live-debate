# 直播辩论系统

## 📌 基本信息

**项目名称**: 直播辩论系统 (Live Debate)

这是一个基于 Node.js + Express + WebSocket 的直播辩论平台，支持实时投票、AI 辩论内容生成、直播控制等功能。

---

## 🚀 本地演示

- **前端访问地址**: http://localhost:3000
- **后台管理页面**: http://localhost:3000/admin
- **网关服务**: 端口 3000
- **后端服务**: 端口 8081

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
- **推荐平台**: Render
- **部署方式**: 将前端、网关、后端部署到同一服务器
- **详细部署文档**: [DEPLOY.md](./DEPLOY.md)

---

## 🛠️ 快速开始

### 环境要求
- Node.js >= 14.x
- npm 或 yarn

### 安装依赖
```bash
# 安装根目录依赖
npm install

# 或分别安装
cd backend && npm install
cd ../gateway && npm install
```

### 本地运行
```bash
# 在项目根目录启动所有服务
npm start
```

服务启动后访问：
- 前端: http://localhost:3000
- 后台管理: http://localhost:3000/admin

---

## 🔗 项目结构

```
/live-debate/
├── frontend/         # 前端项目（uni-app）
│   ├── admin/        # 后台管理页面
│   ├── components/   # Vue 组件
│   ├── pages/        # 页面
│   ├── static/       # 静态资源
│   └── unpackage/    # 构建产物
│
├── gateway/          # 网关项目（代理服务器）
│   ├── gateway.js    # 网关入口
│   └── config/       # 配置文件
│
├── backend/          # 后端项目
│   ├── src/
│   │   ├── controllers/    # 控制器层
│   │   ├── routes/         # 路由层
│   │   ├── services/       # 服务层
│   │   ├── state/          # 状态管理
│   │   ├── websocket/      # WebSocket服务
│   │   ├── scheduler/      # 定时任务
│   │   ├── app.js          # Express应用配置
│   │   └── server.js       # 服务器入口
│   └── package.json
│
├── render.yaml       # Render部署配置
├── vercel.json       # Vercel部署配置
├── DEPLOY.md         # 部署文档
└── README.md         # 项目说明文件
```

---

## 📡 主要接口列表

### 直播流管理

| 功能 | 方法 | 路径 | 描述 |
|------|------|------|------|
| 获取直播流列表 | GET | `/api/v1/admin/streams` | 返回所有直播流 |
| 获取单个直播流 | GET | `/api/v1/admin/streams/:id` | 获取直播流详情 |
| 创建直播流 | POST | `/api/v1/admin/streams` | 创建新的直播流 |
| 更新直播流 | PUT | `/api/v1/admin/streams/:id` | 更新直播流信息 |
| 删除直播流 | DELETE | `/api/v1/admin/streams/:id` | 删除直播流 |
| 切换直播流状态 | POST | `/api/v1/admin/streams/:id/toggle` | 启用/禁用直播流 |

### 投票管理

| 功能 | 方法 | 路径 | 描述 |
|------|------|------|------|
| 获取投票数据 | GET | `/api/v1/admin/votes` | 返回当前票数和百分比 |
| 更新投票数据 | PUT | `/api/v1/admin/votes` | 管理员修改票数 |
| 重置投票 | POST | `/api/v1/admin/votes/reset` | 重置票数为0 |

### 直播管理

| 功能 | 方法 | 路径 | 描述 |
|------|------|------|------|
| 获取直播状态 | GET | `/api/v1/admin/live/status` | 返回直播状态信息 |
| 控制直播 | POST | `/api/v1/admin/live/control` | 开始/停止直播 |
| 设置直播计划 | POST | `/api/v1/admin/live/schedule` | 设置定时直播 |
| 获取直播计划 | GET | `/api/v1/admin/live/schedule` | 获取当前直播计划 |
| 取消直播计划 | POST | `/api/v1/admin/live/schedule/cancel` | 取消直播计划 |
| 获取观看人数 | GET | `/api/v1/admin/live/viewers` | 获取直播观看人数 |
| 设置并开始直播 | POST | `/api/v1/admin/live/setup-and-start` | 设置并开始直播 |

### 辩论管理

| 功能 | 方法 | 路径 | 描述 |
|------|------|------|------|
| 获取辩论设置 | GET | `/api/v1/admin/debate` | 获取辩题信息 |
| 更新辩论设置 | PUT | `/api/v1/admin/debate` | 修改辩题 |

### 仪表板

| 功能 | 方法 | 路径 | 描述 |
|------|------|------|------|
| 获取仪表板数据 | GET | `/api/v1/admin/dashboard` | 获取综合统计数据 |

---

## 🎯 功能特性

- ✅ **实时投票**: 用户实时投票，数据实时同步
- ✅ **AI 辩论内容**: 动态生成正反方辩论内容
- ✅ **直播控制**: 管理员可控制直播启停
- ✅ **多直播流**: 支持多个直播流管理
- ✅ **实时通信**: WebSocket 实现实时数据推送
- ✅ **仪表板**: 数据统计和可视化展示
- ✅ **后台管理**: 完整的管理界面

---

## 📄 许可证

MIT License
