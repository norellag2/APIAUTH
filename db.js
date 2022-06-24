const mysql = require ('mysql2');

const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '2mas2cuatro',
    database: 'app'
})


module.exports = connection;