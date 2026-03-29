const liveService = require('../services/liveService');

// 直播相关控制器
module.exports = {
    // 获取直播状态
    getLiveStatus: (req, res) => {
        try {
            const status = liveService.getLiveStatus();
            res.json(status);
        } catch (error) {
            console.error('获取直播状态失败:', error);
            res.status(500).json({
                success: false,
                error: '获取失败',
                message: error.message
            });
        }
    },

    // 管理员控制直播
    adminControlLive: (req, res) => {
        try {
            const { action, streamUrl } = req.body;
            const result = liveService.controlLive(action, streamUrl);

            res.json({
                success: true,
                status: result.isLive ? 'started' : 'stopped',
                streamUrl: result.streamUrl
            });
        } catch (error) {
            console.error('控制直播状态失败:', error);
            res.status(400).json({
                success: false,
                error: '操作失败',
                message: error.message
            });
        }
    },

    // 用户控制直播
    userControlLive: (req, res) => {
        try {
            const { action, streamId } = req.body;
            const result = liveService.controlLive(action, null, streamId);

            res.json({
                success: true,
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
                success: false,
                message: '操作失败: ' + error.message
            });
        }
    },

    // 设置直播计划
    setLiveSchedule: (req, res) => {
        try {
            const schedule = liveService.setLiveSchedule(req.body);
            res.json({
                success: true,
                message: '直播计划已设置',
                data: schedule
            });
        } catch (error) {
            console.error('设置直播计划失败:', error);
            res.status(400).json({
                success: false,
                error: '设置失败',
                message: error.message
            });
        }
    },

    // 获取直播计划
    getLiveSchedule: (req, res) => {
        try {
            const schedule = liveService.getLiveSchedule();
            res.json({
                success: true,
                data: schedule
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                error: '获取失败'
            });
        }
    },

    // 取消直播计划
    cancelLiveSchedule: (req, res) => {
        try {
            liveService.cancelLiveSchedule();
            res.json({
                success: true,
                message: '直播计划已取消'
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                error: '取消失败'
            });
        }
    },

    // 设置并开始直播
    setupAndStartLive: (req, res) => {
        try {
            const result = liveService.setupAndStartLive(req.body);
            const isSchedule = !req.body.startNow;

            res.json({
                success: true,
                message: isSchedule ? '直播计划已设置' : '直播已开始',
                data: result
            });
        } catch (error) {
            console.error('设置并开始直播失败:', error);
            res.status(400).json({
                success: false,
                error: '操作失败',
                message: error.message
            });
        }
    }
};