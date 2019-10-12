const router = require('express').Router();
var bcrypt = require('bcryptjs');
var jwt = require('jsonwebtoken');
// secret key
const secretkey = require('../../auth/secretkey');

const pool = require('../../mysql/pool/pool');
const _sql = require('../../mysql/queries/accounts/Login'); // QUERY LIST

router.post('/login', (req, res) => {
    
    req.body; 
  
    let login = require('./functions/login');

    const arg = {
        res,
        loginCred: req.body,
        pool,
        _sql,
        bcrypt,
        jwt,
        secretkey
    }

    //  (res, loginCred, pool, _sql ,bcrypt, jwt, secretkey)

    login(arg)

    console.log('> POST - /api/login ');
})

router.post('/register', (req, res) => {

    var body=[
        req.body.user_type_id, 
        req.body.username,
        bcrypt.hashSync(req.body.password, 14),
        req.body.lastname + ', ' + req.body.firstname + ' ' + (req.body.middlename ?  req.body.middlename : '') ,
        req.body.lastname,
        req.body.firstname,
        !req.body.middlename ? '': req.body.middlename ,
        req.body.contact_number
    ]

    body.map( (item, i) => {
        if(item === undefined)
        {
            body = undefined
        }
    })

    let token = req.headers.authorization 

    let register = require('./functions/register2');
    
    if(body) {
    
        let args = {
            res,
            token,
            insertParams : body
        }

        register(args);
    } else {
        res.sendStatus(404)
    } 

    console.log('> POST - /api/register')
})

router.post('/logout', (req, res) => {

    //psedo-code
    // Check if token is valid
    // Insert as blacklisted token
    // 

    let logout = require('./functions/logout');

    args = {
        headers : req.headers.authorization,
        jwt,
        secretkey,
        res,
        pool,
        _sql
    }

    logout(args)

    console.log('> POST - /api/logout')
})

router.post('/auth', (req,res)=>{
    let isLogged = require('./functions/checkToken');
    
    arg = {
        headers : req.headers.authorization,
        res
    }

    isLogged(arg)

    console.log('> POST - /api/auth')
})

router.post('/getaccounts', (req, res) => {
    
    let getaccounts = require('./functions/getAccounts');

    let arg = {
        res,
        token : req.headers.authorization,
        params : {}
    }

    getaccounts(arg);

    console.log('> POST - /api/getaccounts')
})

router.post('/accounts/state/set', (req, res) => {

    let setState = require('./functions/setState');

    let arg = {
        res,
        token : req.headers.authorization,
        params : [
            [req.body.acc_id , req.body.acc_id ] 
        ]
    }

    setState(arg);

    console.log('> POST - /api/accounts/state/set')
})


router.post('/accounts/islocked/set', (req, res) => {
    console.log(`${req.body.acc_id.toString()}`)
    let setLocked = require('./functions/setIs_Locked');

    let arg = {
        res,
        token : req.headers.authorization,
        params : [
            `${req.body.acc_id.toString()}`
        ]
    }

    setLocked(arg);

    console.log('> POST - /api/accounts/islocked/set')
})


module.exports = router




  
  