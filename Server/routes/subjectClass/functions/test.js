// Adding 1 row to subject_detail
var jwtVerify = require('../../reuse/jwtVerify');
var query = require('../../reuse/query')
var sql = require('../../../mysql/queries/accounts/Login')


const test = async ({res, token, params}) => {

    console.log(params)
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

    // Main DB command
    try{
        if(sqlResult[0].is_token === 'AUTH') {
            sqlResult = await query(_sql.test2 ,[])
        }
    } catch (err){
        console.log('mysqlError')
        error  = true;  
    }

    error ? 
    res.sendStatus(401) : 
    res.json({ data : sqlResult[5]})
}

let _sql = {
    test : `
        SET @educ_level_id := '1'; -- 1
        SET @course := 'NONE'; -- 2
        SET @yearlevel := '1st'; -- 2
        SET @section := 'MAGLAYO'; -- 2
        SET @semester_id := '4'; -- 2
        SET @acad_year_id := '1'; -- 2
        SET @subject_id := '123';

        (SELECT 
            @subject_id,
            CONCAT(@subject_id, '-',s.username) AS unique_identifier,
            s.username

            FROM student_ s

            WHERE s.educ_level_id = @educ_level_id 
            AND s.course = @course
            AND s.yearlevel = @yearlevel 
            AND s.section = @section
            AND semester_id = @semester_id 
            AND acad_year_id = @acad_year_id);
    `,

    test2 : `
            SET @educ_level_id := '1'; -- 0
            SET @course := 'NONE'; -- 1
            SET @yearlevel := '1st'; -- 2
            SET @section := 'MAGLAYO'; -- 3
            SET @subject_id := '123'; -- 6

            INSERT IGNORE INTO subject_student_
            (
                subject_id,
                unique_identifier,
                student_id
            )

            SELECT 
                @subject_id,
                CONCAT(@subject_id, '-',s.username) AS unique_identifier,
                s.username

            FROM student_ AS s

            WHERE s.educ_level_id = @educ_level_id 
            AND s.course = @course
            AND s.yearlevel = @yearlevel 
            AND s.section = @section
            AND semester_id = ( SELECT IF( @educ_level_id IN (1,2), 4, id ) FROM semester  WHERE state = 1 )
            AND acad_year_id = ( SELECT id FROM acad_year WHERE state  = 1 );
           `
}

module.exports =  test;

