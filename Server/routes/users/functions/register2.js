const jwt = require('jsonwebtoken');
const secretkey = require('../../../auth/secretkey');

// AWAIT
const jwtVerify = (token) => {
    return(
        new Promise((resolve, reject) => {

            if(token && token.split(" ")[1] && token.split(" ")[0] === 'Bearer') {

                // Verify token final step
                token = token.split(" ")[1]; 
        
                jwt.verify(token, secretkey, function(err, decoded) {
                    if(decoded) {
                        resolve({token, decoded})
                    } else {
                        reject('error') 
                    }
                })
            } else {
                reject('error')
            }
        })
    )
}

const pool = require('../../../mysql/pool/pool');

const sqlPoolPromise = (sql, params) => {
    return(
        new Promise((resolve, reject) => {
            pool.getConnection( (err,connection) => {
                if(err) {
                    reject(err);
                } else {
                    connection.query( sql ,params,(err, results) => {
                        connection.destroy();  // Destoy query
        
                        if( err  ) {
                            reject(err);
                        } else {
                            resolve(results);
                        }
                    })
                }
            });  
        })
    )
} 

const promisRegister = async ({res, token, insertParams}) => {
    let error  = false;    
    let jwtResult;
    let sqlResult;

    try{
        jwtResult = await jwtVerify(token)
    } catch(err) {
        error  = true;   
    }

    if(!jwtResult) {
        error  = true;     
    }

    // <AUTH QUERY>
    try{
        let sql =  require('../../../mysql/queries/accounts/Login');
        sqlResult = await sqlPoolPromise(sql.select_blacklist_token, [jwtResult.token,jwtResult.decoded.id]);
    } catch(err) {
        error  = true;   
    }


    if(!sqlResult) {
        error  = true;   
    }

    // <INSERT QUERY>
    try {
        let sql =  require('../../../mysql/queries/accounts/Login');
        sqlResult = await sqlPoolPromise(sql.insert_new_user, insertParams);
    } catch(err) {
        error  = true;   
    
    }



    error ? 
        res.sendStatus(404) : 
        res.json({sqlResult})
}

module.exports = promisRegister;

// REQUIREMENTS FOR INSERTING

/*
1. req.body.headers.authorization 
2. sql for INSERT
3. res 
*/