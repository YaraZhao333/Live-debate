const mockService = require('../services/mockService');

module.exports = {
    getStreamDetail: (req, res) => {
        try {
            const { stream_id } = req.query;
            if (!stream_id) {
                return res.status(400).json({
                    code: -1,
                    message: 'stream_id 是必填参数',
                    data: null
                });
            }

            const streams = mockService.streams.getAll();
            const stream = streams.find(s => s.id === stream_id);
            
            if (!stream) {
                return res.status(404).json({
                    code: -1,
                    message: '直播流不存在',
                    data: null
                });
            }

            const judges = mockService.judges.getByStreamId(stream_id);
            const debateFlow = mockService.debateFlows.getByStreamId(stream_id);
            const aiContents = mockService.aiContent.getRecent(10, stream_id);
            const votes = mockService.votes.get(stream_id);
            const users = mockService.users.getAll();
            const aiState = mockService.aiContent.getAIState(stream_id);

            res.json({
                code: 0,
                message: 'success',
                data: {
                    stream: stream,
                    judges: judges,
                    debateFlow: debateFlow,
                    aiContents: aiContents,
                    votes: votes,
                    onlineUsers: users.slice(0, 20),
                    aiState: aiState
                }
            });
        } catch (error) {
            console.error('获取流详情失败:', error);
            res.status(500).json({
                code: -1,
                message: '获取流详情失败',
                data: null
            });
        }
    }
};
