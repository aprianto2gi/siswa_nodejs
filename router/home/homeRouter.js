const express = require('express');
const router = express.Router();

const homeController = require('../../controllers/home/homeController');
const auth = require('../../middleware/auth');

router.get('/home',auth,homeController.getIndex);

module.exports = router;