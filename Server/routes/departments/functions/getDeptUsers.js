/*
    STATUS : NOT
*/

// Requries 'Bearer TOKENxxxxx'
var jwtVerify = require('../../reuse/jwtVerify');

// Requires < SQL > , < ARRAY_PARAMETER >
var query = require('../../reuse/query')

var sql = require('../../../mysql/queries/accounts/Login')

const asyncGetDeptUser = async ({res, token, params}) => {
    
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
        sqlResult = await query(sql.select_blacklist_token, [jwtResult.token, jwtResult.decoded.id])
    } catch (err) {
        error  = true; 
    }
    
    // get ONE department
    try{
        if(sqlResult[0].is_token === 'AUTH') {
            dataResult.deptUser = await query(_sql.getDeptUser, params)
            dataResult.department = (await query(_sql.getDeptOne, params))[0]
        }
    } catch (err){
        error  = true;  
    }

    error ? 
        res.sendStatus(401) : 
        res.json({ data:dataResult})
}


let _sql= {
    getDeptUser : `SELECT 
                        IF(dep.acc_id IS NULL, '0', '1') AS 'is_member',
                        user.acc_id,
                        username,
                        lastname,
                        firstname,
                        middlename

                    FROM
                        (SELECT 
                            acc.id AS 'acc_id',
                            acc.username,
                            coalesce(acc.lastname, '') as 'lastname',
                            coalesce(acc.firstname, '') as 'firstname',
                            coalesce(acc.middlename, '') as 'middlename'
                        FROM account acc WHERE NOT acc.user_type_id IN ('ADMIN', 'SUBJECT')) AS user
                        
                    LEFT JOIN 
                        (SELECT 
                            acc.id AS 'acc_id'
                        FROM account acc
                        JOIN account_departments ad ON ad.account_id = acc.id

                        WHERE ad.departments_id = ? AND NOT acc.user_type_id IN ('ADMIN', 'SUBJECT') ) AS dep ON dep.acc_id = user.acc_id`,
    getDeptOne : `SELECT 
                d.name as 'd_name',    
                el.name as 'el_name',
                dt.name as 'd_type_name',
                d.course as 'd_course',
                d.yearlevel as 'd_yearlevel',
                d.head_officer,
                d.state as 'd_state',
                is_coursed,
                
                d.id as 'd_id',
                d.department_type_id as 'd_type',
                el.id as 'el_id'

            FROM departments d
            JOIN departments_type dt ON dt.id = d.department_type_id
            JOIN educ_level el ON el.id = d.educ_level_id

            WHERE d.id = ?`
}

module.exports =  asyncGetDeptUser