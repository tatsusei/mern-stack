const express = require('express')
const app = express()
const { ApolloServer, UserInputError} = require('apollo-server-express')
const fs = require('fs')

const { GraphQLScalarType } = require('graphql')
const { Kind } = require('graphql/language')
const { MongoClient } = require ('mongodb');
const url = 'mongodb://localhost/issuetracker';
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

const issuesDB = [
    {
        id: 1,
        status: 'New',
        owner: 'Ravan',
        effort: 5,
        created: new Date('2019-01-15'),
        due: undefined,
        title: 'Error in console when clicking Add',
    },
    {
        id: 2,
        status: 'Assigned',
        owner: 'Eddie',
        effort: 14,
        created: new Date('2019-01-16'),
        due: new Date('2019-02-01'),
        title: 'Missing bottom border on panel',
    },
];


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

function issueAdd(_, { issue }) {
    issueValidate(issue);
    issue.created = new Date();
    issue.id = issuesDB.length + 1;
    // if (issue.status == undefined) issue.status = 'New';
    issuesDB.push(issue);

    return issue;
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
    typeDefs: fs.readFileSync('./server/schema.graphql', 'utf-8'),
    resolvers,
    formatError: error => {
        console.log(error);
        return error;
    }
})


app.use(express.static('public'))
server.applyMiddleware({ app, path: '/graphql' });

(async function (){
    try {
        await connectToDb();
        app.listen(3000, function () {
            console.log('App started on port 3000')
        })
    } catch (err) {
        console.log('ERROR:', err)
    }

})();
