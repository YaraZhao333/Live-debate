const mockService = require('../services/mockService');

const streamsController = {
	getStreams: (req, res) => {
		try {
			const streams = mockService.streams.getAll();
			res.json({
				code: 0,
				message: 'success',
				data: {
					streams: streams
				}
			});
		} catch (error) {
			console.error('获取直播流列表失败:', error);
			res.status(500).json({
				code: -1,
				message: '获取直播流列表失败',
				data: null
			});
		}
	},

	getStreamById: (req, res) => {
		try {
			const streamId = req.params.id;
			const stream = mockService.streams.getById(streamId);
			
			if (!stream) {
				return res.status(404).json({
					code: -1,
					message: '直播流不存在',
					data: null
				});
			}
			
			res.json({
				code: 0,
				message: 'success',
				data: stream
			});
		} catch (error) {
			console.error('获取直播流详情失败:', error);
			res.status(500).json({
				code: -1,
				message: '获取直播流详情失败',
				data: null
			});
		}
	},

	createStream: (req, res) => {
		try {
			const streamData = req.body;
			const newStream = mockService.streams.create(streamData);
			
			res.json({
				code: 0,
				message: '创建成功',
				data: newStream
			});
		} catch (error) {
			console.error('创建直播流失败:', error);
			res.status(500).json({
				code: -1,
				message: '创建直播流失败',
				data: null
			});
		}
	},

	updateStream: (req, res) => {
		try {
			const streamId = req.params.id;
			const streamData = req.body;
			const updatedStream = mockService.streams.update(streamId, streamData);
			
			if (!updatedStream) {
				return res.status(404).json({
					code: -1,
					message: '直播流不存在',
					data: null
				});
			}
			
			res.json({
				code: 0,
				message: '更新成功',
				data: updatedStream
			});
		} catch (error) {
			console.error('更新直播流失败:', error);
			res.status(500).json({
				code: -1,
				message: '更新直播流失败',
				data: null
			});
		}
	},

	deleteStream: (req, res) => {
		try {
			const streamId = req.params.id;
			const deleted = mockService.streams.delete(streamId);
			
			if (!deleted) {
				return res.status(404).json({
					code: -1,
					message: '直播流不存在',
					data: null
				});
			}
			
			res.json({
				code: 0,
				message: '删除成功',
				data: null
			});
		} catch (error) {
			console.error('删除直播流失败:', error);
			res.status(500).json({
				code: -1,
				message: '删除直播流失败',
				data: null
			});
		}
	},

	toggleStream: (req, res) => {
		try {
			const streamId = req.params.id;
			const stream = mockService.streams.toggleEnabled(streamId);
			
			if (!stream) {
				return res.status(404).json({
					code: -1,
					message: '直播流不存在',
					data: null
				});
			}
			
			res.json({
				code: 0,
				message: '切换成功',
				data: stream
			});
		} catch (error) {
			console.error('切换直播流状态失败:', error);
			res.status(500).json({
				code: -1,
				message: '切换直播流状态失败',
				data: null
			});
		}
	},

	getStreamDebate: (req, res) => {
		try {
			const streamId = req.params.id;
			const debate = mockService.debate.get();
			
			res.json({
				code: 0,
				message: 'success',
				data: debate
			});
		} catch (error) {
			console.error('获取流关联辩题失败:', error);
			res.status(500).json({
				code: -1,
				message: '获取流关联辩题失败',
				data: null
			});
		}
	},

	updateStreamDebate: (req, res) => {
		try {
			const streamId = req.params.id;
			const { debate_id } = req.body;
			
			res.json({
				code: 0,
				message: '关联成功',
				data: null
			});
		} catch (error) {
			console.error('关联辩题失败:', error);
			res.status(500).json({
				code: -1,
				message: '关联辩题失败',
				data: null
			});
		}
	},

	deleteStreamDebate: (req, res) => {
		try {
			const streamId = req.params.id;
			
			res.json({
				code: 0,
				message: '解除关联成功',
				data: null
			});
		} catch (error) {
			console.error('解除关联失败:', error);
			res.status(500).json({
				code: -1,
				message: '解除关联失败',
				data: null
			});
		}
	},

	// 获取RTMP转HLS播放地址
	getRtmpToHlsUrls: (req, res) => {
		try {
			const roomName = req.query.room_name;
			
			if (!roomName) {
				return res.status(400).json({
					code: -1,
					message: '房间名称不能为空',
					data: null
				});
			}
			
			// 模拟返回RTMP转HLS的地址
			// 实际项目中，这里应该调用真实的转码服务
			const pushUrl = `rtmp://localhost/live/${roomName}`;
			const playFlv = `http://localhost:8080/live/${roomName}.flv`;
			const playHls = `http://localhost:8080/live/${roomName}/index.m3u8`;
			
			res.json({
				code: 0,
				message: 'success',
				success: true,
				data: {
					room_name: roomName,
					push_url: pushUrl,
					play_flv: playFlv,
					play_hls: playHls
				}
			});
		} catch (error) {
			console.error('获取RTMP转HLS地址失败:', error);
			res.status(500).json({
				code: -1,
				message: '获取RTMP转HLS地址失败',
				data: null
			});
		}
	}
};

module.exports = streamsController;
