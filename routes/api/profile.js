const express = require('express');
const router = express.Router();
const auth = require('../../middleware/auth');
const { check, validationResult } = require('express-validator');
// const { check, validationResult } = require('express-validator/check');

const User = require('../../models/User');
const Profile = require('../../models/Profile');

// @route   GET api/profile/me
// @desc    Get current users profile
// @acces   Private
router.get('/me', auth, async (req, res) => {
    try {
        const profile = await Profile.findOne({ user: req.user.id }).populate('user', ['name', 'avatar']);

        if (!profile) {
            return res.status(400).json({ msg: 'There is no profile for this user' });
        }

        res.json(profile);
    } catch (err) {
        console.log(err.message);
        res.status(500).send('Server Error');
    }
});

router.post('/', [
    auth,
    [
        check('status', 'Status is required').notEmpty(),
        check('skills', 'Skills is required').notEmpty()
    ]
],
    async (req, res) => {
        //When we do checks above, we need errors
        const errors = validationResult(req);

        if (!errors.isEmpty()) {
            return res.status(400).send({ errors: errors.array() });
        }

        // destructure the request, pull everything out from the body 
        const {
            company,
            location,
            website,
            bio,
            status,
            githubusername,
            skills,
            youtube,
            twitter,
            instagram,
            linkedin,
            facebook,
            // spread the rest of the fields we don't need to check
            ...rest
        } = req.body;

        //Build profile object to insert into db
        const profileFields = {};
        profileFields.user = req.user.id;

        //check if the stuff is coming in
        if (company) profileFields.company = company;
        if (website) profileFields.website = website;
        if (location) profileFields.location = location;
        if (bio) profileFields.bio = bio;
        if (status) profileFields.status = status;
        if (githubusername) profileFields.githubusername = githubusername;
        if (skills) {
            //Turns string into array and separated by delimeter
            profileFields.skills = skills.split(',').map(skill => skill.trim());

        }

        //Build Social Object
        profileFields.social = {}
        if (youtube) profileFields.social.youtube = youtube;
        if (twitter) profileFields.social.twitter = twitter;
        if (facebook) profileFields.social.facebook = facebook;
        if (linkedin) profileFields.social.linkedin = linkedin;
        if (instagram) profileFields.social.instagram = instagram;

        try {
            //We want to find by user, we can get user 
            //User field is the object id and we can match that to req.user.id which comes from token
            //look for profile by the user
            let profile = await Profile.findOne({ user: req.user.id });

            if (profile) {
                //Update
                profile = await Profile.findOneAndUpdate(
                    { user: req.user.id },
                    { $set: profileFields },
                    { new: true }
                );
                return res.json(profile);
            }

            //Create
            profile = new Profile(profileFields);
            //Profile.save is not a function, we don't want to call save on the mode, but on the instance of the model. res.json should show in POSTMAN body
            //_id is the id of the profile, while user is the profile of the user
            // "_id": "61803e19bd40ee065be00a16",
            // "user": "617af601a8f0b2abe76a26c1"
            await profile.save();
            res.json(profile);

        } catch (err) {
            console.error(err.message);
            res.status(500).send('Server Error');
        }
        // console.group(skills);
        // console.group(profileFields.skills);
        // console.group(profileFields.social.twitter);
        // res.send('hello');
    }
);

// @route   GET api/profile
// @desc    Get all profile
// @acces   Public

module.exports = router;
