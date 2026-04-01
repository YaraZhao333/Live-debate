const mockService = require('../services/mockService');

module.exports = {
    getVotesStatistics: (req, res) => {
        try {
            const { timeRange, stream_id } = req.query;
            
            const hours = {
                '1h': 1,
                '6h': 6,
                '12h': 12,
                '24h': 24,
                '7d': 168
            };
            
            const selectedHours = hours[timeRange] || 1;
            
            const voteData = mockService.statistics.getVoteTrends(selectedHours, stream_id);
            const activityData = mockService.statistics.getUserActivity(selectedHours, stream_id);
            
            res.json({
                code: 0,
                message: 'success',
                data: {
                    voteTrends: voteData,
                    userActivity: activityData,
                    timeRange: timeRange
                }
            });
        } catch (error) {
            console.error('获取统计数据失败:', error);
            res.status(500).json({
                code: -1,
                message: '获取统计数据失败',
                data: null
            });
        }
    }
};
