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
            sqlResult = await query( _sql.getSubjectDetails , [params.el_id] )
        }else {
            error  = true;
        }
    } catch (err){
        error  = true;
    }

    error ? 
    res.sendStatus(401) : 
    res.json({ data : sqlResult })
}

let _sql = {
   getSubjectDetails : `SELECT 
                            sd.*,
                            el.name AS 'el_name',
                            auth.fullname AS 'author_name'

                        FROM subject_detail sd 
                        JOIN educ_level el ON el.id = sd.educ_level_id
                            AND el.id = ?
                        JOIN account auth ON auth.id = sd.author_account_id`
}

module.exports =  InsertRowSubjectDetail;

