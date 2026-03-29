# 直播辩论项目

## 📌 项目介绍

这是一个基于 Node.js + Express + WebSocket 的直播辩论平台，支持实时投票、AI 辩论内容生成、直播控制等功能。项目采用标准 MVC 架构，使用 mock 数据模拟真实业务逻辑。

## 🚀 演示地址

- **前端访问地址**: [暂未部署]()
- **后端 API 地址**: [暂未部署]()

## 🧱 技术栈说明

### 后端技术栈
- **Node.js**: JavaScript 运行时环境
- **Express**: Web 框架
- **WebSocket (ws)**: 实时通信
- **UUID**: 生成唯一标识符
- **CORS**: 跨域资源共享

### 前端技术栈
- **uni-app**: 跨平台应用框架
- **Vue.js**: 前端框架
- **WebSocket**: 实时通信

### Mock 数据方案
- **内存存储**: 使用内存对象模拟数据库
- **动态生成**: 投票数据和 AI 辩论内容

## 🔗 项目结构

```
/live-debate/
├── backend/           # 后端服务（MVC标准架构）
│   ├── src/
│   │   ├── app.js          # Express 应用配置
│   │   ├── server.js        # 服务器启动
│   │   ├── controllers/     # 控制器层
│   │   ├── routes/          # 路由层
│   │   ├── services/        # 服务层（含mockService.js）
│   │   ├── state/           # 状态管理
│   │   ├── websocket/       # WebSocket服务
│   │   └── scheduler/       # 定时任务
│   └── package.json
├── frontend/          # 前端项目（uni-app）
│   ├── admin/          # 后台管理页面
│   ├── components/     # 组件
│   ├── config/         # 配置
│   ├── pages/          # 页面
│   └── static/         # 静态资源
├── gateway/           # 网关（纯代理）
│   ├── config/         # 配置
│   └── gateway.js      # 网关入口
└── README.md          # 项目说明
```

## 📡 主要接口列表

| 功能 | 方法 | 路径 | 描述 |
|------|------|------|------|
| **投票管理** | | | |
| 获取投票数据 | GET | `/api/admin/votes` | 返回当前票数和百分比 |
| 更新投票数据 | PUT | `/api/admin/votes` | 管理员修改票数 |
| 重置投票 | POST | `/api/admin/votes/reset` | 重置票数为0 |
| **直播管理** | | | |
| 获取直播状态 | GET | `/api/admin/live/status` | 返回直播状态信息 |
| 控制直播 | POST | `/api/admin/live/control` | 开始/停止直播 |
| 设置直播计划 | POST | `/api/admin/live/schedule` | 设置定时直播 |
| 获取直播计划 | GET | `/api/admin/live/schedule` | 获取当前直播计划 |
| 取消直播计划 | POST | `/api/admin/live/schedule/cancel` | 取消直播计划 |
| **辩论管理** | | | |
| 获取辩论设置 | GET | `/api/admin/debate` | 获取辩题信息 |
| 更新辩论设置 | PUT | `/api/admin/debate` | 修改辩题 |
| **AI 内容管理** | | | |
| 获取AI内容列表 | GET | `/api/admin/ai-content/list` | 分页获取AI辩论内容 |
| 获取单个AI内容 | GET | `/api/admin/ai-content/:id` | 获取单个AI内容详情 |
| 添加AI内容 | POST | `/api/admin/ai-content` | 添加新的AI辩论内容 |
| 更新AI内容 | PUT | `/api/admin/ai-content/:id` | 更新AI辩论内容 |
| 获取AI内容评论 | GET | `/api/admin/ai-content/:id/comments` | 获取AI内容的评论 |
| 删除AI内容评论 | DELETE | `/api/admin/ai-content/:id/comments/:commentId` | 删除AI内容评论 |
| **用户管理** | | | |
| 获取用户列表 | GET | `/api/admin/users` | 获取所有用户 |
| 获取单个用户 | GET | `/api/admin/users/:id` | 获取单个用户详情 |

## 🚀 部署步骤

### 1. 本地开发环境

```bash
# 安装依赖（后端）
cd backend
npm install

# 启动后端服务
npm start
# 或开发模式
npm run dev

# 前端开发
# 使用 HBuilderX 或其他 uni-app 开发工具打开 frontend 目录
```

### 2. 云服务平台部署

#### Vercel 部署
1. 注册 Vercel 账号
2. 连接 GitHub 仓库
3. 配置项目：
   - **Root Directory**: `backend`
   - **Build Command**: `npm install`
   - **Output Directory**: 留空
   - **Environment Variables**: 无特殊要求
4. 部署完成后获取访问地址

#### Render 部署
1. 注册 Render 账号
2. 创建 Web Service
3. 配置：
   - **Repository**: 选择 GitHub 仓库
   - **Branch**: main
   - **Build Command**: `cd backend && npm install`
   - **Start Command**: `cd backend && npm start`
   - **Environment**: Node.js
4. 部署完成后获取访问地址

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

### 部署踩坑记录
- **端口配置**: 确保服务器端口与配置一致
- **环境变量**: 生产环境需要适当的环境变量配置
- **静态文件**: 确保静态资源正确配置

## 🧍 个人介绍

### 技术背景
- **主语言**: JavaScript/TypeScript
- **擅长方向**: 全栈开发、Node.js、Vue.js
- **学习目标**: 不断学习新技术，提升系统架构设计能力

### 项目经验
- 开发过多个基于 Express 和 Vue 的全栈应用
- 熟悉 WebSocket 实时通信技术
- 有云服务平台部署经验

## 📄 许可证

MIT License
