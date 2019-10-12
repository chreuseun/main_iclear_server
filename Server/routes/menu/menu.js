const router = require('express').Router();

const authMenu = require('./functions/auth');

router.post('/menu', (req, res) => {
    
    console.log('> POST - /api/menu')

    let token = req.headers.authorization
 
        authMenu(token, res)
    
    
})

module.exports = router