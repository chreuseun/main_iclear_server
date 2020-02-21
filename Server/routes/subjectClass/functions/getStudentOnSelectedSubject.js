var jwtVerify = require('../../reuse/jwtVerify');
var query = require('../../reuse/query')
var sql = require('../../../mysql/queries/accounts/Login')

const GetSubjectStudentList = async ({res, token, params}) => {

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

            sqlResult = await query(_sql.getSubjectStudentList , [ params.subject_id ]);

        }
    } catch (err){
        error  = true;  
    }

    error ? 
        res.sendStatus(401) : 
        res.json({ data : sqlResult})
}

let _sql = {
    getSubjectStudentList : `
            SELECT 
                sub.*,
                CONCAT(studlname,', ',studfname, ' ',  studmname) AS 's_fullname',
                sem.name AS 'sem_name',
                ay.name AS 'ay_name',
                subdet.name AS 'subdet_name',
                subdet.code AS 'subdet_code',
                substd.id AS 'substd_id',
                substd.remarks,
                subdet.educ_level_id,
                subdet.course,
                subdet.yearlevel,
                el.name AS el_name
            
            FROM subject AS sub
            JOIN subject_detail AS subdet ON subdet.id = sub.subject_detail_id
                AND sub.id = ?
            JOIN subject_student_ AS substd ON substd.subject_id = sub.id
            JOIN student_ AS s ON s.username = substd.student_id
            JOIN semester AS sem ON sem.id = sub.semester_id
            JOIN acad_year AS ay ON ay.id = sub.acad_year_id
            JOIN educ_level AS el ON el.id = subdet.educ_level_id
    `
};

module.exports =  GetSubjectStudentList;

