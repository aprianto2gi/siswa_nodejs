exports.errorController=(req,res,next) => {
    res.status(404).render('404',{
        title:'Page not found',
        path:'/404'
    })
}

exports.errorController500=(req,res,next)=>{
    res.status(500).render('500',{
        title:'An Error Has Occurred',
        path:'/500'
    })
}