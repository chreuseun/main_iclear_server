var jwtVerify = require('../../reuse/jwtVerify');
var query = require('../../reuse/query')
var sql = require('../../../mysql/queries/accounts/Login')

const updateClassIssueRemarks = async ({res, token, params}) => {
    
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
    
    // get ONE department
    try{
        if(sqlResult[0].is_token === 'AUTH') {

            sqlResult = await query(_sql.getCurrentAvailableClass, [...params, jwtResult.decoded.id])
        }
    } catch (err){
        error  = true;  
    }
    
    error ? 
        res.sendStatus(401) : 
        res.json({ data:sqlResult})
}

let _sql= {
    getCurrentAvailableClass : `UPDATE 
                                    class_issue
                                SET is_upload = 0,
                                status = ?

                                WHERE id IN (?)`
}

module.exports =  updateClassIssueRemarks