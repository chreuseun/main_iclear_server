const router = require('express').Router();
var bcrypt = require('bcryptjs');
var jwt = require('jsonwebtoken');
// secret key
const secretkey = require('../../auth/secretkey');


router.get('/test', (req, res) => {
    
    console.log(`> "/test"`)

    token = req.headers.authorization 
    // VALID token step 1
    if(token && token.split(" ")[1] && token.split(" ")[0] === 'Bearer') {
        // Verify token final step
        token = token.split(" ")[1]

        jwt.verify(token, secretkey, function(err, decoded) { 
            if(decoded){
                res.json( {decoded} )
            } else {
                res.json({ err })
            }
        })

        
    }

    
})


module.exports = router