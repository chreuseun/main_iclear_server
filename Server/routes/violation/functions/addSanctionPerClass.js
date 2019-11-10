var jwtVerify = require('../../reuse/jwtVerify');
var query = require('../../reuse/query');
var sql = require('../../../mysql/queries/accounts/Login');

const AddNewSanction = async ({res, token, params}) => {
    
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
            sqlResult = await query(_sql.addSanctionPerClass , params)
        }
    } catch (err){
        error  = true;  
    }

    error ?
        res.sendStatus(401) : 
        res.json({ data : sqlResult[3] })
}

let _sql = {
    addSanctionPerClass : `
                            SET @class_id := ?;
                            SET @dept_id := ?;
                            SET @desc := ?;
                            
                            INSERT INTO violation_sanction
                            (
                                violation_class_id,
                                offence_level,
                                description
                            )

                            VALUES
                            (
                                @class_id,

                                (SELECT 
                                    IF( (SELECT id FROM departments WHERE id = @dept_id AND department_type_id = 3) IS NULL, NULL, COUNT(vs.id) + 1 )  as count
                                FROM violation_sanction vs
                                JOIN violation_class vc ON vc.id = vs.violation_class_id

                                WHERE vc.id =  @class_id),

                                @desc
                            );`

}

module.exports =  AddNewSanction 




