const express = require('express');
const router = express.Router();

const reportController = require('../../controllers/report/reportController');
const auth = require('../../middleware/auth');

router.get('/report',auth,reportController.getReport);

module.exports = router;