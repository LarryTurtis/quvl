import React, { Component, PropTypes } from 'react';
import { replace } from 'react-router-redux';
import Header from './components/Header';
import Footer from './components/Footer';
import InviteUser from './components/InviteUser';
import CreateReport from './components/CreateReport';

class Main extends Component {

  static propTypes = {
    user: PropTypes.object
  }

  static stateToProps = state => ({
    user: state.login.user
  })

  constructor(props) {
    super(props);
    this.state = {};
  }
  
  render() {
    const { user } = this.props;
    return (
      <div>
        <Header user={user} />
        <section>
          <p>You are logged in.</p>
        </section>
        <Footer />
      </div>
    );
  }
}

export default Main;
