var jwtVerify = require('../../../reuse/jwtVerify');

// Requires < SQL > , < ARRAY_PARAMETER >
var query = require('../../../reuse/query')


const getDepartmentClearanceRecords = async ({res, token, params}) => {

    const {semesterId, acadYearId} = params;
    console.log(params);
    let jwtResult;
    let sqlResult;

    try{
        jwtResult= await jwtVerify(token);
    } catch(err) {
        return(res.sendStatus(401))
    }

    try{
        sqlResult = await query(_sql.getDepartmentClearanceRecords, [jwtResult.decoded.username, semesterId, acadYearId]);
    } catch (err){
        return(res.sendStatus(401))
    }
    return res.json({ msg:'okay', title:`clearance record of student by username`,data: sqlResult[3] || []});
}

const _sql = {
  getDepartmentClearanceRecords : `
                                  SET @username := ?;
                                  SET @semesterId := ?;
                                  SET @acadYearId := ?;

                                  SELECT
                                    s.username,
                                    s.educ_level_id,
                                    studfname,
                                    studlname,
                                    studmname,
                                    s.course,
                                    s.yearlevel,
                                    s.section,
                                    s.cpnum,
                                    s.familyphone,
                                    s.gender,
                                    s.activity_card_barcode,
                                    s.department,
                                    s.semester_id AS s_semester_id,
                                    s.acad_year_id AS s_acad_year_id,
                                    '||' AS '||_clearance_issuue',
                                    ci.id as ci_id,
                                    ci.acad_year_id,
                                    ci.semester_id,
                                    ci.departments_id,
                                    ci.context,
                                    ci.status AS clearance_status,
                                    account_id_by,
                                    account_id_status,
                                    ci.is_deleted,
                                    '||'AS '||_dep',
                                    dep.*,
                                    el.name AS el_name,
                                    ay.name AS ay_name,
                                    sem.name AS sem_name,

                                    a_by.firstname AS fname_by,
                                    a_by.lastname AS lname_by,

                                    a_status.firstname AS fname_status,
                                    a_status.lastname AS lname_status

                                  FROM student_ AS s
                                  JOIN clearance_issue AS ci ON ci.student_username = s.username
                                  JOIN departments dep ON dep.id = ci.departments_id
                                  JOIN educ_level el ON el.id =  dep.educ_level_id
                                  JOIN acad_year ay ON ay.id = ci.acad_year_id
                                  JOIN semester sem ON sem.id = ci.semester_id
                                  LEFT JOIN account AS a_by ON a_by.id = ci.account_id_by
                                  LEFT JOIN account AS a_status ON a_status.id = ci.account_id_status

                                  WHERE s.username = @username AND ci.semester_id LIKE @semesterId AND ci.acad_year_id LIKE @acadYearId`,

}

module.exports =  getDepartmentClearanceRecords;
