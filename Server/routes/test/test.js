const router = require('express').Router();
var bcrypt = require('bcryptjs');
var jwt = require('jsonwebtoken');
// secret key
const secretkey = require('../../auth/secretkey');


router.get('/test', (req, res) => {

    res.send('test')
    

    console.log( `Methed: ${req.route.stack[0].method}  ${req.route.path}` );

    console.log(req.query)

})


module.exports = router