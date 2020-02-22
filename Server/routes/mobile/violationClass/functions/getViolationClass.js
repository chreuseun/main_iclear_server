var jwtVerify = require('../../../reuse/jwtVerify');

// Requires < SQL > , < ARRAY_PARAMETER >
var query = require('../../../reuse/query')

const getViolation = async ({res, token, params}) => {

    console.log(params);
    let jwtResult;
    let sqlResult;

    try{
        jwtResult= await jwtVerify(token);
    } catch(err) {
        return(res.sendStatus(401))
    }

    try{
        sqlResult = await query(_sql.getViolationClass, [jwtResult.decoded.username]);
    } catch (err){
        return(res.sendStatus(401))
    }

    return res.json({ msg:'okay', title:`get subject teacher clearance record for the student`, dataLength: sqlResult[1].length || 0, data: sqlResult[1] || []});
}

const _sql = {
  getViolationClass: `
  SET @username := ?;

  SELECT 
    ci.id AS ci_id,
    ci.student_username,
    ci.course,
    ci.yearlevel,
    ci.section,
    ci.acad_year_id,
    ci.semester_id,
    ci.context,
    ci.status,
    ci.is_deleted,
    DATE(ci.created_at) AS issued_on,
    is_upload,
    c.id AS c_id,
    c.name AS c_name,
    c.teacher_account_id,
    ay.name AS 'ay_name',
    sem.name AS 'sem_name',
    a.fullname AS subject_teacher_name

  FROM class_issue AS ci
  JOIN class AS c ON c.id = ci.class_id
  JOIN acad_year ay ON ay.id = ci.acad_year_id
  JOIN semester sem ON sem.id = ci.semester_id
  LEFT JOIN account a ON a.id = c.teacher_account_id

  WHERE ci.student_username = @username;`,

}

module.exports =  getViolation;
