import React, { Component, PropTypes } from 'react';
import { push } from 'react-router-redux';
import { Button, Alert } from 'react-bootstrap';
import connect from '../util/connect';
import { createGroup } from '../actions/group';
import './NewGroup.styl';

class NewGroup extends Component {

  static propTypes = {
    createGroup: PropTypes.func,
    push: PropTypes.func,
    group: PropTypes.object,
    login: PropTypes.object
  };

  static actionsToProps = {
    createGroup,
    push
  };

  static stateToProps = state => ({
    group: state.group,
    login: state.login
  });

  constructor(props) {
    super(props);
    this.state = {};
  }

  handleGroupChange = (e) => {
    this.setState({ groupName: e.target.value });
  }


  handleEmailChange = (e) => {
    this.setState({ emails: e.target.value });
  }

  handleSubmit = (e) => {
    e.preventDefault();
    this.props.createGroup(this.state.groupName, this.state.emails)
      .then(() => {
        this.props.push('/groups');
      });
  }

  render() {
    const { group } = this.props;
    const demoMode = this.props.login && this.props.login.user && this.props.login.user.demoUser;
    let callout;

    if (demoMode) {
      callout = (<Alert bsStyle="warning">
        <h4>Demo Mode</h4>
        <p>This feature is disabled in demo mode.</p>
      </Alert>);
    }

    if (group.isSending) {
      return <div className="sb-invite-form">Spinner</div>;
    }


    return (
      <form className="qv-newgroup card" onSubmit={this.handleSubmit}>
        <h3>Create New Group</h3>
        <div className="form-group">
          {callout}
          <label htmlFor="group">
            Group Name:
          </label>
          <div className="form-group">
            <input
              className="form-control"
              type="text"
              required
              placeholder="My Group"
              dir="auto"
              name="group"
              onChange={this.handleGroupChange}
            />
          </div>
          <div className="form-group">
            <label htmlFor="members">Members (email addresses):</label>
            <textarea
              className="form-control"
              name="members"
              rows="3"
              placeholder="abc@123.com, def@456.com, ghi@789.com, etc..."
              required
              onChange={this.handleEmailChange}
            />
          </div>
          <Button type="submit" bsStyle="primary" disabled={demoMode} >
            Save
          </Button>
        </div>
      </form>
    );
  }
}

export default connect(NewGroup);
