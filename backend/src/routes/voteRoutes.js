const express = require('express');
const router = express.Router();
const voteController = require('../controllers/voteController');

// 票数管理API路由
router.get('/votes', voteController.getVotes);
router.put('/votes', voteController.updateVotes);
router.post('/votes/add', voteController.addVotes);
router.post('/votes/reset', voteController.resetVotes);
router.get('/votes/statistics', voteController.getVotesStatistics);

module.exports = router;
