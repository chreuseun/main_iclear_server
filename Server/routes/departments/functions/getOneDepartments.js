/*
    STATUS : NOT
*/

// Requries 'Bearer TOKENxxxxx'
var jwtVerify = require('../../reuse/jwtVerify');

// Requires < SQL > , < ARRAY_PARAMETER >
var query = require('../../reuse/query')

var sql = require('../../../mysql/queries/accounts/Login')

const asyncGetCourseLevel = async ({res, token, params}) => {
    
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
        sqlResult = await query(sql.select_blacklist_token_all, [jwtResult.token, jwtResult.decoded.id])
    } catch (err) {
        error  = true; 
    }
    
    // get ONE department
    try{
        if(sqlResult[0].is_token === 'AUTH') {

            let sql = `SELECT 
                            d.name as 'd_name',    
                            el.name as 'el_name',
                            dt.name as 'd_type_name',
                            d.course as 'd_course',
                            d.yearlevel as 'd_yearlevel',
                            d.head_officer,
                            d.state as 'd_state',
                            d.is_subdepartment as 'is_subdep',
                            d.student_department,
                            
                            is_coursed,
                            d.id as 'd_id',
                            d.department_type_id as 'd_type',
                            el.id as 'el_id'
                        
                        FROM departments d
                        JOIN departments_type dt ON dt.id = d.department_type_id
                        JOIN educ_level el ON el.id = d.educ_level_id
                        
                        WHERE d.id = ?`;

            sqlResult = await query(sql, [params[0]])
        }
    } catch (err){
        error  = true;  
    }

    error ? 
        res.sendStatus(401) : 
        res.json({ sqlResult:sqlResult})
}

module.exports =  asyncGetCourseLevel