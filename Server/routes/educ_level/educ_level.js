// STATUS : WORKING
const router = require('express').Router();



router.post('/educlevel/get', (req, res) => {

    const getEducLevel = require('./functions/getEducLevel');

    let token = req.headers.authorization
 
    args = {
        res, 
        token ,
        params : []
    }

    getEducLevel(args)

    console.log('> POST - /api/educlevel/get')
})


router.post('/educcourselevel/get', (req, res) => {

    const getCourseLevel = require('./functions/getCourseLevel');

    let token = req.headers.authorization
 
    args = {
        res, 
        token ,
        params : []
    }

    getCourseLevel(args)

    console.log('> POST - /api/educlevel/get')
})

router.post('/initeduccourselevel', (req, res) => {

    const getCourseLevel = require('./functions/getInitCourseLevel');
    console.log(req.body.id)

    let token = req.headers.authorization
 
    args = {
        res, 
        token ,
        params : [req.body.id]
    }

    getCourseLevel(args)

    console.log('> POST - /api/initeduccourselevel')
})

module.exports = router