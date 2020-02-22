const router = require('express').Router();

router.get('/clearance' , async(req, res)=>{
    const getDepartmentClearanceRecords = require('./function/getDepartmentClearanceRecords');

    const token = req.headers.authorization;
    console.log(req.query);
    args = {
        res,
        token,
        params : {
            semesterId:`%${req.query.semesterId}%` || '%%',
            acadYearId:`%${req.query.acadYearId}%` || '%%'
        }
    }

    getDepartmentClearanceRecords(args);

    console.log( `Method: ${req.route.stack[0].method}  ${req.route.path}`);

})

module.exports = router;