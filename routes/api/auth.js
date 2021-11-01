const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const config = require('config');
const { check, validationResult } = require('express-validator');

const auth = require('../../middleware/auth');
const User = require('../../models/User');

// @route   GET api/auth
// @desc    Test Route
// @acces   value: Public
router.get('/', auth, async (req, res) => {
    try {
        const user = await User.findById(req.user.id).select('-password');
        res.json(user);

    } catch (err) {
        console.log(err.message);
        res.status(500).send('Server Error');
    }
});

// @route   POST api/auth
// @desc    Authenticate user & get token
// @acces   value: Public
// Recycled from users.js
router.post('/', [

    check('email', 'Please include a valid email').isEmail(),
    check(
        'password',
        'Password is required'
    ).exists()
],
    async (req, res) => {
        //checks for errors in the body
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        // console.log(req.body) req.body.name, so instead destructure;
        const { email, password } = req.body;


        try {
            //See if user exists, send error, gets info about the user including encrypt pass
            let user = await User.findOne({ email });
            if (!user) {
                return res
                    .status(400)
                    .json({ errors: [{ msg: 'Invalid Credentials Email' }] });
            }

            //We found user, but now we need to match the password, need bcrypt
            //Returns a promise: password is the plaintext password from req.body
            //user.password is the encrypted password
            const isMatch = await bcrypt.compare(password, user.password)
            if (!isMatch) {

                return res
                    .status(400)
                    .json({ errors: [{ msg: 'Invalid Credentials Pass' }] });

            }

            // Return jsonwebtoken
            const payload = {
                user: {
                    id: user.id
                }
            }

            jwt.sign(
                payload,
                config.get('jwtSecret'),
                { expiresIn: 360000 },
                (err, token) => {
                    if (err) throw err;
                    //sends back token
                    res.json({ token });
                }
            );
            // res.send('User Registered');
        } catch (err) {
            console.log(err.message);
            res.status(500).send('Server Error2');
        }




    });

module.exports = router;