const express = require('express');
const bodyParser = require('body-parser');
const graphqlHttp = require('express-graphql');
const {buildSchema} = require('graphql');
const mongoose = require('mongoose');
const Post = require('./models/post');


const app = express();

app.use(bodyParser.json());

app.use('/graphql', graphqlHttp({
    // define schemas
    schema: buildSchema(`
        type Post {
            _id: ID!
            disId: String!
            owner: String!
            content: String!
        }
        
        input PostInput {
            disId: String!
            owner: String!
            content: String!
        }

        type RootQuery {
            posts: [Post!]!
        }

        type RootMutation {
            createPost(postInput: PostInput): Post
        }

        schema {
            query: RootQuery
            mutation: RootMutation
        }
    `),
    rootValue: {
        // resolver
        posts: () => {
             return Post.find().then(posts => {
                 return posts.map(post => {
                     return {...post._doc};
                 });
             }).catch(err => {
                 throw err;
             });
        },
        createPost: args => {
            const post = new Post({
                disId: args.postInput.disId,
                owner: args.postInput.owner,
                content: args.postInput.content
            });
            return post.save().then(result => {
                console.log(result);
                return { ...result._doc };
            }).catch(err => {
                console.log(err);
                throw err;
            });
        }
    },
    graphiql: true
}));

// connect to the mongoDB database
mongoose
    .connect(
        `mongodb+srv://${process.env.MONGO_USER}:${process.env.MONGO_PASSWORD}@cluster0-3zksz.mongodb.net/test?retryWrites=true&w=majority`
        ).then(() => {
    app.listen(3000);
}).catch(err => {
    console.log(err);
});

app.listen(8080);

