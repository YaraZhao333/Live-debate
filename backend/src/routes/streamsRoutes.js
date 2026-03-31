const express = require('express');
const router = express.Router();
const streamsController = require('../controllers/streamsController');

// 直播流管理API路由
router.get('/admin/streams', streamsController.getStreams);
router.get('/admin/streams/:id', streamsController.getStreamById);
router.post('/admin/streams', streamsController.createStream);
router.put('/admin/streams/:id', streamsController.updateStream);
router.delete('/admin/streams/:id', streamsController.deleteStream);
router.post('/admin/streams/:id/toggle', streamsController.toggleStream);
router.get('/admin/streams/:id/debate', streamsController.getStreamDebate);
router.post('/admin/streams/:id/debate', streamsController.updateStreamDebate);
router.delete('/admin/streams/:id/debate', streamsController.deleteStreamDebate);

// V1 API兼容路由
router.get('/v1/admin/streams', streamsController.getStreams);
router.get('/v1/admin/streams/:id', streamsController.getStreamById);
router.post('/v1/admin/streams', streamsController.createStream);
router.put('/v1/admin/streams/:id', streamsController.updateStream);
router.delete('/v1/admin/streams/:id', streamsController.deleteStream);
router.post('/v1/admin/streams/:id/toggle', streamsController.toggleStream);
router.get('/v1/admin/streams/:id/debate', streamsController.getStreamDebate);
router.post('/v1/admin/streams/:id/debate', streamsController.updateStreamDebate);
router.delete('/v1/admin/streams/:id/debate', streamsController.deleteStreamDebate);

// RTMP转HLS接口
router.get('/rtmp/urls', streamsController.getRtmpToHlsUrls);

module.exports = router;
