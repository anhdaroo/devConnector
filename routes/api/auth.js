const express = require('express');
const router = express.Router();

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
router.post('/', [
    check('name', 'Name is required').not().isEmpty(),
    check('email', 'Please include a valid email').isEmail(),
    check('password', 'Please enter a password with six or more characters').isLength({ min: 6 })
],
    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        // console.log(req.body) req.body.name, so instead destructure;
        const { name, email, password } = req.body;


        try {
            //See if user exists, send error
            let user = await User.findOne({ email });
            if (user) {
                return res.status(400).json({ errors: [{ msg: 'User already exists' }] });
            }

            //Get userse gravatar, based on their email
            const avatar = gravatar.url(email, {
                // size
                s: '200',

                // Rating
                r: 'pg',

                // Default
                d: 'mm'
            })

            //Creates a new instance of user, doesn't save it yet
            user = new User({
                name,
                email,
                avatar,
                password
            });

            // Encrypt password using bcrypt
            const salt = await bcrypt.genSalt(10);

            //hashes the password and puts it into user.password
            user.password = await bcrypt.hash(password, salt);

            await user.save();

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
                    res.json({ token });
                }
            );
            // res.send('User Registered');
        } catch (err) {
            console.log(err.message);
            res.status(500).send('Server Error');
        }




    });

module.exports = router;