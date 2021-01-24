const jwt = require('jsonwebtoken');
const {SECRET_KEY} = require('./../config');

module.exports = (req, res, next) => {
    const authHeader = req.headers.authorization;
    const error = new Error();
    error.status = 403;

    if(authHeader) {
        const token = authHeader.split('Bearer ')[1];
        if(token) {
            try{
                const user = jwt.verify(token, SECRET_KEY);
                req.user = user;
                return next();
            } catch(e) {
                error.message = 'Invalid or Expired Token';
            }
        }
        error.message = 'Authorization token must be Bearer[token]';
        return next(error);
    }
    error.message = 'Authorzation Header must be provided';
    return next(error)
}