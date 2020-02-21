var jwtVerify = require('../../reuse/jwtVerify');
var query = require('../../reuse/query')
var sql = require('../../../mysql/queries/accounts/Login')

const GetSubjectWithTeacher = async ({res, token, params}) => {

    let error  = false;    
    let jwtResult;
    let sqlResult;
    
    try{
        jwtResult= await jwtVerify(token); // => {token:'string' , decoded":{}}
 
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

    // insert new department
    try{
        if(sqlResult[0].is_token === 'AUTH') {

            const {subject_detail_id} = params;

            sqlResult = await query(_sql.getSubjectWithTeacher , [ subject_detail_id ]);
        }
    } catch (err){
        error  = true;  
    }

    error ? 
    res.sendStatus(401) : 
    res.json({ data : sqlResult[1]})
}

let _sql = {
    getSubjectWithTeacher : `
                        SET @subject_detail_id := ?;

                        SELECT 
                            sub.*,
                            subdet.name AS 'subdet_name',
                            subdet.code AS 'subdet_code',
                            auth.fullname AS 'auth_name',
                            teac.fullname AS 'teac_name',
                            sem.name AS 'sem_name',
                            ay.name AS 'ay_name'

                        FROM subject AS sub
                        JOIN subject_detail AS subdet ON subdet.id = sub.subject_detail_id
                            AND  sub.subject_detail_id IN (@subject_detail_id)
                        JOIN account auth ON auth.id = sub.authored_account_id
                        JOIN account teac ON teac.id = sub.teacher_account_id
                        JOIN semester sem ON sem.id = sub.semester_id
                        JOIN acad_year ay ON ay.id = sub.acad_year_id
    `
}

module.exports =  GetSubjectWithTeacher;

