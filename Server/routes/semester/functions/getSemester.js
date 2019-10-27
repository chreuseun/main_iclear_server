var jwtVerify = require('../../reuse/jwtVerify');
var query = require('../../reuse/query')
var sql = require('../../../mysql/queries/accounts/Login')

const asyncGetCourseLevel = async ({res, token, params}) => {
    
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
        if(true){

            let sql = `SELECT id, name, level, state 
                            FROM semester WHERE name != 'ALL'`;

            sqlResult = await query(sql, [])
        }
    } catch (err){
        error  = true;  
    }

    error ? 
        res.sendStatus(401) : 
        res.json({ data:sqlResult})
}

module.exports =  asyncGetCourseLevel