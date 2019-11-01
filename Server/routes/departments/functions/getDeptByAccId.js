var jwtVerify = require('../../reuse/jwtVerify');
var query = require('../../reuse/query')
var sql = require('../../../mysql/queries/accounts/Login')

const GetDeptByAccountId = async ({res, token, params}) => {
    
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
            dataResult.UserDept = await query(_sql.getDeptByAccId, [jwtResult.decoded.id])
        }
    } catch (err){
        error  = true;  
    }

    error ? 
        res.sendStatus(401) : 
        res.json({ data:dataResult.UserDept})
}


let _sql= {
    getDeptByAccId : `SELECT 
                        acc.id AS ' acc_id',    
                        ad.departments_id AS 'd_id',
                        d.department_type_id AS 'd_type_id',
                        el.id AS 'el_id',
                        d.name AS 'd_name',
                        dt.name AS 'dt_name',
                        el.name AS 'el_name',
                        d.head_officer,
                        d.course,
                        d.yearlevel

                    FROM account AS acc
                    JOIN account_departments ad ON ad.account_id = acc.id
                    JOIN departments d ON d.id = ad.departments_id
                    JOIN educ_level el ON el.id = d.educ_level_id
                    JOIN departments_type dt ON dt.id = d.department_type_id

                    WHERE acc.state = 1
                        AND acc.is_locked = 0
                        AND d.state = 1
                        AND d.department_type_id = 2
                        AND acc.id = ?`
}

module.exports =  GetDeptByAccountId