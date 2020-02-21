var jwtVerify = require('../../reuse/jwtVerify');
var query = require('../../reuse/query')
var sql = require('../../../mysql/queries/accounts/Login')

const GetClassCourse = async ({res, token, params}) => {
    
    let error  = false;    
    let jwtResult;
    let sqlResult;

    //varify Token
    try{
        jwtResult= await jwtVerify(token);

    } catch(err) {
        error  = true; 
        console.log('Error Token')
    }

    if(!jwtResult) {
        error  = true; 
    }

    try{
        sqlResult = await query(sql.select_blacklist_token_all, [jwtResult.token, jwtResult.decoded.id])
    } catch (err) {
        error  = true; 
        console.log('Error Auth')
    }
    
    // get ONE department
    try{
        if(sqlResult[0].is_token === 'AUTH') {
            sqlResult = await query(_sql.getClassCourse, params);
        }
    } catch (err){
        error  = true;  
    }

    error ? 
        res.sendStatus(401) : 
        res.json({ data : sqlResult })
}

let _sql= {
    getClassCourse : `SELECT 
                            data as 'key', 
                            data as 'value', 
                            data as 'text'
                        FROM
                        (SELECT 
                            DISTINCT course AS 'data'

                        FROM student_

                        WHERE educ_level_id = ?) as main`
}

module.exports =  GetClassCourse