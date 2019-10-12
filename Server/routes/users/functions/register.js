
register = ( {headers, jwt,secretkey , res},{pool,_sql,body}) => {
    // TOKEN CHECKING =========================================
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
                    body
                } 
                mainPool(arg)
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

mainPool  = ({pool,res, _sql, params,body} ) => {
    console.log('regmainPOOL')
    pool.getConnection( (err,connection) => {

        if(err) {
            deny(res)  
        } else {
            connection.query( _sql.select_blacklist_token,params,(err, results) => {
                connection.destroy();  // Destoy query

                if( err || results.length === 0 || results[0].is_token === 'DENY' ) {
                    deny(res)
                } else {

                    args = {
                        pool,
                        res,
                        _sql,
                        body
                    }

                    insertUser(args)

                    
                }
            })
        }
    });
},

insertUser = ({pool,res,_sql,body}) => {
    pool.getConnection( (err,connection) => {

        if(err) {   
            res.json({msg:  'authorized to register' })          
        } else {
            connection.query(_sql.insert_new_user,body,(err, results) => {
                connection.destroy();   
                if( err ) {
                    // console.log(err)
                    deny(res);
                } else {
                    res.json({msg:"1 user added"})
                }
            })
        }
    });
}

module.exports = register;