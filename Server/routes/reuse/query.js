const pool = require('../../mysql/pool/pool');

const sqlPoolPromise = (sql, params) => {
    return(
        new Promise((resolve, reject) => {
            pool.getConnection( (err,connection) => {
                if(err) {
                    reject('error');
                } else {
                    connection.query( sql ,params,(err, results) => {
                        connection.destroy();
        
                        if(err) {
                            reject(null);
                            
                        } else {
                            resolve(results);
                        }
                    })
                }
            });
        })
    )
} 

module.exports = sqlPoolPromise;