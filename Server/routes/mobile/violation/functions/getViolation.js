var jwtVerify = require('../../../reuse/jwtVerify');

// Requires < SQL > , < ARRAY_PARAMETER >
var query = require('../../../reuse/query')


const getViolation = async ({res, token, params}) => {

    const {mode, semesterId, acadYearId} = params;


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
        sqlResult = await query(_sql.getViolations_grouped, [jwtResult.decoded.username, semesterId, acadYearId]);
       }else{
        sqlResult = await query(_sql.getViolations, [jwtResult.decoded.username, semesterId, acadYearId]);
       }

        
    } catch (err){
        return(res.sendStatus(401))
    }

    return res.json({ msg:'okay',params , title:`violation record of student by username`, dataLength: sqlResult[3].length || 0, data: sqlResult[3] || []});
}

const _sql = {
  getViolations: `
    SET @username := ?;
    SET @semesterId := ?;
    SET @acadYearId := ?;

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
      AND sv.semester_id LIKE @semesterId
    JOIN violation v ON v.id = sv.violation_id
    JOIN acad_year ay ON ay.id = sv.acad_year_id
      AND sv.acad_year_id LIKE @acadYearId
    JOIN violation_class vc ON vc.id = v.violation_class_id;`,

  getViolations_grouped: `
    SET @username := ?;
    SET @semesterId := ?;
    SET @acadYearId := ?;

    SELECT
      sv.*,
      COUNT(DISTINCT sv.id) AS 'max_existing_record',
      '--',
      s.department AS 's_dep',
      sem.name as 'sem_name',
      v.name as 'v_name',
      ay.name AS 'ay_name' ,
      vc.name AS 'vc_name',
      DATE_FORMAT(sv.created_at, "%m-%d-%Y") AS 'issued_on',
      DATE_FORMAT(sv.created_at, "%r")AS 'time'

    FROM student_violation sv
    JOIN student_ s ON s.username = sv.student_username	
      AND s.username IN (@username)
    JOIN semester sem ON sem.id = sv.semester_id
      AND sv.semester_id LIKE @semesterId
    JOIN violation v ON v.id = sv.violation_id
    JOIN acad_year ay ON ay.id = sv.acad_year_id
      AND sv.acad_year_id LIKE @acadYearId
    JOIN violation_class vc ON vc.id = v.violation_class_id

    GROUP BY s.username, sv.violation_id, sv.semester_id, sv.acad_year_id;`,
}

module.exports =  getViolation;
