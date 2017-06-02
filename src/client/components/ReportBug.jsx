import React, { Component, PropTypes } from 'react';
import { Alert, Button, FormGroup, FormControl, ControlLabel } from 'react-bootstrap';
import connect from '../util/connect';
import { createBugReport } from '../actions/doc';

class ReportBug extends Component {

  static propTypes = {
    createBugReport: PropTypes.func,
    doc: PropTypes.object,
    login: PropTypes.object
  };

  static actionsToProps = {
    createBugReport
  };

  static stateToProps = state => ({
    doc: state.doc,
    login: state.login
  });

  constructor(props) {
    super(props);
    this.state = {
      name: 'Message'
    };
  }

  handleSubmit = () => {
    this.props.createBugReport(this.state.name, this.state.content).then(() => {
      this.setState({ submitted: true, content: null });
    });
  }

  handleNameChange = (e) => {
    this.setState({ name: e.target.value });
  }

  handleEditorChange = (e) => {
    this.setState({ content: e.target.value });
  }

  render() {
    let callout;

    if (this.state.submitted) {
      callout = (<Alert bsStyle="success">
        <h4>Thanks!</h4>
        <p>
          We will review your submission and follow up with you!
        </p>
      </Alert>);
    }
    return (
      <div>
        <h4>Request a Fix</h4>
        {callout}
        <form>
          <FormGroup controlId="formControlsTextarea">
            <ControlLabel>Please describe your issue or request:</ControlLabel>
            <FormControl disabled={this.state.submitted} componentClass="textarea" placeholder="Please fix X and add y." onChange={this.handleEditorChange} />
          </FormGroup>
          <Button bsStyle="primary" disabled={this.state.submitted} onClick={this.handleSubmit}>Send</Button>
        </form>
      </div>
    );
  }
}

export default connect(ReportBug);
