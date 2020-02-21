const router = require('express').Router();
var bcrypt = require('bcryptjs');
var jwt = require('jsonwebtoken');

const secretkey = require('../../auth/secretkey');

const pool = require('../../mysql/pool/pool');
const _sql = require('../../mysql/queries/accounts/Login');

// Login user 
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

// register new user
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

// logout user and redirect to "/"
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

// auth
router.post('/auth', (req,res)=>{
    let isLogged = require('./functions/refactorCheckToken');
    
    arg = {
        token : req.headers.authorization,
        res ,
        params: []
    }

    isLogged(arg)

    console.log( `Methed: ${req.route.stack[0].method}  ${req.route.path}`);
})

// get accounts
router.post('/getaccounts', (req, res) => {
    
    let getaccounts = require('./functions/getAccounts');

    let arg = {
        res,
        token : req.headers.authorization,
        params : {
            text: req.query.text || '',
            type: req.query.type || '',
            locked: req.query.locked || '',
            state: req.query.state || ''
        }
    }

    getaccounts(arg);

    console.log('> POST - /api/getaccounts')
})

// set the state of accounts to ACTIVE or INACTIVE
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

// set the state of accounts to LOCKED or UNLOCKED
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

// router.post('/auth/ref', (req,res)=>{
//     let isLogged = require('./functions/checkToken');
//     arg = {
//         headers : req.headers.authorization,
//         res
//     }
//     isLogged(arg)
//     console.log('> POST - /api/auth')
// })