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
    getClassStudentList : `SELECT cli.* , 
                            cls.educ_level_id,
                            cls.name AS 'cls_name',
                            ay.name AS 'ay_name',
                            sem.name AS 'sem_name',
                            el.name AS 'el_name',
                            st.studfname,
                            st.studlname,
                            st.studmname
                        FROM class_issue cli
                        JOIN class cls ON cls.id = cli.class_id
                            AND cls.id = ?
                        JOIN acad_year ay ON ay.id = cls.acad_year_id
                        JOIN semester sem ON sem.id = cls.semester_id
                        JOIN educ_level el ON el.id = cls.educ_level_id
                        JOIN student_ st ON st.username = cli.student_username`
}

module.exports =  InsertNewSubj