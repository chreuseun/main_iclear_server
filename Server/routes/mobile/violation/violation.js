const router = require('express').Router();

router.get('/violation' , async(req, res)=>{
    const getViolation = require('./functions/getViolation');

    const token = req.headers.authorization;

    args = {
        res,
        token,
        params : {
          mode: req.query.mode,
        }
    }

    getViolation(args);

    console.log( `Method: ${req.route.stack[0].method}  ${req.route.path}`);

})

module.exports = router;