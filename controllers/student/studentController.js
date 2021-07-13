const studentModel = require('../../models/student/studentModel');

exports.getList = (req,res,next)=>{
    studentModel.fetchAll(student=>{
        //console.log(student);
        res.render('student/student-list',{
            title: "Student List",
            path: '/student-list',
            student: student
        })
    })
}

exports.getAddstudent=(req,res,next)=>{
    res.render('student/addStudent',{
        title: "Add Student",
        path: '/student-list',
        edit: false
    })
}

exports.postAddStudent=(req,res,next)=>{
    const i=req.body;
    const name= i.name;
    const clas= i.clas;
    const nik= i.nik;
    const image= i.image;
    const gender= i.gender;
    const address= i.address; const id=null;
    const Student = new studentModel(id,name,clas,nik,image,gender,address);
    Student.save(); res.redirect('/student-list');
}

exports.getEditStudent=(req,res,next)=>{
    const edit = req.query.edit;
    if(!edit){
        res.redirect('/');
    }
    const id= req.params.i;
    studentModel.FindById(id,student=>{
        res.render('student/addStudent',{
            title: "Edit Student",
            path: '/student-list',
            student: student,
            edit: true
        })
    })
}

exports.postEditStudent=(req,res,next)=>{
    const i=req.body;
    const id= i.id;
    const name= i.name;
    const clas= i.clas;
    const nik= i.nik;
    const image= i.image;
    const gender= i.gender;
    const address= i.address;
    const Student = new studentModel(id,name,clas,nik,image,gender,address);
    Student.save(); res.redirect('/student-list');
}

exports.delStudent=(req,res,next)=>{
    const id=req.body.id;
    studentModel.deleteStudent(id);
    res.redirect('/student-list');
}