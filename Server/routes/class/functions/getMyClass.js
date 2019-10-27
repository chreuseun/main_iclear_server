var jwtVerify = require('../../reuse/jwtVerify');
var query = require('../../reuse/query')
var sql = require('../../../mysql/queries/accounts/Login')

const GetCurrentAvailable = async ({res, token, params}) => {
    
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
            sqlResult = await query(_sql.getMyClass, params)
        }
    } catch (err){
        error  = true;  
    }

    error ? 
        res.sendStatus(401) : 
        res.json({ data:sqlResult})
}


let _sql= {
    getMyClass : `SELECT cl.* ,
        el.name AS el_name,
        ay.name AS ay_name,
        sem.name AS sem_name
        
    FROM class cl
    JOIN educ_level el ON el.id = cl.educ_level_id
    JOIN acad_year ay ON ay.id = cl.acad_year_id
    JOIN semester sem ON sem.id = cl.semester_id

    WHERE teacher_account_id = ?`
}

module.exports =  GetCurrentAvailable