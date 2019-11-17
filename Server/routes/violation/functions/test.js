var jwtVerify = require('../../reuse/jwtVerify');
var query = require('../../reuse/query');
var sql = require('../../../mysql/queries/accounts/Login');

const AddNewSanction = async ({res, token, params}) => {
    
    let error  = false;    
    let jwtResult;
    let sqlResult;


    try{
            sqlResult = await query(_sql.test_sql , params)

    } catch (err){
        error  = true;  
    }

    error ?
        res.sendStatus(401) : 
        res.json({ data : sqlResult })
}

let _sql = {
    test_sql : `
                SET @uid := 'GS3';
                SET @vio := 23 ;
                SET @sem := 1 ;
                SET @ay := 1;
                SET @yr :='3rd';
                SET @crs := 'BSAT';
                SET @sec := "A";
    

                SET @entry := (SELECT COUNT(*) AS ENTRY_today
                                FROM student_violation
                                
                                WHERE student_username = @uid 
                                    AND DATE(NOW()) 
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
                    @uid := 'GS3',
                    @vio := 23 ,
                    @sem := 1 ,
                    @ay := 1,
                    @yr :='3rd',
                    @crs := 'BSAT' ,
                    @sec := "A" ,
                    
                    (SELECT COUNT(*) + 1  FROM student_violation
                    WHERE student_username = @uid AND 
                    violation_id = @vio  AND 
                    semester_id = @sem AND
                    acad_year_id = @ay AND
                    yearlevel = @yr AND
                    course = @crs AND
                    section = @sec LIMIT 1) 
                        
                    WHERE IF(0 = @entry , true, false));`
}

module.exports =  AddNewSanction 




