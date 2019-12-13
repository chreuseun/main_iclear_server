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

            let sql = `INSERT INTO departments
            (
                name,
                department_type_id,
                educ_level_id,    
                course,            
                yearlevel,                
                head_officer,
                student_department,
                is_subdepartment
            )
            VALUES
            (
                ?,
                ?,
                ?,
                ?,
                ?,
                ?,
                ?,
                ?
            )`;
                console.log(params[0])
            sqlResult = await query(sql, params[0])
        }
    } catch (err){
        error  = true;  
        console.log('error in the SQL ')
    }


    error ? 
    res.sendStatus(401) : 
    res.json({ sqlResult })
}

module.exports =  asyncInsertDepartment;


