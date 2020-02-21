var jwtVerify = require('../../reuse/jwtVerify');
var query = require('../../reuse/query')
var sql = require('../../../mysql/queries/accounts/Login')


const GetAttendanceEventRecords = async ({res, token, params}) => {

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

    // UpdateStudentSubjectClearanceRemarks
    try{

        if(sqlResult[0].is_token === 'AUTH') {

            const {event_id} = params;
            sqlResult = await query(_sql.GetAttendanceEventRecords, [event_id]);

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
    GetAttendanceEventRecords : `
        SELECT 
            av.* ,
            DATE_FORMAT(av.time_in, "%b-%d-%Y %r") AS 'TimeIn',
            DATE_FORMAT(av.time_out, "%b-%d-%Y %r") AS 'TimeOut',

            TIME_FORMAT(av.created_at, "%r") AS 'c_at',
            TIME_FORMAT(av.updated_at, "%r") AS 'u_at',
            
            s.studfname,
            s.studmname,
            s.studlname

        FROM attendance_event av 
        JOIN student_ s ON s.username = av.student_username
            AND av.event_id = ?

        ORDER BY av.updated_at DESC;`
}

module.exports =  GetAttendanceEventRecords;