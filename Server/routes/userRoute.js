const express = require('express');
const router = express.Router();
const { userRegister , userLogin, userLogout , getUserInfo} = require('../controllers/userRegister');
const authenticateToken = require('../Middleware/Authentication');
const { searchUsers } = require('../controllers/UserSearch');



// Register user route
router.post('/register', userRegister);

// Login user route
router.post('/login', userLogin);

// Logout user route
router.post('/logout', userLogout);

router.get('/userinfo', authenticateToken, getUserInfo);

//search user
router.post('/search', authenticateToken, searchUsers);

module.exports = router;
