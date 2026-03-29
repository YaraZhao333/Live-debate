const { getGlobalLiveStatus, updateGlobalLiveStatus, resetLiveStatus } = require('../state/liveState');
const { broadcast } = require('../websocket/wsServer');
const { startScheduleCheck, stopLive } = require('../scheduler/liveScheduler');
const mockService = require('./mockService');

// 直播相关服务
module.exports = {
    // 获取直播状态
    getLiveStatus: () => {
        const schedule = mockService.liveSchedule.get();

        let activeStream = null;
        try {
            activeStream = mockService.streams.getActive();
        } catch (error) {
            console.warn('获取启用直播流失败:', error);
        }

        return {
            ...getGlobalLiveStatus(),
            schedule: schedule,
            activeStreamUrl: activeStream ? activeStream.url : null,
            activeStreamId: activeStream ? activeStream.id : null,
            activeStreamName: activeStream ? activeStream.name : null
        };
    },

    // 控制直播状态
    controlLive: (action, streamUrl = null, streamId = null) => {
        if (action === 'start') {
            let selectedStreamUrl = streamUrl;

            if (!selectedStreamUrl) {
                let selectedStream = null;

                if (streamId) {
                    selectedStream = mockService.streams.getById(streamId);
                    if (!selectedStream) {
                        throw new Error('指定的直播流不存在');
                    }
                    if (!selectedStream.enabled) {
                        throw new Error('指定的直播流未启用');
                    }
                } else {
                    selectedStream = mockService.streams.getActive();
                    if (!selectedStream) {
                        throw new Error('没有可用的直播流，请先在后台管理系统中配置直播流');
                    }
                }

                selectedStreamUrl = selectedStream.url;
            }

            updateGlobalLiveStatus({
                isLive: true,
                streamUrl: selectedStreamUrl,
                streamId: streamId || null,
                isScheduled: false,
                scheduledStartTime: null,
                scheduledEndTime: null
            });

            mockService.liveSchedule.clear();

            broadcast('live-status-changed', {
                status: 'started',
                streamUrl: selectedStreamUrl,
                timestamp: Date.now(),
                startedBy: streamId ? 'user' : 'admin'
            });

            return {
                isLive: true,
                streamUrl: selectedStreamUrl,
                streamId: streamId
            };
        } else if (action === 'stop') {
            stopLive();
            return { isLive: false };
        } else {
            throw new Error('无效的操作，action必须是 "start" 或 "stop"');
        }
    },

    // 设置直播计划
    setLiveSchedule: (scheduleData) => {
        const { scheduledStartTime, scheduledEndTime, streamId } = scheduleData;
        const now = Date.now();

        if (!scheduledStartTime) {
            throw new Error('请设置直播开始时间');
        }

        const startTime = new Date(scheduledStartTime).getTime();
        if (startTime <= now) {
            throw new Error('开始时间必须晚于当前时间');
        }

        if (streamId) {
            const stream = mockService.streams.getById(streamId);
            if (!stream) {
                throw new Error('指定的直播流不存在');
            }
            if (!stream.enabled) {
                throw new Error('指定的直播流未启用');
            }
        } else {
            const activeStream = mockService.streams.getActive();
            if (!activeStream) {
                throw new Error('没有可用的直播流');
            }
        }

        const schedule = mockService.liveSchedule.update({
            scheduledStartTime,
            scheduledEndTime: scheduledEndTime || null,
            streamId: streamId || null,
            isScheduled: true
        });

        updateGlobalLiveStatus({
            scheduledStartTime,
            scheduledEndTime: scheduledEndTime || null,
            streamId: streamId || null,
            isScheduled: true
        });

        startScheduleCheck();

        broadcast('live-schedule-updated', {
            schedule: schedule,
            timestamp: Date.now()
        });

        return schedule;
    },

    // 获取直播计划
    getLiveSchedule: () => {
        return mockService.liveSchedule.get();
    },

    cancelLiveSchedule: () => {
        mockService.liveSchedule.clear();

        updateGlobalLiveStatus({
            isScheduled: false,
            scheduledStartTime: null,
            scheduledEndTime: null
        });

        broadcast('live-schedule-cancelled', {
            timestamp: Date.now()
        });

        return { success: true };
    },

    // 设置并开始直播
    setupAndStartLive: (data) => {
        const { streamId, scheduledStartTime, scheduledEndTime, startNow } = data;

        let selectedStream = null;
        if (streamId) {
            selectedStream = mockService.streams.getById(streamId);
            if (!selectedStream) {
                throw new Error('指定的直播流不存在');
            }
            if (!selectedStream.enabled) {
                throw new Error('指定的直播流未启用');
            }
        } else {
            selectedStream = mockService.streams.getActive();
            if (!selectedStream) {
                throw new Error('没有可用的直播流');
            }
        }

        if (startNow) {
            updateGlobalLiveStatus({
                isLive: true,
                streamUrl: selectedStream.url,
                streamId: selectedStream.id,
                isScheduled: false,
                scheduledStartTime: null,
                scheduledEndTime: null
            });

            mockService.liveSchedule.clear();

            broadcast('live-status-changed', {
                status: 'started',
                streamUrl: selectedStream.url,
                timestamp: Date.now(),
                startedBy: 'admin'
            });

            return {
                isLive: true,
                streamUrl: selectedStream.url,
                streamId: selectedStream.id
            };
        } else {
            if (!scheduledStartTime) {
                throw new Error('请设置直播开始时间');
            }

            const startTime = new Date(scheduledStartTime).getTime();
            const now = Date.now();

            if (startTime <= now) {
                throw new Error('开始时间必须晚于当前时间');
            }

            const schedule = mockService.liveSchedule.update({
                scheduledStartTime,
                scheduledEndTime: scheduledEndTime || null,
                streamId: selectedStream.id,
                isScheduled: true
            });

            updateGlobalLiveStatus({
                scheduledStartTime,
                scheduledEndTime: scheduledEndTime || null,
                streamId: selectedStream.id,
                isScheduled: true
            });

            startScheduleCheck();

            broadcast('live-schedule-updated', {
                schedule: schedule,
                timestamp: Date.now()
            });

            return schedule;
        }
    }
};