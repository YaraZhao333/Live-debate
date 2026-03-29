const { updateGlobalLiveStatus, getGlobalLiveStatus } = require('../state/liveState');
const { broadcast } = require('../websocket/wsServer');
const mockService = require('../services/mockService');

let liveScheduleTimer = null;

// 检查直播计划
function checkLiveSchedule() {
    const schedule = mockService.liveSchedule.get();
    const now = Date.now();
    const liveStatus = getGlobalLiveStatus();

    if (schedule.isScheduled && schedule.scheduledStartTime) {
        const startTime = new Date(schedule.scheduledStartTime).getTime();

        if (now >= startTime && !liveStatus.isLive) {
            console.log('⏰ 定时开始直播');
            startScheduledLive(schedule);
        }

        if (schedule.scheduledEndTime && liveStatus.isLive) {
            const endTime = new Date(schedule.scheduledEndTime).getTime();
            if (now >= endTime) {
                console.log('⏰ 定时结束直播');
                stopLive();
            }
        }
    }
}

// 启动计划的直播
function startScheduledLive(schedule) {
    try {
        let streamUrl = null;

        if (schedule.streamId) {
            const stream = mockService.streams.getById(schedule.streamId);
            if (stream && stream.enabled) {
                streamUrl = stream.url;
            }
        }

        if (!streamUrl) {
            const activeStream = mockService.streams.getActive();
            if (activeStream) {
                streamUrl = activeStream.url;
            }
        }

        if (!streamUrl) {
            console.error('❌ 没有可用的直播流');
            return;
        }

        updateGlobalLiveStatus({
            isLive: true,
            streamUrl: streamUrl,
            streamId: schedule.streamId
        });

        broadcast('live-status-changed', {
            status: 'started',
            streamUrl: streamUrl,
            timestamp: Date.now(),
            scheduled: true
        });

        console.log('✅ 直播已开始:', streamUrl);
    } catch (error) {
        console.error('启动计划直播失败:', error);
    }
}

// 停止直播
function stopLive() {
    updateGlobalLiveStatus({
        isLive: false,
        streamUrl: null,
        streamId: null,
        isScheduled: false,
        scheduledStartTime: null,
        scheduledEndTime: null
    });

    mockService.liveSchedule.clear();

    broadcast('live-status-changed', {
        status: 'stopped',
        timestamp: Date.now()
    });

    console.log('🛑 直播已停止');
}

// 启动定时检查
function startScheduleCheck() {
    if (liveScheduleTimer) {
        clearInterval(liveScheduleTimer);
    }
    liveScheduleTimer = setInterval(checkLiveSchedule, 60000); // 每分钟检查一次
    console.log('⏱️  直播计划检查器已启动');
}

// 停止定时检查
function stopScheduleCheck() {
    if (liveScheduleTimer) {
        clearInterval(liveScheduleTimer);
        liveScheduleTimer = null;
    }
    console.log('⏹️  直播计划检查器已停止');
}

module.exports = {
    startScheduleCheck,
    stopScheduleCheck,
    checkLiveSchedule,
    startScheduledLive,
    stopLive
};