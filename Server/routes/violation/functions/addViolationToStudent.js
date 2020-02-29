var jwtVerify = require('../../reuse/jwtVerify');

// Requires < SQL > , < ARRAY_PARAMETER >
var query = require('../../reuse/query')

var sql = require('../../../mysql/queries/accounts/Login')

const AddViolationToStudent = async ({res, token, params}) => {
    
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
            sqlResult = await query(_sql.addViolationToStudent, params );
        }
    } catch (err){
        error  = true;  
    }


    error ? 
    res.sendStatus(401) : 
    res.json({ data:sqlResult || [] })
}

let _sql = {
    addViolationToStudent : `
                    SET @uid := ?;
                    SET @vio := ?;
                    SET @sem := ? ;
                    SET @ay := ?;
                    SET @yr := ?;
                    SET @crs := ?;
                    SET @sec := ?;
        
                    SET @entry := (SELECT COUNT(*) AS ENTRY_today
                                    FROM student_violation
                                    
                                    WHERE student_username = @uid 
                                        AND DATE(created_at) = DATE(NOW()) 
                                        AND violation_id = @vio  LIMIT 1);

                    INSERT INTO student_violation
                    (student_username,
                    violation_id,
                    semester_id,
                    acad_year_id,
                    yearlevel,
                    course,
                    section,
                    existing_record)
                    
                    (SELECT
                        @uid,
                        @vio ,
                        @sem,
                        @ay,
                        @yr,
                        @crs,
                        @sec ,
                        
                        (SELECT COUNT(*) + 1  FROM student_violation
                        WHERE student_username = @uid AND 
                        violation_id = @vio  AND 
                        semester_id = @sem AND
                        acad_year_id = @ay AND
                        yearlevel = @yr AND
                        course = @crs AND
                        section = @sec LIMIT 1) 
                            
                        WHERE IF(0 = (SELECT COUNT(*) AS ENTRY_today
                        FROM student_violation
                        
                        WHERE student_username = @uid 
                            AND DATE(created_at) = DATE(NOW()) 
                            AND violation_id = @vio  LIMIT 1) , true, false));`
}

module.exports =  AddViolationToStudent;


