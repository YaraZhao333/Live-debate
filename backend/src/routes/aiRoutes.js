const express = require('express');
const router = express.Router();
const aiController = require('../controllers/aiController');

// AI控制API路由
router.post('/admin/ai/start', aiController.startAI);
router.post('/admin/ai/stop', aiController.stopAI);
router.post('/admin/ai/toggle', aiController.toggleAI);

// AI内容管理API路由
router.get('/admin/ai-content', aiController.getAIStatus);
router.get('/admin/ai-content/list', aiController.getAIContentList);
router.get('/admin/ai-content/:id', aiController.getAIContentById);
router.post('/admin/ai-content', aiController.addAIContent);
router.put('/admin/ai-content/:id', aiController.updateAIContent);
router.get('/admin/ai-content/:id/comments', aiController.getAIContentComments);
router.delete('/admin/ai-content/:id/comments/:commentId', aiController.deleteAIContentComment);

module.exports = router;
