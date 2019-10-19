var jwtVerify = require('../../reuse/jwtVerify');
var query = require('../../reuse/query')
var sql = require('../../../mysql/queries/accounts/Login')

const getDeptStudents = async ({res, token, params}) => {
    
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
    
    // get acadYear
    try{
        if(sqlResult[0].is_token === 'AUTH') {

            dataResult.dep = (await query(_sql.getDepOne, params))[0]
            dataResult.students = await query(_sql.getDepStudent, params)
        }
    } catch (err){
        error  = true;  
    }

    error ? 
        res.sendStatus(401) : 
        res.json({ data:dataResult})
}

const _sql = {
    getDepStudent : `SELECT  
                        s.id as 's_id',
                        s.acad_year_id as 's_acd_yr',
                        s.semester_id as 's_sem_id',
                        d.department_type_id as 'd_type_id',
                        d.course as 'd_crs',
                        d.yearlevel  as 'd_yr',
                        d.educ_level_id AS 'el_id',
                        d.id AS 'd_id',
                        
                        s.username as 's_username',
                        s.studfname as 's_fn',
                        s.studmname as 's_mn',
                        s.studlname as 's_ln',
                        s.yearlevel as 's_yr',
                        s.section as 's_sec',
                        s.course as 's_crs',
                        ay.name as 'ay_name',
                        sem.name as 'sem_name' 
                    
                    
                    FROM departments as d
                    JOIN student_ as s ON s.educ_level_id = d.educ_level_id
                        AND (CASE
                                WHEN d.course = '-ALL' THEN true
                                ELSE d.course = s.course
                            END)
                        AND (CASE
                                WHEN d.yearlevel = '-ALL' THEN true
                                ELSE d.yearlevel = s.yearlevel
                            END)
                        AND d.state = '1'
                        AND d.id = ?
                    JOIN acad_year ay ON ay.id = s.acad_year_id
                    JOIN semester sem ON sem.id = s.semester_id`,
    
    getDepOne : `SELECT 
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

    WHERE d.state = '1' AND  d.id = ? LIMIT 1`

    
}

module.exports =  getDeptStudents