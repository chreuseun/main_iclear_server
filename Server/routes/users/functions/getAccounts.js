// Requries 'Bearer TOKENxxxxx'
var jwtVerify = require('../../reuse/jwtVerify');

// Requires < SQL > , < ARRAY_PARAMETER >
var query = require('../../reuse/query');

var sql = require('../../../mysql/queries/accounts/Login')

const asyncGetAccounts = async ({res, token, params}) => {
    
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
            

            sqlResult = await query(_sql.selectUsers, [])
        }
    } catch (err){
        error  = true;  
    }

    error ? 
        res.sendStatus(401) : 
        res.json({sqlResult})
}

let _sql = {
    selectUsers :  `SELECT 
                        id,
                        user_type_id,
                        username,
                        fullname,
                        lastname,
                        firstname,
                        middlename,
                        state,
                        is_locked,
                        contact_number,
                        created_at,
                        updated_at
                    FROM account

                    WHERE state LIKE '%%'    
                        AND user_type_id LIKE '%%'
                        AND username LIKE '%%'
                        AND lastname LIKE '%%'
                        AND firstname LIKE '%%'
                        AND middlename LIKE '%%'`
}


module.exports =  asyncGetAccounts