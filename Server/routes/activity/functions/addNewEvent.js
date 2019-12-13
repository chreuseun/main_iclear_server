var jwtVerify = require('../../reuse/jwtVerify');
var query = require('../../reuse/query')
var sql = require('../../../mysql/queries/accounts/Login')

const AddNewEvent = async ({res, token, params}) => {
    
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
            dataResult.addNewEvent = await query(_sql.addNewEvent, params)
        }
    } catch (err){
        error  = true;  
    }

    error ? 
        res.sendStatus(401) : 
        res.json({ data:dataResult.addNewEvent})
}


let _sql= {
    addNewEvent : `INSERT INTO events
                        (
                            departments_id,
                            events_type_id,
                            name,
                            semester_id, -- q
                            acad_year_id, -- q
                            course, -- -ALL
                            yearlevel, -- -ALL
                            student_department,
                            creator_account_id
                        )

                        VALUES
                        (
                            ?,
                            ?,
                            ?,
                            (SELECT id FROM semester WHERE state = 1 LIMIT 1),
                            (SELECT id FROM acad_year WHERE state = 1 LIMIT 1),
                            '-ALL',
                            '-ALL',
                            ?,
                            ?
                        );`
}

module.exports =  AddNewEvent



/*INSERT INTO events
(
departments_id,
events_type_id,
name,
semester_id,
acad_year_id,
course, -- ALL
yearlevel, -- ALL
student_department,
creator_account_id)
VALUES
(
121
);*/