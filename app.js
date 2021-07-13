const path = require('path')
const http = require('http');
const express = require('express');
const bodyParser = require('body-parser');

const app = express();
app.use(bodyParser.urlencoded({extended:false}));


// const routerStudent = require('./router/student');
const homeRouter = require('./router/home/homeRouter');
const studentRouter = require('./router/student/studentRouter');
const assessmentRouter = require('./router/student/assessmentRouter');
// app.use(routerStudent);
app.use(homeRouter);
app.use(studentRouter);
app.use(assessmentRouter);

app.set('view engine','ejs');
app.set('views','views');

app.use(express.static(path.join(__dirname,'public')));


const server = http.createServer(app);
server.listen(5000);