const mockService = require('../services/mockService');
const { broadcast } = require('../websocket/wsServer');

module.exports = {
    getDebateFlow: (req, res) => {
        try {
            const { stream_id } = req.query;
            if (!stream_id) {
                return res.status(400).json({
                    code: -1,
                    message: 'stream_id 是必填参数',
                    data: null
                });
            }

            const segments = mockService.debateFlows.getByStreamId(stream_id);
            
            res.json({
                code: 0,
                message: 'success',
                segments: segments,
                data: { segments }
            });
        } catch (error) {
            console.error('获取辩论流程失败:', error);
            res.status(500).json({
                code: -1,
                message: '获取辩论流程失败',
                data: null
            });
        }
    },

    saveDebateFlow: (req, res) => {
        try {
            const { stream_id, segments } = req.body;
            if (!stream_id) {
                return res.status(400).json({
                    code: -1,
                    message: 'stream_id 是必填参数',
                    data: null
                });
            }

            const updatedSegments = mockService.debateFlows.updateByStreamId(stream_id, segments);
            
            broadcast('debate-flow-updated', {
                streamId: stream_id,
                flow: updatedSegments,
                timestamp: new Date().toISOString()
            });
            
            res.json({
                code: 0,
                message: '辩论流程已保存',
                segments: updatedSegments,
                data: { segments: updatedSegments }
            });
        } catch (error) {
            console.error('保存辩论流程失败:', error);
            res.status(500).json({
                code: -1,
                message: '保存辩论流程失败',
                data: null
            });
        }
    },

    controlDebateFlow: (req, res) => {
        try {
            const { stream_id, action, segmentIndex } = req.body;
            if (!stream_id) {
                return res.status(400).json({
                    code: -1,
                    message: 'stream_id 是必填参数',
                    data: null
                });
            }
            
            const validActions = ['start', 'pause', 'resume', 'reset', 'next', 'prev'];
            if (!validActions.includes(action)) {
                return res.status(400).json({
                    code: -1,
                    message: `action 必须是以下之一: ${validActions.join(', ')}`,
                    data: null
                });
            }

            const result = mockService.debateFlowControls.control(
                stream_id, 
                action, 
                segmentIndex || 0
            );
            
            broadcast('debate-flow-control', {
                streamId: stream_id,
                action: action,
                segmentIndex: result.segmentIndex,
                timestamp: new Date().toISOString()
            });
            
            res.json({
                code: 0,
                message: '流程控制命令已发送',
                data: result
            });
        } catch (error) {
            console.error('辩论流程控制失败:', error);
            res.status(500).json({
                code: -1,
                message: '辩论流程控制失败',
                data: null
            });
        }
    }
};
