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


router.get('/semester/active/get', (req, res) => {

    const getAcadYear = require('./functions/getActiveSem');

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

module.exports = router