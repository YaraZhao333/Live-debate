const express = require('express');
const router = express.Router();
const commentController = require('../controllers/commentController');

// 评论和点赞路由
router.post('/comment', commentController.addComment);
router.delete('/comment/:commentId', commentController.deleteComment);
router.post('/like', commentController.like);

module.exports = router;
