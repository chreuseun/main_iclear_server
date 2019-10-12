/*
    http://localhost:4040/api/semester/get
*/

// STATUS : WORKING

const router = require('express').Router();

router.get('/semester/get', (req, res) => {

    const getAcadYear = require('./functions/getSemester');

    let token = req.headers.authorization
 
    args = {
        res, 
        token ,
        params : []
    }

    getAcadYear(args)

    console.log('> POST - /api/menu/semester/get')
})

router.post('/semester/set', (req, res) => {

    const getAcadYear = require('./functions/setSemester');

    let token = req.headers.authorization
 
    args = {
        res, 
        token ,
        params : [req.body.sem_name]
    }

    getAcadYear(args)

    console.log('> POST - /api/menu/semester/set')
})

// router.post('/acad_year/set', (req, res) => {

//     const insertAcadYear = require('./functions/setAcadYear');

//     let token = req.headers.authorization
    
//     let params = [
//         req.body.base_year
//     ]   

//     args = {
//         res, 
//         token ,
//         params
//     }

//     insertAcadYear(args)
 
//     console.log('> POST - /api/menu/acad_year/insert')
// })

// router.post('/acad_year/insert', (req, res) => {

//     const insertAcadYear = require('./functions/insertAddAcadYear');

//     let token = req.headers.authorization
    
//     let params = [
//     ]

//     args = {
//         res, 
//         token ,
//         params
//     }

//     insertAcadYear(args)
 
//     console.log('> POST - /api/menu/acad_year/insert')
// })


module.exports = router