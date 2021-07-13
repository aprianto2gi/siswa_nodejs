exports.getIndex = (req,res,next)=>{
    res.render('student/assessment-list',{
        title: "Assessment List",
        path: "/assessment"
    })
}

exports.getAddassessment = (req,res,next)=>{
    res.render('student/addAssessment',{
        title: "Add Assessment",
        path: '/assessment'
    })
}

exports.postAddAssessment = (req,res,next)=>{
    
}