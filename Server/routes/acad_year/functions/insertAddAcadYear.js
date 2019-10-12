/*
    STATUS : NOT
*/

// Requries 'Bearer TOKENxxxxx'
var jwtVerify = require('../../reuse/jwtVerify');

// Requires < SQL > , < ARRAY_PARAMETER >
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
        sqlResult = await query(sql.select_blacklist_token, [jwtResult.token, jwtResult.decoded.id])
    } catch (err) {
        error  = true; 
    }
    
    // get acadYear
    try{
        if(sqlResult[0].is_token === 'AUTH') {

            let sql = `INSERT INTO acad_year (base_year, name) 
            SELECT 
                (SELECT MAX(base_year) +1  FROM acad_year),
                (SELECT CONCAT( MAX(base_year) + 1 , '-', MAX(base_year)+2) FROM acad_year)
            WHERE NOT EXISTS 
            (Select id From acad_year 
                                    WHERE base_year =(SELECT MAX(base_year)+1 FROM acad_year) 
                                           AND name = (SELECT CONCAT( MAX(base_year)+1 , '-', MAX(base_year)+2) FROM acad_year) ) LIMIT 1`;

            sqlResult = await query(sql, [])
        }
    } catch (err){
        error  = true;  
    }

    error ? 
        res.sendStatus(401) : 
        res.json({ data:sqlResult.insertId})
}

module.exports =  asyncSetAcadYear