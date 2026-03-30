const mockService = require('../services/mockService');

// 辩题控制器
module.exports = {
    getDebateTopic: (req, res) => {
        try {
            const debate = mockService.debate.get();
            
            res.json({
                code: 0,
                message: 'success',
                data: debate
            });
        } catch (error) {
            console.error('获取辩题失败:', error);
            res.status(500).json({
                code: -1,
                message: '获取失败',
                data: null
            });
        }
    }
};
