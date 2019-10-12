

const tokenSign = (objPayLoad, secretKey, objOpt) => {
    jwt.sign(objPayLoad, secretKey, objOpt, function(err, token) {
        return(token);
      });
}

module.exports = tokenSign