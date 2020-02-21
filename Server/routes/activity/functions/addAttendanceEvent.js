// Adding 1 row to subject_detail
var jwtVerify = require('../../reuse/jwtVerify');
var query = require('../../reuse/query')
var sql = require('../../../mysql/queries/accounts/Login')


const AddAttendanceEvent = async ({res, token, params}) => {

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

            const {
                event_id,
                time_mode,
                barcode
            } = params;

            let arrParams = [event_id, barcode];

            sqlResult = await query(_sql.ifExist, arrParams);

            if(sqlResult[2][0].count === 0){

                if(time_mode === '1'){

                    sqlResult = await query( _sql.timeIn , arrParams);

                    if(sqlResult[2].insertId > 0 ){
                        sqlResult={
                            msg:'TimeIn Scanned'
                        }
                    }else{
                        sqlResult={
                            msg:'Scaning Failed - Barcode Dont Exist'
                        }
                    }

                }else{

                    sqlResult = await query( _sql.timeOut , arrParams)

                    if(sqlResult[2].insertId > 0 ){
                        sqlResult={
                            msg:'TimeOut Scanned'
                        }
                    }else{
                        sqlResult={
                            msg:'Scaning Failed - Barcode Dont Exist'
                        }
                    }

                }

            }else{

                if(time_mode === '1'){

                    sqlResult = await query( _sql.updTimeIn, arrParams)

                    console.log('Data - ' , sqlResult[2])

                    if(sqlResult[2].changedRows > 0){
                        sqlResult={
                            msg:'TimeIn Scanned'
                        }
                    }else{
                        if(sqlResult[2].affectedRows > 0){
                            sqlResult={
                                msg:'Already Time-In'
                            }
                        }else{
                            sqlResult={
                                msg:'Scanning Failed - Barcode Dont Exist'
                            }
                        }

                    }

                }else{
                    sqlResult = await query( _sql.updTimeOut, arrParams);

                    console.log('Data - ' , sqlResult[2])

                    if(sqlResult[2].changedRows > 0){
                        sqlResult={
                            msg:'TimeOut Scanned'
                        }
                    }else{
                        if(sqlResult[2].affectedRows > 0){
                            sqlResult={
                                msg:'Already Time-Out'
                            }
                        }else{
                            sqlResult={
                                msg:'Scanning Failed - Barcode Dont Exist'
                            }
                        }

                    }

                }

            }

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
    timeIn : `
        SET @event_id := ?;
        SET @barcode := ?;

        INSERT INTO attendance_event
        (
            student_username,
            event_id,
            time_in,
            unique_key
        )

            SELECT 
                username,
                @event_id,
                NOW(),
                CONCAT(@barcode, '-', @event_id)

            FROM student_

            WHERE activity_card_barcode = @barcode

            LIMIT 1
        `,

    timeOut : `
        SET @event_id := ?;
        SET @barcode := ?;

        INSERT INTO attendance_event
        (
            student_username,
            event_id,
            time_out,
            unique_key
        )

        SELECT 
            username,
            @event_id,
            NOW(),
            CONCAT(@barcode, '-' , @event_id)

        FROM student_

        WHERE activity_card_barcode = @barcode

        LIMIT 1`,

    ifExist : `
        SET @event_id := ?;
        SET @barcode := ?;

        SELECT COUNT(av.id) AS 'count'

        FROM attendance_event AS av

        WHERE unique_key = CONCAT(@barcode, '-', @event_id);
    `,

    updTimeIn :  `
        SET @event_id := ?;
        SET @barcode := ?;

        UPDATE attendance_event
            SET time_in = IF(time_in IS NULL , NOW(), time_in)

        WHERE unique_key = CONCAT(@barcode, '-', @event_id)`,

    updTimeOut :  `
        SET @event_id := ?;
        SET @barcode := ?;

        UPDATE attendance_event
            SET time_out = IF(time_out IS NULL , NOW(), time_out)

        WHERE unique_key = CONCAT(@barcode, '-', @event_id)`

}

module.exports =  AddAttendanceEvent;