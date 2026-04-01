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
				votes: 2
			}
		],
		'mock-stream-2': [
			{
				id: 'judge-1',
				name: '陈老师',
				role: '主评委',
				avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=judge4',
				votes: 0
			},
			{
				id: 'judge-2',
				name: '刘专家',
				role: '嘉宾评委',
				avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=judge5',
				votes: 0
			},
			{
				id: 'judge-3',
				name: '赵顾问',
				role: '嘉宾评委',
				avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=judge6',
				votes: 0
			}
		]
	},
	
	debateFlowStates: {},

	debateFlows: {
		'mock-stream-1': [
			{ id: 'seg-1', name: '开场陈述', duration: 180 },
			{ id: 'seg-2', name: '自由辩论', duration: 300 },
			{ id: 'seg-3', name: '总结陈词', duration: 120 }
		],
		'mock-stream-2': [
			{ id: 'seg-1', name: '开篇立论', duration: 240 },
			{ id: 'seg-2', name: '攻辩环节', duration: 180 },
			{ id: 'seg-3', name: '自由辩论', duration: 240 },
			{ id: 'seg-4', name: '总结陈词', duration: 180 }
		]
	},
	
	votes: {
		leftVotes: 45,
		rightVotes: 55,
		total: 100,
		updatedAt: new Date().toISOString()
	},
	
	userVotes: [],
	
	aiContent: [
		{
			id: uuidv4(),
			position: 'left',
			content: '关于"如果有一个能一键消除痛苦的按钮，你会按吗？"，我认为会按这个按钮。痛苦是阻碍人类进步的主要障碍之一。',
			timestamp: Date.now() - 60000,
			likes: 12,
			comments: []
		},
		{
			id: uuidv4(),
			position: 'right',
			content: '关于"如果有一个能一键消除痛苦的按钮，你会按吗？"，我认为不会按这个按钮。痛苦是成长的重要组成部分。',
			timestamp: Date.now() - 30000,
			likes: 8,
			comments: []
		}
	],
	
	statistics: {
		totalVotes: 8,
		totalUsers: 2,
		totalComments: 15,
		totalLikes: 23,
		dailyStats: [],
		updatedAt: new Date().toISOString()
	},
	
	liveSchedule: {
		scheduledStartTime: null,
		scheduledEndTime: null,
		streamId: null,
		debateId: null,
		isScheduled: false,
		updatedAt: new Date().toISOString()
	}
};

// 直播流管理
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
	},
	
	updateStats: (id, stats) => {
		const index = mockData.users.findIndex(u => u.id === id);
		if (index === -1) return null;
		
		mockData.users[index].totalVotes = (mockData.users[index].totalVotes || 0) + (stats.votes || 0);
		mockData.users[index].joinedDebates = (mockData.users[index].joinedDebates || 0) + (stats.debates || 0);
		mockData.users[index].updatedAt = new Date().toISOString();
		return mockData.users[index];
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
		const activeStream = mockData.streams.find(s => s.enabled);
		
		return {
			totalUsers: mockData.users.length,
			activeUsers: mockData.users.filter(u => u.status === 'active').length,
			totalVotes: mockData.statistics.totalVotes || 0,
			isLive: !!activeStream
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
	
	reset: () => {
		mockData.votes.leftVotes = 50;
		mockData.votes.rightVotes = 50;
		mockData.votes.total = 100;
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

// AI内容管理
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
			scheduledStartTime: null,
			scheduledEndTime: null,
			streamId: null,
			debateId: null,
			isScheduled: false,
			updatedAt: new Date().toISOString()
		};
		return mockData.liveSchedule;
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
				if (state.isRunning) {
					state.isPaused = true;
					state.pauseTime = Date.now();
				}
				break;

			case 'resume':
				if (state.isPaused) {
					state.isPaused = false;
					state.startTime = Date.now() - (state.pauseTime - (state.startTime || 0));
					state.pauseTime = null;
				}
				break;

			case 'reset':
				state.currentSegmentIndex = 0;
				state.remainingTime = segments[0]?.duration || 180;
				state.isRunning = false;
				state.isPaused = false;
				state.startTime = null;
				state.pauseTime = null;
				state.segmentName = segments[0]?.name || '';
				break;

			case 'next':
				state.currentSegmentIndex = Math.min(state.currentSegmentIndex + 1, segments.length - 1);
				state.remainingTime = segments[state.currentSegmentIndex]?.duration || 180;
				state.segmentName = segments[state.currentSegmentIndex]?.name || '';
				state.startTime = Date.now();
				break;

			case 'prev':
				state.currentSegmentIndex = Math.max(state.currentSegmentIndex - 1, 0);
				state.remainingTime = segments[state.currentSegmentIndex]?.duration || 180;
				state.segmentName = segments[state.currentSegmentIndex]?.name || '';
				state.startTime = Date.now();
				break;
		}

		return {
			...state,
			action,
			segmentIndex: state.currentSegmentIndex,
			timestamp: new Date().toISOString()
		};
	}
};

// 生成动态AI辩论内容
function generateAIDebateContent(topic, position) {
	const args = {
		left: [
			`关于"${topic}"，我认为会按这个按钮。痛苦是阻碍人类进步的主要障碍之一。`,
			`消除痛苦可以让人们更专注于创造和建设，而不是被负面情绪所困扰。`,
			`历史上很多伟大的成就都是在摆脱痛苦之后才实现的。`,
			`痛苦往往会导致非理性的决策，消除痛苦能让我们更清醒地思考。`
		],
		right: [
			`关于"${topic}"，我认为不会按这个按钮。痛苦是成长的重要组成部分。`,
			`没有痛苦的经历，我们无法真正理解和珍惜幸福。`,
			`痛苦能够激发人类的潜能，推动我们不断进步。`,
			`完全消除痛苦可能导致人类失去同理心和情感深度。`
		]
	};
	
	const selectedArgs = arguments[position] || arguments.left;
	const randomArg = selectedArgs[Math.floor(Math.random() * selectedArgs.length)];
	
	return {
		position,
		content: randomArg,
		timestamp: Date.now()
	};
}

// 生成投票数据
function generateVoteData() {
	const leftVotes = Math.floor(Math.random() * 100) + 50;
	const rightVotes = Math.floor(Math.random() * 100) + 50;
	const total = leftVotes + rightVotes;
	
	return {
		leftVotes,
		rightVotes,
		total,
		leftPercentage: ((leftVotes / total) * 100).toFixed(1),
		rightPercentage: ((rightVotes / total) * 100).toFixed(1)
	};
}

module.exports = {
	streams,
	debate,
	users,
	votes,
	userVotes,
	aiContent,
	statistics,
	liveSchedule,
	judges,
	debateFlows,
	debateFlowControls,
	generateAIDebateContent,
	generateVoteData
};
