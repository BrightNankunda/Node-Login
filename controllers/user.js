const jwt = require('jsonwebtoken');
const {SECRET_KEY} = require('./../config');


const User = require('./../models/user');

exports.register = async(req, res, next) => {

    const {firstName, lastName, email, password} = req.body;
    const user = await User.findOne({email})
    if(user)
        return res.status(403).json({Error: {message: "Email Already in Use" }});
    const newUser = new User({firstName, lastName, email, password});
    try {
        await newUser.save();
        const token = getSignedToken(newUser)
        res.json({newUser, Message: "User created Successfully", token}, 200);
    } catch(error) {
        error.status = 400;
        next(error);
    }
        
}

exports.login = async(req, res, next) => {
    const {email, password} = req.body;
    const user = await User.findOne({email});
    const isValid = await user.isPasswordValid(password)
    try {

        if(!user)
        return res.status(403).json({Error: {message: "Incorrect Email | User not found"}});
        if(!isValid)
        return res.json({Error: {Message: "Incorrect Password"}}).status(403);
        const token = getSignedToken(user);
        res.status(200).json(user.firstName + ', You are Logged in with ' + user.email + ' token ' + token)
    } catch(error) {
        error.status = 400;
        next(error);
    }
} 

getSignedToken = user => {
    return jwt.sign({
        id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,

    }, SECRET_KEY, {expiresIn: '4h'})
}
