var jwtVerify = require('../../reuse/jwtVerify');
var query = require('../../reuse/query');
var sql = require('../../../mysql/queries/accounts/Login');

const GetClassSantionByClassId = async ({res, token, params}) => {
    
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
            sqlResult = await query(_sql.getClassSantion , params)
        }
    } catch (err){
        error  = true;  
    }

    error ?
        res.sendStatus(401) : 
        res.json({ data : sqlResult })
}

let _sql = {
    getClassSantion : `SELECT 
                            vs.id AS vs_id,
                            vs.violation_class_id AS vs_class_id,
                            vs.offence_level,
                            vs.description,
                            vs.state,
                            vc.name AS class_name,
                            vc.educ_level_id
                            
                        FROM violation_sanction vs
                        JOIN violation_class vc ON vc.id = vs.violation_class_id
                        JOIN departments dep ON dep.educ_level_id =vc.educ_level_id
                            AND dep.department_type_id = '3'

                        WHERE vc.id = ?
                            AND dep.id = ?

                        ORDER BY offence_level ASC`
}

module.exports =  GetClassSantionByClassId 