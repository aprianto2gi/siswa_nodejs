const express = require('express');
const router = express.Router();

const assessmentController = require('../../controllers/student/assessmentController');

router.get('/assessment', assessmentController.getIndex);
router.get('/assessment/add', assessmentController.getAddassessment);

router.post('/assessment-add',assessmentController.postAddAssessment);

module.exports = router;