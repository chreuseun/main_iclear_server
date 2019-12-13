/*
    STATUS : NOT
*/

// Requries 'Bearer TOKENxxxxx'
var jwtVerify = require('../../reuse/jwtVerify');

// Requires < SQL > , < ARRAY_PARAMETER >
var query = require('../../reuse/query')

var sql = require('../../../mysql/queries/accounts/Login')

const asyncStudentInsertBulkCSV = async ({res, token, params}) => {
    
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

    // insert new department
    try{
        if(sqlResult[0].is_token === 'AUTH') {

            let sql = `INSERT INTO user_type (id)
                        VALUES ?`;

            sqlResult = await query(_sql.insertStudentBulkCSV, params );
        }
    } catch (err){
        error  = true;  
    }


    error ? 
    res.sendStatus(401) : 
    res.json({ data:sqlResult })
}

let _sql = {
    insertStudentBulkCSV : `INSERT IGNORE student_ (
        id,
        educ_level_id,
        username,
        password,
        image_url,
        studfname,
        studmname,
        studlname,
        course,
        yearlevel,
        cpnum,
        familyphone,
        gender,
        section,
        acad_year_id,
        semester_id,
        department,
        activity_card_barcode
    )
    
    VALUES ?
    
    ON DUPLICATE KEY UPDATE 
        educ_level_id = VALUES(educ_level_id),
        password = VALUES(password),
        image_url= VALUES(image_url),
        studfname= VALUES(studfname),
        studmname= VALUES(studmname),
        studlname= VALUES(studlname),
        course= VALUES(course),
        yearlevel= VALUES(yearlevel),
        cpnum= VALUES(cpnum),
        familyphone= VALUES(familyphone),
        gender = VALUES(gender),
        section = VALUES(section),
        acad_year_id = VALUES(acad_year_id),
        semester_id  = VALUES(semester_id),
        department=VALUES(department),
        activity_card_barcode=VALUES(activity_card_barcode)`
}



module.exports =  asyncStudentInsertBulkCSV;


