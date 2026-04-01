const mockService = require('../services/mockService');
const { broadcast } = require('../websocket/wsServer');

module.exports = {
    getJudges: (req, res) => {
        try {
            const { stream_id } = req.query;
            if (!stream_id) {
                return res.status(400).json({
                    code: -1,
                    message: 'stream_id 是必填参数',
                    data: null
                });
            }

            const judges = mockService.judges.getByStreamId(stream_id);
            
            res.json({
                code: 0,
                message: 'success',
                data: judges
            });
        } catch (error) {
            console.error('获取评委列表失败:', error);
            res.status(500).json({
                code: -1,
                message: '获取评委列表失败',
                data: null
            });
        }
    },

    saveJudges: (req, res) => {
        try {
            const { stream_id, judges } = req.body;
            if (!stream_id) {
                return res.status(400).json({
                    code: -1,
                    message: 'stream_id 是必填参数',
                    data: null
                });
            }

            const updatedJudges = mockService.judges.updateByStreamId(stream_id, judges);
            
            broadcast('judges-updated', {
                streamId: stream_id,
                judges: updatedJudges,
                timestamp: new Date().toISOString()
            });
            
            res.json({
                code: 0,
                message: '评委信息已保存',
                data: updatedJudges
            });
        } catch (error) {
            console.error('保存评委信息失败:', error);
            res.status(500).json({
                code: -1,
                message: '保存评委信息失败',
                data: null
            });
        }
    }
};
