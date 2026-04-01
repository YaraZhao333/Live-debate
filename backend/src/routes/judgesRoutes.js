const express = require('express');
const router = express.Router();
const judgesController = require('../controllers/judgesController');

router.get('/admin/judges', judgesController.getJudges);
router.post('/admin/judges', judgesController.saveJudges);

module.exports = router;
