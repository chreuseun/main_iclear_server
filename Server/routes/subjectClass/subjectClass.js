const router = require('express').Router();

// Create new Subject
router.post('/subjclass/insert', async(req, res) => { //tested

    const InsertRowsubjectDetail = require('./functions/insertNewSubject_detail')

    let token = req.headers.authorization



    args = {
        res, 
        token ,
        params : req.body
    }

    InsertRowsubjectDetail(args)

    console.log( `Methed: ${req.route.stack[0].method}  ${req.route.path}`);
});

router.get('/subjclass/subjects/:el_id', async(req,res) => { // Tested

    const GetSubjectDetails = require('./functions/getSubject_Details');

    let token = req.headers.authorization;

    
    args = {
        res, 
        token ,
        params : {
            el_id : req.params.el_id
        }
    }

    GetSubjectDetails(args)

    console.log( `Method: ${req.route.stack[0].method}  ${req.route.path}`);
})

// Get Year level by EL_ID
router.get('/subjclass/yearlevel', async(req,res) => { // Tested

    const GetSubjectDetails = require('./functions/getYearlevelList');

    let token = req.headers.authorization;

    console.log(req.query);

    args = {
        res, 
        token ,
        params : req.query.educlevel
    }

    GetSubjectDetails(args)

    console.log( `Method: ${req.route.stack[0].method}  ${req.route.path}`);
})

// get section Course and Year level
router.get('/subjclass/section', async(req, res) => {

    const GetSections = require('./functions/getSectoinByCourseAndYearlevel');

    let token = req.headers.authorization;

    console.log(req.query);

    args = {
        res, 
        token ,
        params : {
            course: req.query.course,
            yearlevel : req.query.yearlevel,
            el_id : req.query.el_id
        }
    }

    GetSections(args)

    console.log( `Method: ${req.route.stack[0].method}  ${req.route.path}`);
})

// getteacher list only with account.state = 1
router.get('/subjclass/teachers', async(req, res) => {

    const GetTeachers = require('./functions/getTeachers');

    let token = req.headers.authorization;

    console.log(req.query);

    args = {
        res, 
        token ,
        params : {
        }
    }

    GetTeachers(args)

    console.log( `Method: ${req.route.stack[0].method}  ${req.route.path}`);
})

// Add Teacher and Subject in subject(table)
router.post('/subjclass/teachers/subject/add', async(req, res) => {

    const GetSections = require('./functions/insertNewRecordSubject');

    let token = req.headers.authorization;

    args = {
        res, 
        token ,
        params : {
            teacher_account_id : req.body.teacher_account_id,
            subject_detail_id : req.body.subject_detail_id,
            section: req.body.section,
            educ_level_id : req.body.educ_level_id,
            course : req.body.course,
            yearlevel : req.body.yearlevel
        }
    }

    GetSections(args)

    console.log( `Method: ${req.route.stack[0].method}  ${req.route.path}`);
});

// get Teachers with assigned subject (DISPLAY)
router.get( '/subjclass/teachers/subjects', async(req, res) => {

    const GetSubjectWithTeacher = require('./functions/getSubjectWithTeacher');

    let token = req.headers.authorization;

    args = {
        res, 
        token ,
        params : {
            subject_detail_id : req.query.subject_detail_id
        }
    }

    GetSubjectWithTeacher(args)

    console.log( `Method: ${req.route.stack[0].method}  ${req.route.path}`);
});

// get Assigned Subject to Teachers
router.get( '/subjclass/teacher/subject', async(req, res) => {

    const GetAssignedSubjectOnTeacher = require('./functions/getAssignedSubjectsOnTeacher');

    let token = req.headers.authorization;
    
    args = {
        res, 
        token ,
        params : {
        }
    }

    GetAssignedSubjectOnTeacher(args);

    console.log( `Method: ${req.route.stack[0].method}  ${req.route.path}`);
});

// get Student on selected subject
router.get('/subjclass/:subject_id/student', async(req, res) => {

    const GetStudentOnSelectedSubject = require('./functions/getStudentOnSelectedSubject');

    let token = req.headers.authorization;
    
    args = {
        res, 
        token ,
        params : {
            subject_id : req.params.subject_id
        }
    }

    GetStudentOnSelectedSubject(args);

    console.log( `Method: ${req.route.stack[0].method}  ${req.route.path}`);
});

// TASK ON GOING

// Update Student Subject Clearance BULK or SOLO
router.post('/subjclass/:subjct_id/:remarks', async(req, res) => {

    const GetStudentOnSelectedSubject = require('./functions/updateStudentSubjectClearanceRemarks');

    let token = req.headers.authorization;
    
    args = {
        res, 
        token ,
        params : {
            remarks : req.params.remarks ,  // req.params.remarks   [ PASS , CONSIDER , FAIL]
            subject_clearance_ids : req.body.subject_clearance_ids
        }
    }

    GetStudentOnSelectedSubject(args);

    console.log( `Method: ${req.route.stack[0].method}  ${req.route.path}`);
});

router.get( '/subjclass/test', async(req, res) => {

    const GetSubjectWithTeacher = require('./functions/test');

    let token = req.headers.authorization;

    args = {
        res, 
        token ,
        params : {
            subject_detail_id : req.query.subject_detail_id
        }
    }

    GetSubjectWithTeacher(args)

    console.log( `Method: ${req.route.stack[0].method}  ${req.route.path}`);
})


module.exports = router;