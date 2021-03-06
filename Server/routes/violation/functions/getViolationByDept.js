var jwtVerify = require('../../reuse/jwtVerify');
var query = require('../../reuse/query');
var sql = require('../../../mysql/queries/accounts/Login');

const GetViolationByDept = async ({res, token, params}) => {
    
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
    
    try{
        if(sqlResult[0].is_token === 'AUTH') {
            sqlResult = await query(_sql.getViolatoin_of_dept, params)
        }
    } catch (err){
        error  = true;  
    }

    error ?
        res.sendStatus(401) : 
        res.json({ data : sqlResult })
}

let _sql = {
    getViolatoin_of_dept : `SELECT 
                                v.id AS 'v_id', 
                                v.name AS 'v_name',
                                v.description AS 'v_description',
                                v.violation_class_id,
                                v.is_deleted,
                                vc.name AS 'v_class',
                                vc.educ_level_id,
                                '-',
                                d.*

                            FROM violation v 
                            JOIN violation_class vc ON vc.id = v.violation_class_id
                            JOIN departments d ON d.educ_level_id = vc.educ_level_id
                                AND d.department_type_id = 3
                                AND d.id = ?
                                AND d.state = 1`
}

module.exports =  GetViolationByDept