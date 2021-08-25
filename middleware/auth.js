module.exports = (req,res,next) => {
    const auth = req.session.isLogedIn;
    if(auth){
        return next()
    }
    return res.redirect('/');
}