const path = require('path');
const fs = require('fs'); //file system bawaan nodejs
const http = require('http');
const express = require('express');
const bodyParser = require('body-parser');
const session = require('express-session');
const sequelize = require( './utils/database');
const assessmentModel= require('./models/assessment/assessmentModel');
const studentModel = require('./models/student/studentModel');
const UserModel = require('./models/user/userModel');
const timer = require('./middleware/timeout');
const flash = require('connect-flash'); //message
const csrf = require('csurf'); //security
const multer = require('multer'); //upload file
const helmet = require('helmet'); //security respone
const compression = require('compression');
const morgan = require('morgan');


const app = express();
app.set('view engine','ejs'); //setting ejs
app.set('views','views'); //lupa buat apa //buat set views

const fileStorage = multer.diskStorage({
    destination: (req,file,callback) =>{
        callback(null,'images/student')
    },
    filename: (req,file,callback) =>{
        callback(null,Date.now()+'-'+file.originalname)
    }
});
const fileFilter=(req,file,callback) =>{
    if(file.mimetype === 'image/png' || file.mimetype === 'image/jpg' || file.mimetype === 'image/jpeg'){
        callback(null,true);
    }else{
        callback(null,false);
    }
};

const accesslog= fs.createWriteStream(path.join(__dirname,'accesslog.log'),{
    flags: 'a'
});

app.use(helmet()); //buat css di login & register tdk ke load
app.use(compression());
app.use(morgan('combined',{
    stream: accesslog
}));


app.use(bodyParser.urlencoded({extended:false}));
app.use(multer({storage:fileStorage,fileFilter:fileFilter}).single('image'));
const csrfProtection= csrf();

const errorController = require('./controllers/404/errorController');
// const routerStudent = require('./router/student');
const homeRouter = require('./router/home/homeRouter');
const studentRouter = require('./router/student/studentRouter');
const assessmentRouter = require('./router/student/assessmentRouter');
const loginRouter = require('./router/login/registerRouter');
const reportRouter = require('./router/report/reportRouter');
const socket = require('./socket');

app.use(express.static(path.join(__dirname,'public')));
app.use('/images',express.static(path.join(__dirname,'images'))); //static file utk images

app.use(
    session({
        secret:'my secret', 
        resave: false, 
        saveUninitialized: false,
        store: sequelize.sequelizeSessionStore,
        cookie: {maxAge: 10000*60*60}
    })
);
app.use(flash());
app.use(csrfProtection);
app.use(timer); //log out otomatis

app.use((req,res,next) => {
    res.locals.csrfToken= req.csrfToken();
    next()
})

// app.use(routerStudent);
app.use(homeRouter);
app.use(studentRouter);
app.use(assessmentRouter);
app.use(loginRouter);
app.use(reportRouter);

app.use(errorController.errorController);
app.use(errorController.errorController500);
app.use((error,req,res,next) => {
    res.status(500).render('500',{
        title:'An Error Has Occurred',
        path:'/500'
    })
})

assessmentModel.belongsTo(studentModel,{foreignKey:'student_id' ,constraints:true,onDelete:"CASCADE"});
studentModel.hasMany(assessmentModel,{foreignKey:'student_id'});

sequelize.sequelize.sync().then((result) => {
    const server= app.listen(process.env.PORT || 5000);
    const io = require('./socket').init(server);
    io.on('connection',socket=>{
        console.log('Client connected');
    })
}).catch((err) => {
    console.error(err);
});