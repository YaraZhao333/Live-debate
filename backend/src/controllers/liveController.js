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
    }
};