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
        sqlResult = await query(sql.select_blacklist_token, [jwtResult.token, jwtResult.decoded.id])
    } catch (err) {
        error  = true; 
    }
    
    // get departments type
    try{
        if(sqlResult[0].is_token === 'AUTH') {

            let sql = `
                                SELECT *
                    FROM 

                    (SELECT  
                        educ_level_id as 'id',
                        course AS 'key',
                        course AS 'value',
                        course AS 'text'
                                            
                    FROM student_
                                        
                    GROUP BY  educ_level_id, course
                                            
                                        UNION SELECT  1 , 'NONE', 'NONE ', 'NONE'
                                        UNION SELECT 2, 'NONE' , 'NONE' , 'NONE'
                                        UNION SELECT 3, '-ALL',  '-ALL',  '-ALL' 
                                        UNION SELECT  4, '-ALL' , '-ALL',  '-ALL') as main
                    WHERE id = ?`

            sqlResult = await query(sql, params[0])

            sql = `SELECT *
                    FROM
                    
                    (SELECT  
                                    educ_level_id AS 'id',
                                    yearlevel AS 'key',
                                    yearlevel AS 'value',
                                    yearlevel AS 'text'
                            
                                FROM student_            
                                GROUP BY  educ_level_id , yearlevel
                                    
                                UNION SELECT   1, '-ALL' ,  '-ALL' ,  '-ALL'
                                UNION SELECT   2, '-ALL' ,  '-ALL' ,  '-ALL'
                                UNION SELECT   3, '-ALL' ,  '-ALL' ,  '-ALL'
                                UNION SELECT   4, '-ALL' ,  '-ALL' ,  '-ALL'
                                ) AS main
                                
                    WHERE id = ?`

            sqlResult1 = await query(sql, params[0])
       
        }
    } catch (err){
        error  = true;  
    }

    error ? 
        res.sendStatus(401) : 
        res.json({ sqlResult:{course:sqlResult, yearlevel: sqlResult1} })
}

module.exports =  asyncGetCourseLevel