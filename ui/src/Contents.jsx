import React from "react";
import { Switch, Route, Redirect } from "react-router-dom";

import IssueList from "./IssueList.jsx";
import IssueReport from "./IssueReport.jsx";
import IssueEdit from "./IssueEdit.jsx";
import About from "./About.jsx";

const NotFound = () => <h2> Page not Found</h2>;

export default function Contents() {
  return (
    <Switch>
      <Redirect exact from="/" to="/issues"></Redirect>
      <Route path="/issues" component={IssueList}></Route>
      <Route path="/report" component={IssueReport}></Route>
      <Route path="/edit/:id" component={IssueEdit}></Route>
      <Route path="/about" component={About}></Route>
      <Route component={NotFound} />
    </Switch>
  );
}