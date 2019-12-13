var jwtVerify = require('../../reuse/jwtVerify');
var query = require('../../reuse/query')
var sql = require('../../../mysql/queries/accounts/Login')

const InsertNewSubj = async ({res, token, params}) => {
    
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
        sqlResult = await query(sql.select_blacklist_token_all, [jwtResult.token, jwtResult.decoded.id]);
    } catch (err) {
        error  = true; 
    }
    
    // get ONE department
    try{
        if(sqlResult[0].is_token === 'AUTH') {

            sqlResult = await query(_sql.getCurrentAvailableClass, [...params, jwtResult.decoded.id])

            console.log(sqlResult.insertId)
            console.log([...params])



            sqlResult = await query(_sql.insertStudentInClass, [sqlResult.insertId])

            console.log(sqlResult.insertId)
        }
    } catch (err){
        error  = true;  
    }
    
    error ? 
        res.sendStatus(401) : 
        res.json({ data:sqlResult})
}

let _sql= {
    getCurrentAvailableClass : `INSERT INTO class (
                                name,             
                                educ_level_id,
                                course,
                                yearlevel, 
                                section, 
                                acad_year_id, 
                                semester_id,
                                teacher_account_id) 
                                
                                VALUES (
                                ?,
                                ?,
                                ?,
                                ?,
                                ?,
                                (SELECT id FROM acad_year WHERE state = 1 LIMIT 1),
                                (SELECT id FROM semester WHERE IF( ? IN (1,2), id = 4, state = 1) LIMIT 1),
                                ?)`,
                                
    insertStudentInClass : `INSERT INTO class_issue(
                                student_username,
                                class_id,
                                course,
                                yearlevel,
                                section,
                                acad_year_id,
                                semester_id,
                                context
                            )
                            
                            SELECT 
                                st.username,
                                cls.id AS 'cls_id',
                                cls.course,
                                cls.yearlevel,
                                cls.section,
                                cls.acad_year_id,
                                cls.semester_id,
                                'sample context'
                                
                            FROM student_ st 
                                JOIN class cls ON cls.course = st.course
                                    AND cls.educ_level_id = st.educ_level_id
                                    AND cls.yearlevel = st.yearlevel
                                    AND cls.section = st.section
                                    AND cls.acad_year_id = st.acad_year_id
                                    AND cls.semester_id = st.semester_id
                                    AND cls.id = ?`
}

module.exports =  InsertNewSubj