const jwt = require('jsonwebtoken');
const config = require('config'); //Secret

//Middleware function is a function that has access to req, res, next
module.exports = function (req, res, next) {
    //Get token from header, header key that we send token in
    const token = req.header('x-auth-token');

    //Check if no token
    if (!token) {
        return res.status(401).json({ msg: 'No token, authorization denied' });
    }

    //Verify Token
    try {
        //Decodes token
        const decoded = jwt.verify(token, config.get('jwtSecret'));

        //Puts the coded user in our req so we can access all their data
        req.user = decoded.user;
        next();
    } catch (err) {
        res.status(401).json({ msg: 'Token is not valid' });
    }
}