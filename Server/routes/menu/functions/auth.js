const jwt = require('jsonwebtoken'); // 1
const secretkey = require('../../../auth/secretkey'); // 1

// MAKE THIS A UNIVERSAL FUNCTION chekc if TOKEN FORMAT IS GOOD
// 1
const jwtPromise = (token, secretkey) => {
    return (
        new Promise((resolve, reject) => {

                jwt.verify(token, secretkey, function(err, decoded) {  

                    if(decoded){
                        resolve(decoded)
                    } else {
                        reject('error')
                    }
                })
            

        })
    )
}

const pool = require('../../../mysql/pool/pool');
const sql =  require('../../../mysql/queries/accounts/Login')

const sqlPoolPromise = (sql, params) => {
    return(
        new Promise((resolve, reject) => {
            pool.getConnection( (err,connection) => {
                if(err) {
                    reject('error');
                } else {
                    connection.query( sql ,params,(err, results) => {
                        connection.destroy();  // Destoy query
        
                        if( err  ) {
                            reject('error');
                        } else {
                            resolve(results);
                        }
                    })
                }
            });  
        })
    )
} 

const initialize = async(token, res) => {
    let response ;
    let sql_response ;
    let error  = false

    if(token && token.split(" ")[1] && token.split(" ")[0] === 'Bearer') {
        // Verify token final step
        token = token.split(" ")[1]
    } else {
        error =  true
    }

    // decode TOKEN
    try{
        response =  await jwtPromise(token, secretkey);
    } catch(err) {
        error =  true
    }  
    

    
    // CEHCK if token is BLACK LIST IN DB
    try{
        sql_response =  await sqlPoolPromise(sql.select_blacklist_token_all,[token,response.id])
    } catch(err) {
        
        error =  true
    }


    try{
        const sql = require('../../../mysql/queries/menu/main')

        response.user_type_id === 'ADMIN' ?
            sql_response =  await sqlPoolPromise(sql.select_admin_main_menu,[response.id]): 
            sql_response =  await sqlPoolPromise(sql.select_user_main_menu, [response.id]);

        
        
    } catch(err){
        error =  true
    }

    error? 
    res.sendStatus(404):   
    res.json({msg:'auth', user_type: response.user_type_id,data:sql_response})

}
const deny = (res) => res.json({msg: 'denied'});

module.exports = initialize