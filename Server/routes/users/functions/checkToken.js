const pool = require('../../../mysql/pool/pool.js');
const jwt = require('jsonwebtoken');
const secretkey = require('../../../auth/secretkey');
const _sql = require('../../../mysql/queries/accounts/Login')


isLoggedIn = ({headers, res}) => {
    
    token = headers 

    // VALID token step 1
    if(token && token.split(" ")[1] && token.split(" ")[0] === 'Bearer') {
        // Verify token final step
        token = token.split(" ")[1]

        jwt.verify(token, secretkey, function(err, decoded) {  

            if(decoded){
                arg = {
                    pool,
                    res,
                    _sql,
                    params : [token,decoded.id],
                    decoded
                } 
                mainPool(arg)
            } else {
                console.log('>  err : ' + err)

                deny(res)
            }
        });
    } else {
        deny(res)
    }
    // TOKEN CHECKING =========================================
}

deny = (res) => res.json({msg: 'denied'})

mainPool  = ({pool,res, _sql, params, decoded} ) => {

    pool.getConnection( (err,connection) => {

        if(err) {
            deny(res)  
        } else {
            connection.query( _sql.select_blacklist_token_all,params,(err, results) => {
                connection.destroy();  // Destoy query

                if( err || results.length === 0 || results[0].is_token === 'DENY' ) {
                    deny(res)
                } else {
                    res.json({msg:'auth', user_details:decoded})
                }
            })
        }
    });
},

module.exports = isLoggedIn;
