const {
    getAIDebateContent,
    getAIDebateContentById,
    addAIDebateContent,
    updateAIDebateContent,
    deleteAIDebateComment,
    filterAIDebateContent,
    getGlobalAIStatus,
    updateAIStatus,
    getDebateTopic,
    updateDebateTopic,
    getAIStatusForStream,
    startAI,
    stopAI,
    toggleAI
} = require('../state/aiState');
const { broadcast } = require('../websocket/wsServer');

// AI相关服务
module.exports = {
    // 获取AI内容列表
    getAIContentList: (page = 1, pageSize = 20, startTime = null, endTime = null) => {
        // 验证pageSize最大值
        if (pageSize > 100) {
            throw new Error('pageSize最大值为100');
        }

        // 过滤内容
        const filteredContent = filterAIDebateContent(startTime, endTime);

        // 计算总数
        const total = filteredContent.length;

        // 分页
        const start = (page - 1) * pageSize;
        const end = start + pageSize;
        const paginatedContent = filteredContent.slice(start, end);

        return {
            total,
            page,
            pageSize,
            items: paginatedContent
        };
    },

    // 获取格式化的AI内容列表（V1 API）
    getFormattedAIContentList: (page = 1, pageSize = 20, startTime = null, endTime = null) => {
        const result = this.getAIContentList(page, pageSize, startTime, endTime);

        // 转换为文档格式
        const items = result.items.map(item => {
            // 计算评论数
            const commentCount = (item.comments && Array.isArray(item.comments)) ? item.comments.length : 0;

            // 转换timestamp为ISO格式
            let timestampISO = '';
            if (item.timestamp) {
                if (typeof item.timestamp === 'number') {
                    timestampISO = new Date(item.timestamp).toISOString();
                } else {
                    timestampISO = new Date(item.timestamp).toISOString();
                }
            } else if (item.createdAt) {
                timestampISO = new Date(item.createdAt).toISOString();
            } else {
                timestampISO = new Date().toISOString();
            }

            return {
                id: item.id,
                content: item.content || item.text || '',
                type: 'summary',
                timestamp: timestampISO,
                position: item.position || item.side || 'left',
                confidence: item.confidence || 0.95,
                statistics: {
                    views: item.statistics?.views || item.views || 0,
                    likes: item.statistics?.likes || item.likes || 0,
                    comments: commentCount
                }
            };
        });

        return {
            total: result.total,
            page: result.page,
            items: items
        };
    },

    // 获取单个AI内容
    getAIContentById: (id) => {
        const content = getAIDebateContentById(id);
        if (!content) {
            throw new Error('内容不存在');
        }
        return content;
    },

    // 添加AI内容
    addAIContent: (contentData) => {
        const { text, side, debate_id } = contentData;

        if (!text || !side) {
            throw new Error('缺少必要参数: text, side');
        }

        if (side !== 'left' && side !== 'right') {
            throw new Error('side必须是 "left" 或 "right"');
        }

        const newContent = addAIDebateContent({ text, side, debate_id });

        // 广播新内容添加
        broadcast('newAIContent', {
            ...newContent,
            updatedBy: 'admin'
        });

        return newContent;
    },

    // 更新AI内容
    updateAIContent: (id, contentData) => {
        const { text, side, debate_id } = contentData;

        // 验证side参数
        if (side !== undefined && side !== 'left' && side !== 'right') {
            throw new Error('side必须是 "left" 或 "right"');
        }

        const updatedContent = updateAIDebateContent(id, { text, side, debate_id });

        if (!updatedContent) {
            throw new Error('内容不存在');
        }

        return updatedContent;
    },

    // 获取AI内容评论列表
    getAIContentComments: (contentId, page = 1, pageSize = 20) => {
        // 验证pageSize最大值
        if (pageSize > 100) {
            throw new Error('pageSize最大值为100');
        }

        const content = getAIDebateContentById(contentId);
        if (!content) {
            throw new Error('AI内容不存在');
        }

        // 获取评论列表
        let comments = [];
        if (content.comments && Array.isArray(content.comments)) {
            comments = content.comments;
        }

        // 按时间倒序排序
        comments.sort((a, b) => {
            const timeA = a.timestamp || a.time || 0;
            const timeB = b.timestamp || b.time || 0;
            const tsA = typeof timeA === 'number' ? timeA : new Date(timeA).getTime();
            const tsB = typeof timeB === 'number' ? timeB : new Date(timeB).getTime();
            return tsB - tsA;
        });

        // 分页
        const total = comments.length;
        const start = (page - 1) * pageSize;
        const end = start + pageSize;
        const paginatedComments = comments.slice(start, end);

        return {
            contentId,
            contentText: content.content || content.text || '',
            total,
            page,
            pageSize,
            comments: paginatedComments
        };
    },

    // 获取格式化的AI内容评论列表（V1 API）
    getFormattedAIContentComments: (contentId, page = 1, pageSize = 20) => {
        const result = this.getAIContentComments(contentId, page, pageSize);

        // 转换为文档格式
        const formattedComments = result.comments.map(comment => {
            // 转换timestamp为ISO格式
            let timestampISO = '';
            if (comment.timestamp) {
                if (typeof comment.timestamp === 'number') {
                    timestampISO = new Date(comment.timestamp).toISOString();
                } else {
                    timestampISO = new Date(comment.timestamp).toISOString();
                }
            } else if (comment.time) {
                timestampISO = new Date().toISOString();
            } else {
                timestampISO = new Date().toISOString();
            }

            // 判断是否为匿名用户
            const userId = comment.userId ||
                (comment.user === '匿名用户' || !comment.user ? 'anonymous' : null) ||
                'anonymous';

            return {
                commentId: comment.commentId || comment.id || '',
                userId: userId,
                nickname: comment.nickname || comment.user || '匿名用户',
                avatar: comment.avatar || '👤',
                content: comment.content || comment.text || '',
                likes: comment.likes || 0,
                timestamp: timestampISO
            };
        });

        return {
            contentId: result.contentId,
            contentText: result.contentText,
            total: result.total,
            page: result.page,
            pageSize: result.pageSize,
            comments: formattedComments
        };
    },

    // 删除AI内容评论
    deleteAIContentComment: (contentId, commentId, notifyUsers = true) => {
        const success = deleteAIDebateComment(contentId, commentId);

        if (!success) {
            throw new Error(`评论ID ${commentId} 不存在或不属于内容ID ${contentId}`);
        }

        // 如果通知用户，广播删除通知
        if (notifyUsers) {
            broadcast('comment-deleted', {
                contentId: contentId,
                commentId: commentId,
                timestamp: Date.now()
            });
        }

        return { contentId, commentId, deleted: true };
    },

    // 获取AI状态
    getAIStatus: () => {
        return getGlobalAIStatus();
    },

    // 更新AI状态
    updateAIStatus: (updates) => {
        return updateAIStatus(updates);
    },

    // 获取辩题
    getDebateTopic: () => {
        return getDebateTopic();
    },

    // 更新辩题
    updateDebateTopic: (updates) => {
        const updatedTopic = updateDebateTopic(updates);

        // 广播辩题更新
        broadcast('debate-updated', {
            debate: updatedTopic,
            timestamp: Date.now()
        });

        return updatedTopic;
    },

    // 获取指定流的AI状态
    getAIStatusForStream: (streamId) => {
        return getAIStatusForStream(streamId);
    },

    // 启动AI识别
    startAI: (streamId, settings = {}) => {
        const result = startAI(streamId, settings);
        broadcast('ai-status-changed', {
            streamId: streamId,
            status: 'running',
            aiSessionId: result.aiSessionId,
            timestamp: new Date().toISOString()
        });
        return result;
    },

    // 停止AI识别
    stopAI: (streamId) => {
        const result = stopAI(streamId);
        broadcast('ai-status-changed', {
            streamId: streamId,
            status: 'stopped',
            timestamp: new Date().toISOString()
        });
        return result;
    },

    // 切换AI状态（暂停/恢复）
    toggleAI: (action, streamId) => {
        const result = toggleAI(action, streamId);
        broadcast('ai-status-changed', {
            streamId: streamId,
            status: result.status,
            timestamp: new Date().toISOString()
        });
        return result;
    }
};