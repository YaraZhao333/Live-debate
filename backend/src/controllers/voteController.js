const voteService = require('../services/voteService');
const { broadcast } = require('../websocket/wsServer');

// 票数相关控制器
module.exports = {
    // 获取当前票数
    getVotes: (req, res) => {
        try {
            const votes = voteService.getVotes();
            res.json({
                code: 0,
                message: 'ok',
                data: {
                    leftVotes: votes.leftVotes,
                    rightVotes: votes.rightVotes,
                    totalVotes: votes.totalVotes,
                    leftPercentage: votes.leftPercentage,
                    rightPercentage: votes.rightPercentage,
                    timestamp: Date.now()
                }
            });
        } catch (error) {
            console.error('获取票数失败:', error);
            res.status(500).json({
                code: -1,
                message: '获取票数失败',
                data: null
            });
        }
    },

    // 更新票数（直接设置）
    updateVotes: (req, res) => {
        try {
            const { leftVotes, rightVotes } = req.body;
            const updatedVotes = voteService.setVotes(leftVotes, rightVotes);

            res.json({
                code: 0,
                message: '更新成功',
                data: updatedVotes
            });
        } catch (error) {
            console.error('修改票数失败:', error);
            res.status(400).json({
                code: -1,
                message: '修改票数失败: ' + error.message,
                data: null
            });
        }
    },

    // 增加票数
    addVotes: (req, res) => {
        try {
            const { leftVotes, rightVotes } = req.body;
            const updatedVotes = voteService.addVotes(leftVotes, rightVotes);

            res.json({
                code: 0,
                message: '增加成功',
                data: updatedVotes
            });
        } catch (error) {
            console.error('增加票数失败:', error);
            res.status(400).json({
                code: -1,
                message: '增加票数失败: ' + error.message,
                data: null
            });
        }
    },

    // 重置票数
    resetVotes: (req, res) => {
        try {
            const { leftVotes = 0, rightVotes = 0 } = req.body;
            const resetVotes = voteService.resetVotes(leftVotes, rightVotes);

            res.json({
                code: 0,
                message: '票数已重置',
                data: resetVotes
            });
        } catch (error) {
            console.error('重置票数失败:', error);
            res.status(500).json({
                code: -1,
                message: '重置票数失败: ' + error.message,
                data: null
            });
        }
    },

    // 获取投票统计数据
    getVotesStatistics: (req, res) => {
        try {
            const { timeRange } = req.query;
            const votes = voteService.getVotes();

            res.json({
                code: 0,
                message: 'ok',
                data: {
                    timeRange: timeRange || '24h',
                    totalVotes: votes.totalVotes + 1800,
                    leftVotes: votes.leftVotes + 850,
                    rightVotes: votes.rightVotes + 950,
                    trend: [
                        { time: '10:00', left: Math.floor(Math.random() * 50) + 10, right: Math.floor(Math.random() * 50) + 10 },
                        { time: '11:00', left: Math.floor(Math.random() * 50) + 20, right: Math.floor(Math.random() * 50) + 20 },
                        { time: '12:00', left: Math.floor(Math.random() * 50) + 30, right: Math.floor(Math.random() * 50) + 30 },
                        { time: '13:00', left: Math.floor(Math.random() * 50) + 25, right: Math.floor(Math.random() * 50) + 25 },
                        { time: '14:00', left: Math.floor(Math.random() * 50) + 35, right: Math.floor(Math.random() * 50) + 35 }
                    ]
                }
            });
        } catch (error) {
            console.error('获取投票统计失败:', error);
            res.status(500).json({
                code: -1,
                message: '获取投票统计失败',
                data: null
            });
        }
    }
};