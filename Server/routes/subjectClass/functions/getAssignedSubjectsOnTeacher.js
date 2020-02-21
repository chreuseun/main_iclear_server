var jwtVerify = require('../../reuse/jwtVerify');
var query = require('../../reuse/query')
var sql = require('../../../mysql/queries/accounts/Login')

const GetYearLevelList = async ({res, token, params}) => {

    let error  = false;    
    let jwtResult;
    let sqlResult;
    
    try{
        jwtResult= await jwtVerify(token); // => {token:'string' , decoded":{}}
        // console.log(jwtResult)
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

    // Get Assign subject to Teacher based on account id of the teacher
    try{
        if(sqlResult[0].is_token === 'AUTH') {

            sqlResult = await query(_sql.getSubjectsAssignToTeacher , [ jwtResult.decoded.id ]);

        }
    } catch (err){
        error  = true;  
    }

    error ? 
        res.sendStatus(401) : 
        res.json({ data : sqlResult})
}

let _sql = {
    getSubjectsAssignToTeacher : `
                    SELECT
                        sub.*,
                        subdet.name AS 'subdet_name',
                        subdet.name AS  'subdet_code',
                        subdet.educ_level_id , 
                        subdet.yearlevel,
                        subdet.course,
                        ay.name AS 'ay_name',
                        sem.name AS 'sem_name',
                        el.name AS 'el_name'

                    FROM subject AS sub
                    JOIN subject_detail AS subdet ON sub.subject_detail_id = subdet.id
                        AND sub.teacher_account_id = ?
                    JOIN acad_year AS ay ON ay.id = sub.acad_year_id
                    JOIN semester AS sem ON sem.id = sub.semester_id
                    JOIN educ_level AS el ON el.id = subdet.educ_level_id
    `
};

module.exports =  GetYearLevelList;

