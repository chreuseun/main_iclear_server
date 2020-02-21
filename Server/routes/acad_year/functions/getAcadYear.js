/*
    STATUS : NOT
*/

// Requries 'Bearer TOKENxxxxx'
var jwtVerify = require('../../reuse/jwtVerify');

// Requires < SQL > , < ARRAY_PARAMETER >
var query = require('../../reuse/query')

var sql = require('../../../mysql/queries/accounts/Login')

const asyncGetCourseLevel = async ({res, token, params}) => {
    
    let error  = false;    
    let jwtResult;
    let sqlResult;
    console.log(token)
    try{
        jwtResult= await jwtVerify(token);
    } catch(err) {
        console.log('token')
        error  = true; 
    }
    
    if(!jwtResult) {
        error  = true; 
    }

    // get acadYear
    try{
        
            let sql = `SELECT * FROM acad_year ORDER BY base_year ASC`;

            sqlResult = await query(sql, []);

    } catch (err){
        console.log('sql')
        error  = true;  
    }

    error ? 
        res.sendStatus(401) : 
        res.json({ data:sqlResult})
}

module.exports =  asyncGetCourseLevel