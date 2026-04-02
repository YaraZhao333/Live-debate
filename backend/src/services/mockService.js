const { v4: uuidv4 } = require('uuid');

// 内存中的Mock数据存储
const mockData = {
	streams: [
		{
			id: 'mock-stream-1',
			name: '主直播间',
			url: 'https://test-streams.mux.dev/x36xhzz/x36xhzz.m3u8',
			type: 'hls',
			enabled: true,
			createdAt: new Date().toISOString(),
			updatedAt: new Date().toISOString()
		},
		{
			id: 'mock-stream-2',
			name: '备用直播间',
			url: 'https://test-streams.mux.dev/x36xhzz/x36xhzz.m3u8',
			type: 'hls',
			enabled: false,
			createdAt: new Date().toISOString(),
			updatedAt: new Date().toISOString()
		}
	],
	
	debates: [
		{
			id: 'debate-1',
			title: "如果有一个能一键消除痛苦的按钮，你会按吗？",
			description: "这是一个关于痛苦、成长与人性选择的深度辩论",
			leftPosition: "会按",
			rightPosition: "不会按",
			isActive: true,
			createdAt: new Date().toISOString(),
			updatedAt: new Date().toISOString()
		}
	],
	
	streamDebates: {},
	
	debate: {
		title: "如果有一个能一键消除痛苦的按钮，你会按吗？",
		description: "这是一个关于痛苦、成长与人性选择的深度辩论",
		leftPosition: "会按",
		rightPosition: "不会按",
		updatedAt: new Date().toISOString()
	},
	
	users: [
		{
			id: 'mock-user-1',
			nickname: '小明',
			avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=1',
			createdAt: new Date(Date.now() - 86400000 * 7).toISOString(),
			updatedAt: new Date().toISOString(),
			totalVotes: 28,
			joinedDebates: 5,
			status: 'active'
		},
		{
			id: 'mock-user-2',
			nickname: '小红',
			avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=2',
			createdAt: new Date(Date.now() - 86400000 * 5).toISOString(),
			updatedAt: new Date().toISOString(),
			totalVotes: 15,
			joinedDebates: 3,
			status: 'active'
		},
		{
			id: 'mock-user-3',
			nickname: '小李',
			avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=3',
			createdAt: new Date(Date.now() - 86400000 * 3).toISOString(),
			updatedAt: new Date().toISOString(),
			totalVotes: 42,
			joinedDebates: 8,
			status: 'active'
		},
		{
			id: 'mock-user-4',
			nickname: '小王',
			avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=4',
			createdAt: new Date(Date.now() - 86400000 * 2).toISOString(),
			updatedAt: new Date().toISOString(),
			totalVotes: 8,
			joinedDebates: 2,
			status: 'inactive'
		},
		{
			id: 'mock-user-5',
			nickname: '小张',
			avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=5',
			createdAt: new Date(Date.now() - 86400000 * 1).toISOString(),
			updatedAt: new Date().toISOString(),
			totalVotes: 67,
			joinedDebates: 12,
			status: 'active'
		}
	],

	judges: {
		'mock-stream-1': [
			{
				id: 'judge-1',
				name: '张教授',
				role: '主评委',
				avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=judge1',
				votes: 5
			},
			{
				id: 'judge-2',
				name: '李博士',
				role: '嘉宾评委',
				avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=judge2',
				votes: 3
			},
			{
				id: 'judge-3',
				name: '王律师',
				role: '嘉宾评委',
				avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=judge3',
				votes: 4
			}
		],
		'mock-stream-2': [
			{
				id: 'judge-4',
				name: '陈教授',
				role: '主评委',
				avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=judge4',
				votes: 0
			},
			{
				id: 'judge-5',
				name: '林博士',
				role: '嘉宾评委',
				avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=judge5',
				votes: 0
			}
		]
	},

	debateFlows: {
		'mock-stream-1': [
			{ id: 'seg-1', name: '开场陈述', duration: 180 },
			{ id: 'seg-2', name: '自由辩论', duration: 300 },
			{ id: 'seg-3', name: '总结陈词', duration: 120 }
		],
		'mock-stream-2': [
			{ id: 'seg-1', name: '开场陈述', duration: 180 },
			{ id: 'seg-2', name: '自由辩论', duration: 300 },
			{ id: 'seg-3', name: '总结陈词', duration: 120 }
		]
	},

	aiContent: [
		{
			id: 'ai-content-1',
			title: '辩论技巧分享',
			content: '在辩论中，逻辑清晰是最重要的。',
			timestamp: Date.now(),
			likes: 15,
			comments: [
				{
					id: 'comment-1',
					content: '说得很有道理！',
					createdAt: new Date().toISOString(),
					likes: 3
				}
			]
		},
		{
			id: 'ai-content-2',
			title: '如何准备辩论',
			content: '充分的准备是成功的关键。',
			timestamp: Date.now() - 3600000,
			likes: 8,
			comments: []
		}
	],

	votes: {
		leftVotes: 50,
		rightVotes: 50,
		total: 100,
		updatedAt: new Date().toISOString()
	},

	userVotes: [
		{
			id: 'user-vote-1',
			userId: 'mock-user-1',
			position: 'left',
			createdAt: new Date().toISOString()
		},
		{
			id: 'user-vote-2',
			userId: 'mock-user-2',
			position: 'right',
			createdAt: new Date().toISOString()
		}
	],

	statistics: {
		totalVotes: 100,
		totalUsers: 5,
		totalComments: 1,
		totalLikes: 23,
		lastLiveTime: new Date().toISOString(),
		liveDuration: 3600,
		updatedAt: new Date().toISOString()
	},

	debateFlowStates: {
		'mock-stream-1': {
			currentSegmentIndex: 0,
			remainingTime: 180,
			isRunning: false,
			isPaused: false,
			startTime: null,
			pauseTime: null,
			segmentName: '开场陈述'
		}
	},

	liveSchedule: {
		nextLiveTime: new Date(Date.now() + 86400000).toISOString(),
		topic: '人工智能的未来',
		speakers: ['专家A', '专家B'],
		updatedAt: new Date().toISOString()
	},

	live: {
		status: 'online',
		currentStream: 'mock-stream-1',
		updatedAt: new Date().toISOString()
	}
};

// 流管理
const streams = {
	getAll: () => mockData.streams,
	
	getById: (id) => {
		return mockData.streams.find(s => s.id === id);
	},
	
	create: (streamData) => {
		const newStream = {
			id: uuidv4(),
			...streamData,
			createdAt: new Date().toISOString(),
			updatedAt: new Date().toISOString()
		};
		mockData.streams.push(newStream);
		return newStream;
	},
	
	add: function(streamData) {
		return this.create(streamData);
	},
	
	update: (id, streamData) => {
		const index = mockData.streams.findIndex(s => s.id === id);
		if (index === -1) return null;
		
		mockData.streams[index] = {
			...mockData.streams[index],
			...streamData,
			updatedAt: new Date().toISOString()
		};
		return mockData.streams[index];
	},
	
	delete: (id) => {
		const originalLength = mockData.streams.length;
		mockData.streams = mockData.streams.filter(s => s.id !== id);
		return mockData.streams.length < originalLength;
	},
	
	toggle: (id) => {
		const index = mockData.streams.findIndex(s => s.id === id);
		if (index === -1) return null;
		
		mockData.streams[index].enabled = !mockData.streams[index].enabled;
		mockData.streams[index].updatedAt = new Date().toISOString();
		return mockData.streams[index];
	},
	
	toggleEnabled: (id) => {
		const index = mockData.streams.findIndex(s => s.id === id);
		if (index === -1) return null;
		
		mockData.streams[index].enabled = !mockData.streams[index].enabled;
		mockData.streams[index].updatedAt = new Date().toISOString();
		return mockData.streams[index];
	},
	
	getActive: () => {
		return mockData.streams.find(s => s.enabled === true);
	}
};

// 辩论设置管理
const debate = {
	get: () => mockData.debate,
	
	update: (debateData) => {
		mockData.debate = {
			...mockData.debate,
			...debateData,
			updatedAt: new Date().toISOString()
		};
		return mockData.debate;
	},
	
	// 创建辩题
	create: (debateData) => {
		const newDebate = {
			id: uuidv4(),
			...debateData,
			createdAt: new Date().toISOString(),
			updatedAt: new Date().toISOString()
		};
		mockData.debates.push(newDebate);
		
		// 如果设置为激活状态，更新全局辩题
		if (debateData.isActive) {
			mockData.debate = {
				title: newDebate.title,
				description: newDebate.description,
				leftPosition: newDebate.leftPosition,
				rightPosition: newDebate.rightPosition,
				updatedAt: new Date().toISOString()
			};
		}
		
		return newDebate;
	},
	
	// 获取单个辩题
	getById: (id) => {
		return mockData.debates.find(d => d.id === id);
	},
	
	// 关联辩题到直播流
	associateToStream: (streamId, debateId) => {
		mockData.streamDebates[streamId] = debateId;
		return {
			streamId,
			debateId,
			updatedAt: new Date().toISOString()
		};
	},
	
	// 从直播流中移除辩题关联
	removeFromStream: (streamId) => {
		delete mockData.streamDebates[streamId];
		return {
			streamId,
			updatedAt: new Date().toISOString()
		};
	},
	
	// 获取直播流的辩题
	getByStreamId: (streamId) => {
		const debateId = mockData.streamDebates[streamId];
		if (debateId) {
			return mockData.debates.find(d => d.id === debateId);
		}
		return mockData.debate; // 默认返回全局辩题
	}
};

// 用户管理
const users = {
	getAll: () => mockData.users,
	
	getById: (id) => {
		return mockData.users.find(u => u.id === id);
	},
	
	createOrUpdate: (userData) => {
		const index = mockData.users.findIndex(u => u.id === userData.id);
		
		if (index === -1) {
			const newUser = {
				...userData,
				createdAt: new Date().toISOString(),
				updatedAt: new Date().toISOString(),
				totalVotes: 0,
				joinedDebates: 0,
				status: 'active'
			};
			mockData.users.push(newUser);
			return newUser;
		} else {
			mockData.users[index] = {
				...mockData.users[index],
				...userData,
				updatedAt: new Date().toISOString()
			};
			return mockData.users[index];
		}
	}
};

// 统计数据管理
const statistics = {
	get: () => mockData.statistics,
	
	incrementVotes: (count = 1) => {
		mockData.statistics.totalVotes = (mockData.statistics.totalVotes || 0) + count;
		mockData.statistics.updatedAt = new Date().toISOString();
		return mockData.statistics;
	},
	
	updateDashboard: (data) => {
		if (data.totalVotes !== undefined) {
			mockData.statistics.totalVotes = data.totalVotes;
		}
		if (data.lastLiveTime !== undefined) {
			mockData.statistics.lastLiveTime = data.lastLiveTime;
		}
		if (data.liveDuration !== undefined) {
			mockData.statistics.liveDuration = data.liveDuration;
		}
		if (data.totalUsers !== undefined) {
			mockData.statistics.totalUsers = data.totalUsers;
		}
		if (data.totalComments !== undefined) {
			mockData.statistics.totalComments = data.totalComments;
		}
		if (data.totalLikes !== undefined) {
			mockData.statistics.totalLikes = data.totalLikes;
		}
		mockData.statistics.updatedAt = new Date().toISOString();
		return mockData.statistics;
	},
	
	getDashboard: () => {
		// 使用 mockData.live 状态来判断是否直播中（与 liveState 同步）
		const isLive = mockData.live && mockData.live.status === 'online';
		
		// 获取当前活跃的直播流
		const activeStream = mockData.streams.find(s => s.enabled === true);
		const streamUrl = activeStream ? activeStream.url : null;
		
		return {
			totalUsers: mockData.users.length,
			activeUsers: mockData.users.filter(u => u.status === 'active').length,
			totalVotes: mockData.statistics.totalVotes || 0,
			isLive: isLive,
			liveStreamUrl: streamUrl,
			activeStreamUrl: streamUrl,
			streamUrl: streamUrl
		};
	}
};

// 投票管理
const votes = {
	get: () => mockData.votes,
	
	update: (leftVotes, rightVotes) => {
		mockData.votes.leftVotes = leftVotes;
		mockData.votes.rightVotes = rightVotes;
		mockData.votes.total = leftVotes + rightVotes;
		mockData.votes.updatedAt = new Date().toISOString();
		return mockData.votes;
	},
	
	add: (leftVotes, rightVotes) => {
		mockData.votes.leftVotes = (mockData.votes.leftVotes || 0) + leftVotes;
		mockData.votes.rightVotes = (mockData.votes.rightVotes || 0) + rightVotes;
		mockData.votes.total = mockData.votes.leftVotes + mockData.votes.rightVotes;
		mockData.votes.updatedAt = new Date().toISOString();
		return mockData.votes;
	},
	
	reset: (leftVotes = 50, rightVotes = 50) => {
		mockData.votes.leftVotes = leftVotes;
		mockData.votes.rightVotes = rightVotes;
		mockData.votes.total = leftVotes + rightVotes;
		mockData.votes.updatedAt = new Date().toISOString();
		return mockData.votes;
	}
};

// 用户投票管理
const userVotes = {
	getAll: () => mockData.userVotes,
	
	getByUserId: (userId) => {
		return mockData.userVotes.filter(uv => uv.userId === userId);
	},
	
	add: (userVote) => {
		const newUserVote = {
			id: uuidv4(),
			...userVote,
			createdAt: new Date().toISOString()
		};
		mockData.userVotes.push(newUserVote);
		return newUserVote;
	}
};

// AI 内容管理
const aiContent = {
	getAll: () => mockData.aiContent,
	
	getById: (id) => {
		return mockData.aiContent.find(c => c.id === id);
	},
	
	add: (contentData) => {
		const newContent = {
			id: uuidv4(),
			...contentData,
			timestamp: Date.now(),
			likes: 0,
			comments: []
		};
		mockData.aiContent.unshift(newContent);
		return newContent;
	},
	
	like: (contentId) => {
		const content = mockData.aiContent.find(c => c.id === contentId);
		if (content) {
			content.likes = (content.likes || 0) + 1;
		}
		return content;
	},
	
	addComment: (contentId, comment) => {
		const content = mockData.aiContent.find(c => c.id === contentId);
		if (content) {
			const newComment = {
				id: uuidv4(),
				...comment,
				createdAt: new Date().toISOString(),
				likes: 0
			};
			content.comments.push(newComment);
			return newComment;
		}
		return null;
	},
	
	deleteComment: (contentId, commentId) => {
		const content = mockData.aiContent.find(c => c.id === contentId);
		if (content) {
			const originalLength = content.comments.length;
			content.comments = content.comments.filter(c => c.id !== commentId);
			return content.comments.length < originalLength;
		}
		return false;
	},
	
	likeComment: (contentId, commentId) => {
		const content = mockData.aiContent.find(c => c.id === contentId);
		if (content) {
			const comment = content.comments.find(c => c.id === commentId);
			if (comment) {
				comment.likes = (comment.likes || 0) + 1;
				return comment;
			}
		}
		return null;
	}
};

// 直播计划管理
const liveSchedule = {
	get: () => mockData.liveSchedule,
	
	update: (scheduleData) => {
		mockData.liveSchedule = {
			...mockData.liveSchedule,
			...scheduleData,
			updatedAt: new Date().toISOString()
		};
		return mockData.liveSchedule;
	},
	
	clear: () => {
		mockData.liveSchedule = {
			nextLiveTime: null,
			topic: null,
			speakers: [],
			updatedAt: new Date().toISOString()
		};
		return mockData.liveSchedule;
	}
};

// 直播状态管理
const live = {
	get: () => mockData.live,
	
	update: (liveData) => {
		mockData.live = {
			...mockData.live,
			...liveData,
			updatedAt: new Date().toISOString()
		};
		return mockData.live;
	}
};

// 评委管理
const judges = {
	getByStreamId: (streamId) => {
		return mockData.judges[streamId] || [
			{ id: 'judge-1', name: '评委一', role: '主评委', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=judge1', votes: 0 },
			{ id: 'judge-2', name: '评委二', role: '嘉宾评委', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=judge2', votes: 0 },
			{ id: 'judge-3', name: '评委三', role: '嘉宾评委', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=judge3', votes: 0 }
		];
	},

	updateByStreamId: (streamId, judgesList) => {
		mockData.judges[streamId] = judgesList;
		return mockData.judges[streamId];
	}
};

// 辩论流程管理
const debateFlows = {
	getByStreamId: (streamId) => {
		return mockData.debateFlows[streamId] || [
			{ id: 'seg-1', name: '开场陈述', duration: 180 },
			{ id: 'seg-2', name: '自由辩论', duration: 300 },
			{ id: 'seg-3', name: '总结陈词', duration: 120 }
		];
	},

	updateByStreamId: (streamId, segments) => {
		mockData.debateFlows[streamId] = segments;
		return mockData.debateFlows[streamId];
	}
};

// 辩论流程控制
const debateFlowControls = {
	getState: (streamId) => {
		if (!mockData.debateFlowStates[streamId]) {
			mockData.debateFlowStates[streamId] = {
				currentSegmentIndex: 0,
				remainingTime: 0,
				isRunning: false,
				isPaused: false,
				startTime: null,
				pauseTime: null,
				segmentName: ''
			};
		}
		return mockData.debateFlowStates[streamId];
	},

	control: (streamId, action, segmentIndex = 0) => {
		const state = debateFlowControls.getState(streamId);
		const segments = debateFlows.getByStreamId(streamId);

		switch (action) {
			case 'start':
				state.currentSegmentIndex = Math.max(0, Math.min(segmentIndex, segments.length - 1));
				state.remainingTime = segments[state.currentSegmentIndex]?.duration || 180;
				state.isRunning = true;
				state.isPaused = false;
				state.startTime = Date.now();
				state.pauseTime = null;
				state.segmentName = segments[state.currentSegmentIndex]?.name || '';
				break;
			case 'pause':
				state.isRunning = false;
				state.isPaused = true;
				state.pauseTime = Date.now();
				break;
			case 'resume':
				state.isRunning = true;
				state.isPaused = false;
				state.startTime = Date.now() - (state.pauseTime - state.startTime);
				state.pauseTime = null;
				break;
			case 'stop':
				state.isRunning = false;
				state.isPaused = false;
				state.remainingTime = 0;
				state.startTime = null;
				state.pauseTime = null;
				break;
		}

		return state;
	}
};

// 导出所有服务
module.exports = {
	streams,
	debate,
	users,
	statistics,
	votes,
	userVotes,
	aiContent,
	liveSchedule,
	live,
	judges,
	debateFlows,
	debateFlowControls
};