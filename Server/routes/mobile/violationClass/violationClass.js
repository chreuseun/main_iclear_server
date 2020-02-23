const router = require('express').Router();

router.get('/violationClass' , async(req, res)=>{
  const {semesterId, acadYearId} = req.query;

  console.log(req.query);

  const getViolation = require('./functions/getViolationClass');



    const token = req.headers.authorization;

    args = {
        res,
        token,
        params : {
          semesterId: semesterId || '%%',
          acadYearId: acadYearId || '%%',
        }
    }

    getViolation(args);

    console.log( `Method: ${req.route.stack[0].method}  ${req.route.path}`);

})

module.exports = router;