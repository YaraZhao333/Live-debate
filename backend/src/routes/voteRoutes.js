const express = require('express');
const router = express.Router();
const voteController = require('../controllers/voteController');
const mockService = require('../services/mockService');

// 票数管理API路由
router.get('/votes', (req, res) => {
  const votes = mockService.votes.get();
  res.json({ code: 0, message: 'success', data: votes });
});
router.get('/votes', voteController.getVotes);
router.put('/votes', voteController.updateVotes);
router.post('/votes/reset', voteController.resetVotes);
router.get('/votes/statistics', voteController.getVotesStatistics);

module.exports = router;
