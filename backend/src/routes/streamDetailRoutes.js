const express = require('express');
const router = express.Router();
const streamDetailController = require('../controllers/streamDetailController');

router.get('/admin/streams/detail', streamDetailController.getStreamDetail);
router.get('/admin/stream/detail', streamDetailController.getStreamDetail);

module.exports = router;
