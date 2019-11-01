const router = require('express').Router();

// get curernt data active yearLvl, acadYear, 
router.get('/class/current', (req, res) => {

    const getStudentClearance = require('./functions/getCurentAvailableClass');

    let token = req.headers.authorization
 
    args = {
        res, 
        token ,
        params: []
    }

    getStudentClearance(args)

    console.log('> GET - /api/class/current')
})

// insert New subject
router.post('/class/insert', (req, res) => {

    const {subj, el_id, course, year, section} = req.body

    body = [
        subj,
        el_id,
        course,
        year,
        section,
        el_id
    ]

    const insertNewClass = require('./functions/insertNewSubj');

    let token = req.headers.authorization;

    args = {
        res, 
        token ,
        params: body
    }

    insertNewClass(args);

    console.log(`> POST - /api${req.url}`)
})

// get class/acc_id
router.get('/class/:acc_id', (req, res) => {


    const getMyClass = require('./functions/getMyClass');

    let token = req.headers.authorization;

    args = {
        res, 
        token ,
        params: [req.params.acc_id]
    }

    getMyClass(args);

    console.log(`> POST - /api${req.url}`)
})

// get List of students based on selected class on client
router.get('/class/student/:class_id', (req, res) => {

    const getClassStudentList = require('./functions/getClassStudents');

    let token = req.headers.authorization;

    args = {
        res, 
        token,
        params: [req.params.class_id]
    }

    getClassStudentList(args);

    console.log(`> GET - /api${req.url}`)
})


router.post('/class/student/:class_id/issue/:remarks', (req, res) => {

    const getClassStudentList = require('./functions/updateClassIssueRemarks');

    let {class_issue_ids} = req.body // ARRAY

    console.log(class_issue_ids)
    let token = req.headers.authorization;

    args = {
        res, 
        token,
        params: [req.params.remarks, class_issue_ids]
    }

    getClassStudentList(args);

    console.log(`> POST - /api${req.url}`)
})
module.exports = router