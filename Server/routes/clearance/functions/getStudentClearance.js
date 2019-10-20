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
        error  = true; 
    }
    
    // get studentClearance
    try{
        if(sqlResult[0].is_token === 'AUTH') {
            sqlResult = await query(sql_.getClearance, params)

        }
    } catch (err){
        error  = true;  
    }

    error ? 
        res.sendStatus(401) : 
        res.json({ data:sqlResult})
}

const sql_ = {
    getClearance: `SELECT 
                        * 
                    FROM
                    (SELECT 
                        ci.id AS 'ci_id',
                        ci.student_username AS 'ci_s_uid',
                        ci.context,
                        ci.status AS 'ci_status',
                        COALESCE(a_by.fullname, '') AS 'issue_by',
                        ci.account_id_by AS 'ci_acc_by',
                        COALESCE(a_status.fullname, '')AS 'status_by',
                        ci.account_id_status AS 'ci_acc_status',
                        ci.update_at AS 'ci_remarks_at'
                        
                    FROM clearance_issue ci
                    LEFT JOIN account a_by ON a_by.id = ci.account_id_by  
                    LEFT JOIN account a_status ON a_status.id = ci.account_id_status  

                    WHERE ci.departments_id LIKE CONCAT('%',?,'%') ) AS main

                    WHERE ci_s_uid LIKE CONCAT('%',?,'%')`                                   

}

module.exports =  asyncSetAcadYear