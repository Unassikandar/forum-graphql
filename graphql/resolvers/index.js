const Post = require('../../models/post');
const Discussion = require('../../models/discussion');

module.exports = {
    // resolvers
    posts: () => {
         return Post.find()
            .populate('disId')
            .then(posts => {
                return posts.map(post => {
                    return {...post._doc};
                });
            }).catch(err => {
                throw err;
            });
    },
    createPost: args => {
        let post, createdPost;
        let instance;
        return Discussion.findById(args.postInput.disId)
        .then(discussion => {
            if(!discussion){
                throw new Error('discussion does not exist.');
            }
            instance = discussion;
            post = new Post({
                disId: args.postInput.disId,
                parId: args.postInput.parId,
                owner: args.postInput.owner,
                content: args.postInput.content
            });
            return post.save()
        }).then(result => {
            console.log(result);
            createdPost = {...result._doc};
            instance.containedPosts.push(post);
            return instance.save();
        }).then(result => {
            return createdPost
        }).catch(err => {
            console.log(err);
            throw err;
        });
    },
    createDiscussion: args => {
        const discussion = new Discussion({
            startTime: new Date(args.startTime),
            endTime: new Date(args.endTime)
        });
        return discussion
            .save()
            .then(result => {
                console.log(result);
                return {...result._doc};
            }).catch(err => {
                console.log(err);
                throw err;
            });
    }
}