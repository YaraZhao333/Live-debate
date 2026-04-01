// 直播状态管理
const fs = require('fs');
const path = require('path');

// 状态文件路径
const STATE_FILE = path.join(__dirname, '../../data/live-state.json');

// 确保数据目录存在
const dataDir = path.dirname(STATE_FILE);
if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true });
}

// 从文件加载状态
function loadStateFromFile() {
    try {
        if (fs.existsSync(STATE_FILE)) {
            const data = fs.readFileSync(STATE_FILE, 'utf8');
            const parsed = JSON.parse(data);
            console.log('📁 从文件加载直播状态:', parsed);
            return parsed;
        }
    } catch (error) {
        console.error('❌ 从文件加载状态失败:', error);
    }
    return null;
}

// 保存状态到文件
function saveStateToFile(state) {
    try {
        fs.writeFileSync(STATE_FILE, JSON.stringify(state, null, 2));
        console.log('💾 直播状态已保存到文件');
    } catch (error) {
        console.error('❌ 保存状态到文件失败:', error);
    }
}

// 初始状态
const defaultState = {
    isLive: false,
    streamUrl: null,
    scheduledStartTime: null,
    scheduledEndTime: null,
    streamId: null,
    isScheduled: false,
    liveId: null,
    startTime: null
};

// 从文件加载状态，如果没有则使用默认状态
const loadedState = loadStateFromFile();
let globalLiveStatus = loadedState?.globalLiveStatus || { ...defaultState };
let streamLiveStatuses = loadedState?.streamLiveStatuses || {};

console.log('🎬 直播状态管理器初始化完成:', {
    isLive: globalLiveStatus.isLive,
    streamId: globalLiveStatus.streamId
});

// 导出状态操作方法
module.exports = {
    getGlobalLiveStatus: () => ({ ...globalLiveStatus }),
    updateGlobalLiveStatus: (updates) => {
        globalLiveStatus = { ...globalLiveStatus, ...updates };
        // 保存到文件
        saveStateToFile({ globalLiveStatus, streamLiveStatuses });
        return { ...globalLiveStatus };
    },
    getStreamLiveStatuses: () => ({ ...streamLiveStatuses }),
    updateStreamLiveStatus: (streamId, status) => {
        streamLiveStatuses[streamId] = { ...status };
        // 保存到文件
        saveStateToFile({ globalLiveStatus, streamLiveStatuses });
        return { ...streamLiveStatuses };
    },
    resetLiveStatus: () => {
        globalLiveStatus = { ...defaultState };
        streamLiveStatuses = {};
        // 保存到文件
        saveStateToFile({ globalLiveStatus, streamLiveStatuses });
        return { ...globalLiveStatus };
    }
};
