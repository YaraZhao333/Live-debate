const { v4: uuidv4 } = require('uuid');

// AI状态管理
let globalAIStatus = {
    status: 'stopped',  // stopped / running / paused
    aiSessionId: null,
    startTime: null,
    settings: {
        mode: 'realtime',
        interval: 5000,
        sensitivity: 'high',
        minConfidence: 0.7
    },
    statistics: {
        totalContents: 0,
        totalWords: 0,
        averageConfidence: 0
    }
};

// AI辩论内容存储
let aiDebateContent = [];

// 辩题状态
let debateTopic = {
    id: uuidv4(),
    title: '',
    description: ''
};

// 导出状态操作方法
module.exports = {
    getGlobalAIStatus: () => ({ ...globalAIStatus }),
    updateAIStatus: (updates) => {
        globalAIStatus = { ...globalAIStatus, ...updates };
        return { ...globalAIStatus };
    },
    getAIDebateContent: () => [...aiDebateContent],
    getAIDebateContentById: (id) => aiDebateContent.find(item => item.id === id),
    addAIDebateContent: (content) => {
        const newContent = {
            id: uuidv4(),
            debate_id: content.debate_id || debateTopic.id,
            text: content.text.trim(),
            side: content.side,
            timestamp: new Date().getTime(),
            comments: [],
            likes: 0,
            statistics: {
                views: 0,
                likes: 0,
                comments: 0
            }
        };
        aiDebateContent.push(newContent);
        return { ...newContent };
    },
    updateAIDebateContent: (id, updates) => {
        const index = aiDebateContent.findIndex(item => item.id === id);
        if (index === -1) return null;

        if (updates.text !== undefined) {
            aiDebateContent[index].text = updates.text.trim();
        }
        if (updates.side !== undefined) {
            aiDebateContent[index].side = updates.side;
        }
        if (updates.debate_id !== undefined) {
            aiDebateContent[index].debate_id = updates.debate_id;
        }

        return { ...aiDebateContent[index] };
    },
    deleteAIDebateComment: (contentId, commentId) => {
        const content = aiDebateContent.find(item => item.id === contentId);
        if (!content || !content.comments) return false;

        const commentIndex = content.comments.findIndex(c =>
            (c.commentId || c.id) === commentId || String(c.commentId || c.id) === String(commentId)
        );

        if (commentIndex === -1) return false;

        content.comments.splice(commentIndex, 1);

        // 更新统计数据
        if (content.statistics) {
            content.statistics.comments = content.comments.length;
        }

        return true;
    },
    getDebateTopic: () => ({ ...debateTopic }),
    updateDebateTopic: (updates) => {
        debateTopic = { ...debateTopic, ...updates };
        return { ...debateTopic };
    },
    filterAIDebateContent: (startTime, endTime) => {
        let filtered = [...aiDebateContent];

        if (startTime) {
            filtered = filtered.filter(item => {
                const itemTime = item.timestamp || item.createdAt || 0;
                return new Date(itemTime) >= new Date(startTime);
            });
        }

        if (endTime) {
            filtered = filtered.filter(item => {
                const itemTime = item.timestamp || item.createdAt || 0;
                return new Date(itemTime) <= new Date(endTime);
            });
        }

        return filtered;
    }
};