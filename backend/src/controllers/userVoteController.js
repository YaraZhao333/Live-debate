const mockService = require('../services/mockService');
const { broadcast } = require('../websocket/wsServer');

// 用户投票控制器
module.exports = {
    userVote: (req, res) => {
        try {
            let requestData = req.body;
            
            if (requestData.request) {
                requestData = requestData.request;
            }

            const { leftVotes, rightVotes, streamId, userId } = requestData;

            if (leftVotes === undefined || rightVotes === undefined) {
                return res.status(400).json({
                    code: -1,
                    message: '缺少必需参数: leftVotes 和 rightVotes',
                    data: null
                });
            }

            const total = leftVotes + rightVotes;
            if (total !== 100) {
                return res.status(400).json({
                    code: -1,
                    message: '投票总和必须为100',
                    data: null
                });
            }

            mockService.votes.update(leftVotes, rightVotes);

            if (userId) {
                mockService.userVotes.add({
                    userId,
                    leftVotes,
                    rightVotes,
                    streamId: streamId || 'mock-stream-1'
                });
            }

            const updatedVotes = mockService.votes.get();

            broadcast('vote-updated', {
                votes: updatedVotes,
                updatedBy: userId || 'guest'
            });

            res.json({
                code: 0,
                message: '投票成功',
                data: updatedVotes
            });
        } catch (error) {
            console.error('用户投票失败:', error);
            res.status(500).json({
                code: -1,
                message: '投票失败',
                data: null
            });
        }
    },

    getUserVotes: (req, res) => {
        try {
            const { user_id, stream_id } = req.query;
            let userVotes = mockService.userVotes.getAll();

            if (user_id) {
                userVotes = userVotes.filter(uv => uv.userId === user_id);
            }

            res.json({
                code: 0,
                message: 'success',
                data: userVotes
            });
        } catch (error) {
            console.error('获取用户投票失败:', error);
            res.status(500).json({
                code: -1,
                message: '获取失败',
                data: null
            });
        }
    }
};
