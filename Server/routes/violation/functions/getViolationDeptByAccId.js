var jwtVerify = require('../../reuse/jwtVerify');
var query = require('../../reuse/query')
var sql = require('../../../mysql/queries/accounts/Login')

const GetViolationDeptByAccId = async ({res, token, params}) => {
    
    let error  = false;    
    let jwtResult;
    let sqlResult;
    let dataResult = {};

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
    
    // get ONE department
    try{
        if(sqlResult[0].is_token === 'AUTH') {
            dataResult.ViolationDepartments = await query(_sql.getViolationDeptByAccId, [jwtResult.decoded.id])
        }
    } catch (err){
        error  = true;  
    }

    error ? 
        res.sendStatus(401) : 
        res.json({ data:dataResult.ViolationDepartments})
}


let _sql= {
    getViolationDeptByAccId : `SELECT 
                        acc.username,
                        acc.id AS 'acc_id',
                        ad.id AS 'ad_id',
                        ad.departments_id AS 'd_id',
                        d.department_type_id AS 'd_type_id',
                        d.educ_level_id AS 'el_id',
                        
                        el.name AS 'el_name',
                        d.name AS 'd_name',
                        d.head_officer,
                        d.course AS 'd_course',
                        d.yearlevel AS 'd_yearlevel',  
                        d.student_department

                    FROM account acc 
                    JOIN account_departments ad ON ad.account_id = acc.id
                    JOIN departments d ON d.id = ad.departments_id
                    JOIN educ_level el ON el.id = d.educ_level_id

                    WHERE acc.state = 1
                        AND acc.is_locked = 0
                        AND d.state = 1
                        AND d.department_type_id = 3
                        AND acc.id = ?`
}

module.exports =  GetViolationDeptByAccId