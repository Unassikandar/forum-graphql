const Post = require('../../models/post');
const Discussion = require('../../models/discussion');
const Vote = require('../../models/vote')
const { dateToString } = require('../../helpers/date');

module.exports = {
    // resolvers
    posts: async () => {
         try {
            const posts = await Post.find().populate('disId');
            return posts.map(post => {
                return { ...post._doc };
            });
        }
        catch (err) {
            throw err;
        }
    },
    votes: async () => {
        try {
            const votes = await Vote.find().populate('postId');
            return votes.map(vote => {
                return {...vote._doc};
            });
        } catch (err) {
            throw err;
        }
    },
    createPost: async args => {
        let createdPost, instance;
        try {
            const discussion = await Discussion.findById(args.postInput.disId);
            if (!discussion) {
                throw new Error('discussion does not exist.');
            }
            instance = discussion;
            const post = new Post({
                disId: args.postInput.disId,
                parId: args.postInput.parId,
                owner: args.postInput.owner,
                content: args.postInput.content
            });
            const result = await post.save();
            console.log(result);
            createdPost = { ...result._doc };
            instance.containedPosts.push(post);
            instance.save();
            return createdPost;
        }
        catch (err) {
            console.log(err);
            throw err;
        }
    },
    createDiscussion: async args => {
        const discussion = new Discussion({
            startTime: dateToString(args.startTime),
            endTime: dateToString(args.endTime)
        });
        try {
            const result = await discussion.save();
            console.log(result);
            return { ...result._doc };
        }
        catch (err) {
            console.log(err);
            throw err;
        }
    },
    createVote: async args => {
        try{
            const existing = await Vote.find({
                owner: args.voteInput.owner,
                postId: args.voteInput.postId
            });
            if (existing.length) {
                throw new Error('vote already exists');
            }
            const vote = new Vote({
                owner: args.voteInput.owner,
                postId: args.voteInput.postId
            });
            const result = await vote.save();
            console.log(result);
            return {...result._doc};
        } catch (err) {
            console.log(err);
            throw err;
        }
    }
}