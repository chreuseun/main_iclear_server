// 'http://localhost:4040/api/acad_year/get
// http://localhost:4040/api/acad_year/set
//'http://localhost:4040/api/acad_year/insert

// STATUS : WORKING

const router = require('express').Router();

router.get('/acad_year/get', (req, res) => {

    const getAcadYear = require('./functions/getAcadYear');

    let token = req.headers.authorization
 
    args = {
        res, 
        token ,
        params : []
    }

    getAcadYear(args)

    console.log('> POST - /api/menu/acad_year/get')
})

// router.post('/departmentinsert', (req, res) => {

//     // let body = [
//     //     req.body.valDeptName,
//     //     req.body.valType,
//     //     req.body.valAcadLevel,
//     //     req.body.valCourse ,
//     //     req.body.valYearLevel,
//     //     req.body.valHeadOff 
//     // ]

//     // const insertDepartment = require('./functions/insertNewDepartments');

//     // let token = req.headers.authorization
    
//     // let params = [
//     //    body 
//     // ]


//     // args = {
//     //     res, 
//     //     token ,
//     //     params
//     // }

//     // insertDepartment(args)
 
//     // console.log('> POST - /api/menu/departmentinsert')
// })


module.exports = router