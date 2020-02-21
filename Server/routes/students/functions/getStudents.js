var jwtVerify = require('../../reuse/jwtVerify');
var query = require('../../reuse/query');
var sql = require('../../../mysql/queries/accounts/Login')

const getStudents = async({res, token, params}) => {
    
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
    console.log(params)

    // insert new department
    try{
        if(sqlResult[0].is_token === 'AUTH') {

            sqlResult = await query(_sql.getStudent, [
                `%${params.text}%`,
                `%${params.level}%`,
                `%${params.course}%`,
                `%${params.yrlvl}%`,
                `%${params.section}%`
            ] );
        }
    } catch (err){
        error  = true;
    }

    error ? 
    res.sendStatus(401) : 
    res.json({ data:sqlResult[5] })
}

let _sql = {
    getStudent : `
                SET @text := ?;
                SET @level := ?;
                SET @course := ?;
                SET @yrlvl := ?;
                SET @section := ?;

                SELECT 
                    s.*,
                    el.name AS 'el_name',
                    sem.name AS 'sem_name',
                    ay.name AS 'ay_name',
                    DATE_FORMAT(s.created_at, '%Y-%m-%d') AS reg_date,
                    DATE_FORMAT(s.updated_at, '%Y-%m-%d') AS upd_date

                FROM student_ s
                JOIN educ_level el ON el.id = s.educ_level_id
                JOIN semester sem ON sem.id = s.semester_id
                JOIN acad_year ay ON ay.id = s.acad_year_id
                
                WHERE
                    s.educ_level_id LIKE @level AND
                    s.course LIKE @course AND
                    s.yearlevel LIKE @yrlvl AND 
                    s.section LIKE @section AND 
                    (studfname LIKE @text OR
                    studmname LIKE @text OR
                    studlname LIKE @text OR
                    username LIKE @text); `
}



module.exports =  getStudents;


