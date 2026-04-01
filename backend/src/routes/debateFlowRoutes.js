const express = require('express');
const router = express.Router();
const debateFlowController = require('../controllers/debateFlowController');

router.get('/admin/debate-flow', debateFlowController.getDebateFlow);
router.post('/admin/debate-flow', debateFlowController.saveDebateFlow);
router.post('/admin/debate-flow/control', debateFlowController.controlDebateFlow);

module.exports = router;
