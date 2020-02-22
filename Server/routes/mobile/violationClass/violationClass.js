const router = require('express').Router();

router.get('/violationClass' , async(req, res)=>{
    const getViolation = require('./functions/getViolationClass');

    const token = req.headers.authorization;

    args = {
        res,
        token,
        params : {
          // Query for acadYearId, semesterId
        }
    }

    getViolation(args);

    console.log( `Method: ${req.route.stack[0].method}  ${req.route.path}`);

})

module.exports = router;