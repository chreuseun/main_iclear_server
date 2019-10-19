// ADDING REQUIREMENTS OF DEPARTMENT


var jwtVerify = require('../../reuse/jwtVerify');
var query = require('../../reuse/query')
var sql = require('../../../mysql/queries/accounts/Login')


const asyncInsertDepartment = async ({res, token, params}) => {
    
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

    // insert new department
    try{
        if(sqlResult[0].is_token === 'AUTH') {

            let sql = `INSERT INTO departments_requirements
                        (departments_id,
                        context)
                        VALUES
                        (?,
                        ?)`;

            sqlResult = await query(sql,params)
        }
    } catch (err){
        error  = true;  
    }


    error ? 
    res.sendStatus(401) : 
    res.json({ data : sqlResult.insertId })
}

module.exports =  asyncInsertDepartment;


