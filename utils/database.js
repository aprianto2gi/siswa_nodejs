// const mysqli = require('mysql2');
// const pool = mysqli.createPool({
//     host: 'localhost',
//     user: 'root',
//     password: '',
//     database: 'node_student'
// })

// module.exports= pool.promise();
const Sequelize = require('sequelize');
const session = require('express-session');
const sessionStore = require('express-session-sequelize')(session.Store);

const sequelize = new Sequelize(`${process.env.namedatabase}`,`${process.env.dbusername}`,``,{dialect:`${process.env.dbengine}`,host: `${process.env.dbhost}`});

const sequelizeSessionStore= new sessionStore({
    db:sequelize //buat tabel session di db
});

module.exports={
    sequelize,
    sequelizeSessionStore
};