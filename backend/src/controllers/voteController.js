const mockService = require('../services/mockService');
const { broadcast } = require('../websocket/wsServer');

// 票数相关控制器
module.exports = {
    // 获取当前票数
    getVotes: (req, res) => {
        try {
            const votes = mockService.votes.get();
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
            const updatedVotes = mockService.votes.update(leftVotes, rightVotes);

            broadcast('vote-updated', {
                votes: updatedVotes,
                updatedBy: 'admin'
            });

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
            const resetVotes = mockService.votes.reset();

            broadcast('vote-updated', {
                votes: resetVotes,
                updatedBy: 'admin',
                action: 'reset'
            });

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
    }
};