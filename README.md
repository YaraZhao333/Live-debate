# 直播辩论系统

## 📌 基本信息

**项目名称**: 直播辩论系统

**项目简介**: 这是一个基于 Node.js + Express + WebSocket 的实时直播辩论平台服务，支持多直播间管理、实时投票、AI 辩论内容识别、辩论流程控制等功能。


### 🎯 功能实现情况

#### 1. 直播管理功能
| 功能 | 后台管理 | 前端页面 | 说明 |
|------|----------|----------|------|
| 多直播流管理（创建、编辑、删除、启用/禁用） | ✅ | ❌ | 仅后台管理页面支持直播流CRUD操作 |
| 直播控制（开始/停止） | ✅ | ✅ | 前后端均支持 |
| 直播计划（定时直播） | ✅ | ❌ | 仅后台支持定时直播设置 |
| 实时观看人数统计 | ✅ | ✅ | 前后端均支持 |
| HLS 视频流播放 | ✅ | ✅ | 前后端均支持 |

#### 2. 实时投票系统
| 功能 | 后台管理 | 前端页面 | 说明 |
|------|----------|----------|------|
| 正方/反方票数实时更新 | ✅ | ✅ | WebSocket 实时推送 |
| 票数设置/增加/重置 | ✅ | ❌ | 仅后台支持票数管理 |
| 投票统计与百分比计算 | ✅ | ✅ | 前后端均支持 |
| 大屏幕实时展示 | ✅ | - | 独立展示页面 |

#### 3. AI 内容管理
| 功能 | 后台管理 | 前端页面 | 说明 |
|------|----------|----------|------|
| AI 语音识别控制（启动/停止/暂停） | ✅ | ❌ | 仅后台支持 AI 控制 |
| AI 辩论内容列表 | ✅ | ✅（仅查看） | 后台支持完整管理，前端仅查看 |
| AI 内容评论与点赞 | ✅ | ✅ | 前后端均支持 |
| 实时 AI 内容推送 | ✅ | ✅ | WebSocket 实时推送 |

#### 4. 辩论流程控制
| 功能 | 后台管理 | 前端页面 | 说明 |
|------|----------|----------|------|
| 辩论流程配置 | ✅ | ❌ | 仅后台支持配置环节 |
| 辩论流程控制（开始/暂停/结束） | ✅ | ❌ | 仅后台支持控制 |
| 大屏幕实时显示 | ✅ | - | 独立展示页面 |
| 辩题管理 | ✅ | ✅（仅查看） | 后台支持编辑，前端仅查看 |

#### 5. 其他功能
| 功能 | 后台管理 | 前端页面 | 说明 |
|------|----------|----------|------|
| 评委管理 | ✅ | ❌ | 仅后台支持评委管理 |
| 用户投票记录 | ✅ | ❌ | 仅后台支持查看记录 |
| 微信登录 | ✅ | ✅ | Mock 实现 |
| 跨域资源共享（CORS） | ✅ | ✅ | 前后端均支持 |
| WebSocket 实时通信 | ✅ | ✅ | 前后端均支持 |

---

## 🚀 演示地址

- **前端访问地址**: https://live-debate-frontend.onrender.com
- **后台管理页面**: https://live-debate-admin.onrender.com

> **注意**: 以上地址已部署到 Render 平台，可直接访问。
> 
> **架构说明**: 采用网关代理模式，所有 API 请求通过网关 (`live-debate-gateway`) 转发到后端服务，前端不直接访问后端。

---

## 🧱 技术栈说明

### 后端框架
- **Node.js**: JavaScript 运行时环境 (v24.14.0)
- **Express**: Web 应用框架 (v4.18.2)
- **WebSocket (ws)**: 实时双向通信 (v8.14.2)
- **UUID**: 唯一标识符生成 (v9.0.1)
- **CORS**: 跨域资源共享中间件 (v2.8.5)

### Mock 数据生成方案
- **内存存储**: 使用 JavaScript 对象模拟数据库存储，无需连接真实数据库
- **动态生成**: 投票数据、AI 辩论内容、直播流信息等通过代码动态生成
- **服务位置**: `backend/src/services/mockService.js`
- **状态管理**: `backend/src/state/` 目录下的状态管理模块（aiState.js、liveState.js、voteState.js）

### 部署平台与方式
- **开发环境**: 
  - 后端：IDEA + Node.js + nodemon（热重载）
  - 前端：HBuilderX（uni-app 跨平台开发）
- **生产环境**: Render 云平台
- **部署架构**: 
  - **前端**: 独立部署到 `live-debate-frontend.onrender.com`
  - **后台管理**: 独立部署到 `live-debate-admin.onrender.com`
  - **网关**: 独立部署到 `live-debate-gateway.onrender.com`（统一入口，代理所有 API 请求）
  - **后端**: 独立部署到 `live-debate-backend.onrender.com`（内部服务，不直接对外）
- **访问方式**: 前端通过网关访问后端 API，路径为 `https://live-debate-gateway.onrender.com/api/v1/...`

---

## 🔗 项目结构与接口说明

### 后端目录结构

```
backend/
├── config/                    # 配置文件
│   └── server-mode.node.js    # 服务器模式配置
├── src/
│   ├── controllers/           # 控制器层（处理业务逻辑）
│   │   ├── adminController.js        # 后台管理控制器
│   │   ├── aiContentController.js    # AI内容管理控制器
│   │   ├── aiController.js           # AI控制控制器
│   │   ├── authController.js         # 认证控制器
│   │   ├── commentController.js      # 评论控制器
│   │   ├── debateFlowController.js   # 辩论流程控制器
│   │   ├── debateTopicController.js  # 辩题控制器
│   │   ├── judgesController.js       # 评委控制器
│   │   ├── liveController.js         # 直播控制控制器
│   │   ├── statisticsController.js   # 统计控制器
│   │   ├── streamDetailController.js # 流详情控制器
│   │   ├── streamsController.js      # 直播流管理控制器
│   │   ├── userVoteController.js     # 用户投票控制器
│   │   ├── voteController.js         # 票数管理控制器
│   │   └── wechatLoginController.js  # 微信登录控制器
│   ├── routes/                # 路由层（定义 API 路由）
│   │   ├── adminRoutes.js            # 后台管理路由
│   │   ├── aiContentRoutes.js        # AI内容路由
│   │   ├── aiRoutes.js               # AI控制路由
│   │   ├── authRoutes.js             # 认证路由
│   │   ├── commentRoutes.js          # 评论路由
│   │   ├── debateFlowRoutes.js       # 辩论流程路由
│   │   ├── debateTopicRoutes.js      # 辩题路由
│   │   ├── judgesRoutes.js           # 评委路由
│   │   ├── liveRoutes.js             # 直播控制路由
│   │   ├── statisticsRoutes.js       # 统计路由
│   │   ├── streamDetailRoutes.js     # 流详情路由
│   │   ├── streamsRoutes.js          # 直播流管理路由
│   │   ├── userVoteRoutes.js         # 用户投票路由
│   │   ├── voteRoutes.js             # 票数管理路由
│   │   └── wechatLoginRoutes.js      # 微信登录路由
│   ├── services/              # 服务层（业务逻辑实现）
│   │   ├── aiService.js              # AI服务
│   │   ├── liveService.js            # 直播服务
│   │   ├── mockService.js            # Mock数据服务
│   │   ├── voteService.js            # 投票服务
│   │   └── wechatService.js          # 微信服务
│   ├── state/                 # 状态管理（内存状态）
│   │   ├── aiState.js                # AI状态管理
│   │   ├── liveState.js              # 直播状态管理
│   │   └── voteState.js              # 投票状态管理
│   ├── websocket/             # WebSocket 服务
│   │   └── wsServer.js               # WebSocket 服务器
│   ├── scheduler/             # 定时任务
│   │   └── liveScheduler.js          # 直播计划调度器
│   ├── app.js                 # Express 应用配置
│   └── server.js              # 服务器入口文件
└── package.json               # 项目依赖配置
```

### 主要接口列表

#### 直播管理接口

| 功能 | 方法 | 路径 | 描述 |
|------|------|------|------|
| 获取数据概览 | GET | `/api/v1/admin/dashboard` | 返回直播状态、票数、观看人数等综合数据 |
| 开始直播 | POST | `/api/v1/admin/live/start` | 开始指定直播流的直播 |
| 停止直播 | POST | `/api/v1/admin/live/stop` | 停止当前直播 |
| 获取直播状态 | GET | `/api/v1/live/status` | 获取当前直播状态和流地址 |
| 控制直播 | POST | `/api/v1/admin/live/control` | 管理员控制直播开始/停止 |
| 设置直播计划 | POST | `/api/v1/admin/live/schedule` | 设置定时直播计划 |
| 获取直播计划 | GET | `/api/v1/admin/live/schedule` | 获取当前直播计划 |
| 取消直播计划 | POST | `/api/v1/admin/live/schedule/cancel` | 取消直播计划 |
| 获取观看人数 | GET | `/api/v1/admin/live/viewers` | 获取当前观看人数 |

#### 投票管理接口

| 功能 | 方法 | 路径 | 描述 |
|------|------|------|------|
| 获取票数 | GET | `/api/v1/admin/votes` | 返回正方/反方票数和百分比 |
| 更新票数 | PUT | `/api/v1/admin/votes` | 设置票数为指定值 |
| 增加票数 | POST | `/api/v1/admin/votes/add` | 增加指定数量的票数 |
| 重置票数 | POST | `/api/v1/admin/votes/reset` | 重置票数为初始值 |
| 更新投票 | POST | `/api/v1/admin/live/update-votes` | 更新投票数据 |
| 重置投票 | POST | `/api/v1/admin/live/reset-votes` | 重置投票数据 |
| 获取投票统计 | GET | `/api/v1/admin/votes/statistics` | 获取投票统计数据 |

#### 直播流管理接口

| 功能 | 方法 | 路径 | 描述 |
|------|------|------|------|
| 获取直播流列表 | GET | `/api/v1/admin/streams` | 获取所有直播流信息 |
| 获取直播流详情 | GET | `/api/v1/admin/streams/detail` | 获取指定直播流的详细信息 |
| 获取单个直播流 | GET | `/api/v1/admin/streams/:id` | 获取指定 ID 的直播流 |
| 创建直播流 | POST | `/api/v1/admin/streams` | 创建新的直播流 |
| 更新直播流 | PUT | `/api/v1/admin/streams/:id` | 更新直播流信息 |
| 删除直播流 | DELETE | `/api/v1/admin/streams/:id` | 删除指定直播流 |
| 切换直播流状态 | POST | `/api/v1/admin/streams/:id/toggle` | 启用/禁用直播流 |
| 获取 RTMP 转 HLS 地址 | GET | `/api/v1/admin/rtmp/urls` | 获取 RTMP 流的 HLS 播放地址 |

#### AI 控制接口

| 功能 | 方法 | 路径 | 描述 |
|------|------|------|------|
| 启动 AI 识别 | POST | `/api/v1/admin/ai/start` | 启动 AI 语音识别服务 |
| 停止 AI 识别 | POST | `/api/v1/admin/ai/stop` | 停止 AI 语音识别服务 |
| 切换 AI 状态 | POST | `/api/v1/admin/ai/toggle` | 暂停/恢复 AI 识别 |

#### AI 内容管理接口

| 功能 | 方法 | 路径 | 描述 |
|------|------|------|------|
| 获取 AI 内容列表 | GET | `/api/v1/admin/ai-content/list` | 分页获取 AI 辩论内容 |
| 获取单个 AI 内容 | GET | `/api/v1/admin/ai-content/:id` | 获取指定 AI 内容详情 |
| 添加 AI 内容 | POST | `/api/v1/admin/ai-content` | 添加新的 AI 辩论内容 |
| 更新 AI 内容 | PUT | `/api/v1/admin/ai-content/:id` | 更新 AI 辩论内容 |
| 获取 AI 内容评论 | GET | `/api/v1/admin/ai-content/:id/comments` | 获取 AI 内容的评论列表 |
| 删除 AI 内容评论 | DELETE | `/api/v1/admin/ai-content/:id/comments/:commentId` | 删除指定评论 |

#### 辩论流程管理接口

| 功能 | 方法 | 路径 | 描述 |
|------|------|------|------|
| 获取辩论流程 | GET | `/api/v1/admin/debate-flow` | 获取当前辩论流程配置 |
| 保存辩论流程 | POST | `/api/v1/admin/debate-flow` | 保存辩论流程配置 |
| 控制辩论流程 | POST | `/api/v1/admin/debate-flow/control` | 控制辩论流程（开始/暂停/结束） |

#### 辩题管理接口

| 功能 | 方法 | 路径 | 描述 |
|------|------|------|------|
| 获取辩题 | GET | `/api/v1/debate-topic` | 获取当前辩题信息 |

#### 评论和点赞接口

| 功能 | 方法 | 路径 | 描述 |
|------|------|------|------|
| 添加评论 | POST | `/api/v1/admin/comment` | 为 AI 内容添加评论 |
| 删除评论 | DELETE | `/api/v1/admin/comment/:commentId` | 删除指定评论 |
| 点赞 | POST | `/api/v1/admin/like` | 为 AI 内容点赞 |

#### 用户投票接口

| 功能 | 方法 | 路径 | 描述 |
|------|------|------|------|
| 用户投票 | POST | `/api/v1/admin/user-vote` | 用户进行投票 |
| 获取用户投票记录 | GET | `/api/v1/admin/user-votes` | 获取用户投票记录 |

#### 评委管理接口

| 功能 | 方法 | 路径 | 描述 |
|------|------|------|------|
| 获取评委列表 | GET | `/api/v1/admin/judges` | 获取所有评委信息 |
| 保存评委信息 | POST | `/api/v1/admin/judges` | 保存评委信息 |

#### 统计接口

| 功能 | 方法 | 路径 | 描述 |
|------|------|------|------|
| 获取投票统计 | GET | `/api/v1/admin/votes/statistics` | 获取投票统计数据 |
| 获取综合统计 | GET | `/api/v1/admin/statistics` | 获取综合统计数据 |

#### 认证接口

| 功能 | 方法 | 路径 | 描述 |
|------|------|------|------|
| 微信登录 | POST | `/api/v1/admin/auth/wechat/login` | 微信用户登录 |
| 获取用户信息 | GET | `/api/v1/admin/auth/wechat/userinfo` | 获取微信用户信息 |
| 微信登录（旧） | POST | `/api/v1/admin/wechat-login` | 微信用户登录（兼容接口） |

---

## 🧠 项目开发过程笔记

### 项目实现思路

1. **架构设计**: 采用标准 MVC 架构，清晰分离路由层、控制器层、服务层，提高代码可维护性
2. **数据管理**: 使用内存存储模拟数据库，通过 `mockService.js` 统一管理模拟数据，简化开发流程
3. **实时通信**: 集成 WebSocket 实现实时数据更新，支持直播状态、票数、AI 内容的实时推送
4. **状态管理**: 通过独立的 `state` 模块管理全局状态，包括直播状态、AI 状态、投票状态
5. **模块化设计**: 按功能模块拆分代码，每个功能模块包含独立的路由、控制器、服务

### 遇到的问题与解决方案

#### 1. 跨域资源共享（CORS）问题
**问题描述**: 前端页面请求后端 API 时，浏览器阻止跨域请求，提示 `Access-Control-Allow-Origin` 头缺失。

**解决方案**:
- 在 `app.js` 中配置 CORS 中间件，允许所有来源的请求
- 为静态文件服务添加 CORS 响应头
- 为 HLS 流请求添加专门的 CORS 处理路由

#### 2. WebSocket 消息格式不一致
**问题描述**: 前后端 WebSocket 消息格式不一致，导致前端无法正确解析后端发送的消息。

**解决方案**:
- 统一 WebSocket 消息格式，使用 `type` 字段标识消息类型
- 在前端添加消息格式兼容处理，支持多种消息格式

#### 3. 重置票数功能问题
**问题描述**: 重置票数功能将票数重置为 0，而不是用户输入的初始值。

**解决方案**:
- 修改后端 `resetVotes` 方法，支持从 `resetTo` 对象中获取票数
- 兼容两种请求格式：直接在 body 中或在 resetTo 对象中

#### 4. 视频播放跨域问题
**问题描述**: 前端页面无法播放 HLS 直播流，提示跨域错误。

**解决方案**:
- 使用稳定的测试流地址（Apple 提供的测试流）
- 添加视频加载事件处理，手动触发播放
- 为视频组件添加 `ref` 属性，便于手动控制

#### 5. 直播状态同步问题
**问题描述**: 前端直播状态与后端不一致，导致显示错误。

**解决方案**:
- 实现 WebSocket 实时状态推送
- 添加定时轮询机制，定期同步状态
- 使用乐观更新策略，提升用户体验

### 本地联调经验

1. **启动顺序**: 先启动后端服务，确保 API 接口正常，再启动前端项目
2. **接口测试**: 使用 Postman 或浏览器开发工具测试所有 API 接口，确保返回数据格式正确
3. **WebSocket 测试**: 使用浏览器开发工具的 Network 标签页，监控 WebSocket 连接和消息
4. **跨域调试**: 在浏览器开发工具中查看 Network 请求，确认 CORS 头是否正确设置
5. **日志调试**: 在关键代码位置添加 `console.log`，便于追踪问题

### 部署步骤与踩坑记录

#### 部署步骤

1. **安装依赖**: 在 `backend` 目录下运行 `npm install` 安装依赖
2. **启动服务**: 运行 `npm run dev` 启动开发服务器（支持热重载）
3. **访问前端**: 打开浏览器访问 `http://localhost:8081`
4. **访问后台管理**: 打开浏览器访问 `http://localhost:8081/admin`

#### 踩坑记录

1. **端口占用**: 如果端口 8081 被占用，需要先停止占用该端口的进程
   - 使用 `netstat -ano | findstr :8081` 查找占用进程
   - 使用 `taskkill /F /PID <PID>` 终止进程

2. **静态文件路径**: 确保静态文件路径正确，Express 能够正确找到前端文件

3. **WebSocket 连接**: 确保前端 WebSocket 连接地址与后端一致，使用 `ws://` 或 `wss://` 协议

4. **环境变量**: 生产环境需要配置正确的环境变量，如端口号、API 地址等

---

## 🔮 可扩展性思考

本项目目前使用 Mock 数据实现，如果后续要接入真实后端，我有以下想法：

### 1. 数据库替换
现在数据都存在内存里，重启服务就丢了。如果要持久化，可以考虑：
- 用 MySQL 存储直播流信息、用户投票记录等结构化数据
- 用 Redis 缓存热点数据（比如当前票数、在线人数），减少数据库压力
- 数据模型设计可以参考现在的 `mockService.js`，把对象结构转成表结构

### 2. AI 功能接入
现在的 AI 内容是模拟生成的，真实场景可以：
- 接入科大讯飞或百度的语音识别 API，把直播语音转成文字
- 后端用 WebSocket 实时推送识别结果到前端
- 需要处理音频流的分片和并发识别

### 3. 用户认证完善
现在的微信登录是 Mock 的，真实实现需要：
- 接入微信 OAuth2.0 登录流程
- 用 JWT 生成 Token，前端请求时带上
- 后端验证 Token 有效期，实现登录态管理

### 4. 性能优化方向
- 直播人数统计可以用 Redis 的 HyperLogLog，节省内存
- 投票接口可以加个简单的限流，防止刷票
- WebSocket 连接多了之后，可以考虑用 Redis 做消息广播，支持多实例部署

### 5. 学到的东西
通过这个项目，我对以下技术有了更深的理解：
- WebSocket 实时通信的原理和应用场景
- CORS 跨域问题的产生原因和解决方法
- MVC 架构的分层思想，对后续学习 SpringBoot 有帮助
- 部署到云平台的流程和注意事项

---

## 🧍 个人介绍

**赵依梦** | 软件工程本科 | 宁波大学科学技术学院

### 技术背景
- **主语言**: Java
- **擅长方向**: 后端开发（SpringBoot + MyBatis + MySQL）
- **技术栈**: Java、SpringBoot、MyBatis、MySQL、Redis、Socket网络编程
- **学习目标**: 深入学习微服务架构、分布式系统设计、云原生技术

### 核心优势
- 📚 专业排名前5%，获省政府奖学金、校一等奖学金
- 💻 熟悉 Java 后端开发，能独立完成 SpringBoot + MySQL 项目开发
- 🚀 具备良好的编程基础，熟悉 MyBatis、Redis 缓存及 Socket 网络编程
- 🌐 有云服务平台部署经验，熟悉 Render 等部署平台
- 📱 具备全栈开发能力，熟悉 Android 开发及前端技术栈

### 项目经验
- **QQ即时通讯系统**: 基于 Java Socket + MySQL 实现，支持实时聊天、文件传输、离线消息
- **购物商城系统**: SpringBoot + MyBatis + Redis，实现商品管理、购物车、订单系统
- **Android天气应用**: MVVM架构，集成第三方API，实现天气查询与可视化

---