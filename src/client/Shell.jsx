import React, { Component, PropTypes } from 'react';
import { replace } from 'react-router-redux';
import connect from './util/connect';

class Shell extends Component {

  static propTypes = {
    replace: PropTypes.func,
    user: PropTypes.object,
    children: PropTypes.node
  };

  static stateToProps = (state) => ({
    user: state.login.user
  });

  static actionsToProps = {
    replace
  };

  componentWillMount() {
    const { user } = this.props;
    this.redirectIfNotAuthenticated(user);
  }

  componentWillReceiveProps(nextProps) {
    const { user } = nextProps;
    this.redirectIfNotAuthenticated(user);
  }

  redirectIfNotAuthenticated(user) {
    // If the user is not logged in, if their token has expired, redirect to login.
    console.log(user)
    if (!user) {
      this.props.replace('/login');
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
