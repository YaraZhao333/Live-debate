const express = require('express');
const router = express.Router();
const aiController = require('../controllers/aiController');

// AI内容管理API路由
router.get('/admin/ai-content', aiController.getAIStatus);
router.get('/admin/ai-content/list', aiController.getAIContentList);
router.get('/admin/ai-content/:id', aiController.getAIContentById);
router.post('/admin/ai-content', aiController.addAIContent);
router.put('/admin/ai-content/:id', aiController.updateAIContent);
router.get('/admin/ai-content/:id/comments', aiController.getAIContentComments);
router.delete('/admin/ai-content/:id/comments/:commentId', aiController.deleteAIContentComment);

// V1 API路由
router.get('/v1/admin/ai-content/list', aiController.getFormattedAIContentList);
router.get('/v1/admin/ai-content/:id/comments', aiController.getFormattedAIContentComments);
router.delete('/v1/admin/ai-content/:id/comments/:commentId', aiController.deleteFormattedAIContentComment);

module.exports = router;