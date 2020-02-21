const router = require('express').Router();

// Get All Acad_levels
router.get('/filter_student/acad_level_id', (req, res)=> {
    
    const getAcadLevelId = require('./function/getAcadLevels')

    let token = req.headers.authorization

    args = {
        res, 
        token ,
        params : [req.body.values]
    }

    getAcadLevelId(args)

    console.log( `Methed: ${req.route.stack[0].method}  ${req.route.path}`);
});

// Get All Course
router.get('/filter_student/course', (req, res)=> {
    
    const getCourse = require('./function/getCourse')

    let token = req.headers.authorization

    args = {
        res, 
        token ,
        params : [req.body.values]
    }

    getCourse(args)

    console.log( `Methed: ${req.route.stack[0].method}  ${req.route.path}`);
});

// Get All yearlevel
router.get('/filter_student/yearlevel', (req, res)=> {
    
    const getYearLevel = require('./function/getYearlevels')

    let token = req.headers.authorization

    args = {
        res, 
        token ,
        params : [req.body.values]
    }

    getYearLevel(args)

    console.log( `Methed: ${req.route.stack[0].method}  ${req.route.path}`);
});

// Get All Section
router.get('/filter_student/section', (req, res)=> {
    
    const getSection = require('./function/getSection')

    let token = req.headers.authorization

    args = {
        res, 
        token ,
        params : [req.body.values]
    }

    getSection(args);

    console.log( `Methed: ${req.route.stack[0].method}  ${req.route.path}`);
});

router.get('/filter_student/class/educ_level', (req, res)=> {

    const getClassAcadLevel = require('./function/getClassAcadLevel')

    let token = req.headers.authorization

    args = {
        res, 
        token ,
        params : [req.body.values] // 
    }

    getClassAcadLevel(args);

    console.log( `Methed: ${req.route.stack[0].method}  ${req.route.path}`);
});

router.get('/filter_student/class/course', (req, res) => {
    const getClassCourse = require('./function/getClassCourse')

    let token = req.headers.authorization

    args = {
        res, 
        token ,
        params : [req.query.educlevel] // 
    }

    getClassCourse(args);
    console.log( `Methed: ${req.route.stack[0].method}  ${req.route.path}`);
})

/*
SELECT 
	data as 'key', 
    data as 'value', 
    data as 'text'
FROM
(SELECT 
	DISTINCT course AS 'data'

FROM student_

WHERE educ_level_id = 1) as main

*/

module.exports = router;