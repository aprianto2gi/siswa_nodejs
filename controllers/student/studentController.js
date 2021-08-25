const studentModel = require('../../models/student/studentModel');
const {validationResult}= require('express-validator');
const io= require('../../socket');
const deleteFile= require('../../utils/file');
const ITEMS_PER_PAGE= 2; //jumlah data per page

exports.getList = (req,res,next)=>{
    const page= +req.query.page || 1;
    const limit=(page * ITEMS_PER_PAGE)-2;
    let totalItems;
    let message = req.flash('success');
    if(message.length>0){
        message= message[0]
    }else{
        message= null
    }

    studentModel.findAndCountAll().then((result) => {
        totalItems=result.count;
        return studentModel.findAll({
            limit: ITEMS_PER_PAGE,
            offset: limit,
            order:[
                ['id','DESC']
            ]
        })
    })
    .then((rows) => {
        res.render('student/student-list',{
            title: "Student List",
            path: '/student-list',
            student: rows,
            message: message,
            currentPage: page,
            hasNextPage: ITEMS_PER_PAGE * page < totalItems,
            hasPrevious:  page > 1,
            nextPage: page + 1,
            PreviousPage: page - 1,
            lastPage: Math.ceil(totalItems / ITEMS_PER_PAGE)
        })
    }).catch((err) => {
        const error=new Error(err);
        error.httpStatusCode = 500;
        return next(err);
    });
    
}

exports.getAddstudent=(req,res,next)=>{
    res.render('student/addStudent',{
        title: "Add Student",
        path: '/student-list',
        edit: false,
        message:''
    })
}

exports.postAddStudent=(req,res,next)=>{
    const i=req.body;
    const name= i.name;
    const clas= i.clas;
    const nik= i.nik;
    const image= req.file;
    const gender= i.gender;
    const address= i.address; const id=null;
    if(!image){
        return res.status(422).render('student/addStudent',{
            title: "Add Student",
            path: '/student-list',
            edit: false,
            message: message.array()[0].msg
        })
    }
    let message= validationResult(req);
    if(!message.isEmpty()){
        return res.status(422).render('student/addStudent',{
            title: "Add Student",
            path: '/student-list',
            edit: false,
            message:message.array()[0].msg
        })
    }
    const imgUrl=image.path;
    studentModel.create({ 
        name:name,
        clas:clas,
        nik:nik,
        image:imgUrl,
        gender:gender,
        address:address
    }).then((result) => {
        io.getIo().emit('create',{action:'create',student:result})
        req.flash('success','add success');
        res.redirect("/student-list");
    }).catch((err) => {
        const error=new Error(err);
        error.httpStatusCode = 500;
        return next(err);
    });
    
}

exports.getEditStudent=(req,res,next)=>{
    const edit = req.query.edit;
    if(!edit){
        res.redirect('/');
    }
    const id= req.params.i;
    //studentModel.findByPk(id).then((result) => { //pencarian berdasarkan primary
    studentModel.findAll({where:{id:id}}).then((result) => {
        res.render('student/addStudent',{
            title: "Edit Student",
            path: '/student-list',
            student: result[0],
            // student: result, //findByPk
            edit: true,
            message:''
        })
    }).catch((err) => {
        const error=new Error(err);
        error.httpStatusCode = 500;
        return next(err);
    });
}

exports.postEditStudent= async (req,res,next)=>{
    const i=req.body;
    const id= i.id;
    const name= i.name;
    const clas= i.clas;
    const nik= i.nik;
    const image= req.file;
    const gender= i.gender;
    const address= i.address;
    let message= validationResult(req);
    if(!message.isEmpty()){
        const student= await studentModel.findByPk(id)
            return res.status(422).render('student/addStudent',{
                title: "Edit Student",
                path: '/student-list',
                student: student,
                edit: true,
                message:message.array()[0].msg
            
        });
    }
    studentModel.findByPk(id).then((result) => {
        result.name=name;
        result.clas=clas;
        result.nik=nik;
        if(image){
            deleteFile.deletefile(result.image);
            result.image = image.path;
        }
        result.gender= gender;
        result.address= address;
        return result.save();
    }).then((results)=>{
        console.log("Update");
        req.flash('success', 'update success');
        res.redirect('/student-list');
    }).catch((err) => {
        const error=new Error(err);
        error.httpStatusCode = 500;
        return next(err);
    });
}

exports.delStudent= async (req,res,next)=>{
    const id=req.params.id;
    const student= await studentModel.findByPk(id);
    try {
        if(!student){
            return next(new Error('student not found'));
        }
        deleteFile.deletefile(student.image);
        student.destroy();
        //req.flash('success','delete success');    
        res.status(200).json({message: 'delete success'})
        //res.redirect("/student-list");
    } catch (err) {
        const error=new Error(err);
        res.status(500).json({message: 'delete failed'})
    }
    
}