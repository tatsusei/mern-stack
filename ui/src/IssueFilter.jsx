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
      effortMin: params.get("effortMin") || "",
      effortMax: params.get("effortMax") || "",
      changed: false,
    };
    this.applyFilter = this.applyFilter.bind(this);
    this.showOriginalFilter = this.showOriginalFilter.bind(this);
    this.onChangeEffortMin = this.onChangeEffortMin.bind(this);
    this.onChangeEffortMax = this.onChangeEffortMax.bind(this);
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

  onChangeEffortMin(e) {
    const effortString = e.target.value;
    if (effortString.match(/^\d*$/)) {
      this.setState({ effortMin: e.target.value, changed: true });
    }
  }

  onChangeEffortMax(e) {
    const effortString = e.target.value;
    if (effortString.match(/^\d*$/)) {
      this.setState({ effortMax: e.target.value, changed: true });
    }
  }

  showOriginalFilter() {
    const {
      location: { search },
    } = this.props;
    const params = new URLSearchParams(search);
    this.setState({
      status: params.get("status") || "",
      effortMin: params.get('effortMin') || "",
      effortMax: params.get('effortMax') || "",
      changed: false,
    });
  }

  applyFilter() {
    const { status, effortMin, effortMax } = this.state;
    const { history } = this.props;

    const params = new URLSearchParams();
    if (status) params.set("status", status);
    if (effortMax) params.set("effortMax", effortMax);
    if (effortMin) params.set("effortMin", effortMin);

    const search = params.toString() ? `${params.toString()}` : "";

    history.push({
      pathname: "/issues",
      search
    });
  }

  render() {
    const { status, changed } = this.state;
    const { effortMin, effortMax } = this.state;

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
        Effort between:{" "}
        <input size={5} value={effortMin} onChange={this.onChangeEffortMin} />
        {" - "}
        <input
          size={5}
          value={effortMax}
          onChange={this.onChangeEffortMax}
        />{" "}
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
