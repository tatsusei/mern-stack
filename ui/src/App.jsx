
import 'babel-polyfill';
import 'whatwg-fetch';
import React from 'react';
import ReactDOM from 'react-dom';
import { HashRouter as Router } from 'react-router-dom';

import IssueList from './IssueList.jsx'
import Page from './Page.jsx'

const element = (
    <Router>
        <Page></Page>
    </Router>
) 

ReactDOM.render(element, document.getElementById('contents'))

if (module.hot) {
    module.hot.accept();
}