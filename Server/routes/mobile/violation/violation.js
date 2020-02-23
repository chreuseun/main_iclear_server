const router = require('express').Router();

router.get('/violation' , async(req, res)=>{
    const getViolation = require('./functions/getViolation');

    const token = req.headers.authorization;

    args = {
        res,
        token,
        params : {
          mode: req.query.mode,
          semesterId: req.query.semesterId || '%%' ,
          acadYearId: req.query.acadYearId || '%%',
        },
    }

    getViolation(args);

    console.log( `Method: ${req.route.stack[0].method}  ${req.route.path}`);

})

module.exports = router;