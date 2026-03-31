const express = require('express');
const router = express.Router();
const liveController = require('../controllers/liveController');

// 直播控制API路由
router.get('/admin/dashboard', liveController.getDashboard);
router.post('/admin/live/start', liveController.startLive);
router.post('/admin/live/stop', liveController.stopLive);
router.post('/admin/live/update-votes', liveController.updateVotes);
router.post('/admin/live/reset-votes', liveController.resetVotes);
router.post('/admin/live/broadcast-viewers', liveController.broadcastViewers);
router.post('/admin/live/control', liveController.adminControlLive);
router.post('/live/control', liveController.userControlLive);
router.post('/admin/live/schedule', liveController.setLiveSchedule);
router.get('/admin/live/schedule', liveController.getLiveSchedule);
router.post('/admin/live/schedule/cancel', liveController.cancelLiveSchedule);
router.get('/admin/live/status', liveController.getLiveStatus);
router.post('/admin/live/setup-and-start', liveController.setupAndStartLive);
router.get('/admin/live/viewers', liveController.getViewersCount);

module.exports = router;
