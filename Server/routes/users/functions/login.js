
login = ({res, loginCred, pool, _sql ,bcrypt, jwt, secretkey}) => {
        // check if exisiting
    const error = {msg:"denied"}
    const {username, password} = loginCred;
    
    if( username && password ) {
        var params = [ username, password ]; // arrayPrams for the query  criteria

        pool.getConnection( (err,connection) => {
            
            if(err) {
                res.json({error});             
            } else {
                connection.query(_sql.select_1_user,params[0],(err, results) => {
                    // When done with the connection, release it.
                    connection.destroy(); 
                    
                    // If ERROR
                    if(err || results.length === 0 ) {
                        res.json({error})
                    }
                    // if Log 
                    else if(results[0].lock_meter >= 5 || results[0].is_locked === 1) {
                        
                        results[0].is_locked === 1 ? 
                        res.json({msg:'account locked'})
                        // res.json({err:"7"})   
                        :
                        
                        // update account_id locked
                        pool.getConnection((err, connection) => {
                            if(err){
                                res.json({error})
                            } else {
                                connection.query(_sql.update_account_to_locked, [results[0].acc_id], (err, results) => {
                                    if(err) {
                                        res.json({error})
                                    } else {
                                        res.json({msg:'account locked'})
                                        // res.json({err:"6"})  
                                    }
                                })
                            }
                        })
                    } else {
                        // compare- password here to hash
                        bcrypt.compare(password , results[0].password, (err, status) => {
                            if(err){
                                // res.json({err:"4"}) 
                                res.json({error})
                            }else{
                                
                                const payload = {
                                    id : results[0].acc_id,
                                    username : results[0].username,
                                    user_type_id : results[0].user_type_id
                                };

                                status ?  
                                    // CREATE TOKEN and SEND TO THE CLIENT
                                    jwt.sign(payload, secretkey, { expiresIn: '24h' },function(err, token) {
                                        res.send({msg:"success", token, user_details:payload})
                                    })  :  
                                    pool.getConnection( (err,connection) => {
                                        if(err) {
                                            res.json({error})
                                            // res.json({err:"erre4"})  
                                        } else {                             
                                            pool.query(_sql.insert_account_login_logs, results[0].acc_id,(err, results) => {
                                                connection.destroy(); 

                                                if(err){
                                                    res.json({error})  
                                                    // res.json({err:"erre3"})  
                                                } else {
                                                    res.json({error}) 
                                                    // res.json({err:"erre2"})  
                                                }
                                            })
                                        }
                                    })
                            }       
                        }); 
                    }
                });
            }
        })

    } else {
        // res.json({error});
        res.json({err:"er1"})  
    } 
}

deny = (res) => res.json({msg: 'denied'})

module.exports = login;



