const express = require('express');
const router = express.Router();

const assessmentController = require('../../controllers/student/assessmentController');

router.get('/assessment', assessmentController.getIndex);
router.get('/assessment/add', assessmentController.getAddassessment);

router.post('/assessment-add',assessmentController.postAddAssessment);
router.get('/assessment/:id',assessmentController.getEditAssessment);
router.post('/assessment-edit',assessmentController.postEditAssessment);
router.post('/assessment-delete',assessmentController.postDeleteAssessment);

module.exports = router;