const assessmentModel = require('../../models/assessment/assessmentModel');
const studentModel = require('../../models/student/studentModel');
const io = require('../../socket');
const {validationResult}= require('express-validator');
const ITEMS_PER_PAGE=2;

exports.getIndex = (req,res,next)=>{
    const page= +req.query.page || 1;
    const limit= (page * ITEMS_PER_PAGE) - 2;
    let totalItems;

    let message = req.flash('success');
    if(message.length > 0){
        message= message[0];
    }else{
        message= null;
    }
    assessmentModel.findAndCountAll().then((NumberAssessment) => {
        totalItems= NumberAssessment.count;
        return assessmentModel.findAll({
            include:[{
                model: studentModel,
                attribute: ['name', 'clas', 'gender', 'nik', 'image', 'address']
            }],
            order:[
                ['id','DESC']
            ],
            limit: ITEMS_PER_PAGE,
            offset: limit
        }).then((results) => {
            //console.log(results); //untuk mendapatkan student_tbl yg akan dipakai di dlm perulangan assessment-list. cek nama table di model
            res.render('student/assessment-list',{
                title: "Assessment List",
                path: "/assessment",
                assessment: results,
                message: message,
                currentPage: page,
                hasNextPage: ITEMS_PER_PAGE * page < totalItems,
                hasPrevious:  page > 1,
                nextPage: page + 1,
                PreviousPage: page - 1,
                lastPage: Math.ceil(totalItems / ITEMS_PER_PAGE)
            })
        })
    })
    .catch((err) => {
        const error=new Error(err);
        error.httpStatusCode = 500;
        return next(err);
    });
}

exports.getAddassessment = (req,res,next)=>{
    studentModel.findAll().then((result) => {
        res.render('student/addAssessment',{
            title: "Add Assessment",
            path: '/assessment',
            student: result,
            edit: false,
            message:''
        })
    }).catch((err) => {
        const error=new Error(err);
        error.httpStatusCode = 500;
        return next(err);
    });
    
}

exports.postAddAssessment = async (req,res,next)=>{
    const i=req.body;
    const student_id=i.student_id;
    const score=i.score;
    const message= validationResult(req);
    if(!message.isEmpty()){
        const result= await studentModel.findAll() 
        return res.status(422).render('student/addAssessment',{
            title: "Add Assessment",
            path: '/assessment',
            student: result,
            edit: false,
            message: message.array()[0].msg
        })
    }
    assessmentModel.create({
        student_id: student_id,
        score: score
    }).then((result) => {
        assessmentModel.findByPk(result.id,{
            include:[{ //krn berelasi dgn student
                model: studentModel,
                attribute: ['id', 'name', 'clas', 'gender', 'nik', 'image', 'address']
            }]
        }).then((assessment)=>{ console.log(assessment);
            io.getIo().emit('assessment',{action:'create',assessment: assessment})
        })
        req.flash('success',"add success");
        res.redirect('/assessment');
    }).catch((err) => {
        const error=new Error(err);
        error.httpStatusCode = 500;
        return next(err);
    });
    
}

exports.getEditAssessment = (req,res,next)=>{
    const edit=req.query.edit;
    if(!edit){
       return res.redirect('/assessment');
    }
    const id= req.params.id;
    assessmentModel.findByPk(id, {
        include:[{ //krn berelasi dgn student jd pakai include
            model:studentModel,
            attribute: ['name', 'clas', 'gender', 'nik', 'image', 'address']
        }]
    }).then((result) => { //blm dpt beda pakai '(' result ')' atau gk
        return result;
    }).then((result) =>{
        studentModel.findAll().then((result2) => {
            res.render('student/addAssessment',{
                title: "Edit Assessment",
                path: '/assessment',
                assessment: result,
                student:result2,
                edit: true,
                message:''
            })
        });
    }).catch((err) => {
        const error=new Error(err);
        error.httpStatusCode = 500;
        return next(err);
    });
}

exports.postEditAssessment= async (req,res,next)=>{
    const i=req.body;
    const id=i.id;
    const student_id=i.student_id;
    const score=i.score;

    let message= validationResult(req);
    if(!message.isEmpty()){
        const result2 = await studentModel.findAll();
        const result = await assessmentModel.findByPk(id,{
            include:[{
                model:studentModel,
                attributes:['id','name','clas','nik','gender','image','address']
            }]
        })
        return res.status(422).render('student/addAssessment',{
            title: "Edit Assessment",
            path: '/assessment',
            assessment: result,
            student:result2,
            edit: true,
            message:message.array()[0].msg
        })
    }

    assessmentModel.findByPk(id).then((result) => {
        result.student_id=id;
        result.score=score;
        result.save();
    }).then(results=>{
        console.log("Berhasil diperbaharui");
        req.flash('success','update success');
        res.redirect('/assessment');
    }).catch((err) => {
        const error=new Error(err);
        error.httpStatusCode = 500;
        return next(err);
    });
}

exports.postDeleteAssessment= async (req,res,next)=>{
    //PROMISE
    // const id=req.body.id;
    // assessmentModel.findByPk(id).then((result) => {
    //     return result.destroy();
    // }).then(results=>{
    //     console.log("Berhasil Dihapus");
    //     req.flash('success','delete success');
    //     res.redirect('/assessment');
    // }).catch((err) => {
    //     console.log(err); 
    // });
    //ASYNC AWAIT
    const id= await req.body.id;
    const assessment= await assessmentModel.findByPk(id);
    assessment.destroy();
    try {
        console.log("Berhasil Dihapus");
        req.flash('success','delete success');
        res.redirect('/assessment');
    } catch (err) {
        const error=new Error(err);
        error.httpStatusCode = 500;
        return next(err);
    }
}