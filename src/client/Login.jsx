import React, { Component, PropTypes } from 'react';
import qs from 'querystring';
import { replace } from 'react-router-redux';
import { Button, Spinner } from '@blueprintjs/core';
import connect from './util/connect';
import { getUserFromProfile } from './util/user';
import { buildGet } from './util/requestFactory';
import LockForm from './components/LoginForm';

class Login extends Component {

  static propTypes = {
    replace: PropTypes.func
  };

  static stateToProps = state => ({
    user: state.user
  });

  static actionsToProps = {
    replace
  };

  constructor(props) {
    super(props);
    this.state = {};
    const url = '/api/login';
    const loginRequest = buildGet(url);

    fetch(loginRequest)
      .then(response => {
        if (response.ok) {
          return response.json();
        }
        throw Error(response.statusText);
      });
  }

  render() {
    if (this.state.redirecting) {
      return <Spinner />;
    }
    return (
      <LockForm />
    );
  }

}

export default connect(Login);
