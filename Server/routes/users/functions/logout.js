logout = ( {headers, jwt,secretkey , res, pool, _sql}) => {
    // TOKEN CHECKING =========================================
    token = headers 
    // VALID token step 1
    if(token && token.split(" ")[1] && token.split(" ")[0] === 'Bearer') {
        // Verify token final step
        token = token.split(" ")[1]

        jwt.verify(token, secretkey, function(err, decoded) {  

            if(decoded){
                 args = {
                    pool,
                    res,
                    _sql,
                    params: [token,decoded.id]
                }

                // insertBlacklist(args)

                mainLogout(args)

            } else {
                deny(res)
            }
        });
    } else {
        deny(res)
    }
    // TOKEN CHECKING =========================================
}

deny = (res) => res.json({msg: 'denied'})

mainLogout  = ({pool,res, _sql, params} ) => {
    
    pool.getConnection( (err,connection) => {

        if(err) {
            deny(res)  
        } else {
            connection.query( _sql.select_blacklist_token_all, params, (err, results) => {
                connection.destroy();  // Destoy query

                if( err || results.length === 0 || results[0].is_token === 'DENY' ) {
                    res.json({msg:"logout success"})
                    
                } else {

                    args = {
                        pool,
                        res,
                        _sql,
                        params
                        
                    }

                    insertBlacklist(args)                    
                }
            })
        }
    });
},

insertBlacklist = ({pool, _sql, params, res}) => {
    pool.getConnection( (err,connection) => {
        if(err) {
            deny(res)             
        } else {
            connection.query(_sql.insert_blacklist_token,params,(err, results) => {

                connection.destroy();
    
                if( err ) {
                    deny(res)
                } else {
                    res.json({msg:"logout success33"})
                }
    
            })
        }
    });
}

module.exports = logout;