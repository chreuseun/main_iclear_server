/*UPDATE account  as main
SET main.is_locked = (
	SELECT * FROM (SELECT IF(is_locked= '1' , '0', '1') as DATA FROM account WHERE id = 2 LIMIT 1) as sub
)
WHERE main.id = 2*/

/*
    STATUS : NOT
*/

// Requries 'Bearer TOKENxxxxx'
var jwtVerify = require('../../reuse/jwtVerify');

// Requires < SQL > , < ARRAY_PARAMETER >
var query = require('../../reuse/query')

var sql = require('../../../mysql/queries/accounts/Login')

const setUserState = async ({res, token, params}) => {
    
    let error  = false;    
    let jwtResult;
    let sqlResult;

    try{
        jwtResult= await jwtVerify(token);
    } catch(err) {
        error  = true; 
    }
    
    if(!jwtResult) {
        error  = true; 
    }

    try{       
        sqlResult = await query(sql.select_blacklist_token, [jwtResult.token, jwtResult.decoded.id])
    } catch (err) {
        error  = true; 
    }
    
    try{
        if(sqlResult[0].is_token === 'AUTH') {
            console.log([params[0], params[0]])
            console.log(params)
            sqlResult = await query(_sql.UpdateState, [params[0], params[0]])

            sqlResult = await query(_sql.UpdateLocked, params[0])

        }
    } catch (err){
        error  = true;  
    }

    error ? 
        res.sendStatus(401) : 
        res.json({ data:sqlResult})
}


let _sql = {
    UpdateState : `UPDATE account  as main
    SET main.is_locked = (
        SELECT * FROM (SELECT IF(is_locked= '1' , '0', '1') as DATA FROM account WHERE id = ? LIMIT 1) as sub
    )
    WHERE main.id = ?`,

    UpdateLocked : `DELETE  FROM account_login_logs 
    WHERE account_id = ?`
}

module.exports =  setUserState