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
            console.log('line 38 addDeptUser.js : ', params)
            let sql = `
                SET @acc_id := ?;
                SET @dep_id := ?;
                SET @ifExist := (SELECT COUNT(*) as count FROM account_departments WHERE account_id = @acc_id AND departments_id = @dep_id);

                INSERT INTO account_departments
                (
                account_id,
                departments_id)

                (SELECT @acc_id, @dep_id  WHERE  IF( @ifExist = 0, true, false))`;

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


