// Adding 1 row to subject_detail
var jwtVerify = require('../../reuse/jwtVerify');
var query = require('../../reuse/query')
var sql = require('../../../mysql/queries/accounts/Login')


const InsertRowSubjectDetail = async ({res, token, params}) => {

    console.log(params)
    let error  = false;    
    let jwtResult;
    let sqlResult;
    
    
    try{
        jwtResult= await jwtVerify(token); // => {token:'string' , decoded":{}}
        // console.log(jwtResult)
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

    // insert new department
    try{
        if(sqlResult[0].is_token === 'AUTH') {

            let if_code_already_exist = await query(_sql.if_code_exist , [params.code])
    
            console.log(if_code_already_exist[1][0].if_exist !== 1, 'comparison')

            if(if_code_already_exist[1][0].if_exist === 0 ){

                const { code, name, educ_level_id, yearlevel, course} = params;

                sqlResult = await query(_sql.insertRecord , [
                    name,
                    code,
                    educ_level_id,
                    jwtResult.decoded.id,
                    yearlevel,
                    course
                ])

                sqlResult = {
                    msg: 'Insert Succesful',
                    data:sqlResult[6].insertId
                }

            } else {
                sqlResult = {
                    msg: `Code Already Exist`
                }

            }
        }
    } catch (err){
        console.log('mysqlErro')
        error  = true;  
    }

    error ? 
    res.sendStatus(401) : 
    res.json({ data : sqlResult })
}

let _sql = {
    if_code_exist : `
                    SET @code := ?;

                    SELECT  COUNT(code) as if_exist
                    FROM subject_detail 
                    WHERE code = @code;`,

    insertRecord : `
                    SET @name := ?;
                    SET @code := ?;
                    SET @educ_level_id := ?;
                    SET @author_account_id := ?;
                    SET @yearlevel := ?;
                    SET @course := ?;
                    
                    INSERT INTO iclear_svms_db.subject_detail
                    (
                        name,
                        code,
                        educ_level_id, -- AUTO BY department _ID
                        author_account_id, -- VIA TOKEN DECODE
                        yearlevel,
                        course
                    )
                    VALUES
                    (
                        @name ,
                        @code ,
                        @educ_level_id,
                        @author_account_id,
                        @yearlevel,
                        @course
                    ); -- 6`
}

module.exports =  InsertRowSubjectDetail;

