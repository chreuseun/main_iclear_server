var jwtVerify = require('../../reuse/jwtVerify');
var query = require('../../reuse/query')
var sql = require('../../../mysql/queries/accounts/Login')

const GetCurrentAvailable = async ({res, token, params}) => {
    
    let error  = false;    
    let jwtResult;
    let sqlResult;

    //varify Token
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
            sqlResult = await query(_sql.getCourse, params)
        }
    } catch (err){
        error  = true;  
    }

    error ? 
        res.sendStatus(401) : 
        res.json({ data:sqlResult})
}


let _sql= {
    getCourse : `SELECT 
	course AS 'key',
    course AS 'value',
    course AS 'text'

FROM student_

GROUP By course`
}

module.exports =  GetCurrentAvailable