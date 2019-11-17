/*
    STATUS : WORKING
*/

// Requries 'Bearer TOKENxxxxx'
var jwtVerify = require('../../reuse/jwtVerify');

// Requires < SQL > , < ARRAY_PARAMETER >
var query = require('../../reuse/query')

var sql = require('../../../mysql/queries/accounts/Login')

const getCourseDepartment = async ({res, token, params}) => {
    
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
    
    // get departments type
    try{
        if(sqlResult[0].is_token === 'AUTH') {
            sqlResult = await query(_sql.getCourseDepartment, params)
        }
    } catch (err){
        error  = true;  
    }

    error ? 
        res.sendStatus(401) : 
        res.json({data:sqlResult})
}

let _sql = {
    getCourseDepartment : `SELECT 
                            'ALL' AS 'key' , 'ALL' AS 'value', 'ALL' AS 'text'
                            
                            UNION
                            
                            SELECT 
                                IF(st.department = 'NONE', 'ALL', st.department) AS 'key',
                                IF(st.department = 'NONE', 'ALL', st.department)  AS 'value',
                                IF(st.department = 'NONE', 'ALL', st.department)  AS 'text'
                            FROM student_ st 
                            WHERE educ_level_id  =?
                            
                            GROUP BY st.educ_level_id, st.department, st.course`
}

module.exports =  getCourseDepartment