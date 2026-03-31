const express = require('express');
const router = express.Router();
const userVoteController = require('../controllers/userVoteController');

// 用户投票路由
router.post('/user-vote', userVoteController.userVote);
router.get('/user-votes', userVoteController.getUserVotes);

module.exports = router;
