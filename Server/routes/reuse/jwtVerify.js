const jwt = require('jsonwebtoken'); // 1
const secretkey = require('../../auth/secretkey'); // 1

// MAKE THIS A UNIVERSAL FUNCTION chekc if TOKEN FORMAT IS GOOD
// 1
const jwtVerify = (token) => {
    return(
        new Promise((resolve, reject) => {

            if(token && token.split(" ")[1] && token.split(" ")[0] === 'Bearer') {

                // Verify token final step
                token = token.split(" ")[1];

                jwt.verify(token, secretkey, function(err, decoded) {
                    if(decoded) {

                        resolve({token, decoded});

                    } else {

                        reject(null)

                    }
                })
            } else {
                reject(null)
            }
        })
    )
}
module.exports =  jwtVerify;