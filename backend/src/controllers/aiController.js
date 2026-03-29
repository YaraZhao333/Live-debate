const aiService = require('../services/aiService');

// AI相关控制器
module.exports = {
    // 获取AI内容列表
    getAIContentList: (req, res) => {
        try {
            const page = parseInt(req.query.page) || 1;
            const pageSize = parseInt(req.query.pageSize) || 20;
            const startTime = req.query.startTime || null;
            const endTime = req.query.endTime || null;

            const result = aiService.getAIContentList(page, pageSize, startTime, endTime);

            res.json({
                success: true,
                data: result,
                timestamp: Date.now()
            });
        } catch (error) {
            console.error('获取AI内容列表失败:', error);
            res.status(500).json({
                success: false,
                message: '获取AI内容列表失败: ' + error.message
            });
        }
    },

    // V1 API: 获取格式化的AI内容列表
    getFormattedAIContentList: (req, res) => {
        try {
            console.log('✅ v1 AI内容列表路由被调用:', req.query);

            const page = parseInt(req.query.page) || 1;
            const pageSize = parseInt(req.query.pageSize) || 20;
            const startTime = req.query.startTime || null;
            const endTime = req.query.endTime || null;

            const result = aiService.getFormattedAIContentList(page, pageSize, startTime, endTime);

            res.json({
                success: true,
                data: result
            });
        } catch (error) {
            console.error('获取AI内容列表失败:', error);
            res.status(500).json({
                success: false,
                message: '获取AI内容列表失败: ' + error.message
            });
        }
    },

    // 获取单个AI内容
    getAIContentById: (req, res) => {
        try {
            const content = aiService.getAIContentById(req.params.id);
            res.json({
                success: true,
                data: content
            });
        } catch (error) {
            res.status(404).json({
                success: false,
                error: '内容不存在',
                message: error.message
            });
        }
    },

    // 添加AI内容
    addAIContent: (req, res) => {
        try {
            const newContent = aiService.addAIContent(req.body);
            res.json({
                success: true,
                data: newContent
            });
        } catch (error) {
            res.status(400).json({
                success: false,
                error: '添加AI内容失败',
                message: error.message
            });
        }
    },

    // 更新AI内容
    updateAIContent: (req, res) => {
        try {
            const updatedContent = aiService.updateAIContent(req.params.id, req.body);
            res.json({
                success: true,
                data: updatedContent
            });
        } catch (error) {
            res.status(400).json({
                success: false,
                error: '更新AI内容失败',
                message: error.message
            });
        }
    },

    // 获取AI内容评论列表
    getAIContentComments: (req, res) => {
        try {
            const page = parseInt(req.query.page) || 1;
            const pageSize = parseInt(req.query.pageSize) || 20;
            const result = aiService.getAIContentComments(req.params.id, page, pageSize);

            res.json({
                success: true,
                data: result,
                timestamp: Date.now()
            });
        } catch (error) {
            console.error('获取AI内容评论列表失败:', error);
            res.status(500).json({
                success: false,
                message: '获取评论列表失败: ' + error.message
            });
        }
    },

    // V1 API: 获取格式化的AI内容评论列表
    getFormattedAIContentComments: (req, res) => {
        try {
            const page = parseInt(req.query.page) || 1;
            const pageSize = parseInt(req.query.pageSize) || 20;
            const result = aiService.getFormattedAIContentComments(req.params.id, page, pageSize);

            res.json({
                success: true,
                data: result
            });
        } catch (error) {
            console.error('获取AI内容评论列表失败:', error);
            res.status(500).json({
                success: false,
                message: '获取评论列表失败: ' + error.message
            });
        }
    },

    // 删除AI内容评论
    deleteAIContentComment: (req, res) => {
        try {
            const { reason = '', notifyUsers = true } = req.body;
            const result = aiService.deleteAIContentComment(
                req.params.id,
                req.params.commentId,
                notifyUsers
            );

            console.log(`🗑️  已删除评论: ${req.params.commentId}, 原因: ${reason || '管理员删除'}`);

            res.json({
                success: true,
                data: result,
                message: '评论已删除',
                timestamp: Date.now()
            });
        } catch (error) {
            console.error('删除评论失败:', error);
            res.status(500).json({
                success: false,
                message: '删除评论失败: ' + error.message
            });
        }
    },

    // V1 API: 删除AI内容评论
    deleteFormattedAIContentComment: (req, res) => {
        try {
            const { reason = '', notifyUsers = true } = req.body;
            const result = aiService.deleteAIContentComment(
                req.params.id,
                req.params.commentId,
                notifyUsers
            );

            console.log(`🗑️  已删除评论: ${req.params.commentId}, 原因: ${reason || '管理员删除'}`);

            // 按照文档格式返回响应
            res.json({
                success: true,
                data: {
                    commentId: req.params.commentId,
                    contentId: req.params.id,
                    deleteTime: null
                },
                message: '评论已删除'
            });
        } catch (error) {
            console.error('删除评论失败:', error);
            res.status(500).json({
                success: false,
                message: '删除评论失败: ' + error.message
            });
        }
    },

    // 获取AI状态
    getAIStatus: (req, res) => {
        try {
            const status = aiService.getAIStatus();
            res.json({
                success: true,
                data: status
            });
        } catch (error) {
            res.status(500).json({ error: '获取AI内容失败' });
        }
    }
};