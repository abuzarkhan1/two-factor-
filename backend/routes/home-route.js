const express = require('express');
const authMiddleware = require('../middlewares/auth-middleware');

const router = express.Router();


router.get('/', authMiddleware, (req, res) => {
    const {name,userId,role } = req.userInfo;
    res.json({
        message: 'Welcome to Home',
        user: {
            _id: userId,
            name,
            role
        }
    })
});


module.exports = router;