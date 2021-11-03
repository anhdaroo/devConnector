const express = require('express');
const router = express.Router();

const auth = require('../../middleware/auth');
const { check, validationResult } = require('express-validator');

const User = require('../../models/User');
const Post = require('../../models/Post');

//If you send a POST you need application/json in the header of POSTMAN

// @route   POST api/posts
// @desc    Create a post, will return all the contents from the Post Model
// @acces   Private
router.post('/',

    auth,
    check('text', 'Text is required').notEmpty(),

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

            //Object and you HAVE to instantiate a new post from the POST
            const newPost = new Post({
                //Text comes from the body 
                text: req.body.text,

                //Rest comes from the user itself 
                name: user.name,
                avatar: user.avatar,
                user: req.user.id
            });
            //Saves it into post variable then we can send that as a response
            const post = await newPost.save();

            res.json(post);

        } catch (err) {
            console.error(err.message);
            res.status(500).send('Server Error');
        }

    }
);


// @route   GET api/posts
// @desc    Get all posts
// @acces   Private
// You have to be logged in to get the posts
router.get('/', auth, async (req, res) => {
    try {
        //Getting a post from the Post model and saving it to variable post
        //From the most recent 
        const posts = await Post.find().sort({ date: -1 });
        res.json(posts);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// @route   GET api/posts/:id
// @desc    Get specific/single post by ID
// @access   Private
// You have to be logged in to get the posts
router.get('/:id', auth, async (req, res) => {
    try {
        //Get a post from the params, 
        const post = await Post.findById(req.params.id);

        //Check if there is a post by this id
        //404 is NOT FOUND HTTP status code
        if (!post) {
            return res.status(404).json({ msg: 'Post not Found' })
        }
        res.json(post);
    } catch (err) {
        //If what they pass in isn't a valid object ID, we want the same message showing regardless
        console.error(err.message);

        if (err.kind === 'ObjectId') {
            return res.status(404).json({ msg: 'Post not Found' })
        }

        res.status(500).send('Server Error');
    }
});

// @route   DELETE api/posts/:postID
// @desc    Delete a single post
// @acces   Private
router.delete('/:id', auth, async (req, res) => {
    try {
        //Find the single post from the Post DB
        //Make sure to use awit since you're tring to find from the DB
        const post = await Post.findById(req.params.id);


        //If post isn't found
        if (!post) {
            return res.status(400).json({ msg: 'Post not found' });
        }

        //Check user | post.user will return an object, so you will need to turn it into string
        //Even if they match, it won't match object != string
        //req.user.id is the logged in user
        if (post.user.toString() !== req.user.id) {
            // console.log(post.user.toString());
            // console.log(req.user.id);
            return res.status(401).json({ msg: 'User not Authorized' });
        }



        await post.remove();

        res.json({ msg: 'Post Removed' });

    } catch (err) {
        console.error(err.message);
        //Not sure where err.kind is coming rfom
        if (err.kind == 'ObjectId') {
            return res.status(400).json({ msg: 'Post not found' });
        }
        res.status(500).send('Server Error');
    }
})

// @route   PUT api/posts//like/:id
// @desc    Updating a Post, so its a PUT request. Like a post
// @acces   Private
router.put('/like/:id', auth, async (req, res) => {
    try {
        //Fetch the post
        const post = await Post.findById(req.params.id);

        //Check if the post has already been liked by the user
        // If the post we just got, likes which is an array, filter though the likes
        // Compare the current iteration/current user to the user that is logged in
        //Turn this into a string so it'll match the user  
        //If its larger than 0 then that already means it is liked
        if (post.likes.filter(like => like.user.toString() === req.user.id).length > 0) {
            return res.status(400).json({ msg: 'Post already liked' });
        }

        //Add a like, we can use push, but unshift just puts it in the beginning
        post.likes.unshift({ user: req.user.id });

        await post.save();

        res.json(post.likes);
        //When it gets to react, we'll see why he uses post.likes
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
})

// @route   PUT api/posts//unlike/:id
// @desc    Updating post, removing like
// @acces   Private
router.put('/unlike/:id', auth, async (req, res) => {
    try {
        //Fetch the post
        const post = await Post.findById(req.params.id);


        if (post.likes.filter(like => like.user.toString() === req.user.id).length === 0) {
            return res.status(400).json({ msg: 'Post has not yet been liked' });

        }

        //Get remove index
        //For each like I'm going to return , in the like array we have the user, convert to string
        //Get that index of that user to then remove
        const removeIndex = post.likes.map(like => like.user.toString()).indexOf(req.user.id);

        post.likes.splice(removeIndex, 1);

        await post.save();

        res.json(post.likes);
        //When it gets to react, we'll see why he uses post.likes
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
})

// @route   POST api/posts/comment/:id
// @desc    Add comment to a post 
// @acces   Private

router.post('/comment/:id',
    auth,
    check('text', 'Text is required').notEmpty(),

    async (req, res) => {

        //ERror checking
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        //Need to import all the models first, to get the name/avatar/user itself
        //We're logged in so we have the token and puts in req.user.id in the request, don't want password

        try {
            //Get the user 
            const user = await User.findById(req.user.id).select('-password');

            //Get the post
            const post = await Post.findById(req.params.id);




            //It's not an actual collection in the database, so we don't need new Post
            //It's just going to be an object
            const newComment = {
                //Text comes from the body 
                text: req.body.text,

                //Rest comes from the user itself 
                name: user.name,
                avatar: user.avatar,
                user: req.user.id
            };

            post.comments.unshift(newComment);

            //Saves it into post variable then we can send that as a response
            await post.save();

            res.json(post.comments);

        } catch (err) {
            console.error(err.message);
            res.status(500).send('Server Error');
        }

    });


// @route   DELETE api/posts/comment/:id/:comment_id
// @desc    DELETE comment
// @acces   Private

router.delete('/comment/:id/:comment_id', auth, async (req, res) => {
    try {
        //Get post id
        const post = await Post.findById(req.params.id);

        //pull out comment, this will give us the commment, or false
        //For each commment, find the comment id in which it equals the comment id in the req
        const comment = post.comments.find(comment => comment.id === req.params.comment_id);

        // make sure comment exists becasue find will display undefined if it cna't find anything
        if (!comment) {
            return res.status(404).json({ msg: 'Comment does not exist ' });
        }

        //Check user, make sure thats deleting the comment is the one who actually made the comment
        //comment.user is the user who wrote the post shown in DB, but it's an object id so convert to string
        if (comment.user.toString() !== req.user.id) {
            return res.status(404).json({ msg: 'User not Authroized! ' });
        }

        //Get remove index
        //For each like I'm going to return , in the like array we have the user, convert to string
        //Get that index of that user to then remove
        const removeIndex = post.comments
            .map(comment => comment.user.toString()).indexOf(req.user.id);

        post.comments.splice(removeIndex, 1);

        await post.save();

        res.json(post.comments);
        //When it gets to react, we'll see why he uses post.likes
    } catch (err) {

    }
})




module.exports = router;