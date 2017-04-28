import React, { Component, PropTypes } from 'react';
import { push } from 'react-router-redux';
import connect from './util/connect';
import LoginForm from './components/LoginForm';
import Header from './components/Header';
import Footer from './components/Footer';
import { checkLogin } from './actions/login';

class Login extends Component {

  static propTypes = {
    checkLogin: PropTypes.func,
    push: PropTypes.func,
    seeking: PropTypes.string
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
          this.props.push(props.seeking || '/dashboard');
        }
      });
  }

  render() {
    return (
      <div className="shell">
        <Header user={this.props.user} />
        <LoginForm />
        <Footer />
      </div>
    );
  }

}

export default connect(Login);
