var jwtVerify = require('../../reuse/jwtVerify');
var query = require('../../reuse/query')
var sql = require('../../../mysql/queries/accounts/Login');

const GetAttendanceEventRecords = async ({res, token, params}) => {

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

    // UpdateStudentSubjectClearanceRemarks
    try{

        if(sqlResult[0].is_token === 'AUTH') {

            sqlResult = await query(_sql.GetAttendanceRecordMain, []);

        }else {
            error  = true;
        }

    } catch (err){
        error  = true;
    }

    error ? 
    res.sendStatus(401) : 
    res.json({ data : sqlResult })
}

let _sql = {
    GetAttendanceRecordMain : `
        SELECT 
            av.* ,
            ev.name AS 'event_name',
            DATE_FORMAT(av.time_in, "%b-%d-%Y %r") AS 'TimeIn',
            DATE_FORMAT(av.time_out, "%b-%d-%Y %r") AS 'TimeOut',

            (CASE 
                WHEN av.time_in IS NULL THEN  'NO_TIME_IN'
                WHEN av.time_out IS NULL THEN 'NO_TIME_OUT'
                ELSE 'COMPLETED'
            END) AS 'status',

            s.studfname,
            s.studmname,
            s.studlname,
            ev.student_department,
            sem.name AS 'sem_name',
            ay.name AS 'ay_name'

        FROM attendance_event av 
        JOIN student_ s ON s.username = av.student_username
        JOIN events ev ON ev.id = av.event_id
        JOIN semester sem ON sem.id = ev.semester_id
        JOIN acad_year ay ON ay.id = ev.acad_year_id


        ORDER BY av.updated_at DESC;`
}

module.exports =  GetAttendanceEventRecords;