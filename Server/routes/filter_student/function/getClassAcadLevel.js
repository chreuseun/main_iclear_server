var jwtVerify = require('../../reuse/jwtVerify');
var query = require('../../reuse/query')
var sql = require('../../../mysql/queries/accounts/Login')

const GetClassAcadLevels = async ({res, token, params}) => {
    
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
            sqlResult = await query(_sql.getAcadLevelClass, []);
        }
    } catch (err){
        error  = true;  
    }

    error ? 
        res.sendStatus(401) : 
        res.json({ data:sqlResult })
}

let _sql= {
    getAcadLevelClass : `SELECT 
                            id AS 'key',
                            name AS 'text',
                            id AS  'value'

                        FROM educ_level

                        WHERE id IN (1,2)`
}

module.exports =  GetClassAcadLevels