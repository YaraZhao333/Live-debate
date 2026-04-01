const express = require('express');
const router = express.Router();
const debateFlowController = require('../controllers/debateFlowController');

router.get('/debate-flow', debateFlowController.getDebateFlow);
router.post('/debate-flow', debateFlowController.saveDebateFlow);
router.post('/debate-flow/control', debateFlowController.controlDebateFlow);

module.exports = router;
