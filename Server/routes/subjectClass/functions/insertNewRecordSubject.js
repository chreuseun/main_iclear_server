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

    // insert new department
    try{
        if(sqlResult[0].is_token === 'AUTH') {

            const {
                 teacher_account_id,
                 subject_detail_id, 
                 section, 
                 educ_level_id,
                 course,
                 yearlevel
            } = params

            sqlResult = await query(_sql.checkIfSubjectExist , [
                teacher_account_id,
                subject_detail_id,
                section
            ])


            // Insert in the DB
            if( sqlResult[3][0].count === 0 ){

                sqlResult = await query(_sql.insertNewsubject , [
                    jwtResult.decoded.id,
                    teacher_account_id,
                    subject_detail_id,
                    section,
                    educ_level_id
                ])

                if(sqlResult[5].insertId){

                    sqlResult = await query(_sql.insertStudentsInSubject , [
                        educ_level_id,
                        course ,
                        yearlevel ,
                        section ,
                        sqlResult[5].insertId
                    ]);

                    sqlResult =  {msg: 'Teacher Added on the Subject'};
                } else{
                    sqlResult = {msg: `Teacher adding failed in the subject`};
                }

            }else{
                sqlResult = {msg: `Subject Entry Already Exist`};
            }
        }
    } catch (err){
        error  = true;  
    }

    error ? 
    res.sendStatus(401) : 
    res.json({ data : sqlResult})
}

let _sql = {
    insertNewsubject : `
                    SET @author_account_id := ?;
                    SET @teacher_account_id := ?;
                    SET @subject_detail_id := ?;
                    SET @section := ?;
                    SET @educ_level_id := ?;
                    
                    INSERT INTO iclear_svms_db.subject
                    (
                        authored_account_id,
                        teacher_account_id,
                        subject_detail_id,
                        section,
                        semester_id,
                        acad_year_id
                    )

                    VALUES(
                        @author_account_id,
                        @teacher_account_id,
                        @subject_detail_id, 
                        @section,
                        ( SELECT IF( @educ_level_id IN (1,2) , 4, ( SELECT id FROM semester where state = 1 )) ),
                        (SELECT id FROM acad_year WHERE state = 1) -- acad_year_id
                    )`,

    checkIfSubjectExist : `
                    SET @teacher_account_id := ?;
                    SET @subject_detail_id := ?;
                    SET @section := ?;

                    SELECT 
                        COUNT(sub.id) AS 'count'

                    FROM subject sub
                    JOIN account auth ON auth.id = sub.authored_account_id
                    JOIN account teac ON teac.id = sub.teacher_account_id
                    JOIN subject_detail subdet ON subdet.id = sub.subject_detail_id
                    JOIN semester sem ON sem.id  = sub.semester_id
                    JOIN acad_year ay ON ay.id = sub.acad_year_id

                    WHERE section = @section
                        AND subject_detail_id = @subject_detail_id
                
                        AND acad_year_id = (SELECT id FROM acad_year WHERE state = 1)
                        AND semester_id IN (4, (SELECT id FROM semester WHERE state = 1));`,
    insertStudentsInSubject : `
                    SET @educ_level_id := ?; -- 0
                    SET @course := ?; -- 1
                    SET @yearlevel := ?; -- 2
                    SET @section := ?; -- 3
                    SET @subject_id := ?; -- 4

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
                    AND acad_year_id = ( SELECT id FROM acad_year WHERE state  = 1 ); -- 5`
}

module.exports =  GetYearLevelList;

