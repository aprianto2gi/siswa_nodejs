module.exports =(req,res,next)=>{
    const time=req.session.user;
    if(time){
        setTimeout(() =>{
            req.session.destroy((err)=>{
                console.log(err);
                console.log('session destroyed');
            })
        },10000*60*60);
    }
    next()
}