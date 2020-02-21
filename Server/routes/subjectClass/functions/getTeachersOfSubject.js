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

            const {teacher_account_id, subject_detail_id, section} = params


            sqlResult = await query(_sql.checkIfSubjectExist , [
                teacher_account_id,
                subject_detail_id,
                section
            ])

            // Insert in the DB
            if(sqlResult[3][0] === 0){

                sqlResult = await query(_sql.insertNewsubject , [
                    jwtResult.decoded.id,
                    teacher_account_id,
                    subject_detail_id,
                    section
                ])

                if(sqlResult[4].insertId){
                    sqlResult =  {msg: 'Teacher Added on the Subject'}
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
    res.json({ data : sqlResult[3][0].count})
}

let _sql = {
    insertNewsubject : `
                    SET @author_account_id := ?;
                    SET @teacher_account_id := ?;
                    SET @subject_detail_id := ?;
                    SET @section := ?;
                    
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
                        @author_account_id, -- token decode .id
                        @teacher_account_id, -- client
                        @subject_detail_id, -- client
                        @section,                        
                        ( SELECT IF( @educ_level_id IN (1,2) , 4, ( SELECT id FROM semester where state = 1 )) ),  -- query semester
                        (SELECT id FROM acad_year WHERE state = 1) -- acad_year_id
                    )`
}

module.exports =  GetYearLevelList;

