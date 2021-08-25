const express = require('express');
const router = express.Router();
const {check}= require('express-validator');

const studentController = require('../../controllers/student/studentController');
const auth = require('../../middleware/auth');

router.get('/student-list',auth,studentController.getList);
router.get('/student-list/add',auth,studentController.getAddstudent);

router.post('/student-add',
check('name').isString().isLength({min:2}).withMessage('fill in the data correctly'),
check('clas').isLength({min:1}).withMessage('fill in the data correctly'),
auth,studentController.postAddStudent);

router.get('/student-list/:i',auth,studentController.getEditStudent);
router.post('/student-edit',
check('name').isString().isLength({min:2}).withMessage('fill in the data correctly'),
check('clas').isLength({min:1}).withMessage('fill in the data correctly'),
auth,studentController.postEditStudent);
router.delete('/student-delete/:id',auth,studentController.delStudent);

module.exports = router;