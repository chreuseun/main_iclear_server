const router = require('express').Router();

router.get('/clearance' , async(req, res)=>{

    const getDepartmentClearanceRecords = require('./function/getDepartmentClearanceRecords');

    const token = req.headers.authorization;

    args = {
        res,
        token,
    }

    getDepartmentClearanceRecords(args)

    console.log( `Methed: ${req.route.stack[0].method}  ${req.route.path}`);

})

module.exports = router;