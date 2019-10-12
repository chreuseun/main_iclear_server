const mysql = require('mysql');

const pool  = mysql.createPool({
    connectionLimit : 10,
    host            : 'localhost',
    user            : 'dev',
    password        : 'devPASS',
    database        : 'iclear_svms_db',
    multipleStatements: true
});

module.exports = pool;