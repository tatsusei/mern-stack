import React from 'react';
import { Link } from 'react-router-dom';

export default class IssueFilter extends React.Component {
    render() {
        return (
            <div>
                <Link to="/issues">All Issue</Link>
                { ' | ' }
                <Link to={{ pathname: '/issues', search: '?status=New' }}>New Issue</Link>
                { ' | ' }
                <Link to={{ pathname: '/issues', search: '?status=Assigned' }}>Assigned Issues</Link>
            </div>
        );
    }
};