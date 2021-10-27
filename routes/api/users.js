const express = require('express');
const router = express.Router();
const { check, validationResult } = require('express-validator');

// @route   GET TEST api/users
// @desc    Test Route
// @acces   value: Public
// router.get('/', (req, res) => res.send('User Route'));

// @route   POST api/users
// @desc    Register User
// @acces   value: Public
router.post('/', [
    check('name', 'Name is required').not().isEmpty(),
    check('email', 'Please include a valid email').isEmail(),
    check('password', 'Please enter a password with six or more characters').isLength({ min: 6 })
],
    (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        console.log(req.body);
        res.send('User Route')
    });


module.exports = router;