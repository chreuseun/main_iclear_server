var jwtVerify = require('../../reuse/jwtVerify');
var query = require('../../reuse/query')
var sql = require('../../../mysql/queries/accounts/Login')

const GetStudentViolationByStudentUsername = async ({res, token, params}) => {
    
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

    // insert new department
    try{
        if(sqlResult[0].is_token === 'AUTH') {
            console.log(params)
            sqlResult = await query(_sql.getViolationStudentRecord, params );
        }
    } catch (err){
        error  = true;  
    }


    error ? 
    res.sendStatus(401) : 
    res.json({ data:sqlResult[1] || [] })
}

let _sql = {
    getViolationStudentRecord : `SET @studentUsername := ?;

                                SELECT 
                                    sv.*,
                                    '--',
                                    s.department AS 's_dep',
                                    sem.name as 'sem_name',
                                    v.name as 'v_name',
                                    ay.name AS 'ay_name' ,
                                    DATE_FORMAT(sv.created_at, "%m-%d-%Y") AS 'issued_on',
                                    DATE_FORMAT(sv.created_at, "%r")AS 'time'
                                
                                FROM student_violation sv
                                JOIN student_ s ON s.username = sv.student_username	
                                    AND s.username IN (@studentUsername)
                                JOIN semester sem ON sem.id = sv.semester_id
                                JOIN violation v ON v.id = sv.violation_id
                                JOIN acad_year ay ON ay.id = sv.acad_year_id;`
}

module.exports =  GetStudentViolationByStudentUsername;


