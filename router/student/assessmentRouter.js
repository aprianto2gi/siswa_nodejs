const express = require('express');
const router = express.Router();
const {check}= require('express-validator');

const assessmentController = require('../../controllers/student/assessmentController');
const auth = require('../../middleware/auth');

router.get('/assessment',auth, assessmentController.getIndex);
router.get('/assessment/add', auth, assessmentController.getAddassessment);

router.post('/assessment-add',check('score').isLength({min:1}).withMessage('value required'),auth,assessmentController.postAddAssessment);
router.get('/assessment/:id',auth,assessmentController.getEditAssessment);
router.post('/assessment-edit',check('score').isLength({min:1}).withMessage('value required'),auth,assessmentController.postEditAssessment);
router.post('/assessment-delete',auth,assessmentController.postDeleteAssessment);

module.exports = router;