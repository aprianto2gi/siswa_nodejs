exports.getIndex = (req,res,next)=>{
    res.render('home/index',{
        title:'home',
        path: '/'
    })
}