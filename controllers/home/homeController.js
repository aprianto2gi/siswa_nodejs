exports.getIndex = (req,res,next)=>{
    console.log(req.session.user[0].email);
    res.render('home/index',{
        title:'home',
        path: '/'
    })
}