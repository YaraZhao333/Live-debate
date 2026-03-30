const mockService = require('../services/mockService');
const voteService = require('../services/voteService');

// 管理员相关控制器
module.exports = {
    // 获取辩论设置
    getDebateSettings: (req, res) => {
        try {
            const debate = mockService.debate.get();
            res.json({
                success: true,
                data: debate
            });
        } catch (error) {
            console.error('获取辩论设置失败:', error);
            res.status(500).json({
                success: false,
                error: '获取失败',
                message: error.message
            });
        }
    },

    // 更新辩论设置
    updateDebateSettings: (req, res) => {
        try {
            const debate = mockService.debate.update(req.body);
            res.json({
                success: true,
                data: debate
            });
        } catch (error) {
            console.error('更新辩论设置失败:', error);
            res.status(500).json({
                success: false,
                error: '更新失败',
                message: error.message
            });
        }
    },

    // 获取用户列表
    getUsers: (req, res) => {
        try {
            const users = mockService.users.getAll();
            res.json({
                success: true,
                data: users
            });
        } catch (error) {
            console.error('获取用户列表失败:', error);
            res.status(500).json({
                success: false,
                error: '获取失败',
                message: error.message
            });
        }
    },

    // 获取单个用户
    getUserById: (req, res) => {
        try {
            const user = mockService.users.getById(req.params.id);
            if (!user) {
                return res.status(404).json({
                    success: false,
                    error: '用户不存在'
                });
            }
            res.json({
                success: true,
                data: user
            });
        } catch (error) {
            console.error('获取用户失败:', error);
            res.status(500).json({
                success: false,
                error: '获取失败',
                message: error.message
            });
        }
    },

    // 获取仪表板数据
    getDashboard: (req, res) => {
        try {
            const streamId = req.query.stream_id;
            const dashboard = mockService.statistics.getDashboard();
            const votes = voteService.getVotes();
            const debate = mockService.debate.get();
            
            res.json({
                code: 0,
                message: 'success',
                data: {
                    ...dashboard,
                    votes: votes,
                    debate: debate,
                    streamId: streamId
                }
            });
        } catch (error) {
            console.error('获取仪表板数据失败:', error);
            res.status(500).json({
                code: -1,
                message: '获取失败',
                data: null
            });
        }
    }
};
