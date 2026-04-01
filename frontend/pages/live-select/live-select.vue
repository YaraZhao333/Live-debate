<template>
	<view class="live-select-container">
		<!-- 背景 -->
		<view class="pop-bg"></view>
		
		<!-- 自定义导航栏 -->
		<view class="custom-navbar">
			<text class="navbar-title">选择直播间</text>
		</view>
		
		
		<!-- 直播列表 -->
		<scroll-view class="live-list-section" scroll-y="true">
			<!-- 加载中 -->
			<view v-if="loading" class="loading-container">
				<view class="loading-spinner"></view>
				<text class="loading-text">加载中...</text>
			</view>
			
			<!-- 直播卡片列表 -->
			<view v-else-if="liveStreams.length > 0" class="live-cards-container">
				<view 
					v-for="stream in liveStreams" 
					:key="stream.id"
					class="live-card"
					:class="{ 'is-live': stream.isLive }"
					@click="enterLiveRoom(stream)"
				>
					<!-- 直播状态标签 -->
					<view class="live-status-badge" :class="{ 'live': stream.isLive }">
						<text class="status-dot">●</text>
						<text class="status-text">{{ stream.isLive ? 'LIVE NOW' : 'OFFLINE' }}</text>
					</view>
					
					<!-- 直播间信息 -->
				<view class="card-content">
					<!-- 辩题信息 -->
					<view v-if="stream.debateTopic && stream.debateTopic.title" class="debate-info">
						<text class="debate-title">{{ stream.debateTopic.title }}</text>
					</view>
					
					<!-- 左右两方信息 -->
					<view v-if="stream.debateTopic && stream.debateTopic.leftSide" class="sides-info">
						<view class="side-item left-item">
							<text class="side-label">{{ stream.debateTopic.leftSide }}</text>
						</view>
						<view class="vs-divider">VS</view>
						<view class="side-item right-item">
							<text class="side-label">{{ stream.debateTopic.rightSide }}</text>
						</view>
					</view>
					
					<!-- 进入按钮 -->
					<view class="enter-btn" :class="{ 'disabled': !stream.isLive }">
						<text class="btn-text">{{ stream.isLive ? 'ENTER' : 'WAITING' }}</text>
						<image v-if="stream.isLive" src="/static/iconfont/bofang.png" class="btn-icon-img" mode="aspectFit"></image>
						<image v-else src="/static/iconfont/suo.png" class="btn-icon-img" mode="aspectFit"></image>
					</view>
				</view>
				</view>
			</view>
			
			<!-- 空状态 -->
			<view v-else class="empty-container">
				<image src="/static/iconfont/zhibo.png" class="empty-icon-img" mode="aspectFit"></image>
				<text class="empty-text">NO STREAMS</text>
				<text class="empty-hint">Please come back later</text>
			</view>
		</scroll-view>
		
		<!-- 底部刷新按钮 -->
		<view class="footer-section">
			<view class="refresh-btn" @click="refreshStreams">
				<image src="/static/iconfont/shuaxin.png" class="refresh-icon-img" mode="aspectFit"></image>
				<text class="refresh-text">REFRESH</text>
			</view>
		</view>
	</view>
</template>

<script>
import apiService from '@/utils/api-service.js';

export default {
	data() {
		return {
			loading: true,
			liveStreams: [],
			wsConnection: null,
			reconnectTimer: null,
			lastRefreshTime: 0,
			minRefreshInterval: 10000,
			serverRestartDetected: false,
			lastKnownLiveStatus: null
		};
	},
	
	onLoad() {
		console.log('📺 直播选择页面加载');
		this.loadLiveStreams();
		this.connectWebSocket();
		
		// 启动服务重启检测定时器
		this.startServerRestartDetection();
	},
	
	onShow() {
		const now = Date.now();
		if (now - this.lastRefreshTime > this.minRefreshInterval) {
			this.refreshStreams();
		} else {
			console.log('⏳ 刷新间隔过短，跳过刷新');
		}
	},
	
	onUnload() {
		this.disconnectWebSocket();
		this.stopServerRestartDetection();
	},
	
	methods: {
		async loadLiveStreams() {
			try {
				this.loading = true;
				const streams = await apiService.getStreamsList();
				
				if (!streams || streams.length === 0) {
					this.liveStreams = [];
					this.loading = false;
					return;
				}
				
				const enabledStreams = streams.filter(s => s.enabled);
				
				if (enabledStreams.length === 0) {
					this.liveStreams = [];
					this.loading = false;
					return;
				}
				
				const streamsWithDetails = await Promise.all(
					enabledStreams.map(stream => this.fetchStreamDetails(stream))
				);
				
				this.liveStreams = streamsWithDetails;
				this.loading = false;
			} catch (error) {
				console.error('❌ 加载直播流列表失败:', error);
				this.loading = false;
				uni.showToast({
					title: '加载失败',
					icon: 'none'
				});
			}
		},
		
		async fetchStreamDetails(stream) {
			try {
				const dashboard = await apiService.getDashboard(stream.id);
				const isCurrentlyLive = dashboard?.isLive === true;
				
				// 记录初始直播状态（用于服务重启检测）
				if (this.lastKnownLiveStatus === null) {
					this.lastKnownLiveStatus = isCurrentlyLive;
					console.log('📝 记录初始直播状态:', isCurrentlyLive);
				}
				
				// 从 dashboard 获取辩题信息（包含 leftSide 和 rightSide）
				let debateTopic = null;
				if (dashboard && dashboard.debateTopic) {
					debateTopic = {
						title: dashboard.debateTopic.title || '',
						leftSide: dashboard.debateTopic.leftSide || '',
						rightSide: dashboard.debateTopic.rightSide || '',
						description: dashboard.debateTopic.description || ''
					};
				}
				
				// 如果 dashboard 中没有 debateTopic，则从单独的 API 获取
				if (!debateTopic) {
					const debateResponse = await apiService.getDebateTopic(stream.id);
					if (debateResponse && debateResponse.success && debateResponse.data) {
						debateTopic = debateResponse.data;
					} else if (debateResponse && debateResponse.data) {
						debateTopic = debateResponse.data;
					} else if (debateResponse && debateResponse.title) {
						debateTopic = debateResponse;
					}
				}
				
				return {
					...stream,
					isLive: isCurrentlyLive,
					activeUsers: isCurrentlyLive ? (dashboard?.activeUsers || 0) : 0,
					debateTopic: debateTopic
				};
			} catch (error) {
				return {
					...stream,
					isLive: false,
					activeUsers: 0
				};
			}
		},
		
		async refreshStreams() {
			try {
				console.log('🔄 手动刷新直播流列表');
				this.lastRefreshTime = Date.now();
				await this.loadLiveStreams();
				uni.showToast({
					title: '刷新成功',
					icon: 'success',
					duration: 1500
				});
			} catch (error) {
				console.error('❌ 刷新失败:', error);
				uni.showToast({
					title: '刷新失败，请重试',
					icon: 'none',
					duration: 2000
				});
			}
		},
		
		enterLiveRoom(stream) {
			if (!stream.isLive) {
				uni.showToast({
					title: '直播未开始',
					icon: 'none'
				});
				return;
			}
			uni.navigateTo({
				url: `/pages/home/home?streamId=${stream.id}`
			});
		},
		
		// WebSocket methods kept minimal for brevity but fully functional
		connectWebSocket() {
			try {
				const wsUrl = apiService.getWebSocketUrl();
				this.wsConnection = uni.connectSocket({
					url: wsUrl,
					success: () => console.log('✅ WebSocket 连接请求已发送')
				});
				this.wsConnection.onMessage((event) => {
					try {
						const message = JSON.parse(event.data);
						this.handleWebSocketMessage(message);
					} catch (error) {
						console.error('❌ 解析 WebSocket 消息失败:', error);
					}
				});
				this.wsConnection.onError(() => this.scheduleReconnect());
				this.wsConnection.onClose(() => this.scheduleReconnect());
			} catch (error) {
				console.error('❌ 创建 WebSocket 连接失败:', error);
			}
		},
		
		disconnectWebSocket() {
			if (this.reconnectTimer) {
				clearTimeout(this.reconnectTimer);
				this.reconnectTimer = null;
			}
			if (this.wsConnection) {
				this.wsConnection.close();
				this.wsConnection = null;
			}
		},
		
		scheduleReconnect() {
			if (this.reconnectTimer) return;
			this.reconnectTimer = setTimeout(() => {
				this.reconnectTimer = null;
				this.connectWebSocket();
			}, 30000);
		},
		
		handleWebSocketMessage(message) {
			console.log('📨 收到 WebSocket 消息:', message);
			const { type, streamId, liveId, data } = message;
			const currentStreamId = streamId || liveId || data?.streamId || data?.liveId;
			
			// 处理 live-started 事件（直播开始）
			if (type === 'live-started') {
				console.log('📡 收到直播开始事件:', data);
				if (data && data.streamId) {
					this.updateLiveStatus(data.streamId, {
						isLive: true,
						status: 'started',
						activeUsers: data.activeUsers || 0
					});
				} else if (data) {
					// 如果没有 streamId，尝试更新所有流的状态
					console.log('📡 没有 streamId，尝试更新所有流');
					this.liveStreams.forEach(stream => {
						this.updateLiveStatus(stream.id, {
							isLive: true,
							status: 'started',
							activeUsers: data.activeUsers || 0
						});
					});
				}
				return;
			}
			
			// 处理 live-status 事件（连接时获取当前状态）
			if (type === 'live-status') {
				console.log('📡 收到直播状态:', data);
				if (data && data.streamId) {
					this.updateLiveStatus(data.streamId, {
						isLive: data.isLive || data.status === 'online',
						status: data.status,
						activeUsers: data.activeUsers || 0
					});
				} else if (data) {
					// 如果没有 streamId，尝试更新所有流的状态
					console.log('📡 没有 streamId，尝试更新所有流');
					const isLive = data.isLive || data.status === 'online';
					this.liveStreams.forEach(stream => {
						this.updateLiveStatus(stream.id, {
							isLive: isLive,
							status: data.status,
							activeUsers: data.activeUsers || 0
						});
					});
				}
				return;
			}
			
			// 处理 liveStatus / live-status-changed 事件
			if (type === 'liveStatus' || type === 'live-status-changed') {
				console.log('📡 收到直播状态变更:', data);
				if (currentStreamId && data) {
					this.updateLiveStatus(currentStreamId, data);
				} else if (data) {
					// 如果没有 streamId，尝试更新所有流的状态
					console.log('📡 没有 streamId，尝试更新所有流');
					const isLive = data.isLive !== undefined ? data.isLive : (data.status === 'started' || data.status === 'running');
					this.liveStreams.forEach(stream => {
						this.updateLiveStatus(stream.id, {
							...data,
							isLive: isLive
						});
					});
				}
				return;
			}
		},
		
		updateLiveStatus(streamId, data) {
			const stream = this.liveStreams.find(s => s.id === streamId);
			if (stream) {
				const isLive = data.isLive !== undefined ? data.isLive : (data.status === 'started' || data.status === 'running');
				stream.isLive = isLive;
				if (data.activeUsers !== undefined) stream.activeUsers = data.activeUsers;
				this.$forceUpdate();
			}
		},
		
		// 启动服务重启检测定时器
		startServerRestartDetection() {
			// 每30秒检测一次服务是否重启
			this.serverRestartCheckTimer = setInterval(() => {
				this.checkServerRestart();
			}, 30000);
		},
		
		// 停止服务重启检测定时器
		stopServerRestartDetection() {
			if (this.serverRestartCheckTimer) {
				clearInterval(this.serverRestartCheckTimer);
				this.serverRestartCheckTimer = null;
			}
		},
		
		// 检测服务是否重启
		async checkServerRestart() {
			try {
				// 获取当前直播状态
				const dashboard = await apiService.getDashboard();
				const currentIsLive = dashboard?.isLive === true;
				
				// 如果之前有直播状态记录，但现在状态不一致，可能是服务重启了
				if (this.lastKnownLiveStatus !== null && this.lastKnownLiveStatus !== currentIsLive) {
					console.log('⚠️ 检测到服务状态变化:', {
						lastKnown: this.lastKnownLiveStatus,
						current: currentIsLive
					});
					
					// 如果之前是直播中，现在变成未直播，可能是服务重启了
					if (this.lastKnownLiveStatus === true && currentIsLive === false) {
						console.log('🔄 服务可能已重启，直播状态已重置');
						this.serverRestartDetected = true;
						
						// 显示提示
						uni.showModal({
							title: '服务已重启',
							content: '检测到服务器已重启，直播状态已重置。请返回后台管理重新开启直播。',
							showCancel: false,
							confirmText: '我知道了',
							success: () => {
								// 刷新列表
								this.refreshStreams();
							}
						});
					}
				}
				
				// 更新已知状态
				this.lastKnownLiveStatus = currentIsLive;
			} catch (error) {
				console.error('❌ 检测服务重启失败:', error);
			}
		}
	}
};
</script>

<style scoped>
/* Pop Art Styles */
.live-select-container {
	width: 100%;
	min-height: 100vh;
	display: flex;
	flex-direction: column;
	position: relative;
	box-sizing: border-box;
	background: #FFEB3B; /* Solid Yellow */
}

/* 自定义导航栏 */
.custom-navbar {
	position: fixed;
	top: 80rpx;
	left: 0;
	right: 0;
	height: 88rpx;
	background: #FFEB3B;
	border-bottom: 6rpx solid #FF0000;
	display: flex;
	align-items: center;
	justify-content: flex-start;
	z-index: 100;
	box-sizing: border-box;
	padding-top: env(safe-area-inset-top);
	padding-left: 40rpx;
}

.navbar-title {
	font-size: 42rpx;
	font-weight: 900;
	color: #FF0000;
	letter-spacing: 2rpx;
	text-shadow: 2rpx 2rpx 0 #0066FF;
}

/* Background */
.pop-bg {
	position: fixed;
	top: 0; left: 0; width: 100%; height: 100%;
	background-image: radial-gradient(#000 10%, transparent 11%);
	background-size: 30rpx 30rpx;
	opacity: 0.08;
	z-index: 0;
	pointer-events: none;
}


/* List Section */
.live-list-section {
	flex: 1;
	z-index: 10;
	padding: 30rpx 40rpx 140rpx 40rpx;
	margin-top: 210rpx;
	box-sizing: border-box;
	width: 100%;
}

.live-cards-container {
	display: flex;
	flex-direction: column;
	gap: 30rpx;
}

/* Cards */
.live-card {
	background: #FFF;
	border: 6rpx solid #000;
	padding: 20rpx;
	box-shadow: 10rpx 10rpx 0 #000;
	position: relative;
	transform: rotate(-1deg);
	margin-top: 5rpx;
	box-sizing: border-box;
	width: 100%;
}

.live-card:nth-child(even) {
	transform: rotate(1deg);
}

.live-card:active {
	transform: translate(4rpx, 4rpx);
	box-shadow: 6rpx 6rpx 0 #000;
}

.live-card.is-live {
	border-color: #000;
}

/* Status Badge */
.live-status-badge {
	display: inline-flex;
	align-items: center;
	gap: 10rpx;
	padding: 8rpx 20rpx;
	background: #000;
	color: #FFF;
	border: 4rpx solid #000;
	margin-bottom: 20rpx;
	transform: skew(-10deg);
}

.live-status-badge.live {
	background: #FF0000; /* Red */
	color: #FFF;
	border: 4rpx solid #000;
}

.status-dot { font-size: 20rpx; color: inherit; }
.status-text { font-size: 24rpx; font-weight: 700; }

/* Debate Info */
.debate-info {
	background: #0066FF; /* Blue */
	border: 4rpx solid #FF0000;
	padding: 16rpx;
	margin-bottom: 16rpx;
	box-shadow: 6rpx 6rpx 0 #FF0000;
}

.debate-title {
	display: block;
	color: #FFF;
	font-weight: 900;
	font-size: 28rpx;
	text-align: center;
	margin-bottom: 0;
	text-shadow: 2rpx 2rpx 0 #000;
}


/* 左右两方信息 */
.sides-info {
	display: flex;
	align-items: center;
	gap: 16rpx;
	margin-bottom: 16rpx;
}

.side-item {
	flex: 1;
	border: 4rpx solid #000;
	padding: 16rpx;
	box-shadow: 8rpx 8rpx 0 #000;
	text-align: center;
	transform: rotate(-1deg);
}

.side-item:nth-child(3) {
	transform: rotate(1deg);
}

.left-item {
	background: #FF0000;
}

.right-item {
	background: #0066FF;
}

.side-label {
	font-size: 24rpx;
	font-weight: 900;
	letter-spacing: 1rpx;
	display: block;
	color: #FFF;
	text-shadow: 2rpx 2rpx 0 #000;
	word-break: break-word;
	line-height: 1.4;
}

.vs-divider {
	font-size: 32rpx;
	font-weight: 900;
	color: #FF0000;
	text-align: center;
	min-width: 50rpx;
	text-shadow: 3rpx 3rpx 0 #000;
	letter-spacing: 1rpx;
}

/* Enter Button */
.enter-btn {
	background: #FFEB3B;
	border: 4rpx solid #FF0000;
	padding: 16rpx;
	display: flex;
	justify-content: center;
	align-items: center;
	gap: 10rpx;
	box-shadow: 6rpx 6rpx 0 #0066FF;
	font-weight: 900;
	font-size: 28rpx;
}

.enter-btn.disabled {
	background: #CCC;
	color: #666;
	box-shadow: none;
	border-color: #666;
}

.btn-icon-img { width: 30rpx; height: 30rpx; }

/* Footer */
.footer-section {
	position: fixed;
	bottom: 0; left: 0; right: 0;
	padding: 20rpx;
	background: #FFEB3B;
	border-top: 6rpx solid #FF0000;
	display: flex;
	justify-content: center;
}

.refresh-btn {
	background: #FFF;
	border: 4rpx solid #FF0000;
	padding: 16rpx 40rpx;
	box-shadow: 6rpx 6rpx 0 #0066FF;
	display: flex;
	align-items: center;
	gap: 10rpx;
	font-weight: 700;
}

.refresh-btn:active { transform: translate(2rpx, 2rpx); box-shadow: 4rpx 4rpx 0 #000; }
.refresh-icon-img { width: 30rpx; height: 30rpx; }

/* Loading / Empty */
.loading-container, .empty-container {
	display: flex; flex-direction: column; align-items: center; padding: 100rpx 0;
}
.loading-spinner {
	width: 60rpx; height: 60rpx; border: 6rpx solid #000; border-top-color: #FF0000; border-radius: 50%; animation: spin 1s linear infinite; margin-bottom: 20rpx;
}
@keyframes spin { to { transform: rotate(360deg); } }
.empty-text { font-size: 40rpx; font-weight: 900; margin-top: 20rpx; }
.empty-icon-img { width: 100rpx; height: 100rpx; opacity: 0.5; }
</style>
