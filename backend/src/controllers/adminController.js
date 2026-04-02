const mockService = require('../services/mockService');
const voteService = require('../services/voteService');

// 管理员相关控制器
module.exports = {
    // 获取辩论设置
    getDebateSettings: (req, res) => {
        try {
            const debate = mockService.debate.get();
            res.json({
                code: 0,
                message: 'success',
                data: debate
            });
        } catch (error) {
            console.error('获取辩论设置失败:', error);
            res.status(500).json({
                code: -1,
                message: '获取失败',
                data: null
            });
        }
    },

    // 更新辩论设置
    updateDebateSettings: (req, res) => {
        try {
            const debate = mockService.debate.update(req.body);
            res.json({
                code: 0,
                message: '更新成功',
                data: debate
            });
        } catch (error) {
            console.error('更新辩论设置失败:', error);
            res.status(500).json({
                code: -1,
                message: '更新失败',
                data: null
            });
        }
    },

    // 创建辩题
    createDebate: (req, res) => {
        try {
            const debate = mockService.debate.create(req.body);
            res.json({
                code: 0,
                message: '创建成功',
                data: debate
            });
        } catch (error) {
            console.error('创建辩题失败:', error);
            res.status(500).json({
                code: -1,
                message: '创建失败',
                data: null
            });
        }
    },

    // 获取单个辩题详情
    getDebateById: (req, res) => {
        try {
            const debate = mockService.debate.getById(req.params.id);
            if (!debate) {
                return res.status(404).json({
                    code: -1,
                    message: '辩题不存在',
                    data: null
                });
            }
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
    },

    // 关联辩题到直播流
    associateDebateToStream: (req, res) => {
        try {
            const { debate_id } = req.body;
            const result = mockService.debate.associateToStream(req.params.streamId, debate_id);
            res.json({
                code: 0,
                message: '关联成功',
                data: result
            });
        } catch (error) {
            console.error('关联辩题失败:', error);
            res.status(500).json({
                code: -1,
                message: '关联失败',
                data: null
            });
        }
    },

    // 删除直播流的辩题关联
    deleteStreamDebateTopic: (req, res) => {
        try {
            const result = mockService.debate.removeFromStream(req.params.streamId);
            res.json({
                code: 0,
                message: '删除成功',
                data: result
            });
        } catch (error) {
            console.error('删除辩题失败:', error);
            res.status(500).json({
                code: -1,
                message: '删除失败',
                data: null
            });
        }
    },

    // 获取用户列表
    getUsers: (req, res) => {
        try {
            const users = mockService.users.getAll();
            res.json({
                code: 0,
                message: 'success',
                data: users
            });
        } catch (error) {
            console.error('获取用户列表失败:', error);
            res.status(500).json({
                code: -1,
                message: '获取失败',
                data: null
            });
        }
    },

    // 获取单个用户
    getUserById: (req, res) => {
        try {
            const user = mockService.users.getById(req.params.id);
            if (!user) {
                return res.status(404).json({
                    code: -1,
                    message: '用户不存在',
                    data: null
                });
            }
            res.json({
                code: 0,
                message: 'success',
                data: user
            });
        } catch (error) {
            console.error('获取用户失败:', error);
            res.status(500).json({
                code: -1,
                message: '获取失败',
                data: null
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
