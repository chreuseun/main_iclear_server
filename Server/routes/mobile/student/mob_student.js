const router = require('express').Router();

router.post('/student/login' , (req, res)=>{

    const studentLogin = require('./function/login')
    args = {
        res,         
        params : {
            username:req.body.username,
            password:req.body.password
        }
    }



    studentLogin(args)

    console.log( `Methed: ${req.route.stack[0].method}  ${req.route.path}`);
})

module.exports = router;