var jwtVerify = require('../../reuse/jwtVerify');
var query = require('../../reuse/query')
var sql = require('../../../mysql/queries/accounts/Login')

const GetCurrentAvailable = async ({res, token, params}) => {
    
    let error  = false;    
    let jwtResult;
    let sqlResult;
    let dataResult = {};

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
            dataResult.UserDept = await query(_sql.getCurrentAvailableClass, [])
        }
    } catch (err){
        error  = true;  
    }

    error ? 
        res.sendStatus(401) : 
        res.json({ data:dataResult.UserDept})
}


let _sql= {
    getCurrentAvailableClass : `SELECT 
                                    s.educ_level_id,
                                    s.semester_id,
                                    s.acad_year_id,
                                    s.course,
                                    s.yearlevel,
                                    s.section,   
                                    el.name AS 'el_name',
                                    sem.name AS 'sem_name',
                                    ay.name AS 'acad_year'

                                FROM student_ s
                                JOIN semester sem ON sem.id = s.semester_id
                                JOIN acad_year ay ON ay.id = s.acad_year_id
                                JOIN educ_level el ON el.id = s.educ_level_id

                                WHERE acad_year_id = (SELECT id FROM acad_year  WHERE state IN (1) LIMIT 1)
                                    AND semester_id IN  (SELECT id FROM semester  WHERE state IN (1) OR id = 4 )
                                    AND s.educ_level_id IN (1,2)

                                GROUP BY educ_level_id, course, yearlevel, section

                                ORDER BY educ_level_id, course , yearlevel, section`
}

module.exports =  GetCurrentAvailable