var jwtVerify = require('../../reuse/jwtVerify');
var query = require('../../reuse/query')
var sql = require('../../../mysql/queries/accounts/Login')

const asyncSetAcadYear = async ({res, token, params}) => {
    
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
        console.log('err auth')
        error  = true; 
    }
    
    // get acadYear
    try{
        if(sqlResult[0].is_token === 'AUTH') {
            console.log(params)


            sqlResult = await query(sql_.addClearanceStudent, params)
        }
    } catch (err){
        console.log('error Add')
        error  = true;  
    }

    error ? 
        res.sendStatus(401) : 
        res.json({ data:sqlResult })
}


const sql_ = {
    addClearanceStudent: `INSERT IGNORE clearance_issue
                        (
                            student_username,
                            unique_id,
                            departments_id,
                            acad_year_id,
                            semester_id,
                            context,
                            account_id_by,
                            course,
                            yearlevel,
                            section
                        )
                        VALUES ?`
                        // (
                        //     'CL1',
                        //     '104',
                        //     (SELECT id FROM acad_year WHERE state = 1 LIMIT 1),
                        //     (SELECT id FROM semester WHERE state = 1 LIMIT 1),
                        //     'Form-137',
                        //     '110',
                        //     (SELECT course FROM student_ WHERE username='CL1'),
                        //     (SELECT yearlevel FROM student_ WHERE username='CL1'),
                        //     (SELECT section FROM student_ WHERE username='CL1')
                        // )
}

module.exports =  asyncSetAcadYear