import React, { Component, PropTypes } from 'react';
import { push } from 'react-router-redux';
import connect from './util/connect';
import LockForm from './components/LoginForm';
import { checkLogin } from './actions/login';

class Login extends Component {

  static propTypes = {
    checkLogin: PropTypes.func,
    push: PropTypes.func
  };

  static actionsToProps = {
    checkLogin,
    push
  };

  static stateToProps = state => ({
    user: state.user
  });

  constructor(props) {
    super(props);
    this.state = {};
    this.props.checkLogin()
    .then((response) => {
      if (!response.error) {
        this.props.push('/');
      }
    });
  }

  render() {
    return (
      <LockForm />
    );
  }

}

export default connect(Login);
