const assessmentModel = require('../../models/assessment/assessmentModel');
const studentModel = require('../../models/student/studentModel');

exports.getIndex = (req,res,next)=>{
    assessmentModel.fetchAll().then(([results]) => {
        res.render('student/assessment-list',{
            title: "Assessment List",
            path: "/assessment",
            assessment: results
        })
    }).catch((err) => {
        console.error(err);
    });
}

exports.getAddassessment = (req,res,next)=>{
    studentModel.fetchAll().then(([result]) => {
        res.render('student/addAssessment',{
            title: "Add Assessment",
            path: '/assessment',
            student: result,
            edit: false
        })
    }).catch((err) => {
        console.log(err);
    });
    
}

exports.postAddAssessment = (req,res,next)=>{
    const i=req.body;
    const student_id=i.student_id;
    const score=i.score;
    const assessment = new assessmentModel(null,student_id,score);
    assessment.save().then((result) => {
        res.redirect('/assessment');
    }).catch((err) => {
        console.log(err); 
    });
}

exports.getEditAssessment = (req,res,next)=>{
    const edit=req.query.edit;
    if(!edit){
       return res.redirect('/assessment');
    }
    const id= req.params.id;
    assessmentModel.findById(id).then(([result]) => {
        return result[0];
    }).then(result =>{
        studentModel.fetchAll().then(([result2]) => {
            res.render('student/addAssessment',{
                title: "Edit Assessment",
                path: '/assessment',
                assessment: result,
                student:result2,
                edit: true
            })
        });
    }).catch((err) => {
        console.log(err);
    });
}

exports.postEditAssessment=(req,res,next)=>{
    const i=req.body;
    const id=i.id;
    const student_id=i.student_id;
    const score=i.score;
    const assessment = new assessmentModel(id,student_id,score);
    assessment.save().then((result) => {
        res.redirect('/assessment');
    }).catch((err) => {
        console.log(err); 
    });
}

exports.postDeleteAssessment=(req,res,next)=>{
    const id=req.body.id;
    assessmentModel.deleteById(id).then((result) => {
        res.redirect('/assessment');
    }).catch((err) => {
        console.log(err);
    });
}