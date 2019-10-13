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

router.get('/acad_year/active/get', (req, res) => {

    const getAcadYear = require('./functions/getActiveAcadYear');

    let token = req.headers.authorization
 
    args = {
        res, 
        token ,
        params : []
    }

    getAcadYear(args)

    console.log('> POST - /api/menu/acad_year/get')
})

router.post('/acad_year/set', (req, res) => {

    const insertAcadYear = require('./functions/setAcadYear');

    let token = req.headers.authorization
    
    let params = [
        req.body.base_year
    ]   

    args = {
        res, 
        token ,
        params
    }

    insertAcadYear(args)
 
    console.log('> POST - /api/menu/acad_year/insert')
})

router.post('/acad_year/insert', (req, res) => {

    const insertAcadYear = require('./functions/insertAddAcadYear');

    let token = req.headers.authorization
    
    let params = [
    ]

    args = {
        res, 
        token ,
        params
    }

    insertAcadYear(args)
 
    console.log('> POST - /api/menu/acad_year/insert')
})


module.exports = router