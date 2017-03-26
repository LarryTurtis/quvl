import React, { Component, PropTypes } from 'react';
import { replace } from 'react-router-redux';
import { isTokenExpired } from './util/user';
import connect from './util/connect';

class Shell extends Component {

  static propTypes = {
    replace: PropTypes.func,
    user: PropTypes.object,
    location: PropTypes.object,
    children: PropTypes.node
  };

  static stateToProps = (state) => ({
    user: state.login.user
  });

  static actionsToProps = {
    replace
  };

  componentWillMount() {
    const { user, location } = this.props;
    this.redirectIfNotAuthenticated(user, location);
  }

  componentWillReceiveProps(nextProps) {
    const { user, location } = nextProps;
    this.redirectIfNotAuthenticated(user, location);
  }

  redirectIfNotAuthenticated(user, location) {
    // If the user is not logged in, or if their token has expired, redirect to login.

    console.log("redirect not authed", user, location)

    if (!user || !user.token || isTokenExpired(user.token)) {
      this.props.replace(`/login?r=${location.pathname}`);
    }
  }

  render() {
    return (
      <div className="shell">
        {this.props.children}
      </div>
    );
  }

}

export default connect(Shell);
