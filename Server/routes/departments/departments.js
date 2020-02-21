// STATUS : WORKING
const router = require('express').Router();

// ADMIN
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
});

router.post('/departmentinsert', (req, res) => {

    let body = [
        req.body.valDeptName,
        req.body.valType,
        req.body.valAcadLevel,
        req.body.valCourse ,
        req.body.valYearLevel,
        req.body.valHeadOff,
        req.body.valCrsDept,
        req.body.valIsChecked
    ]

    console.log()

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
});

router.get('/department/get', (req, res) => {

    const getDepartments = require('./functions/getDepartments');

    let token = req.headers.authorization

    args = {
        res, 
        token ,
        params:{
            text : req.query.text || '',
            level : req.query.level || '',
            type : req.query.type || '',
            state : req.query.state || ''
        }
    }

    getDepartments(args)
 
    console.log('> POST - /api/menu/department/get')
});

router.post('/department/getone', (req, res) => {

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
});

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
});

router.post('/departments/users/add', (req, res) => {

    const addDeptUser = require('./functions/AddDeptUser');
    
    let token = req.headers.authorization

    args = {
        res, 
        token ,
        params:[
            req.body.acc_id,
            req.body.dep_id      
        ]  
    }

    addDeptUser(args)
 
    console.log('> POST - /api/menu/departments/users/add')
});

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
});

router.post(`/department/update`,(req, res) => {
    
    
    let data = [
        req.body.valDeptName,
        req.body.valAcadLevel,
        req.body.valType,
        req.body.valCourse,
        req.body.valYearLevel,
        req.body.valHeadOff,
        `${req.body.valStatus}`,
        req.body.valCrsDept,
        req.body.valIsChecked,
        req.body.valDepartment_id
    ]

    let token = req.headers.authorization

    console.log(req.body)
    const depUpdate = require('./functions/updateDepartment');

    args = {
        res, 
        token ,
        params: data
    }

    depUpdate(args)
    
    console.log('> POST - /api/menu/departments/users/delete')
});

// USER ============================================================================
router.get('/departments/user', (req, res) => {
    
    const getDeptByAccId = require('./functions/getDeptByAccId');
    
    let token = req.headers.authorization

    args = {
        res, 
        token ,
        params:[
        ]
    }

    getDeptByAccId(args)
 
    console.log('> POST - /api/menu/departments/users/:acc_id')
});

router.get('/departments/coursedepartment/:el_id', (req,res) => {
    const getCourseDept = require('./functions/getCourseDepartment');
    
    let token = req.headers.authorization

    args = {
        res, 
        token ,
        params:[
            req.params.el_id
        ]
    }

    getCourseDept(args)
 
    console.log(`> POST - /api${req.url}`)
});

router.get('/departments/:d_id/req/get', (req, res) => {

    let token = req.headers.authorization

    const getDeptReq = require('./functions/getDeptRequirements');

    args = {
        res, 
        token ,
        params: [req.params.d_id]
    }

    getDeptReq(args)
    
    console.log('> POST - /api/menu/:d_id/req/get')
});

router.post('/departments/req/add', (req, res) => {

    
    let data = [
        req.body.d_id,
        req.body.context
    ]

    console.log(data)
    let token = req.headers.authorization

    const AddRequirements = require('./functions/AddDeptReq');

    args = {
        res, 
        token ,
        params: data
    }

    AddRequirements(args)
    
    console.log('> POST - /api/menu/departments/req/add')
});

router.get('/departments/:dep/std', (req, res) => {

    let data = [
        req.params.dep
    ]

    console.log(data)
    let token = req.headers.authorization

    const AddRequirements = require('./functions/getDepStudent');

    args = {
        res, 
        token ,
        params: {
            dep: req.params.dep,
            text: req.query.text || '',
            level: req.query.level || '',
            course: req.query.course || '',
            yrlvl: req.query.yrlvl || '',
            section: req.query.section || ''
        }
    }

    AddRequirements(args)
    
    console.log('> POST - /api/menu/departments/:dep/std')
});

module.exports = router