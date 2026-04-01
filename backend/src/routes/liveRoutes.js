const express = require('express');
const router = express.Router();
const liveController = require('../controllers/liveController');

// 直播控制API路由
router.get('/dashboard', liveController.getDashboard);
router.post('/live/start', liveController.startLive);
router.post('/live/stop', liveController.stopLive);
router.post('/live/update-votes', liveController.updateVotes);
router.post('/live/reset-votes', liveController.resetVotes);
router.post('/live/broadcast-viewers', liveController.broadcastViewers);
router.post('/live/control', liveController.adminControlLive);
router.post('/live/user-control', liveController.userControlLive);
router.post('/live/schedule', liveController.setLiveSchedule);
router.get('/live/schedule', liveController.getLiveSchedule);
router.post('/live/schedule/cancel', liveController.cancelLiveSchedule);
router.get('/live/status', liveController.getLiveStatus);
router.post('/live/setup-and-start', liveController.setupAndStartLive);
router.get('/live/viewers', liveController.getViewersCount);

module.exports = router;
