// STATUS : WORKING

const router = require('express').Router();

router.post('/departmentstype/get', (req, res) => {

    const getDepartments = require('./functions/getDepartmentType');

    let token = req.headers.authorization
 
    args = {
        res, 
        token ,
        params : []
    }

    getDepartments(args)

    console.log('> POST - /api/menu/departments/get')
})

router.post('/departmentinsert', (req, res) => {

    let body = [
        req.body.valDeptName,
        req.body.valType,
        req.body.valAcadLevel,
        req.body.valCourse ,
        req.body.valYearLevel,
        req.body.valHeadOff 
    ]

    const insertDepartment = require('./functions/insertNewDepartments');

    let token = req.headers.authorization
    
    let params = [
       body 
    ]


    args = {
        res, 
        token ,
        params
    }

    insertDepartment(args)
 
    console.log('> POST - /api/menu/departmentinsert')
})

router.get('/department/get', (req, res) => {

    const getDepartments = require('./functions/getDepartments');

    let token = req.headers.authorization

    args = {
        res, 
        token ,
        params:[]
    }

    getDepartments(args)
 
    console.log('> POST - /api/menu/department/get')
})

router.post('/department/getone', (req, res) => {
    console.log(req.body)
    const getDepartments = require('./functions/getOneDepartments');
    
    let token = req.headers.authorization

    args = {
        res, 
        token ,
        params:[
            [req.body.id]
        ]
    }

    getDepartments(args)
 
    console.log('> POST - /api/menu/department/getone')
})


router.get('/departments/:dept_id/users', (req, res) => {
    
    console.log(req.params.dept_id)
    const getDepartmentsUser = require('./functions/getDeptUsers');
    
    let token = req.headers.authorization

    args = {
        res, 
        token ,
        params:[
            req.params.dept_id
        ]
    }

    getDepartmentsUser(args)
 
    console.log('> POST - /api/menu/departments/:dept_id/users')
})

router.post('/departments/users/add', (req, res) => {

    const addDeptUser = require('./functions/AddDeptUser');
    
    let token = req.headers.authorization

    args = {
        res, 
        token ,
        params:[
            req.body.acc_id,
            req.body.dep_id, 
            req.body.acc_id,
            req.body.dep_id
        ]
    }

    addDeptUser(args)
 
    console.log('> POST - /api/menu/departments/users/add')
})

router.post('/departments/users/delete', (req, res) => {

    const delDeptUser = require('./functions/DeleteDeptUser');
    
    let token = req.headers.authorization

    args = {
        res, 
        token ,
        params:[
            req.body.acc_id,
            req.body.dep_id
        ]
    }

    delDeptUser(args)
 
    console.log('> POST - /api/menu/departments/users/delete')
})

module.exports = router