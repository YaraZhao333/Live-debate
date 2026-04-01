// ===============================
// 全局状态（你可以换成数据库）
// ===============================
let liveStatus = "stopped"; // running | stopped
let aiStatus = "stopped";
let currentStreamId = null;
let viewersCount = 0;
let voteData = { left: 0, right: 0 };
let liveSchedule = null;

// ===============================
// 工具函数：统一成功响应
// ===============================
function ok(message, data = {}) {
  return { code: 0, message, data };
}

// 工具函数：统一失败响应
function fail(message) {
  return { code: -1, message, data: null };
}

// ===============================
// 控制器开始
// ===============================
module.exports = {

  // ===============================
  // 1. 获取后台 Dashboard 信息
  // ===============================
  getDashboard: (req, res) => {
    res.json(ok("ok", {
      liveStatus,
      aiStatus,
      currentStreamId,
      viewersCount,
      voteData,
      timestamp: Date.now()
    }));
  },

  // ===============================
  // 2. 开始直播
  // ===============================
  startLive: (req, res) => {
    try {
      const { streamId, autoStartAI } = req.body;

      if (!streamId) {
        return res.json(fail("缺少 streamId"));
      }

      console.log("🚀 开始直播:", streamId);

      currentStreamId = streamId;
      liveStatus = "running";
      aiStatus = autoStartAI ? "running" : "stopped";

      return res.json(ok("直播已开始", {
        streamId,
        liveStatus,
        aiStatus,
        timestamp: Date.now()
      }));

    } catch (err) {
      console.error("❌ startLive 错误:", err);
      return res.json(fail("服务器内部错误"));
    }
  },

  // ===============================
  // 3. 停止直播
  // ===============================
  stopLive: (req, res) => {
    liveStatus = "stopped";
    aiStatus = "stopped";
    currentStreamId = null;

    return res.json(ok("直播已停止", {
      liveStatus,
      aiStatus
    }));
  },

  // ===============================
  // 4. 获取直播状态
  // ===============================
  getLiveStatus: (req, res) => {
    res.json(ok("ok", {
      liveStatus,
      aiStatus,
      currentStreamId,
      timestamp: Date.now()
    }));
  },

  // ===============================
  // 5. 更新投票
  // ===============================
  updateVotes: (req, res) => {
    const { side } = req.body;

    if (side !== "left" && side !== "right") {
      return res.json(fail("side 必须是 left 或 right"));
    }

    voteData[side] += 1;

    res.json(ok("投票成功", voteData));
  },

  // ===============================
  // 6. 重置投票
  // ===============================
  resetVotes: (req, res) => {
    voteData = { left: 0, right: 0 };
    res.json(ok("投票已重置", voteData));
  },

  // ===============================
  // 7. 广播观看人数（模拟）
  // ===============================
  broadcastViewers: (req, res) => {
    viewersCount = Math.floor(Math.random() * 200);
    res.json(ok("观看人数已更新", { viewersCount }));
  },

  // ===============================
  // 8. 管理员控制直播（暂停/继续等）
  // ===============================
  adminControlLive: (req, res) => {
    const { action } = req.body;

    if (action === "pause") liveStatus = "paused";
    else if (action === "resume") liveStatus = "running";
    else return res.json(fail("未知 action"));

    res.json(ok("操作成功", { liveStatus }));
  },

  // ===============================
  // 9. 用户控制直播（点赞等）
  // ===============================
  userControlLive: (req, res) => {
    res.json(ok("用户操作成功"));
  },

  // ===============================
  // 10. 设置直播计划
  // ===============================
  setLiveSchedule: (req, res) => {
    liveSchedule = req.body;
    res.json(ok("直播计划已设置", liveSchedule));
  },

  // ===============================
  // 11. 获取直播计划
  // ===============================
  getLiveSchedule: (req, res) => {
    res.json(ok("ok", liveSchedule || {}));
  },

  // ===============================
  // 12. 取消直播计划
  // ===============================
  cancelLiveSchedule: (req, res) => {
    liveSchedule = null;
    res.json(ok("直播计划已取消"));
  },

  // ===============================
  // 13. 一键配置并开始直播
  // ===============================
  setupAndStartLive: (req, res) => {
    const { streamId } = req.body;

    if (!streamId) return res.json(fail("缺少 streamId"));

    liveStatus = "running";
    aiStatus = "running";
    currentStreamId = streamId;

    res.json(ok("直播已配置并开始", {
      streamId,
      liveStatus,
      aiStatus
    }));
  },

  // ===============================
  // 14. 获取观看人数
  // ===============================
  getViewersCount: (req, res) => {
    res.json(ok("ok", { viewersCount }));
  }
};
