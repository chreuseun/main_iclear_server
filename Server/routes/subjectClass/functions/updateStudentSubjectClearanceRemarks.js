// Adding 1 row to subject_detail
var jwtVerify = require('../../reuse/jwtVerify');
var query = require('../../reuse/query')
var sql = require('../../../mysql/queries/accounts/Login')


const UpateStudentSubjectClearanceRemarks = async ({res, token, params}) => {

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
            sqlResult = await query( _sql.updateStudentSubjectClearnceRemarks , [params.remarks, params.subject_clearance_ids] )
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
   updateStudentSubjectClearnceRemarks : `
                                    UPDATE subject_student_

                                    SET remarks = ?

                                    WHERE id IN (?) `
}

module.exports =  UpateStudentSubjectClearanceRemarks;