// 直播状态管理
let globalLiveStatus = {
    isLive: false,
    streamUrl: null,
    scheduledStartTime: null,
    scheduledEndTime: null,
    streamId: null,
    isScheduled: false,
    liveId: null,
    startTime: null
};

// 每个流的独立直播状态
let streamLiveStatuses = {};

// 导出状态操作方法
module.exports = {
    getGlobalLiveStatus: () => ({ ...globalLiveStatus }),
    updateGlobalLiveStatus: (updates) => {
        globalLiveStatus = { ...globalLiveStatus, ...updates };
        return { ...globalLiveStatus };
    },
    getStreamLiveStatuses: () => ({ ...streamLiveStatuses }),
    getStreamLiveStatus: (streamId) => {
        if (!streamId) return null;
        return streamLiveStatuses[streamId] ? { ...streamLiveStatuses[streamId] } : null;
    },
    updateStreamLiveStatus: (streamId, status) => {
        streamLiveStatuses[streamId] = { ...status };
        return { ...streamLiveStatuses };
    },
    resetLiveStatus: () => {
        globalLiveStatus = {
            isLive: false,
            streamUrl: null,
            scheduledStartTime: null,
            scheduledEndTime: null,
            streamId: null,
            isScheduled: false,
            liveId: null,
            startTime: null
        };
        streamLiveStatuses = {};
        return { ...globalLiveStatus };
    }
};