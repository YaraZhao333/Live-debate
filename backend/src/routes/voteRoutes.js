const express = require('express');
const router = express.Router();
const voteController = require('../controllers/voteController');

// 票数管理API路由
router.get('/admin/votes', voteController.getVotes);
router.put('/admin/votes', voteController.updateVotes);
router.post('/admin/votes/reset', voteController.resetVotes);

// V1 API兼容路由
router.get('/v1/admin/votes', voteController.getVotes);
router.put('/v1/admin/votes', voteController.updateVotes);
router.post('/v1/admin/votes/reset', voteController.resetVotes);

module.exports = router;