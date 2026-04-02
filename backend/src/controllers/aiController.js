const aiService = require('../services/aiService');

// AI相关控制器
module.exports = {
    // 启动AI识别
    startAI: (req, res) => {
        try {
            const { streamId, settings, notifyUsers = true } = req.body;
            console.log('🚀 收到启动AI识别请求:', { streamId, settings });
            
            const result = aiService.startAI(streamId, settings);
            
            res.json({
                code: 0,
                message: 'AI识别已启动',
                data: result
            });
        } catch (error) {
            console.error('启动AI识别失败:', error);
            res.status(500).json({
                code: -1,
                message: '启动AI识别失败',
                data: null
            });
        }
    },

    // 停止AI识别
    stopAI: (req, res) => {
        try {
            const { streamId, saveHistory = true, notifyUsers = true } = req.body;
            console.log('🛑 收到停止AI识别请求:', { streamId });
            
            const result = aiService.stopAI(streamId);
            
            res.json({
                code: 0,
                message: 'AI识别已停止',
                data: result
            });
        } catch (error) {
            console.error('停止AI识别失败:', error);
            res.status(500).json({
                code: -1,
                message: '停止AI识别失败',
                data: null
            });
        }
    },

    // 切换AI状态（暂停/恢复）
    toggleAI: (req, res) => {
        try {
            const { action, notifyUsers = true } = req.body;
            console.log('🔄 收到切换AI状态请求:', { action });
            
            const streamId = req.body.streamId;
            const result = aiService.toggleAI(action, streamId);
            
            res.json({
                code: 0,
                message: 'AI状态已更新',
                data: result
            });
        } catch (error) {
            console.error('切换AI状态失败:', error);
            res.status(500).json({
                code: -1,
                message: '切换AI状态失败',
                data: null
            });
        }
    },
    // 获取AI内容列表
    getAIContentList: (req, res) => {
        try {
            const page = parseInt(req.query.page) || 1;
            const pageSize = parseInt(req.query.pageSize) || 20;
            const startTime = req.query.startTime || null;
            const endTime = req.query.endTime || null;

            const result = aiService.getAIContentList(page, pageSize, startTime, endTime);

            res.json({
                code: 0,
                message: 'success',
                data: result
            });
        } catch (error) {
            console.error('获取AI内容列表失败:', error);
            res.status(500).json({
                code: -1,
                message: '获取AI内容列表失败: ' + error.message,
                data: null
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
                code: 0,
                message: 'success',
                data: result
            });
        } catch (error) {
            console.error('获取AI内容列表失败:', error);
            res.status(500).json({
                code: -1,
                message: '获取AI内容列表失败: ' + error.message,
                data: null
            });
        }
    },

    // 获取单个AI内容
    getAIContentById: (req, res) => {
        try {
            const content = aiService.getAIContentById(req.params.id);
            res.json({
                code: 0,
                message: 'success',
                data: content
            });
        } catch (error) {
            res.status(404).json({
                code: -1,
                message: '内容不存在',
                data: null
            });
        }
    },

    // 添加AI内容
    addAIContent: (req, res) => {
        try {
            const newContent = aiService.addAIContent(req.body);
            res.json({
                code: 0,
                message: '添加成功',
                data: newContent
            });
        } catch (error) {
            res.status(400).json({
                code: -1,
                message: '添加AI内容失败',
                data: null
            });
        }
    },

    // 更新AI内容
    updateAIContent: (req, res) => {
        try {
            const updatedContent = aiService.updateAIContent(req.params.id, req.body);
            res.json({
                code: 0,
                message: '更新成功',
                data: updatedContent
            });
        } catch (error) {
            res.status(400).json({
                code: -1,
                message: '更新AI内容失败',
                data: null
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
                code: 0,
                message: 'success',
                data: result
            });
        } catch (error) {
            console.error('获取AI内容评论列表失败:', error);
            res.status(500).json({
                code: -1,
                message: '获取评论列表失败: ' + error.message,
                data: null
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
                code: 0,
                message: 'success',
                data: result
            });
        } catch (error) {
            console.error('获取AI内容评论列表失败:', error);
            res.status(500).json({
                code: -1,
                message: '获取评论列表失败: ' + error.message,
                data: null
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
                code: 0,
                message: '评论已删除',
                data: result
            });
        } catch (error) {
            console.error('删除评论失败:', error);
            res.status(500).json({
                code: -1,
                message: '删除评论失败: ' + error.message,
                data: null
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

            res.json({
                code: 0,
                message: '评论已删除',
                data: {
                    commentId: req.params.commentId,
                    contentId: req.params.id,
                    deleteTime: null
                }
            });
        } catch (error) {
            console.error('删除评论失败:', error);
            res.status(500).json({
                code: -1,
                message: '删除评论失败: ' + error.message,
                data: null
            });
        }
    },

    // 获取AI状态
    getAIStatus: (req, res) => {
        try {
            const streamId = req.query.stream_id || req.query.streamId;
            console.log('📡 获取AI状态请求:', { streamId });
            
            const status = aiService.getAIStatus(streamId);
            res.json({
                code: 0,
                message: 'success',
                data: status
            });
        } catch (error) {
            console.error('获取AI状态失败:', error);
            res.status(500).json({
                code: -1,
                message: '获取AI状态失败',
                data: null
            });
        }
    }
};