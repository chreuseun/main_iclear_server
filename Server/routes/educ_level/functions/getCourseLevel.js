/*
    STATUS : WORKING
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
    let sqlResult1;

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

            let sql = `SELECT *
            FROM
            (SELECT  
            educ_level_id,
            course,
            IF(department = 'NONE', 'ALL', department) AS 'department'
            
            FROM student_
            
            GROUP BY  educ_level_id, course
            
            UNION SELECT  1 , 'NONE', 'ALL'
            UNION SELECT 2, 'NONE', 'ALL'
            UNION SELECT 3, '-ALL', 'ALL'
            UNION SELECT  4, '-ALL' , 'ALL') as main ORDER BY educ_level_id ASC, course ASC`

            sqlResult = await query(sql, [])

            sql = `SELECT  
                educ_level_id,
                yearlevel
                
            FROM student_
            
            GROUP BY  educ_level_id, yearlevel
                
            UNION SELECT  1 ,  '-ALL'
            UNION SELECT 2,  '-ALL'
            UNION SELECT 3, '-ALL'
            UNION SELECT  4,'-ALL'
                
            ORDER BY educ_level_id  ASC, yearlevel ASC`

            sqlResult1 = await query(sql, [])
       
        }
    } catch (err){
        error  = true;  
    }

    error ? 
        res.sendStatus(401) : 
        res.json({ sqlResult:{course:sqlResult, yearlevel: sqlResult1} })
}

module.exports =  asyncGetCourseLevel