const mockService = require('../services/mockService');
const { broadcast } = require('../websocket/wsServer');

// 评论和点赞控制器
module.exports = {
    addComment: (req, res) => {
        try {
            const { contentId, text, user, avatar } = req.body;

            if (!contentId || !text) {
                return res.status(400).json({
                    code: -1,
                    message: '缺少必需参数: contentId 和 text',
                    data: null
                });
            }

            const comment = mockService.aiContent.addComment(contentId, {
                text,
                user: user || '匿名用户',
                avatar: avatar || '👤'
            });

            if (comment) {
                broadcast('comment-added', {
                    contentId,
                    comment
                });

                res.json({
                    code: 0,
                    message: '评论成功',
                    data: comment
                });
            } else {
                res.status(404).json({
                    code: -1,
                    message: '内容不存在',
                    data: null
                });
            }
        } catch (error) {
            console.error('添加评论失败:', error);
            res.status(500).json({
                code: -1,
                message: '添加评论失败',
                data: null
            });
        }
    },

    deleteComment: (req, res) => {
        try {
            const { commentId } = req.params;
            const { contentId } = req.body;

            if (!contentId || !commentId) {
                return res.status(400).json({
                    code: -1,
                    message: '缺少必需参数: contentId 和 commentId',
                    data: null
                });
            }

            const success = mockService.aiContent.deleteComment(contentId, commentId);

            if (success) {
                broadcast('comment-deleted', {
                    contentId,
                    commentId
                });

                res.json({
                    code: 0,
                    message: '删除成功',
                    data: null
                });
            } else {
                res.status(404).json({
                    code: -1,
                    message: '评论不存在',
                    data: null
                });
            }
        } catch (error) {
            console.error('删除评论失败:', error);
            res.status(500).json({
                code: -1,
                message: '删除评论失败',
                data: null
            });
        }
    },

    like: (req, res) => {
        try {
            const { contentId, commentId } = req.body;

            if (!contentId) {
                return res.status(400).json({
                    code: -1,
                    message: '缺少必需参数: contentId',
                    data: null
                });
            }

            let result;
            if (commentId) {
                result = mockService.aiContent.likeComment(contentId, commentId);
                broadcast('comment-liked', {
                    contentId,
                    commentId,
                    likes: result?.likes
                });
            } else {
                result = mockService.aiContent.like(contentId);
                broadcast('content-liked', {
                    contentId,
                    likes: result?.likes
                });
            }

            if (result) {
                res.json({
                    code: 0,
                    message: '点赞成功',
                    data: result
                });
            } else {
                res.status(404).json({
                    code: -1,
                    message: '内容不存在',
                    data: null
                });
            }
        } catch (error) {
            console.error('点赞失败:', error);
            res.status(500).json({
                code: -1,
                message: '点赞失败',
                data: null
            });
        }
    }
};
