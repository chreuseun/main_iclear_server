/*
    STATUS : WORKING
*/

// Requries 'Bearer TOKENxxxxx'
var jwtVerify = require('../../reuse/jwtVerify');

// Requires < SQL > , < ARRAY_PARAMETER >
var query = require('../../reuse/query')

var sql = require('../../../mysql/queries/accounts/Login')

const asynGetDeptType = async ({res, token, params}) => {
    
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
    
    // get departments type
    try{
        if(sqlResult[0].is_token === 'AUTH') {

            let sql = `SELECT id as 'key' , name as 'text' , id as 'value'  FROM iclear_svms_db.departments_type WHERE id != 1`
            sqlResult = await query(sql, [])
        }
    } catch (err){
        error  = true;  
    }

    error ? 
        res.sendStatus(401) : 
        res.json({sqlResult})
}

module.exports =  asynGetDeptType