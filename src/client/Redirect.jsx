import React, { Component, PropTypes } from 'react';
import { Spinner } from '@blueprintjs/core';
import { replace } from 'react-router-redux';
import connect from './util/connect';

class Redirect extends Component {

  static propTypes = {
    replace: PropTypes.func,
    user: PropTypes.object
  };

  static stateToProps = (state) => ({
    user: state.login.user
  });

  static actionsToProps = {
    replace
  };

  constructor(props) {
    super(props);
    this.state = { redirecting: false };
  }

  componentWillMount() {
    const { user } = this.props;
    if (user && user.role !== 'inactive') {
      this.setState({ redirecting: true });
      this.props.replace(`${user.role}/${user.id}`);
    }
  }

  render() {
    if (this.state.redirecting) {
      return <Spinner />;
    }
    return (
      <div>
        Your account must be activated by an admin.
      </div>
    );
  }

}

export default connect(Redirect);
