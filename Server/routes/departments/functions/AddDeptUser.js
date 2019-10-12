/*
    STATUS : NOT
*/

// Requries 'Bearer TOKENxxxxx'
var jwtVerify = require('../../reuse/jwtVerify');

// Requires < SQL > , < ARRAY_PARAMETER >
var query = require('../../reuse/query')

var sql = require('../../../mysql/queries/accounts/Login')

const asyncInsertDepartment = async ({res, token, params}) => {
    
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

    // insert new department
    try{
        if(sqlResult[0].is_token === 'AUTH') {
            console.log(params)
            let sql = `INSERT INTO account_departments (account_id, departments_id)
            SELECT * FROM (SELECT ?, ?) AS tmp
            WHERE NOT EXISTS (
                SELECT id FROM account_departments WHERE account_id = ? AND  departments_id = ?
            ) LIMIT 1`;

            sqlResult = await query(sql, params)
        }
    } catch (err){
        error  = true;  
    }


    error ? 
    res.sendStatus(401) : 
    res.json({ sqlResult })
}

module.exports =  asyncInsertDepartment;


