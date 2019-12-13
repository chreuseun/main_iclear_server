const jwt = require('jsonwebtoken');
const secretkey = require('../../auth/secretkey'); // 1

const signJwt = ( payload ) => {
    return(
        new Promise((resolve, reject) => {
            
            jwt.sign(payload, secretkey, { expiresIn: '24h' },function(err, token) {
                if(token){
                    resolve(token)
                }else{
                    reject('token failed');
                }
            }) 

        })
    )
}

module.exports = signJwt;