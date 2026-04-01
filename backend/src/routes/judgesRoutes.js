const express = require('express');
const router = express.Router();
const judgesController = require('../controllers/judgesController');

router.get('/judges', judgesController.getJudges);
router.post('/judges', judgesController.saveJudges);

module.exports = router;
