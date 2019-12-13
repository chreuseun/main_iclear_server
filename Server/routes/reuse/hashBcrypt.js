const bcrypt = require('bcryptjs');

// const hash = '$2y$14$9XyFPi07CvcD.P36wvWy8Oe7Q6w89mZNJKEqV4WO6u1./RTuqq44C';
// const password = 'jdldsjflkfjfljfljflkdlkjsdldjfldlkjfdklfjkljlksdjlksdjflksdjfldfjlkfjlkjflksdjlksdjflsjfdkjf'

const hashBcrypt = ( hash, password ) => {
    return(
        new Promise((resolve, reject) => {
            const data = bcrypt.compareSync( password, hash );

            if(data === true) {
                resolve(true);
            } else{
                reject(0);
            } 
        })
    )
}

module.exports = hashBcrypt






