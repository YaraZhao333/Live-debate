const liveService = require('../services/liveService');
const mockService = require('../services/mockService');
const { broadcast } = require('../websocket/wsServer');

// 全局观看人数，用于波动
let globalViewers = 123;

// 直播相关控制器
module.exports = {
    // 获取直播状态（前端轮询这个接口）
    getLiveStatus: (req, res) => {
        try {
            const streamId = req.query.stream_id || req.query.streamId;
            const aiStatus = require('../state/aiState').getAIStatusForStream(streamId);
            const liveStatus = liveService.getLiveStatus();
            
            // 🔧 关键修复：根据 streamId 获取对应流的直播状态
            const { getStreamLiveStatus } = require('../state/liveState');
            const streamLiveStatus = streamId ? getStreamLiveStatus(streamId) : null;
            
            // 🔧 关键修复：如果流没有独立状态，检查 mockService.live.status（与后台管理系统保持一致）
            let isLive = streamLiveStatus ? streamLiveStatus.isLive : liveStatus.isLive;
            let streamUrl = streamLiveStatus ? streamLiveStatus.streamUrl : liveStatus.streamUrl;
            const currentStreamId = streamLiveStatus ? streamId : liveStatus.streamId;
            
            // 如果流没有独立状态且全局状态为 false，检查 mockService.live.status
            if (!isLive && !streamLiveStatus) {
                isLive = mockService.live.get().status === 'online';
                // 如果 mockService.live.status 为 online，使用默认流地址
                if (isLive && !streamUrl) {
                    streamUrl = 'https://test-streams.mux.dev/x36xhzz/x36xhzz.m3u8';
                }
            }
            
            console.log('📡 getLiveStatus 查询:', { 
                streamId, 
                isLive, 
                streamLiveStatus: streamLiveStatus ? 'found' : 'not found',
                globalIsLive: liveStatus.isLive,
                mockLiveStatus: mockService.live.status
            });
            
            res.json({
                code: 0,
                message: 'success',
                data: {
                    isLive: isLive,
                    status: isLive ? 'online' : 'offline',
                    streamUrl: streamUrl,
                    current_stream: currentStreamId,
                    streamId: streamId,
                    aiStatus: aiStatus.status,
                    timestamp: Date.now()
                }
            });
        } catch (error) {
            console.error('获取直播状态失败:', error);
            res.status(500).json({
                code: -1,
                message: '获取失败',
                data: null
            });
        }
    },

    // 管理员控制直播
    adminControlLive: (req, res) => {
        try {
            const { action, streamUrl } = req.body;
            const result = liveService.controlLive(action, streamUrl);

            res.json({
                code: 0,
                message: '操作成功',
                data: {
                    status: result.isLive ? 'started' : 'stopped',
                    streamUrl: result.streamUrl
                }
            });
        } catch (error) {
            console.error('控制直播状态失败:', error);
            res.status(400).json({
                code: -1,
                message: '操作失败',
                data: null
            });
        }
    },

    // 用户控制直播
    userControlLive: (req, res) => {
        try {
            const { action, streamId } = req.body;
            const result = liveService.controlLive(action, null, streamId);

            res.json({
                code: 0,
                message: result.isLive ? '直播已开始' : '直播已停止',
                data: {
                    status: result.isLive ? 'started' : 'stopped',
                    streamUrl: result.streamUrl,
                    streamId: result.streamId
                }
            });
        } catch (error) {
            console.error('用户控制直播状态失败:', error);
            res.status(400).json({
                code: -1,
                message: '操作失败: ' + error.message,
                data: null
            });
        }
    },

    // 设置直播计划
    setLiveSchedule: (req, res) => {
        try {
            const schedule = liveService.setLiveSchedule(req.body);
            res.json({
                code: 0,
                message: '直播计划已设置',
                data: schedule
            });
        } catch (error) {
            console.error('设置直播计划失败:', error);
            res.status(400).json({
                code: -1,
                message: '设置失败',
                data: null
            });
        }
    },

    // 获取直播计划
    getLiveSchedule: (req, res) => {
        try {
            const schedule = liveService.getLiveSchedule();
            res.json({
                code: 0,
                message: 'success',
                data: schedule
            });
        } catch (error) {
            res.status(500).json({
                code: -1,
                message: '获取失败',
                data: null
            });
        }
    },

    // 取消直播计划
    cancelLiveSchedule: (req, res) => {
        try {
            liveService.cancelLiveSchedule();
            res.json({
                code: 0,
                message: '直播计划已取消',
                data: null
            });
        } catch (error) {
            res.status(500).json({
                code: -1,
                message: '取消失败',
                data: null
            });
        }
    },

    // 设置并开始直播
    setupAndStartLive: (req, res) => {
        try {
            const result = liveService.setupAndStartLive(req.body);
            const isSchedule = !req.body.startNow;

            res.json({
                code: 0,
                message: isSchedule ? '直播计划已设置' : '直播已开始',
                data: result
            });
        } catch (error) {
            console.error('设置并开始直播失败:', error);
            res.status(400).json({
                code: -1,
                message: '操作失败',
                data: null
            });
        }
    },

    // 获取观看人数（支持两种模式）
    getViewersCount: (req, res) => {
        try {
            const streamId = req.query.stream_id || req.query.streamId;
            
            // 模拟人数波动
            globalViewers = globalViewers + Math.floor(Math.random() * 10 - 5);
            if (globalViewers < 0) globalViewers = 0;
            
            // 如果没有 stream_id，返回所有流的数据（多直播总览用）
            if (!streamId) {
                res.json({
                    code: 0,
                    message: 'ok',
                    data: {
                        streams: {
                            'mock-stream-1': Math.floor(Math.random() * 200),
                            'mock-stream-2': Math.floor(Math.random() * 200)
                        },
                        timestamp: Date.now()
                    }
                });
                return;
            }
            
            // 有 stream_id，返回单个流的数据
            res.json({
                code: 0,
                message: 'ok',
                data: {
                    streamId: streamId,
                    viewers: globalViewers,
                    timestamp: Date.now()
                }
            });
        } catch (error) {
            console.error('获取观看人数失败:', error);
            res.status(500).json({
                code: -1,
                message: '获取失败',
                data: null
            });
        }
    },

    // 开始直播（关键修复）
    startLive: (req, res) => {
        try {
            const { streamId, stream_id, autoStartAI = true, notifyUsers = true } = req.body;
            const finalStreamId = streamId || stream_id;
            console.log('🚀 收到开始直播请求:', { streamId: finalStreamId, autoStartAI });
            
            if (!finalStreamId) {
                return res.status(400).json({
                    code: -1,
                    message: "stream_id 不能为空",
                    data: null
                });
            }
            
            // 调用服务方法开始直播
            const result = liveService.startLive(finalStreamId, autoStartAI, notifyUsers);
            console.log('📋 liveService.startLive 返回结果:', result);
            
            // 直接更新全局状态（双重保险）
            const { updateGlobalLiveStatus, getGlobalLiveStatus } = require('../state/liveState');
            const playHls = "https://test-streams.mux.dev/x36xhzz/x36xhzz.m3u8";
            
            updateGlobalLiveStatus({
                isLive: true,
                streamUrl: playHls,
                streamId: finalStreamId,
                liveId: 'live-' + Date.now(),
                startTime: new Date().toISOString()
            });
            
            // 验证状态是否更新成功
            const updatedStatus = getGlobalLiveStatus();
            console.log('✅ 全局直播状态已更新:', updatedStatus);
            
            // 同步更新 mockService.live 状态
            mockService.live.update({
                status: "online",
                currentStream: finalStreamId
            });
            
            // 广播 live-started 事件给所有 WebSocket 客户端
            broadcast('live-started', {
                streamId: finalStreamId,
                streamUrl: playHls,
                timestamp: Date.now()
            });
            
            // 同时广播 live-status 事件（确保前端能收到）
            broadcast('live-status', {
                status: 'online',
                isLive: true,
                streamUrl: playHls,
                streamId: finalStreamId
            });
            
            console.log('📡 已广播 live-started 和 live-status 事件');
            
            return res.json({
                code: 0,
                message: '直播已开始',
                data: {
                    stream_id: finalStreamId,
                    streamId: finalStreamId,
                    play_hls: playHls,
                    status: 'started',
                    aiStatus: 'running',
                    timestamp: Date.now()
                }
            });
        } catch (error) {
            console.error('❌ 开始直播失败:', error);
            return res.status(400).json({
                code: -1,
                message: error.message || '开始直播失败',
                data: null
            });
        }
    },

    // 停止直播
    stopLive: (req, res) => {
        try {
            const { streamId, stream_id, saveStatistics = true, notifyUsers = true } = req.body;
            const finalStreamId = streamId || stream_id;
            console.log('🛑 收到停止直播请求:', { streamId: finalStreamId });
            
            if (!finalStreamId) {
                return res.status(400).json({
                    code: -1,
                    message: "stream_id 不能为空",
                    data: null
                });
            }
            
            // 先调用服务方法停止直播，确保 liveState 状态被正确更新
            const result = liveService.stopLive(finalStreamId, saveStatistics, notifyUsers);
            
            // 同步更新 mockService.live 状态，保持与 liveState 一致
            mockService.live.update({
                status: "offline",
                currentStream: null
            });
            
            return res.json({
                code: 0,
                message: '直播已停止'
            });
        } catch (error) {
            console.error('停止直播失败:', error);
            return res.status(400).json({
                code: -1,
                message: error.message || '停止直播失败',
                data: null
            });
        }
    },

    // 更新投票
    updateVotes: (req, res) => {
        try {
            const { action, leftVotes: L, rightVotes: R, reason = '', notifyUsers = true, streamId } = req.body;
            console.log('📊 收到更新投票请求:', { action, leftVotes: L, rightVotes: R, streamId });
            
            const result = liveService.updateVotes(action, L, R, reason, notifyUsers, streamId);
            
            res.json({
                code: 0,
                message: '投票更新成功',
                data: {
                    leftVotes: result.leftVotes,
                    rightVotes: result.rightVotes,
                    timestamp: Date.now()
                }
            });
        } catch (error) {
            console.error('更新投票失败:', error);
            res.status(400).json({
                code: -1,
                message: error.message || '更新投票失败',
                data: null
            });
        }
    },

    // 重置投票
    resetVotes: (req, res) => {
        try {
            // 兼容两种请求格式：直接在body中或在resetTo对象中
            const { resetTo, leftVotes = 0, rightVotes = 0, saveBackup = true, notifyUsers = true, streamId } = req.body;
            
            // 优先使用resetTo对象中的值
            const finalLeftVotes = resetTo?.leftVotes ?? leftVotes;
            const finalRightVotes = resetTo?.rightVotes ?? rightVotes;
            
            console.log('🔄 收到重置投票请求:', { leftVotes: finalLeftVotes, rightVotes: finalRightVotes, streamId });
            
            const result = liveService.resetVotes(finalLeftVotes, finalRightVotes, saveBackup, notifyUsers, streamId);
            
            res.json({
                code: 0,
                message: '投票数已重置',
                data: result
            });
        } catch (error) {
            console.error('重置投票失败:', error);
            res.status(400).json({
                code: -1,
                message: error.message || '重置投票失败',
                data: null
            });
        }
    },

    // 广播观看人数
    broadcastViewers: (req, res) => {
        try {
            const { streamId } = req.body;
            console.log('👥 收到广播观看人数请求:', { streamId });
            
            const result = liveService.broadcastViewers(streamId);
            
            res.json({
                code: 0,
                message: '观看人数已广播',
                data: result
            });
        } catch (error) {
            console.error('广播观看人数失败:', error);
            res.status(400).json({
                code: -1,
                message: error.message || '广播观看人数失败',
                data: null
            });
        }
    },

    // 获取数据概览
    getDashboard: (req, res) => {
        try {
            const streamId = req.query.stream_id || req.query.streamId;
            console.log('📊 收到数据概览请求:', { streamId });

            const liveStatus = liveService.getLiveStatus();
            const votes = require('../services/voteService').getVotes();
            const aiStatus = require('../state/aiState').getAIStatusForStream(streamId);

            // 使用全局观看人数，确保与 viewers 接口一致
            globalViewers = globalViewers + Math.floor(Math.random() * 10 - 5);
            if (globalViewers < 0) globalViewers = 0;

            // 🔧 关键修复：根据 streamId 获取对应流的直播状态，而不是全局状态
            // 这样每个流的 isLive 状态是独立的
            const { getStreamLiveStatus } = require('../state/liveState');
            const streamLiveStatus = streamId ? getStreamLiveStatus(streamId) : null;
            
            // 🔧 关键修复：如果流没有独立状态，检查 mockService.live.status（与后台管理系统保持一致）
            let isLive = streamLiveStatus ? streamLiveStatus.isLive : liveStatus.isLive;
            let streamUrl = streamLiveStatus ? streamLiveStatus.streamUrl : liveStatus.streamUrl;
            
            // 如果流没有独立状态且全局状态为 false，检查 mockService.live.status
            if (!isLive && !streamLiveStatus) {
                isLive = mockService.live.get().status === 'online';
                // 如果 mockService.live.status 为 online，使用默认流地址
                if (isLive && !streamUrl) {
                    streamUrl = 'https://test-streams.mux.dev/x36xhzz/x36xhzz.m3u8';
                }
            }
            
            console.log('📊 Dashboard 状态计算:', { 
                streamId, 
                isLive, 
                streamLiveStatus: streamLiveStatus ? 'found' : 'not found',
                globalIsLive: liveStatus.isLive,
                mockLiveStatus: mockService.live.status 
            });

            const dashboardData = {
                streamId: streamId,
                leftVotes: votes.leftVotes,
                rightVotes: votes.rightVotes,
                viewers: globalViewers,
                status: isLive ? 'running' : 'stopped',
                isLive: isLive,
                streamUrl: streamUrl,
                totalUsers: 100, // 模拟数据
                totalVotes: votes.leftVotes + votes.rightVotes,
                activeUsers: globalViewers,
                aiStatus: aiStatus.status,
                timestamp: Date.now()
            };

            res.json({
                code: 0,
                message: 'ok',
                data: dashboardData
            });
        } catch (error) {
            console.error('获取数据概览失败:', error);
            res.status(500).json({
                code: -1,
                message: '获取数据概览失败',
                data: null
            });
        }
    }
};