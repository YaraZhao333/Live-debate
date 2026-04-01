const express = require('express');
const router = express.Router();
const streamDetailController = require('../controllers/streamDetailController');

router.get('/streams/detail', streamDetailController.getStreamDetail);
router.get('/stream/detail', streamDetailController.getStreamDetail);                                       

module.exports = router;
