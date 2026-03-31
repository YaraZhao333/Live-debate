const express = require('express');
const router = express.Router();
const liveController = require('../controllers/liveController');

// 直播控制API路由
router.post('/admin/live/control', liveController.adminControlLive);
router.post('/live/control', liveController.userControlLive);
router.post('/admin/live/schedule', liveController.setLiveSchedule);
router.get('/admin/live/schedule', liveController.getLiveSchedule);
router.post('/admin/live/schedule/cancel', liveController.cancelLiveSchedule);
router.get('/admin/live/status', liveController.getLiveStatus);
router.post('/admin/live/setup-and-start', liveController.setupAndStartLive);
router.get('/admin/live/viewers', liveController.getViewersCount);

module.exports = router;
