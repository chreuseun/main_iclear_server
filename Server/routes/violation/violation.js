const router = require('express').Router();

// USER violation tab is clicked list all violation departments os the logged user
router.get('/violation/user', (req, res) => {

    const GetViolationDeptByIdd = require('./functions/getViolationDeptByAccId')

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

// Get Student List in a violationt dept
router.get('/violation/user/:deptVioId', (req, res) => {

    const GetVioDeptStudentList = require('./functions/getVioDeptStudents')

    let token = req.headers.authorization

    args = {
        res, 
        token ,
        params:[
            req.params.deptVioId
        ]
    }

    GetVioDeptStudentList(args)

    console.log( `Methed: ${req.route.stack[0].method}  ${req.route.path}` );
})

// Get violations in a violation
router.get('/violation/user/:deptVioId/violations', (req, res) => {

    const GetViolationListByDeptId = require('./functions/getViolationByDept')

    let token = req.headers.authorization

    args = {
        res, 
        token ,
        params:[
            req.params.deptVioId
        ]
    }

    GetViolationListByDeptId(args)

    console.log( `Methed: ${req.route.stack[0].method}  ${req.route.path}` );
})

// Get Class list of a vioaltion department
router.get('/violation/user/:deptVioId/class', (req, res) => {

    const GetClassByDeptId = require('./functions/getViolationClassByDept')

    let token = req.headers.authorization

    args = {
        res, 
        token ,
        params:[
            req.params.deptVioId
        ]
    }

    GetClassByDeptId(args)

    console.log( `Methed: ${req.route.stack[0].method}  ${req.route.path}` );
})

// Update Violation Name, Description, Class, State
router.post('/violation/user/:deptVioId/violations/:viol_id/update', (req, res) => {

    const UpdateViolation = require('./functions/updateViolation')

    let token = req.headers.authorization

    let {
        name ,
        description ,
        violation_class_id ,
        is_deleted,
        id 
    } = req.body

    console.log(req.body)

    args = {
        res, 
        token ,
        params:[
            name ,
            description ,
            violation_class_id ,
            is_deleted,
            id 
        ]
    }

    UpdateViolation(args)

    console.log( `Methed: ${req.route.stack[0].method}  ${req.route.path}` );
})

// Inset Violation Name, Description, Class, State
router.post('/violation/user/:deptVioId/violations/add', (req, res) => {

    const AddViolation = require('./functions/addVio')

    let token = req.headers.authorization

    let {
        name,
        desc,
        cls
    } = req.body

    console.log(req.body)

    args = {
        res, 
        token ,
        params:[
            name,
            desc,
            cls
        ]
    }

    AddViolation(args)

    console.log( `Methed: ${req.route.stack[0].method}  ${req.route.path}` );
})



module.exports = router