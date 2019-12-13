var jwtVerify = require('../../reuse/jwtVerify');
var query = require('../../reuse/query')
var sql = require('../../../mysql/queries/accounts/Login')

const GetAllEventByDeptId = async ({res, token, params}) => {
    
    let error  = false;    
    let jwtResult;
    let sqlResult;
    let dataResult = {};

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
            dataResult.getEventListByDeptId = await query(_sql.getEventListByDeptId, params)
        }
    } catch (err){
        error  = true;  
    }

    error ? 
        res.sendStatus(401) : 
        res.json({ data:dataResult.getEventListByDeptId})
}


let _sql= {
    getEventListByDeptId : `SELECT 
                                ev.*,
                                evt.name as 'evt_name',
                                ay.name AS 'ay_name',
                                sem.name AS 'sem_name',
                                dep.educ_level_id AS 'el_id',   
                                lastname ,
                                firstname,
                                middlename
    
                            FROM events ev
                            JOIN events_type evt ON evt.id = ev.events_type_id
                                AND ev.departments_id = ?
                            JOIN acad_year ay ON ay.id = ev.acad_year_id
                            JOIN semester sem ON sem.id = ev.semester_id
                            JOIN departments dep ON dep.id = ev.departments_id
                            JOIN account acc ON acc.id = ev.creator_account_id`
}

module.exports =  GetAllEventByDeptId;