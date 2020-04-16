const express = require('express')
const { ApolloServer, UserInputError} = require('apollo-server-express')
const fs = require('fs')
require('dotenv').config();

const { GraphQLScalarType } = require('graphql')
const { Kind } = require('graphql/language')
const { MongoClient } = require ('mongodb');
const url = process.env.DB_URL || 'mongodb://localhost/issuetracker';

// Atlas URL - replace UUU with user, PPP with password, XXX with hostname
// const url = 'mongodb+srv://UUU:PPP@cluster0-XXX.mongodb.net/issuetracker?retryWrites=true';
// mLab URL - replace UUU with user, PPP with password, XXX with hostname 
// const url = 'mongodb://UUU:PPP@XXX.mlab.com:33533/issuetracker';


const GraphQLDate = new GraphQLScalarType({
    name: 'GraphQLDate',
    description: 'A Date() type in GraphQL as a scalar',
    serialize(value) {
        return value.toISOString()

    },
    parseValue(value) {
        // return new Date(value);
        const dataValue = new Date(value)
        return isNaN(dataValue) ? undefined : dataValue;
    },
    parseLiteral(ast) {
        // return (ast.kind == Kind.STRING) ? new Date(ast.value) : undefined;
        if (ast.kind == Kind.STRING) {
            const value = new Date(ast.value)
            return isNaN(value) ? undefined : value;
        }
    }
})

let db

let aboutMessage = "Issue Tracker API v1.0"

async function connectToDb() {
    const client = new MongoClient(url, { useUnifiedTopology: true, useNewUrlParser: true })
    await client.connect();
    console.log('Connected to MongoDB at', url )
    db = client.db()
}

const resolvers = {
    Query: {
        about: () => aboutMessage,
        issueList,
    },
    Mutation: {
        setAboutMessage,
        issueAdd,
    },
    GraphQLDate,
};

function setAboutMessage(_, { message }) {
    return aboutMessage = message;
}

async function issueList() {
    const issues = await db.collection('issues').find({}).toArray()
    return issues;
}

async function getNextSequence(name) {
    const result = await db.collection('counters').findOneAndUpdate(
        { _id: name},
        { $inc:  { current:1 }},
        { returnOriginal: false},
    )
    return result.value.current
}


async function issueAdd(_, { issue }) {
    issueValidate(issue);
    issue.created = new Date();
    issue.id = await getNextSequence('issues')
    const result = await db.collection('issues').insertOne(issue)
    const savedIssue = await db.collection('issues').findOne({_id : result.insertedId })
    return savedIssue;
}

function issueValidate(issue) {
    const errors = [];
    if (issue.title.length < 3) {
        errors.push('Field "title" must be at least 3 characters long.')
    }
    if (issue.status == 'Assigned' && !issue.owner) {
        errors.push('Field "owner" is required when status is "Assigned"');
    }
    if (errors.length > 0) {
        throw new UserInputError('Invalid input(s)', { errors });
    }
}


const server = new ApolloServer({
    typeDefs: fs.readFileSync('./schema.graphql', 'utf-8'),
    resolvers,
    formatError: error => {
        console.log(error);
        return error;
    }
})

const app = express()
const enableCors = (process.env.ENABLE_CORS || 'true') == 'true';
console.log('CORS setting:', enableCors)

server.applyMiddleware({ app, path: '/graphql' , cors: enableCors });

const port = process.env.API_SERVER_PORT || 3000;

(async function (){
    try {
        await connectToDb();
        app.listen(port, function () {
            console.log(`API Server started on port ${port}`)
        })
    } catch (err) {
        console.log('ERROR:', err)
    }
})();
