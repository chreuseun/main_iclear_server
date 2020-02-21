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

            const {course, el_id , yearlevel} = params;

            sqlResult = await query(_sql.getSectionList , [course, el_id, yearlevel])

        }
    } catch (err){
        error  = true;  
    }

    error ? 
    res.sendStatus(401) : 
    res.json({ data : sqlResult[3] })
}

let _sql = {
    getSectionList : `
                        SET @course := ?;
                        SET @el_id := ?;
                        SET @yearlevel := ?;
                        
                        SELECT 
                            section AS 'value',
                            section AS 'key',
                            section AS 'text'
                        
                        FROM
                        (SELECT 
                            DISTINCT(section) AS 'section'
                        FROM student_ AS s
                        JOIN semester AS sem ON sem.id = s.semester_id
                            AND IF(@el_id IN (1,2), true, sem.state = 1)
                        JOIN acad_year AS ay ON ay.id = s.acad_year_id
                            AND ay.state = 1
                            
                        WHERE s.educ_level_id = @el_id
                            AND s.course = @course
                            AND s.yearlevel = @yearlevel) AS main`
}

module.exports =  GetYearLevelList;

