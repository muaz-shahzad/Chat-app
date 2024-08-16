const jwt = require('jsonwebtoken')
const User = require('../models/userModel')

const getUserDetailsFromToken = async(token)=>{
    
    if(!token){
        return {
            message : "session out",
            logout : true,
        }
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const user = await User.findById(decoded.id).select('-password')

    return user
}

module.exports = getUserDetailsFromToken