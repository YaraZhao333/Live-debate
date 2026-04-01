const express = require('express');
const router = express.Router();
const streamsController = require('../controllers/streamsController');

// 直播流管理API路由
router.get('/streams', streamsController.getStreams);

// 流详情接口
router.get('/streams/detail', streamsController.getStreamDetail);

// 其他直播流管理API路由
router.get('/streams/:id', streamsController.getStreamById);
router.post('/streams', streamsController.createStream);
router.put('/streams/:id', streamsController.updateStream);
router.delete('/streams/:id', streamsController.deleteStream);
router.post('/streams/:id/toggle', streamsController.toggleStream);
router.get('/streams/:id/debate', streamsController.getStreamDebate);
router.post('/streams/:id/debate', streamsController.updateStreamDebate);
router.delete('/streams/:id/debate', streamsController.deleteStreamDebate);

// RTMP转HLS接口
router.get('/rtmp/urls', streamsController.getRtmpToHlsUrls);

module.exports = router;
