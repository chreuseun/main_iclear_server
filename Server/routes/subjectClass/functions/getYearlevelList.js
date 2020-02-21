// Adding 1 row to subject_detail
var jwtVerify = require('../../reuse/jwtVerify');
var query = require('../../reuse/query')
var sql = require('../../../mysql/queries/accounts/Login')


const GetYearLevelList = async ({res, token, params}) => {

    console.log(params)
    let error  = false;    
    let jwtResult;
    let sqlResult;
    
    
    try{
        jwtResult= await jwtVerify(token); // => {token:'string' , decoded":{}}
        // console.log(jwtResult)
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

    // insert new department
    try{
            if(sqlResult[0].is_token === 'AUTH') {
            console.log(params)
            sqlResult = await query(_sql.getYearLevelList , [params])

        }
    } catch (err){
        error  = true;  
    }

    error ? 
    res.sendStatus(401) : 
    res.json({ data : sqlResult[1] })
}

let _sql = {
    getYearLevelList : `
                        SET @el_id := ?;

                        SELECT
                            DISTINCT(yearlevel) AS 'yearlevel'
                        
                        FROM student_ s 
                        JOIN acad_year ay ON ay.id = s.acad_year_id 
                        JOIN semester sem ON sem.id = s.semester_id 
                        
                        WHERE IF(@el_id IN (1,2), true, sem.state = 1) 
                            AND s.educ_level_id = @el_id 
                            AND ay.state = 1`
}

module.exports =  GetYearLevelList;

