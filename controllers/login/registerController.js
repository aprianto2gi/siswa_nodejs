const userModel= require('../../models/user/userModel');
const bcrypt= require('bcryptjs');
const {validationResult} = require('express-validator');

exports.getRegister=(req,res,next)=>{
    res.render('login/register',{
        pageTitle: 'Register',
        path     : '/register',
        error :''
    })
}

exports.getIndex= async (req,res,next)=>{ // async await membatasi non block
    let message= await req.flash('error');
    if(message.length>0){
        message=message[0]
    }else{
        message=null
    }
    res.render('login/index',{
        pageTitle: 'Login',
        path     : '/login',
        error: message
    })
}

exports.postLogin=(req,res,next)=>{
    const email=req.body.email;
    const password=req.body.password;
    userModel.findAll({where: {email: email},
        attributes: [
            'id',
            'name',
            'email',
            'password'
        ]
    }).then((user) => {
       if(user.length<1){
           req.flash('error','Invalid email');
           return res.redirect('/');
       }
       bcrypt.compare(password,user[0].password).then(Match=>{
           if(Match){
               req.session.isLogedIn= true;
               req.session.user= user;
               return req.session.save(err=>{
                   console.log(err);
                   res.redirect('/home');
               })
           }
           req.flash('error','Invalid password');
           return res.redirect('/');
       })
    }).catch((err) => {
        const error=new Error(err);
        error.httpStatusCode = 500;
        return next(err);
    });

}

exports.postRegister=(req,res,next)=>{
    const name = req.body.name;
    const email = req.body.email;
    const password = req.body.password;
    const message= validationResult(req);
    if(!message.isEmpty()){
        //console.log(message.array()[0].msg);
        return res.status(422).render('login/register',{
            pageTitle: 'Register',
            path     : '/register',
            error : message.array()[0].msg
        })
    }
    userModel.findAll({
        where:{email:email},
        attribute:[
            'id','name','email','password'
        ]
    }).then((user) => {
        if(user.length>0){
            return res.redirect('/register');
        }
        bcrypt.hash(password,12).then((hashPassword) => {
            userModel.create({
                name:name,
                email:email,
                password:hashPassword
            })
        }).then(result => {
            return res.redirect('/');
        })
    }).catch((err) => {
        const error=new Error(err);
        error.httpStatusCode = 500;
        return next(err);
    });
}

exports.postlogout=(req,res,next) => {
    req.session.destroy(err=>{
        console.log(err);
        res.redirect('/');
    });
}