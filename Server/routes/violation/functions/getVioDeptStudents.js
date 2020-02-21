var jwtVerify = require('../../reuse/jwtVerify');
var query = require('../../reuse/query')
var sql = require('../../../mysql/queries/accounts/Login')

const GetVioDeptStudentList = async ({res, token, params}) => {
    
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
    
    try{
        if(sqlResult[0].is_token === 'AUTH') {
            dataResult.VioStudentList = await query(_sql.getViolationDeptStudentList, [
                params.deptVioId,
                `%${params.text}%`,
                `%${params.level}%`,
                `%${params.course}%`,
                `%${params.yrlvl}%`,
                `%${params.section}%`
            ])
        }
    } catch (err){
        error  = true;  
    }

    error ? 
        res.sendStatus(401) : 
        res.json({ data:dataResult.VioStudentList[6]})
}

let _sql= {
    getViolationDeptStudentList : `
                                    SET @dept_id := ?;
                                    SET @text := ?;
                                    SET @level := ?;
                                    SET @course := ?;
                                    SET @yrlvl := ?;
                                    SET @section := ?;

                                    SELECT  
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
                                        s.department AS 's_dept',
                                        ay.name as 'ay_name',
                                        sem.name as 'sem_name' 

                                    FROM departments as d
                                    JOIN student_ as s ON s.educ_level_id = d.educ_level_id
                                        AND s.educ_level_id LIKE @level AND
                                        s.course LIKE @course AND
                                        s.yearlevel LIKE @yrlvl AND 
                                        s.section LIKE @section AND 
                                        (studfname LIKE @text OR
                                        studmname LIKE @text OR
                                        studlname LIKE @text OR
                                        username LIKE @text)
                                        AND (CASE
                                                WHEN d.course = '-ALL' THEN true
                                                ELSE d.course = s.course
                                            END)
                                        AND (CASE
                                                WHEN d.yearlevel = '-ALL' THEN true
                                                ELSE d.yearlevel = s.yearlevel
                                            END)
                                            
                                        AND (CASE
                                                WHEN d.student_department IN ('ALL','NONE') THEN true
                                                ELSE d.student_department = s.department
                                            END)
                                        AND d.state = '1'
                                        AND d.id = @dept_id
                                        AND d.department_type_id = '3'
                                    JOIN acad_year ay ON ay.id = s.acad_year_id
                                    JOIN semester sem ON sem.id = s.semester_id`
}

module.exports =  GetVioDeptStudentList