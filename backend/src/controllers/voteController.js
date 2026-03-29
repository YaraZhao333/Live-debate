const voteService = require('../services/voteService');

// 票数相关控制器
module.exports = {
    // 获取当前票数
    getVotes: (req, res) => {
        try {
            const votes = voteService.getVotes();
            res.json({
                success: true,
                data: votes
            });
        } catch (error) {
            console.error('获取票数失败:', error);
            res.status(500).json({
                success: false,
                error: '获取票数失败',
                message: error.message
            });
        }
    },

    // 更新票数
    updateVotes: (req, res) => {
        try {
            const { leftVotes, rightVotes } = req.body;
            const updatedVotes = voteService.updateVotes(leftVotes, rightVotes);

            res.json({
                success: true,
                data: updatedVotes
            });
        } catch (error) {
            console.error('修改票数失败:', error);
            res.status(400).json({
                success: false,
                error: '修改票数失败',
                message: error.message
            });
        }
    },

    // 重置票数
    resetVotes: (req, res) => {
        try {
            voteService.resetVotes();
            res.json({
                success: true,
                message: '票数已重置'
            });
        } catch (error) {
            console.error('重置票数失败:', error);
            res.status(500).json({
                success: false,
                error: '重置票数失败',
                message: error.message
            });
        }
    }
};