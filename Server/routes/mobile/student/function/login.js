// Student Login for mobile app
var query = require('../../../reuse/query'); // MySQL query from sql 
var hashBcrypt = require('../../../reuse/hashBcrypt'); // HashBcrypt
var signJWT = require('../../../reuse/signJWT'); // signJWT creating Token

const StudentLogin = async({res, params}) => {
    
    let error = false;
    let bcryptResult;
    let token;
    let sqlResult;

    // Do a mysql Query here :)  SELECT IF username exist
    try{
        sqlResult = await query(_sql.login, [params.username]);

    }catch(err){    
        error = true;
    }

    // Compare password to hash
    try{
        bcryptResult = await hashBcrypt(sqlResult[0].password, params.password);
    }catch(err){
        error = true;
    }

    // Sign Token
    try{
        if(bcryptResult === true){
            const studentDetails = sqlResult[0];

            const payload = {
                id: studentDetails.id,
                username: studentDetails.username,
                studfname:studentDetails.studfname,
                studlname:studentDetails.studlname,
                studmname:studentDetails.studmname,
                ay_name:studentDetails.ay_name,
                sem_name:studentDetails.sem_name,
                educ_level_name: studentDetails.educ_level_name,
                created_at: studentDetails.created_at,
                image_url: studentDetails.image_url,
                educ_level_id: studentDetails.educ_level_id,
                section: studentDetails.section,
                yearlevel: studentDetails.yearlevel,
                activity_card_barcode: studentDetails.activity_card_barcode

            }

            token=await signJWT(payload);

        } else {error=true;}
    }catch(err){
        error = true;
    }

    error ? 
    res.sendStatus(401) : 
    res.json({ data: {msg:'okay',token, data: sqlResult[0]}})
}

let _sql= {
    login : `SELECT st.*,
            sem.name AS 'sem_name',
            ay.name AS 'ay_name',
            el.name AS 'educ_level_name'

            FROM student_ st
            JOIN acad_year ay ON ay.id = st.acad_year_id 
            JOIN semester sem ON sem.id = st.semester_id
            JOIN educ_level el ON el.id = st.educ_level_id

            WHERE username = BINARY(?) LIMIT 1;`
}

module.exports =  StudentLogin