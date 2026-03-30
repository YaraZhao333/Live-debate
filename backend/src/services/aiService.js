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
    updateDebateTopic
} = require('../state/aiState');
const { broadcast } = require('../websocket/wsServer');

const getAIContentListInternal = (page = 1, pageSize = 20, startTime = null, endTime = null) => {
    if (pageSize > 100) {
        throw new Error('pageSize最大值为100');
    }

    const filteredContent = filterAIDebateContent(startTime, endTime);

    const total = filteredContent.length;

    const start = (page - 1) * pageSize;
    const end = start + pageSize;
    const paginatedContent = filteredContent.slice(start, end);

    return {
        total,
        page,
        pageSize,
        items: paginatedContent
    };
};

const getAIContentCommentsInternal = (contentId, page = 1, pageSize = 20) => {
    if (pageSize > 100) {
        throw new Error('pageSize最大值为100');
    }

    const content = getAIDebateContentById(contentId);
    if (!content) {
        throw new Error('AI内容不存在');
    }

    let comments = [];
    if (content.comments && Array.isArray(content.comments)) {
        comments = content.comments;
    }

    comments.sort((a, b) => {
        const timeA = a.timestamp || a.time || 0;
        const timeB = b.timestamp || b.time || 0;
        const tsA = typeof timeA === 'number' ? timeA : new Date(timeA).getTime();
        const tsB = typeof timeB === 'number' ? timeB : new Date(timeB).getTime();
        return tsB - tsA;
    });

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
};

module.exports = {
    getAIContentList: getAIContentListInternal,

    getFormattedAIContentList: (page = 1, pageSize = 20, startTime = null, endTime = null) => {
        const result = getAIContentListInternal(page, pageSize, startTime, endTime);

        const items = result.items.map(item => {
            const commentCount = (item.comments && Array.isArray(item.comments)) ? item.comments.length : 0;

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

    getAIContentById: (id) => {
        const content = getAIDebateContentById(id);
        if (!content) {
            throw new Error('内容不存在');
        }
        return content;
    },

    addAIContent: (contentData) => {
        const { text, side, debate_id } = contentData;

        if (!text || !side) {
            throw new Error('缺少必要参数: text, side');
        }

        if (side !== 'left' && side !== 'right') {
            throw new Error('side必须是 "left" 或 "right"');
        }

        const newContent = addAIDebateContent({ text, side, debate_id });

        broadcast('newAIContent', {
            ...newContent,
            updatedBy: 'admin'
        });

        return newContent;
    },

    updateAIContent: (id, contentData) => {
        const { text, side, debate_id } = contentData;

        if (side !== undefined && side !== 'left' && side !== 'right') {
            throw new Error('side必须是 "left" 或 "right"');
        }

        const updatedContent = updateAIDebateContent(id, { text, side, debate_id });

        if (!updatedContent) {
            throw new Error('内容不存在');
        }

        return updatedContent;
    },

    getAIContentComments: getAIContentCommentsInternal,

    getFormattedAIContentComments: (contentId, page = 1, pageSize = 20) => {
        const result = getAIContentCommentsInternal(contentId, page, pageSize);

        const formattedComments = result.comments.map(comment => {
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

    deleteAIContentComment: (contentId, commentId, notifyUsers = true) => {
        const success = deleteAIDebateComment(contentId, commentId);

        if (!success) {
            throw new Error(`评论ID ${commentId} 不存在或不属于内容ID ${contentId}`);
        }

        if (notifyUsers) {
            broadcast('comment-deleted', {
                contentId: contentId,
                commentId: commentId,
                timestamp: Date.now()
            });
        }

        return { contentId, commentId, deleted: true };
    },

    getAIStatus: () => {
        return getGlobalAIStatus();
    },

    updateAIStatus: (updates) => {
        return updateAIStatus(updates);
    },

    getDebateTopic: () => {
        return getDebateTopic();
    },

    updateDebateTopic: (updates) => {
        const updatedTopic = updateDebateTopic(updates);

        broadcast('debate-updated', {
            debate: updatedTopic,
            timestamp: Date.now()
        });

        return updatedTopic;
    }
};