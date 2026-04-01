// 直播状态管理
// 临时设置为 LIVE 以便测试前端功能
let globalLiveStatus = {
    isLive: true,
    streamUrl: 'https://test-streams.mux.dev/x36xhzz/x36xhzz.m3u8',
    scheduledStartTime: null,
    scheduledEndTime: null,
    streamId: 'mock-stream-1',
    isScheduled: false,
    liveId: 'live-test-001',
    startTime: new Date().toISOString()
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
