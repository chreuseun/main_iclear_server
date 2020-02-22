var jwtVerify = require('../../../reuse/jwtVerify');

// Requires < SQL > , < ARRAY_PARAMETER >
var query = require('../../../reuse/query')


const getViolation = async ({res, token, params}) => {

    const {mode} = params;

    console.log(params);
    let jwtResult;
    let sqlResult;

    try{
        jwtResult= await jwtVerify(token);
    } catch(err) {
        return(res.sendStatus(401))
    }

    try{
       if (mode==='grouped'){
        sqlResult = await query(_sql.getViolations_grouped, [jwtResult.decoded.username]);
       }else{
        sqlResult = await query(_sql.getViolations, [jwtResult.decoded.username]);
       }

        
    } catch (err){
        return(res.sendStatus(401))
    }

    return res.json({ msg:'okay', title:`violation record of student by username`, dataLength: sqlResult[1].length || 0, data: sqlResult[1] || []});
}

const _sql = {
  getViolations: `
  SET @username := ?;

  SELECT 
    sv.*,
    '--',
    s.department AS 's_dep',
    sem.name as 'sem_name',
    v.name as 'v_name',
      v.violation_class_id,
      vc.name AS 'vc_name',
    ay.name AS 'ay_name' ,
    DATE_FORMAT(sv.created_at, "%m-%d-%Y") AS 'issued_on',
    DATE_FORMAT(sv.created_at, "%r")AS 'time'

  FROM student_violation sv
  JOIN student_ s ON s.username = sv.student_username	
    AND s.username IN (@username)
  JOIN semester sem ON sem.id = sv.semester_id
  JOIN violation v ON v.id = sv.violation_id
  JOIN acad_year ay ON ay.id = sv.acad_year_id
  JOIN violation_class vc ON vc.id = v.violation_class_id;`,

  getViolations_grouped: `
  SET @username := ?;

  SELECT
    sv.*,
    COUNT(DISTINCT sv.id) AS 'max_existing_record',
    '--',
    s.department AS 's_dep',
    sem.name as 'sem_name',
    v.name as 'v_name',
    ay.name AS 'ay_name' ,
    DATE_FORMAT(sv.created_at, "%m-%d-%Y") AS 'issued_on',
    DATE_FORMAT(sv.created_at, "%r")AS 'time'

  FROM student_violation sv
  JOIN student_ s ON s.username = sv.student_username	
    AND s.username IN (@username)
  JOIN semester sem ON sem.id = sv.semester_id
  JOIN violation v ON v.id = sv.violation_id
  JOIN acad_year ay ON ay.id = sv.acad_year_id

  GROUP BY s.username, sv.violation_id, sv.semester_id, sv.acad_year_id;`,

}

module.exports =  getViolation;
