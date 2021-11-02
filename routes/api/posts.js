const express = require('express');
const router = express.Router();

const auth = require('../../middleware/auth');
const { check, validationResult } = require('express-validator');

const User = require('../../models/User');
const Profile = require('../../models/Profile');
const Post = require('../../models/Post');


// @route   POST api/Posts
// @desc    Create a post
// @acces   Private
router.post('/',
    [
        auth
        [
        check('text', 'Text is required').notEmpty()
        ]
    ],
    async (req, res) => {

        //ERror checking
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        //Need to import all the models first, to get the name/avatar/user itself
        //We're logged in so we have the token and puts in req.user.id in the request, don't want password

        try {
            const user = await User.findById(req.user.id).select('-password');

            //Object 
            const newPost = {
                //Text comes from the body 
                text: req.body.text,

                //Rest comes from the user itself 
                name: user.name,
                avatar: user.avatar,
                user: req.user.id
            }
        } catch (err) {
            console.error(err.message);
            res.status(500).send('Server Error');
        }

    });

module.exports = router;