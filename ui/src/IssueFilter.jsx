import React from "react";
import { withRouter } from "react-router-dom";
import URLSearchParams from "url-search-params";

class IssueFilter extends React.Component {
  constructor({ location: { search } }) {
    super();
    this.onChangeStatus = this.onChangeStatus.bind(this);
    const params = new URLSearchParams(search);
    this.state = {
      status: params.get("status") || "",
      changed: false,
    };
    this.applyFilter = this.applyFilter.bind(this);
    this.showOriginalFilter = this.showOriginalFilter.bind(this);
  }

  onChangeStatus(e) {
    this.setState({
      status: e.target.value,
      changed: true,
    });
  }

  componentDidUpdate(prevProps) {
    const {
      location: { search: prevSearch },
    } = prevProps;
    const {
      location: { search },
    } = this.props;
    if (prevSearch !== search) {
      this.showOriginalFilter();
    }
  }

  showOriginalFilter() {
    const {
      location: { search },
    } = this.props;
    const params = new URLSearchParams(search);
    this.setState({
      status: params.get("status") || "",
      changed: false,
    });
  }

  applyFilter() {
    const { status } = this.state;
    const { history } = this.props;
    history.push({
      pathname: "/issues",
      search: status ? `?status=${status}` : "",
    });
  }

  render() {
    const { status, changed } = this.state;

    return (
      <div>
        Status:{" "}
        <select value={status} onChange={this.onChangeStatus}>
          <option value="">(ALL)</option>
          <option value="New">New</option>
          <option value="Assigned">Assigned</option>
          <option value="Fixed">Fixed</option>
          <option value="Closed">Closed</option>
        </select>{" "}
        <button type="button" onClick={this.applyFilter}>
          Apply
        </button>{" "}
        <button
          type="button"
          onClick={this.showOriginalFilter}
          disabled={!changed}
        >
          Reset
        </button>
      </div>
      // <div>
      //     <Link to="/issues">All Issue</Link>
      //     { ' | ' }
      //     <Link to={{ pathname: '/issues', search: '?status=New' }}>New Issue</Link>
      //     { ' | ' }
      //     <Link to={{ pathname: '/issues', search: '?status=Assigned' }}>Assigned Issues</Link>
      // </div>
    );
  }
}

export default withRouter(IssueFilter);
