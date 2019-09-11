const { buildSchema } = require('graphql');

module.exports = buildSchema(`
    type Post {
        _id: ID!
        disId: Discussion!
        parId: String!
        owner: String!
        content: String!
    }

    type Discussion {
        _id: ID!
        startTime: String!
        endTime: String!
        containedPosts: [Post!]
    }

    input PostInput {
        disId: String!
        parId: String!
        owner: String!
        content: String!
    }

    type RootQuery {
        posts: [Post!]!
    }

    type RootMutation {
        createPost(postInput: PostInput): Post
        createDiscussion(startTime: String!, endTime: String!): Discussion
    }

    schema {
        query: RootQuery
        mutation: RootMutation
    }
    `);