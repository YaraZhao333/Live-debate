const liveService = require('../services/liveService');

// 直播相关控制器
module.exports = {
    // 获取直播状态
    getLiveStatus: (req, res) => {
        try {
            const status = liveService.getLiveStatus();
            res.json({
                code: 0,
                message: 'success',
                data: status
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

    // 获取观看人数
    getViewersCount: (req, res) => {
        try {
            const streamId = req.query.stream_id;
            const viewers = Math.floor(Math.random() * 200) + 50;
            
            res.json({
                code: 0,
                message: 'success',
                data: {
                    streamId: streamId,
                    viewers: viewers,
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

    // 开始直播
    startLive: (req, res) => {
        try {
            const { streamId, autoStartAI = false, notifyUsers = true } = req.body;
            console.log('🚀 收到开始直播请求:', { streamId, autoStartAI });
            
            const result = liveService.startLive(streamId, autoStartAI, notifyUsers);
            
            res.json({
                code: 0,
                message: '直播已开始',
                data: result
            });
        } catch (error) {
            console.error('开始直播失败:', error);
            res.status(400).json({
                code: -1,
                message: error.message || '开始直播失败',
                data: null
            });
        }
    },

    // 停止直播
    stopLive: (req, res) => {
        try {
            const { streamId, saveStatistics = true, notifyUsers = true } = req.body;
            console.log('🛑 收到停止直播请求:', { streamId });
            
            const result = liveService.stopLive(streamId, saveStatistics, notifyUsers);
            
            res.json({
                code: 0,
                message: '直播已停止',
                data: result
            });
        } catch (error) {
            console.error('停止直播失败:', error);
            res.status(400).json({
                code: -1,
                message: error.message || '停止直播失败',
                data: null
            });
        }
    },

    // 更新投票
    updateVotes: (req, res) => {
        try {
            const { action, leftVotes, rightVotes, reason = '', notifyUsers = true, streamId } = req.body;
            console.log('📊 收到更新投票请求:', { action, leftVotes, rightVotes, streamId });
            
            const result = liveService.updateVotes(action, leftVotes, rightVotes, reason, notifyUsers, streamId);
            
            res.json({
                code: 0,
                message: '投票数已更新',
                data: result
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
            const { leftVotes = 0, rightVotes = 0, saveBackup = true, notifyUsers = true, streamId } = req.body;
            console.log('🔄 收到重置投票请求:', { leftVotes, rightVotes, streamId });
            
            const result = liveService.resetVotes(leftVotes, rightVotes, saveBackup, notifyUsers, streamId);
            
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
            const streamId = req.query.stream_id;
            console.log('📊 收到数据概览请求:', { streamId });

            const liveStatus = liveService.getLiveStatus();
            const votes = require('../services/voteService').getVotes();
            const aiStatus = require('../state/aiState').getAIStatusForStream(streamId);
            const viewers = Math.floor(Math.random() * 200) + 50;

            const dashboardData = {
                streamId: streamId,
                leftVotes: votes.leftVotes,
                rightVotes: votes.rightVotes,
                viewers: viewers,
                aiStatus: aiStatus.status,
                isLive: liveStatus.isLive,
                timestamp: new Date().toISOString()
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