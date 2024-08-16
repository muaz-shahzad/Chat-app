const express = require('express');
const router = express.Router();
const authenticateToken = require('../Middleware/Authentication');

router.get('/protected', authenticateToken, (req, res) => {
  res.status(200).json({ message: 'Protected route accessed' }); // Return a JSON response with a message
});

module.exports = router;
