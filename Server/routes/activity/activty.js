const router = require('express').Router();

// USER ACTIVTY tab is clicked list all ACTIVITY departments os the logged user
router.get('/activity/user', (req, res) => {

    const GetViolationDeptByIdd = require('./functions/getActDeptByAccId')

    let token = req.headers.authorization

    args = {
        res, 
        token ,
        params:[
        ]
    }

    GetViolationDeptByIdd(args)

    console.log( `Methed: ${req.route.stack[0].method}  ${req.route.path}`);
})

// Get Activity Dept Types
router.get('/activity/types', (req, res) => {

    const GetActivityType = require('./functions/getActivityType')

    let token = req.headers.authorization

    args = {
        res, 
        token ,
        params:[
        ]
    }

    GetActivityType(args)

    console.log( `Methed: ${req.route.stack[0].method}  ${req.route.path}` );
})

// // Get violations in a violation
// router.get('/violation/user/:deptVioId/violations', (req, res) => {

//     const GetViolationListByDeptId = require('./functions/getViolationByDept')

//     let token = req.headers.authorization

//     args = {
//         res, 
//         token ,
//         params:[
//             req.params.deptVioId
//         ]
//     }

//     GetViolationListByDeptId(args)

//     console.log( `Methed: ${req.route.stack[0].method}  ${req.route.path}` );
// })

// // Get Class list of a vioaltion department
// router.get('/violation/user/:deptVioId/class', (req, res) => {

//     const GetClassByDeptId = require('./functions/getViolationClassByDept')

//     let token = req.headers.authorization

//     args = {
//         res, 
//         token ,
//         params:[
//             req.params.deptVioId
//         ]
//     }

//     GetClassByDeptId(args)

//     console.log( `Methed: ${req.route.stack[0].method}  ${req.route.path}` );
// })

// // Update Violation Name, Description, Class, State
// router.post('/violation/user/:deptVioId/violations/:viol_id/update', (req, res) => {

//     const UpdateViolation = require('./functions/updateViolation')

//     let token = req.headers.authorization

//     let {
//         name ,
//         description ,
//         violation_class_id ,
//         is_deleted,
//         id 
//     } = req.body

//     console.log(req.body)

//     args = {
//         res, 
//         token ,
//         params:[
//             name ,
//             description ,
//             violation_class_id ,
//             is_deleted,
//             id 
//         ]
//     }

//     UpdateViolation(args)

//     console.log( `Methed: ${req.route.stack[0].method}  ${req.route.path}` );
// })

// // Inset Violation Name, Description, Class, State
// router.post('/violation/user/:deptVioId/violations/add', (req, res) => {

//     const AddViolation = require('./functions/addVio')

//     let token = req.headers.authorization

//     let {
//         name,
//         desc,
//         cls
//     } = req.body

//     console.log(req.body)

//     args = {
//         res, 
//         token ,
//         params:[
//             name,
//             desc,
//             cls
//         ]
//     }

//     AddViolation(args)

//     console.log( `Methed: ${req.route.stack[0].method}  ${req.route.path}` );
// })

// // Insert new sanction for a class
// router.post('/violation/user/:deptVioId/class/:class_id/sanction/add', (req, res) => {

//     const AddSanction = require('./functions/addSanctionPerClass')

//     let token = req.headers.authorization

//     args = {
//         res, 
//         token ,
//         params:[
//             req.params.class_id === ''? undefined : req.params.class_id,
//             req.params.deptVioId === ''? undefined : req.params.deptVioId,
//             req.body.desc === ''? undefined : req.body.desc
//         ]
//     }

//     AddSanction(args)

//     console.log( `Methed: ${req.route.stack[0].method}  ${req.route.path}` );
// })


// // 2019-11-10 -  GET all sanctions of a violation class_id
// router.get('/violation/user/:deptVioId/violations/sanction/:class_id', (req, res) => {

//     const getViolationSanction = require('./functions/getViolationSanctionsByClassId')

//     let token = req.headers.authorization

//     let {
//         name,
//         desc,
//         cls
//     } = req.body

//     console.log(req.body)

//     args = {
//         res, 
//         token ,
//         params:[
//             req.params.class_id,
//             req.params.deptVioId
//         ]
//     }

//     getViolationSanction(args)

//     console.log( `Methed: ${req.route.stack[0].method}  ${req.route.path}` );
// })

// // ISSUE VIOLATION TO A STUDENT
// router.post('/violation/user/:deptVioId/violations/student/add', (req, res)=>{

//     const AddViolationToStudent = require('./functions/addViolationToStudent');

//     /*
//     Required Parameter:
//         @uid := 'GS3'
//         @vio := 23 
//         @sem := 1 
//         @ay := 1
//         @yr :='3rd'
//         @crs := 'BSAT'
//         @sec := "A"
//     */
//     const {uid, vio, sem, ay, yr, crs, sec} = req.body;

//     let body = [
//         uid, vio, sem, ay, yr, crs, sec
//     ]

//     console.log(req.body)

//     let token = req.headers.authorization

//     console.log(token)

//     args = {
//         res, 
//         token ,
//         params:body
//     }

//     AddViolationToStudent(args)

//     console.log( `Methed: ${req.route.stack[0].method}  ${req.route.path}` );
// })

// // 2019-11-10 - GET ALL VIOLATION RECORD OF A STUDENT
// router.get('/violation/user/:deptVioId/violations/student/records/:std', (req, res) => {

//     const getStudentViolationByUsername = require('./functions/getStudentViolationByStudentUsername')

//     let token = req.headers.authorization


//     console.log(req.params.std)

//     args = {
//         res, 
//         token ,
//         params:[
//             req.params.std || ''
//         ]
//     }

//     getStudentViolationByUsername(args)

//     console.log( `Methed: ${req.route.stack[0].method}  ${req.route.path}` );
// })

// // TEST TEST TEST TEST TEST TEST TEST 
// router.get('/violation/test', (req, res) => {

    
//     const getTest = require('./functions/test')

//     args = {
//         res, 
//         token:'ss' ,
//         params:[
//         ]
//     }


//     getTest(args);

//     // res.send('Violation Test')
//     console.log( `Methed: ${req.route.stack[0].method}  ${req.route.path}` );
// })



module.exports = router