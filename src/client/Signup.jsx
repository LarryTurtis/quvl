import React, { Component, PropTypes } from 'react';
import { push } from 'react-router-redux';
import connect from './util/connect';
import SignupForm from './components/SignupForm';
import Header from './components/Header';
import Footer from './components/Footer';
import { checkLogin } from './actions/login';

class Signup extends Component {

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
      <div className="shell">
        <Header user={this.props.user} />
        <SignupForm />
        <Footer />
      </div>
    );
  }

}

export default connect(Signup);
