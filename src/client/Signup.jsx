import React, { Component, PropTypes } from 'react';
import connect from './util/connect';
import SignupForm from './components/SignupForm';
import Header from './components/Header';
import { doLogout } from './actions/login';

class Signup extends Component {

  static propTypes = {
    doLogout: PropTypes.func
  };

  static actionsToProps = {
    doLogout
  };

  static stateToProps = state => ({
    user: state.user
  });

  constructor(props) {
    super(props);
    this.state = {};
    this.props.doLogout();
  }

  render() {
    return (
      <div className="shell">
        <Header />
        <SignupForm />
      </div>
    );
  }

}

export default connect(Signup);
