const express = require('express');
const router = express.Router();

const studentController = require('../../controllers/student/studentController');

router.get('/student-list',studentController.getList);
router.get('/student-list/add',studentController.getAddstudent);

router.post('/student-add',studentController.postAddStudent);

router.get('/student-list/:i',studentController.getEditStudent);
router.post('/student-edit',studentController.postEditStudent);
router.post('/student-delete',studentController.delStudent);

module.exports = router;