const mysqli = require('mysql2');
const pool = mysqli.createPool({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'node_student'
})

module.exports= pool.promise();