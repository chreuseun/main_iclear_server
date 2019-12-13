// STATUS : WORKING
const router = require('express').Router();

router.post('/student/csv/insert', (req, res) => {

    console.log(req.body.values);


    const InsertBulkFromCsv = require('./functions/insertBulkStudentFromCSV');

    let token = req.headers.authorization
 
    args = {
        res, 
        token ,
        params : [req.body.values]
    }

    InsertBulkFromCsv(args)

    console.log( `Methed: ${req.route.stack[0].method}  ${req.route.path}`);
})

router.get('/student', (req, res) => {

    const getStudents = require('./functions/getStudents');

    let token = req.headers.authorization
 
    args = {
        res, 
        token ,
        params : []
    }

    getStudents(args);

    console.log( `Methed: ${req.route.stack[0].method}  ${req.route.path}`);
})

module.exports = router