const mockService = require('../services/mockService');

// AI内容控制器
module.exports = {
    getAiContent: (req, res) => {
        try {
            const streamId = req.query.stream_id || req.query.streamId;
            console.log('📡 获取AI内容请求:', { streamId });
            
            // 调用 mockService 获取AI内容，支持按 streamId 过滤
            const content = mockService.aiContent.getAll();
            
            res.json({
                code: 0,
                message: 'success',
                data: {
                    content: content,
                    total: content.length,
                    streamId: streamId
                }
            });
        } catch (error) {
            console.error('获取AI内容失败:', error);
            res.status(500).json({
                code: -1,
                message: '获取失败',
                data: null
            });
        }
    }
};
