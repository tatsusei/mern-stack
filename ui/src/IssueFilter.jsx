import React from "react";
import { withRouter } from "react-router-dom";
import URLSearchParams from "url-search-params";
import {
  ButtonToolbar, Button, FormGroup, FormControl, 
  ControlLabel, InputGroup, Row, Col,
} from 'react-bootstrap'

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
      <Row>
        <Col xs={6} sm={4} md={3} lg={2}>
         <FormGroup> 
            <ControlLabel>Status:</ControlLabel>
            <FormControl componentClass="select" value={status} onChange={this.onChangeStatus}>
              <option value="">(ALL)</option>
              <option value="New">New</option>
              <option value="Assigned">Assigned</option>
              <option value="Fixed">Fixed</option>
              <option value="Closed">Closed</option>
            </FormControl>
         </FormGroup>
        </Col>

        <Col xs={6} sm={4} md={3} lg={2}>
          <FormGroup>
            <ControlLabel>Effort between:</ControlLabel>
            <InputGroup>
              <FormControl value={effortMin} onChange={this.onChangeEffortMin} />
              <InputGroup.Addon> - </InputGroup.Addon>
              <FormControl value={effortMax} onChange={this.onChangeEffortMax} />
            </InputGroup>
          </FormGroup>
        </Col>

        <Col xs={6} sm={4} md={3} lg={2}>
          <FormGroup>
            <ControlLabel>&nbsp;</ControlLabel>
            <ButtonToolbar>  
              <Button bsStyle="primary" type="button" onClick={this.applyFilter}>
                Apply
              </Button>
              <Button type="button" onClick={this.showOriginalFilter} disabled={!changed}>
                Reset
              </Button>
          </ButtonToolbar> 
          </FormGroup>
     
        </Col>
       </Row>

    );
  }
}

export default withRouter(IssueFilter);
