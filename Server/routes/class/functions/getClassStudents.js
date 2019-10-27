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
        sqlResult = await query(sql.select_blacklist_token_all, [jwtResult.token, jwtResult.decoded.id])
    } catch (err) {
        error  = true; 
    }
    

    try{
        if(sqlResult[0].is_token === 'AUTH') {

            sqlResult = await query(_sql.getClassStudentList, params) // requires class_id

        }
    } catch (err){
        error  = true;  
    }
    
    error ? 
        res.sendStatus(401) : 
        res.json({ data:sqlResult})
}

let _sql= {
    getClassStudentList : `SELECT 
                                st.username,
                                cls.id AS 'cls_id',
                                cls.course,
                                cls.yearlevel,
                                cls.section,
                                cls.acad_year_id,
                                cls.semester_id,
                                'sample context'

                            FROM student_ st 
                            JOIN class cls ON cls.educ_level_id = st.educ_level_id
                            AND cls.course = st.course
                            AND cls.yearlevel = st.yearlevel
                            AND cls.section = st.section
                            AND cls.acad_year_id = st.acad_year_id
                            AND cls.semester_id = st.semester_id
                            AND cls.id = ?`
}

module.exports =  InsertNewSubj