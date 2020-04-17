const { UserInputError } = require('apollo-server-express');
const { getDb, getNextSequence } = require('./db.js');

async function list(_, { status }) {
    const db = getDb();
    const filter = {};
    if (status) filter.status = status;
    const issues = await db.collection('issues').find(filter).toArray()
    return issues;
}

async function add(_, { issue }) {
    const db = getDb();
    validate(issue);
    issue.created = new Date();
    issue.id = await getNextSequence('issues')
    const result = await db.collection('issues').insertOne(issue)
    const savedIssue = await db.collection('issues').findOne({_id : result.insertedId })
    return savedIssue;
}

function validate(issue) {
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

module.exports = { list, add }