import React from 'react';

export default class IssueFilter extends React.Component {
    render() {
        return (
            <div>
                <a href="/#/issues">All Issue</a>
                { ' | ' }
                <a href="/#/issues?status=New">New Issue</a>
                { ' | ' }
                <a href="/#/issues?status=Assigned">Assigned Issues</a>
            </div>
        );
    }
};