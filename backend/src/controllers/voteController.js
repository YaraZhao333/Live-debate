const voteService = require('../services/voteService');

// 票数相关控制器
module.exports = {
    // 获取当前票数
    getVotes: (req, res) => {
        try {
            const votes = voteService.getVotes();
            res.json({
                code: 0,
                message: 'success',
                data: votes
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

    // 更新票数
    updateVotes: (req, res) => {
        try {
            const { leftVotes, rightVotes } = req.body;
            const updatedVotes = voteService.updateVotes(leftVotes, rightVotes);

            res.json({
                code: 0,
                message: '更新成功',
                data: updatedVotes
            });
        } catch (error) {
            console.error('修改票数失败:', error);
            res.status(400).json({
                code: -1,
                message: '修改票数失败',
                data: null
            });
        }
    },

    // 重置票数
    resetVotes: (req, res) => {
        try {
            voteService.resetVotes();
            res.json({
                code: 0,
                message: '票数已重置',
                data: null
            });
        } catch (error) {
            console.error('重置票数失败:', error);
            res.status(500).json({
                code: -1,
                message: '重置票数失败',
                data: null
            });
        }
    },

    // 获取投票统计
    getVotesStatistics: (req, res) => {
        try {
            const timeRange = req.query.timeRange || '24h';
            const votes = voteService.getVotes();
            
            const statistics = {
                timeRange: timeRange,
                leftVotes: votes.leftVotes,
                rightVotes: votes.rightVotes,
                totalVotes: votes.leftVotes + votes.rightVotes,
                leftPercentage: votes.leftVotes + votes.rightVotes > 0 
                    ? Math.round((votes.leftVotes / (votes.leftVotes + votes.rightVotes)) * 100) 
                    : 50,
                rightPercentage: votes.leftVotes + votes.rightVotes > 0 
                    ? Math.round((votes.rightVotes / (votes.leftVotes + votes.rightVotes)) * 100) 
                    : 50,
                timeline: [
                    { time: new Date(Date.now() - 3600000).toISOString(), leftVotes: Math.max(0, votes.leftVotes - 5), rightVotes: Math.max(0, votes.rightVotes - 3) },
                    { time: new Date(Date.now() - 7200000).toISOString(), leftVotes: Math.max(0, votes.leftVotes - 10), rightVotes: Math.max(0, votes.rightVotes - 6) },
                    { time: new Date(Date.now() - 10800000).toISOString(), leftVotes: Math.max(0, votes.leftVotes - 15), rightVotes: Math.max(0, votes.rightVotes - 9) },
                ]
            };
            
            res.json({
                code: 0,
                message: 'success',
                data: statistics
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