const mysql = require('mysql');

var pool = mysql.createPool({
    "user": proccess.env.MYSQL_USER,
    "password": proccess.env.MYSQL_PASSWORD,
    "database": proccess.env.MYSQL_DATABASE,
    "host": proccess.env.MYSQL_HOST,
    "port": proccess.env.MYSQL_PORT
});

exports.pool = pool;